import { useCallback, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY } from "../lib/api";
import { AuthContext } from "./auth-context";

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    // Auth lives in React state, not read fresh from storage during render.
    // That is what makes a route guard re-evaluate after logging in.
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(readStoredUser);

    const login = useCallback((nextToken, nextUser) => {
        localStorage.setItem(TOKEN_KEY, nextToken);
        if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser ?? null);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }, []);

    // The api interceptor clears an expired token; mirror that into state so the
    // guard redirects instead of leaving a signed-out user on a blank dashboard.
    useEffect(() => {
        const onUnauthorized = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem("user");
        };
        window.addEventListener("codenest:unauthorized", onUnauthorized);
        return () => window.removeEventListener("codenest:unauthorized", onUnauthorized);
    }, []);

    // Keep tabs in sync when the user signs out in another one.
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === TOKEN_KEY) setToken(e.newValue);
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const value = useMemo(
        () => ({ token, user, isAuthenticated: Boolean(token), login, logout }),
        [token, user, login, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
