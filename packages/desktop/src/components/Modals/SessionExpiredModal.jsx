import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { clearError, logout } from "../../store/slices/authSlice";
import { selectAuthError } from "../../store/slices/authSlice";

const SessionExpiredModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const authError = useSelector(selectAuthError);
    
    // Show modal if there's a session expired error
    const isSessionExpired = authError === "Your session has expired. Please log in again.";

    const handleClose = () => {
        dispatch(clearError());
        // Optionally redirect to login page or refresh
        window.location.reload(); // Simple approach - reloads the app
    };

    const handleLoginRedirect = () => {
        dispatch(clearError());
        dispatch(logout()); // Ensure clean logout
        // Use URL parameters to trigger login modal like Header component does
        const searchParams = new URLSearchParams();
        searchParams.set('login', 'true');
        // Set return URL to current location (without the current search params to avoid loops)
        searchParams.set('returnUrl', encodeURIComponent(location.pathname));
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };

    if (!isSessionExpired) return null;

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
                        Your Session Has Expired
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
                                color: "#ffc107",
                            }}
                        >
                            ⏰
                        </div>
                        <p
                            style={{
                                marginBottom: "0",
                                color: "#666",
                                fontSize: "14px",
                                lineHeight: "1.5",
                            }}
                        >
                            For your security, you have been automatically logged out due to inactivity. 
                            Please log in again to continue using the application.
                        </p>
                    </div>
                    <button
                        onClick={handleLoginRedirect}
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
                        Log In Again
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
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SessionExpiredModal;
