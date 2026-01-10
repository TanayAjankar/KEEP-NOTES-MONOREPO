import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../store/slices/authSlice";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        // Create the return URL from current location
        const returnUrl = location.pathname + location.search;
        
        // Redirect to home page with login state and save the attempted location
        return <Navigate to={`/?login=true&returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
    }

    return children;
};

export default PrivateRoute;
