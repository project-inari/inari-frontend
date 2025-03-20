export const useEnvironment = () => process.env.APP_ENV || 'LOCAL';
export const useBackendBaseUrl = () => process.env.BACKEND_API_BASE_URL;
