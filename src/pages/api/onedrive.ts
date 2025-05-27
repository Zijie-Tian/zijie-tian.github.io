import type { APIRoute } from "astro";

// OneDrive API 配置
const GRAPH_API_BASE = "https://graph.microsoft.com/v1.0";

interface OneDriveFile {
	id: string;
	name: string;
	size?: number;
	createdDateTime: string;
	lastModifiedDateTime: string;
	webUrl: string;
	downloadUrl?: string;
	folder?: {
		childCount: number;
	};
	file?: {
		mimeType: string;
	};
}

interface OneDriveResponse {
	value: OneDriveFile[];
	"@odata.nextLink"?: string;
}

export const GET: APIRoute = async ({ request, url }) => {
	try {
		// 从查询参数获取访问令牌和文件夹路径
		const accessToken = url.searchParams.get("access_token");
		const folderPath = url.searchParams.get("folder_path") || "/Blog";
		const includeContent = url.searchParams.get("include_content") === "true";

		if (!accessToken) {
			return new Response(
				JSON.stringify({
					error: "Access token is required",
					message: "需要提供访问令牌",
				}),
				{
					status: 401,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// 构建Microsoft Graph API请求
		const graphUrl = `${GRAPH_API_BASE}/me/drive/root:${folderPath}:/children`;

		const response = await fetch(graphUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return new Response(
				JSON.stringify({
					error: "Failed to fetch OneDrive files",
					message: "获取OneDrive文件失败",
					details: errorData,
				}),
				{
					status: response.status,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const data: OneDriveResponse = await response.json();

		// 处理文件数据
		const processedFiles = await Promise.all(
			data.value.map(async (file) => {
				let content = null;

				// 如果请求包含内容且是文本文件，获取文件内容
				if (includeContent && file.file && isTextFile(file.name)) {
					try {
						const contentResponse = await fetch(
							`${GRAPH_API_BASE}/me/drive/items/${file.id}/content`,
							{
								headers: {
									Authorization: `Bearer ${accessToken}`,
								},
							},
						);

						if (contentResponse.ok) {
							content = await contentResponse.text();
						}
					} catch (error) {
						console.warn(`Failed to fetch content for ${file.name}:`, error);
					}
				}

				return {
					id: file.id,
					name: file.name,
					size: file.size,
					createdDateTime: file.createdDateTime,
					lastModifiedDateTime: file.lastModifiedDateTime,
					webUrl: file.webUrl,
					isFolder: !!file.folder,
					mimeType: file.file?.mimeType,
					content: content,
					childCount: file.folder?.childCount,
				};
			}),
		);

		// 按类型和名称排序
		processedFiles.sort((a, b) => {
			// 文件夹优先
			if (a.isFolder && !b.isFolder) return -1;
			if (!a.isFolder && b.isFolder) return 1;
			// 然后按名称排序
			return a.name.localeCompare(b.name);
		});

		return new Response(
			JSON.stringify({
				success: true,
				files: processedFiles,
				folderPath: folderPath,
				hasMore: !!data["@odata.nextLink"],
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "public, max-age=300", // 缓存5分钟
				},
			},
		);
	} catch (error) {
		console.error("OneDrive API Error:", error);

		return new Response(
			JSON.stringify({
				error: "Internal server error",
				message: "服务器内部错误",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};

// 检查是否为文本文件
function isTextFile(filename: string): boolean {
	const textExtensions = [
		".txt",
		".md",
		".markdown",
		".json",
		".xml",
		".html",
		".css",
		".js",
		".ts",
		".py",
		".java",
		".cpp",
		".c",
		".h",
		".php",
		".rb",
		".go",
		".rs",
		".swift",
		".yml",
		".yaml",
		".toml",
		".ini",
		".cfg",
		".conf",
	];

	const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
	return textExtensions.includes(extension);
}

// POST方法用于上传文件
export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData();
		const accessToken = formData.get("access_token") as string;
		const file = formData.get("file") as File;
		const folderPath = (formData.get("folder_path") as string) || "/Blog";

		if (!accessToken || !file) {
			return new Response(
				JSON.stringify({
					error: "Missing required parameters",
					message: "缺少必需的参数",
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		// 上传文件到OneDrive
		const uploadUrl = `${GRAPH_API_BASE}/me/drive/root:${folderPath}/${file.name}:/content`;

		const uploadResponse = await fetch(uploadUrl, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/octet-stream",
			},
			body: await file.arrayBuffer(),
		});

		if (!uploadResponse.ok) {
			const errorData = await uploadResponse.json();
			return new Response(
				JSON.stringify({
					error: "Upload failed",
					message: "文件上传失败",
					details: errorData,
				}),
				{
					status: uploadResponse.status,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		const uploadedFile = await uploadResponse.json();

		return new Response(
			JSON.stringify({
				success: true,
				message: "文件上传成功",
				file: {
					id: uploadedFile.id,
					name: uploadedFile.name,
					size: uploadedFile.size,
					webUrl: uploadedFile.webUrl,
				},
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Upload Error:", error);

		return new Response(
			JSON.stringify({
				error: "Upload failed",
				message: "文件上传失败",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
