import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth-context";

// Reads auth from context during its own render, so it re-evaluates on every
// navigation — unlike a value captured once in App's render body.
const RequireAuth = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default RequireAuth;
