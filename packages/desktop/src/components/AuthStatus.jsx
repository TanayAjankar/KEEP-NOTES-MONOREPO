import { useSelector } from "react-redux";
import {
    selectIsAuthenticated,
    selectUser,
    selectAuthLoading,
    selectAuthChecked,
} from "../store/slices/authSlice";

const AuthStatus = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);
    const loading = useSelector(selectAuthLoading);
    const authChecked = useSelector(selectAuthChecked);

    // Get the entire auth state for debugging
    const authState = useSelector((state) => state.auth);

    if (loading && !authChecked) {
        return (
            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    margin: "20px",
                }}
            >
                <h3>Authentication Status: Checking session...</h3>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "20px",
                backgroundColor: isAuthenticated ? "#d4edda" : "#f8d7da",
                border: `1px solid ${isAuthenticated ? "#c3e6cb" : "#f5c6cb"}`,
                borderRadius: "4px",
                margin: "20px",
            }}
        >
            <h3>
                Authentication Status:{" "}
                {isAuthenticated ? "Logged In" : "Logged Out"}
            </h3>
            {isAuthenticated && user && (
                <div>
                    <p>
                        <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>User ID:</strong> {user.id}
                    </p>
                </div>
            )}
            {!isAuthenticated && <p>Please log in to see your information.</p>}

            {/* Debug section - show raw auth state */}
            <details style={{ marginTop: "15px" }}>
                <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                    Debug: Raw Auth State
                </summary>
                <pre
                    style={{
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        marginTop: "10px",
                        overflow: "auto",
                        maxHeight: "200px",
                    }}
                >
                    {JSON.stringify(authState, null, 2)}
                </pre>
            </details>
        </div>
    );
};

export default AuthStatus;
