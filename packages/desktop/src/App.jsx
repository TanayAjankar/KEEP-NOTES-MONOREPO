import TestAPI from "./components/TestAPI";
import { Routes, Route } from "react-router-dom";
import VerifyEmail from "./pages/verifyEmail";
import ResendVerification from "./pages/resendVerification";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sessionExpired, logout, authRequired } from "./store/slices/authSlice";
import { selectIsAuthenticated, selectAuthChecked, selectAuthLoading } from "./store/slices/authSlice";
import { setSessionCallbacks, setAuthenticationStatus } from "shared";
import SessionExpiredModal from "./components/Modals/SessionExpiredModal";
import AuthRequiredModal from "./components/Modals/AuthRequiredModal";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { checkAuthStatus } from "./store/thunks/authThunks";
import { CircularProgress, Box } from "@mui/material";

function App() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const authChecked = useSelector(selectAuthChecked);
    const authLoading = useSelector(selectAuthLoading);

    // Perform initial authentication check on app load
    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    useEffect(() => {
        // Set up session callbacks for the API client
        setSessionCallbacks(
            // Session expired callback (for authenticated users who lose session)
            () => {
                console.log('Session expired - triggering logout');
                dispatch(sessionExpired());
            },
            // Force logout callback (for account revoked, etc.)
            (reason) => {
                console.log('Force logout:', reason);
                dispatch(logout());
            },
            // Auth required callback (for unauthenticated users accessing protected routes)
            () => {
                console.log('Authentication required - showing login prompt');
                dispatch(authRequired());
            }
        );
    }, [dispatch]);

    // Update API client with current authentication status
    useEffect(() => {
        setAuthenticationStatus(isAuthenticated);
    }, [isAuthenticated]);

    // Show loading spinner while performing initial auth check
    if (!authChecked && authLoading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Routes>
                {/* Home route - shows dashboard if authenticated, login if not */}
                <Route path="/" element={<HomePage />} />
                
                {/* Protected routes - require authentication */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                
                {/* Public routes - accessible to everyone */}
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/resend-verification" element={<ResendVerification />} />
                
                {/* Development/Testing routes */}
                <Route
                    path="/test"
                    element={
                        <div>
                            <TestAPI />
                        </div>
                    }
                />
            </Routes>
            
            {/* Session Expired Modal - will show when session expires */}
            <SessionExpiredModal />
            
            {/* Auth Required Modal - will show when unauthenticated user tries protected action */}
            <AuthRequiredModal />
        </>
    );
}

export default App;
