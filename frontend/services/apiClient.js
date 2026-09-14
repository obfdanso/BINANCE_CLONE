/**
 * The single axios instance every API call goes through.
 *
 * Responsibilities:
 *   - point at the backend resolved in config.js
 *   - attach the stored JWT to every request
 *   - turn axios failures into a predictable { status, message } shape
 *   - clear the session and notify the app when the token is rejected
 */
import axios from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config';
import { clearSession, getToken } from './session';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// AuthContext registers a callback here so an expired token can bounce the
// user back to the sign-in screen from anywhere in the app.
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

function toApiError(error) {
    // The request never reached the server: wrong IP, backend down, wrong Wi-Fi.
    if (!error.response) {
        const offline = error.code === 'ECONNABORTED'
            ? 'The server took too long to respond.'
            : `Cannot reach the server at ${API_BASE_URL}. Check that the backend is running and that your phone is on the same Wi-Fi.`;
        return new ApiError(offline, 0, null);
    }

    const { status, data } = error.response;
    // The backend reports failures as { "message": "..." } across controllers.
    const message =
        (typeof data === 'string' && data) ||
        data?.message ||
        data?.error ||
        `Request failed with status ${status}.`;

    return new ApiError(message, status, data);
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const apiError = toApiError(error);

        if (apiError.status === 401 || apiError.status === 403) {
            await clearSession();
            if (unauthorizedHandler) unauthorizedHandler();
        }

        return Promise.reject(apiError);
    },
);

export default apiClient;
