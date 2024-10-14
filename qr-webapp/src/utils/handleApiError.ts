export function handleApiError(error: any): never {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.response?.data?.error || 'Unknown error occurred';
    const err = new Error(message) as any;
    err.statusCode = statusCode;
    throw err;
}
