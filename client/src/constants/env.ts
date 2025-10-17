export const FIREBASE = {
	API_KEY: import.meta.env.VITE_API_KEY,
	AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
	PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
	STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
	MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
	APP_ID: import.meta.env.VITE_APP_ID,
} as const;

export const EMULATORS = {
	HOST: import.meta.env.VITE_EMULATION_HOST,
	AUTH_PORT:  import.meta.env.VITE_EMULATION_AUTH_PORT,
	STORAGE_PORT: import.meta.env.VITE_EMULATION_STORAGE_PORT,
} as const;

export const API = {
	ROUTE: import.meta.env.VITE_FUNCTIONS_URL,
} as const;

export const IS_DEV = import.meta.env.DEV;
