import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated } from "../store/slices/authSlice";

const PublicRoute = ({ children, redirectTo = "/dashboard" }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    if (isAuthenticated) {
        // If user is already authenticated, redirect to dashboard
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PublicRoute;
