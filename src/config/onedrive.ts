// OneDrive 集成配置
export interface OneDriveConfig {
	clientId: string;
	tenantId?: string;
	defaultFolderPath: string;
	scopes: string[];
	redirectUri: string;
	authority: string;
}

// 默认配置
export const defaultOneDriveConfig: OneDriveConfig = {
	clientId:
		import.meta.env.ONEDRIVE_CLIENT_ID ||
		"4b36a6d5-66ae-4656-9b1f-d73b9a4f2163",
	tenantId:
		import.meta.env.ONEDRIVE_TENANT_ID ||
		"2a0b75e3-76b1-4b19-bea3-f04683913749",
	defaultFolderPath: "/Blog",
	scopes: [
		"Files.Read.All",
		"Files.ReadWrite.All",
		"User.Read",
		"offline_access",
	],
	redirectUri:
		import.meta.env.SITE || "https://zijie-tian-github-io.vercel.app",
	authority: "https://login.microsoftonline.com/common",
};

// 获取完整的重定向URI
export function getRedirectUri(path = "/onedrive-demo"): string {
	const baseUrl = import.meta.env.SITE || "http://localhost:4321";
	return `${baseUrl}${path}`;
}

// 构建授权URL
export function buildAuthUrl(
	config: OneDriveConfig,
	redirectPath?: string,
): string {
	const authUrl = new URL(`${config.authority}/oauth2/v2.0/authorize`);

	authUrl.searchParams.set("client_id", config.clientId);
	authUrl.searchParams.set("response_type", "token");
	authUrl.searchParams.set("redirect_uri", getRedirectUri(redirectPath));
	authUrl.searchParams.set("scope", config.scopes.join(" "));
	authUrl.searchParams.set("response_mode", "fragment");

	return authUrl.toString();
}

// 支持的文件类型配置
export const fileTypeConfig = {
	// 文档类型
	documents: {
		extensions: [".md", ".txt", ".doc", ".docx", ".pdf", ".rtf"],
		icon: "📄",
		color: "blue",
	},

	// 表格类型
	spreadsheets: {
		extensions: [".xls", ".xlsx", ".csv"],
		icon: "📊",
		color: "green",
	},

	// 演示文稿
	presentations: {
		extensions: [".ppt", ".pptx"],
		icon: "📽️",
		color: "orange",
	},

	// 图片类型
	images: {
		extensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"],
		icon: "🖼️",
		color: "purple",
	},

	// 视频类型
	videos: {
		extensions: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
		icon: "🎬",
		color: "red",
	},

	// 音频类型
	audio: {
		extensions: [".mp3", ".wav", ".flac", ".aac", ".ogg"],
		icon: "🎵",
		color: "pink",
	},

	// 压缩文件
	archives: {
		extensions: [".zip", ".rar", ".7z", ".tar", ".gz"],
		icon: "📦",
		color: "gray",
	},

	// 代码文件
	code: {
		extensions: [
			".js",
			".ts",
			".html",
			".css",
			".py",
			".java",
			".cpp",
			".c",
			".php",
			".rb",
			".go",
		],
		icon: "💻",
		color: "indigo",
	},
};

// 获取文件类型信息
export function getFileTypeInfo(filename: string) {
	const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));

	for (const [type, config] of Object.entries(fileTypeConfig)) {
		if (config.extensions.includes(extension)) {
			return {
				type,
				icon: config.icon,
				color: config.color,
			};
		}
	}

	// 默认文件类型
	return {
		type: "unknown",
		icon: "📄",
		color: "gray",
	};
}

// OneDrive API 端点配置
export const apiEndpoints = {
	graphBase: "https://graph.microsoft.com/v1.0",

	// 获取用户信息
	userProfile: "/me",

	// 获取驱动器信息
	drives: "/me/drives",
	defaultDrive: "/me/drive",

	// 文件和文件夹操作
	rootChildren: "/me/drive/root/children",
	itemChildren: (itemId: string) => `/me/drive/items/${itemId}/children`,
	itemByPath: (path: string) => `/me/drive/root:${path}`,
	itemContent: (itemId: string) => `/me/drive/items/${itemId}/content`,

	// 搜索
	search: (query: string) => `/me/drive/root/search(q='${query}')`,

	// 上传
	uploadByPath: (path: string, filename: string) =>
		`/me/drive/root:${path}/${filename}:/content`,

	// 分享
	createLink: (itemId: string) => `/me/drive/items/${itemId}/createLink`,
};

// 错误消息配置
export const errorMessages = {
	invalid_client: "客户端ID无效，请检查Azure应用配置",
	invalid_request: "请求参数无效",
	unauthorized_client: "客户端未授权，请检查应用权限",
	access_denied: "用户拒绝了访问请求",
	unsupported_response_type: "不支持的响应类型",
	invalid_scope: "请求的权限范围无效",
	server_error: "服务器内部错误",
	temporarily_unavailable: "服务暂时不可用",
	network_error: "网络连接错误，请检查网络设置",
	token_expired: "访问令牌已过期，请重新登录",
	insufficient_permissions: "权限不足，请联系管理员",
	file_not_found: "文件或文件夹不存在",
	quota_exceeded: "存储空间不足",
};

// 获取友好的错误消息
export function getFriendlyErrorMessage(error: string): string {
	return (
		errorMessages[error as keyof typeof errorMessages] || "未知错误，请稍后重试"
	);
}

// 缓存配置
export const cacheConfig = {
	// 访问令牌缓存时间（毫秒）
	tokenCacheTime: 55 * 60 * 1000, // 55分钟（令牌1小时过期）

	// 文件列表缓存时间
	fileListCacheTime: 5 * 60 * 1000, // 5分钟

	// 用户信息缓存时间
	userInfoCacheTime: 30 * 60 * 1000, // 30分钟

	// 缓存键前缀
	keyPrefix: "onedrive_",
};

// 缓存工具函数
export const cacheUtils = {
	set(
		key: string,
		value: unknown,
		ttl: number = cacheConfig.fileListCacheTime,
	) {
		const item = {
			value,
			expiry: Date.now() + ttl,
		};
		localStorage.setItem(
			`${cacheConfig.keyPrefix}${key}`,
			JSON.stringify(item),
		);
	},

	get(key: string) {
		const itemStr = localStorage.getItem(`${cacheConfig.keyPrefix}${key}`);
		if (!itemStr) return null;

		try {
			const item = JSON.parse(itemStr);
			if (Date.now() > item.expiry) {
				localStorage.removeItem(`${cacheConfig.keyPrefix}${key}`);
				return null;
			}
			return item.value;
		} catch {
			localStorage.removeItem(`${cacheConfig.keyPrefix}${key}`);
			return null;
		}
	},

	remove(key: string) {
		localStorage.removeItem(`${cacheConfig.keyPrefix}${key}`);
	},

	clear() {
		const keys = Object.keys(localStorage);
		for (const key of keys) {
			if (key.startsWith(cacheConfig.keyPrefix)) {
				localStorage.removeItem(key);
			}
		}
	},
};
