import axios from "axios";

export const TOKEN_KEY = "token";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach the bearer token to every request rather than at each call site.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// A rejected token means the session is over — clear it once, here, instead of
// letting every screen render an empty state that looks like "you have no data".
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
            localStorage.removeItem(TOKEN_KEY);
            window.dispatchEvent(new Event("codenest:unauthorized"));
        }
        return Promise.reject(error);
    }
);

// Axios failures come in three shapes: a server response, a request that never
// got one, and everything else. Callers only ever want the sentence.
export const errorMessage = (error, fallback = "Something went wrong.") => {
    if (error.response) return error.response.data?.message || fallback;
    if (error.request) return "Cannot reach the server. Is the API running?";
    return fallback;
};

export default api;
