import { createContext, useContext } from "react";

// Context and hook live here, apart from the provider component, so the
// provider file only exports components and Fast Refresh keeps working.
export const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};
