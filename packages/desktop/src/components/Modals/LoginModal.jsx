import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Modal from "./Modal";
import { loginUser } from "../../store/thunks/authThunks";
import {
    selectAuthLoading,
    selectAuthError,
    clearError,
} from "../../store/slices/authSlice";

function LoginModal({ onClose, onSwitchToRegister }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const loading = useSelector(selectAuthLoading);
    const globalError = useSelector(selectAuthError);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [localError, setLocalError] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
        // Clear errors when user starts typing
        if (localError) setLocalError("");
        if (globalError) dispatch(clearError());
    };

    async function handleLogin(e) {
        e.preventDefault();
        setLocalError("");

        try {
            const { email, password } = formData;
            const result = await dispatch(
                loginUser({ email, password })
            ).unwrap();

            // Handle successful login
            console.log("Login successful:", result.message);
            
            // Check if there's a return URL to redirect to
            const returnUrl = searchParams.get('returnUrl');
            if (returnUrl) {
                // Decode and navigate to the intended destination
                navigate(decodeURIComponent(returnUrl), { replace: true });
            } else {
                // Default behavior - just close the modal
                onClose();
            }
        } catch (err) {
            // Error is already handled by the thunk and stored in global state
            setLocalError(err);
        }
    }

    const handleRegisterClick = (e) => {
        e.preventDefault();
        onClose();
        if (onSwitchToRegister) onSwitchToRegister();
    };

    return (
        <Modal onClose={onClose}>
            <div style={{ width: "400px", maxWidth: "90vw" }}>
                <div style={{ padding: "20px" }}>
                    <h2
                        style={{
                            textAlign: "center",
                            marginBottom: "24px",
                            color: "#333",
                        }}
                    >
                        Welcome Back
                    </h2>
                    {(localError || globalError) && (
                        <div
                            className="error"
                            style={{
                                color: "red",
                                backgroundColor: "#ffebee",
                                border: "1px solid #ffcdd2",
                                padding: "8px 12px",
                                borderRadius: "4px",
                                marginBottom: "16px",
                                fontSize: "14px",
                            }}
                        >
                            {localError || globalError}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "16px" }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    marginBottom: "4px",
                                    fontWeight: "500",
                                }}
                            >
                                Email <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: "block",
                                    marginBottom: "4px",
                                    fontWeight: "500",
                                }}
                            >
                                Password <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                }}
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: loading ? "#ccc" : "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "16px",
                                fontWeight: "500",
                                cursor: loading ? "not-allowed" : "pointer",
                                marginBottom: "16px",
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <div
                        className="form-footer"
                        style={{
                            textAlign: "center",
                            paddingTop: "16px",
                            borderTop: "1px solid #eee",
                        }}
                    >
                        <p
                            style={{
                                margin: "0 0 12px 0",
                                color: "#666",
                                fontSize: "14px",
                            }}
                        >
                            Don't have an account?{" "}
                            <a
                                href="#"
                                onClick={handleRegisterClick}
                                style={{
                                    color: "#007bff",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }}
                                onMouseOver={(e) =>
                                    (e.target.style.textDecoration =
                                        "underline")
                                }
                                onMouseOut={(e) =>
                                    (e.target.style.textDecoration = "none")
                                }
                            >
                                Register here
                            </a>
                        </p>
                        <button
                            onClick={onClose}
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
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default LoginModal;
