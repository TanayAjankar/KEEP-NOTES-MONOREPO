import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { clearError } from "../../store/slices/authSlice";
import { selectAuthError, selectIsAuthenticated } from "../../store/slices/authSlice";

const AuthRequiredModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const authError = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    // Show modal if there's an auth required error and user is not authenticated
    const isAuthRequired = authError === "Authentication required. Please log in to continue.";
    const shouldShowModal = isAuthRequired && !isAuthenticated;

    const handleClose = () => {
        dispatch(clearError());
    };

    const handleLogin = () => {
        dispatch(clearError());
        // Use URL parameters to trigger login modal like Header component does
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('login', 'true');
        // Set return URL to current location
        searchParams.set('returnUrl', encodeURIComponent(location.pathname + location.search));
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    if (!shouldShowModal) return null;

    return (
        <Modal onClose={handleClose}>
            <div style={{ width: "400px", maxWidth: "90vw" }}>
                <div style={{ padding: "20px" }}>
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "24px",
                            color: "#333",
                        }}
                    >
                        Login Required
                    </h2>
                    <div
                        style={{
                            textAlign: "center",
                            marginBottom: "24px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "48px",
                                marginBottom: "16px",
                                color: "#17a2b8",
                            }}
                        >
                            🔐
                        </div>
                        <p
                            style={{
                                marginBottom: "0",
                                color: "#666",
                                fontSize: "14px",
                                lineHeight: "1.5",
                            }}
                        >
                            You need to be logged in to access this feature. 
                            Please log in to your account to continue.
                        </p>
                    </div>
                    <button
                        onClick={handleLogin}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "16px",
                            fontWeight: "500",
                            cursor: "pointer",
                            marginBottom: "16px",
                        }}
                    >
                        Log In
                    </button>
                    <div
                        className="form-footer"
                        style={{
                            textAlign: "center",
                            paddingTop: "16px",
                            borderTop: "1px solid #eee",
                        }}
                    >
                        <button
                            onClick={handleClose}
                            style={{
                                padding: "8px 20px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AuthRequiredModal;
