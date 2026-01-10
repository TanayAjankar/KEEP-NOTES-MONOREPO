import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../store/slices/authSlice";
import { logoutUser } from "../store/thunks/authThunks";
import LoginModal from "./Modals/LoginModal";
import RegisterModal from "./Modals/RegisterModal";

const Header = ({ headerHeight }) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    const [activeModal, setActiveModal] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get("login") === "true") {
            setActiveModal("login");
            // Don't remove the returnUrl parameter - keep it for after login
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("login");
            setSearchParams(newParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (activeModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeModal]);

    return (
        <>
            <header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: headerHeight,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: "0 20px",
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "steelblue",
                    zIndex: 1000,
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        fontSize: "24px",
                        fontWeight: "bold",
                    }}
                >
                    KEEP NOTES MONOREPO
                </h1>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    {!isAuthenticated ? (
                        // Show login and register buttons when not authenticated
                        <>
                            <button
                                onClick={() => setActiveModal("login")}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "14px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Login
                            </button>

                            <button
                                onClick={() => setActiveModal("register")}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "14px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        // Show user info and logout button when authenticated
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    color: "white",
                                }}
                            >
                                <span style={{ fontSize: "14px" }}>
                                    Welcome, {user?.name || "User"}!
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "8px 16px",
                                    fontSize: "14px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.2s ease",
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </header>

            {!isAuthenticated && activeModal === "login" && (
                <LoginModal
                    onClose={closeModal}
                    onSwitchToRegister={() => setActiveModal("register")}
                />
            )}
            {!isAuthenticated && activeModal === "register" && (
                <RegisterModal
                    onClose={closeModal}
                    onSwitchToLogin={() => setActiveModal("login")}
                />
            )}
        </>
    );
};

export default Header;
