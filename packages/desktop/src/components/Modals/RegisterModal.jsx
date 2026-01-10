import { useState } from "react";
import Modal from "./Modal";
import { authServices } from "shared";

function RegisterModal({ onClose, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    async function handleRegister(e) {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { name, email, password } = formData;
            await authServices.register({ name, email, password });
            setIsRegistered(true); // Show success message instead of closing
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Registration failed";

            // Check if the error is about existing email and customize message
            if (
                errorMessage.toLowerCase().includes("user already exists") ||
                errorMessage.toLowerCase().includes("email already exists")
            ) {
                setError("User already exists with this email");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLoginClick = (e) => {
        e.preventDefault();
        onClose();
        if (onSwitchToLogin) onSwitchToLogin();
    };

    return (
        <Modal onClose={onClose}>
            <div style={{ width: "400px", maxWidth: "90vw" }}>
                {isRegistered ? (
                    <div
                        className="success-message"
                        style={{ textAlign: "center", padding: "20px" }}
                    >
                        <div
                            style={{
                                fontSize: "48px",
                                color: "#28a745",
                                marginBottom: "16px",
                            }}
                        >
                            ✓
                        </div>
                        <h2 style={{ color: "#28a745", marginBottom: "16px" }}>
                            Registration Successful!
                        </h2>
                        <p
                            style={{
                                marginBottom: "20px",
                                color: "#666",
                                lineHeight: "1.5",
                            }}
                        >
                            We have sent a verification email to{" "}
                            <strong style={{ color: "#333" }}>
                                {formData.email}
                            </strong>
                            .
                        </p>
                        <p
                            style={{
                                marginBottom: "24px",
                                color: "#666",
                                lineHeight: "1.5",
                            }}
                        >
                            Please verify your email and{" "}
                            <a
                                href="#"
                                onClick={handleLoginClick}
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
                                login here
                            </a>
                            .
                        </p>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "12px 24px",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "16px",
                                fontWeight: "500",
                                cursor: "pointer",
                            }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: "20px" }}>
                        <h2
                            style={{
                                textAlign: "center",
                                marginBottom: "24px",
                                color: "#333",
                            }}
                        >
                            Create Account
                        </h2>
                        {error && (
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
                                {error
                                    .toLowerCase()
                                    .includes("user already exists") ? (
                                    <>
                                        User already exists with this email,
                                        please{" "}
                                        <a
                                            href="#"
                                            onClick={handleLoginClick}
                                            style={{
                                                color: "#007bff",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            login
                                        </a>
                                    </>
                                ) : (
                                    error
                                )}
                            </div>
                        )}
                        <form onSubmit={handleRegister}>
                            <div style={{ marginBottom: "16px" }}>
                                <label
                                    htmlFor="name"
                                    style={{
                                        display: "block",
                                        marginBottom: "4px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Name <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                    }}
                                    placeholder="Enter your full name"
                                />
                                <small
                                    style={{ color: "#666", fontSize: "12px" }}
                                >
                                    Minimum 3 characters, letters only
                                </small>
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <label
                                    htmlFor="email"
                                    style={{
                                        display: "block",
                                        marginBottom: "4px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Email{" "}
                                    <span style={{ color: "red" }}>*</span>
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
                            <div style={{ marginBottom: "16px" }}>
                                <label
                                    htmlFor="password"
                                    style={{
                                        display: "block",
                                        marginBottom: "4px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Password{" "}
                                    <span style={{ color: "red" }}>*</span>
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
                                    placeholder="Create a strong password"
                                />
                                <div
                                    style={{
                                        marginTop: "4px",
                                        fontSize: "12px",
                                        color: "#666",
                                    }}
                                >
                                    <div>Password must contain:</div>
                                    <ul
                                        style={{
                                            margin: "4px 0",
                                            paddingLeft: "16px",
                                        }}
                                    >
                                        <li>At least 8 characters</li>
                                        <li>One uppercase letter (A-Z)</li>
                                        <li>One lowercase letter (a-z)</li>
                                        <li>One number (0-9)</li>
                                        <li>
                                            One special character (!@#$%^&*)
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label
                                    htmlFor="confirmPassword"
                                    style={{
                                        display: "block",
                                        marginBottom: "4px",
                                        fontWeight: "500",
                                    }}
                                >
                                    Confirm Password{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                    }}
                                    placeholder="Confirm your password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: loading
                                        ? "#ccc"
                                        : "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    marginBottom: "16px",
                                }}
                            >
                                {loading ? "Registering..." : "Register"}
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
                                Already have an account?{" "}
                                <a
                                    href="#"
                                    onClick={handleLoginClick}
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
                                    Login here
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
                )}
            </div>
        </Modal>
    );
}

export default RegisterModal;
