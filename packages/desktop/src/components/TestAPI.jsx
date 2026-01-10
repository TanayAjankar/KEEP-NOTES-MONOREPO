import { useState } from "react";
import { testService } from "shared";

const TestAPI = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [protectedResult, setProtectedResult] = useState(null);
    const [protectedLoading, setProtectedLoading] = useState(false);
    const [protectedError, setProtectedError] = useState(null);

    const handleTestAPI = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await testService.testConnection();
            setResult(response.data);
        } catch (err) {
            // Handle HTTP errors properly
            if (err.response) {
                // The request was made and the server responded with an error status
                const status = err.response.status;
                const statusText = err.response.statusText;
                const errorMessage = err.response.data?.message || err.response.data?.error || statusText;
                setError(`${status}: ${errorMessage}`);
            } else if (err.request) {
                // The request was made but no response was received
                setError("No response from server");
            } else {
                // Something else happened
                setError(err.message || "API test failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTestProtectedAPI = async () => {
        setProtectedLoading(true);
        setProtectedError(null);
        setProtectedResult(null);

        try {
            const response = await testService.testProtectedConnection();
            setProtectedResult(response.data);
        } catch (err) {
            // Handle HTTP errors properly
            if (err.response) {
                // The request was made and the server responded with an error status
                const status = err.response.status;
                const statusText = err.response.statusText;
                const errorMessage = err.response.data?.message || err.response.data?.error || statusText;
                setProtectedError(`${status}: ${errorMessage}`);
            } else if (err.request) {
                // The request was made but no response was received
                setProtectedError("No response from server");
            } else {
                // Something else happened
                setProtectedError(err.message || "Protected API test failed");
            }
        } finally {
            setProtectedLoading(false);
        }
    };

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
            <h2 style={{ marginBottom: "8px", color: "#495057" }}>
                API Connection Test
            </h2>
            <p
                style={{
                    marginBottom: "20px",
                    color: "#6c757d",
                    fontSize: "14px",
                    lineHeight: "1.5",
                }}
            >
                Test the connection to the backend server to ensure all services
                are running properly.
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    onClick={handleTestAPI}
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: loading ? "#6c757d" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                    }}
                >
                    {loading ? "Testing Connection..." : "Test API Connection"}
                </button>

                <button
                    onClick={handleTestProtectedAPI}
                    disabled={protectedLoading}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: protectedLoading ? "#6c757d" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: protectedLoading ? "not-allowed" : "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                    }}
                >
                    {protectedLoading ? "Testing Protected..." : "Test Protected API"}
                </button>
            </div>

            {result && (
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#d4edda",
                        border: "1px solid #c3e6cb",
                        borderRadius: "4px",
                        marginBottom: "16px",
                    }}
                >
                    <h3 style={{ marginBottom: "8px", color: "#155724" }}>
                        ✅ Connection Successful
                    </h3>
                    <p
                        style={{
                            marginBottom: "12px",
                            color: "#155724",
                            fontSize: "14px",
                        }}
                    >
                        The API is responding correctly. Server connection
                        established.
                    </p>
                    <details style={{ marginTop: "12px" }}>
                        <summary
                            style={{
                                cursor: "pointer",
                                color: "#155724",
                                fontSize: "14px",
                                fontWeight: "500",
                                marginBottom: "8px",
                            }}
                        >
                            View Response Data
                        </summary>
                        <pre
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                overflow: "auto",
                                marginTop: "8px",
                                border: "1px solid #c3e6cb",
                            }}
                        >
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#f8d7da",
                        border: "1px solid #f5c6cb",
                        borderRadius: "4px",
                    }}
                >
                    <h3 style={{ marginBottom: "8px", color: "#721c24" }}>
                        ❌ Connection Failed
                    </h3>
                    <p
                        style={{
                            marginBottom: "8px",
                            color: "#721c24",
                            fontSize: "14px",
                        }}
                    >
                        Unable to connect to the API server. Please check if the
                        server is running.
                    </p>
                    <p
                        style={{
                            color: "#721c24",
                            margin: 0,
                            fontSize: "13px",
                            fontFamily: "monospace",
                            backgroundColor: "#ffffff",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #f5c6cb",
                        }}
                    >
                        <strong>Error:</strong> {error}
                    </p>
                </div>
            )}

            {protectedResult && (
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#d1ecf1",
                        border: "1px solid #bee5eb",
                        borderRadius: "4px",
                        marginBottom: "16px",
                    }}
                >
                    <h3 style={{ marginBottom: "8px", color: "#0c5460" }}>
                        🔒 Protected Connection Successful
                    </h3>
                    <p
                        style={{
                            marginBottom: "12px",
                            color: "#0c5460",
                            fontSize: "14px",
                        }}
                    >
                        The protected API endpoint is responding correctly. Authentication is working.
                    </p>
                    <details style={{ marginTop: "12px" }}>
                        <summary
                            style={{
                                cursor: "pointer",
                                color: "#0c5460",
                                fontSize: "14px",
                                fontWeight: "500",
                                marginBottom: "8px",
                            }}
                        >
                            View Response Data
                        </summary>
                        <pre
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                overflow: "auto",
                                marginTop: "8px",
                                border: "1px solid #bee5eb",
                            }}
                        >
                            {JSON.stringify(protectedResult, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            {protectedError && (
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeaa7",
                        borderRadius: "4px",
                        marginBottom: "16px",
                    }}
                >
                    <h3 style={{ marginBottom: "8px", color: "#856404" }}>
                        🔐 Protected Connection Failed
                    </h3>
                    <p
                        style={{
                            marginBottom: "8px",
                            color: "#856404",
                            fontSize: "14px",
                        }}
                    >
                        Unable to access the protected API endpoint. This is expected if you're not logged in.
                    </p>
                    <p
                        style={{
                            color: "#856404",
                            margin: 0,
                            fontSize: "13px",
                            fontFamily: "monospace",
                            backgroundColor: "#ffffff",
                            padding: "8px",
                            borderRadius: "4px",
                            border: "1px solid #ffeaa7",
                        }}
                    >
                        <strong>Error:</strong> {protectedError}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TestAPI;
