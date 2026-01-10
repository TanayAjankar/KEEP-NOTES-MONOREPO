import HeaderLayout from "../Layout/HeaderLayout";
import TestAPI from "../components/TestAPI";
import AuthStatus from "../components/AuthStatus";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice";

const HomePage = () => {
    const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleGoToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <>
            <HeaderLayout>
                <div style={{ padding: "20px" }}>
                    <TestAPI />
                    <AuthStatus />
                    
                    {isAuthenticated && (
                        <div style={{ marginTop: "20px" }}>
                            <button 
                                onClick={handleGoToDashboard}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "16px"
                                }}
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </HeaderLayout>
        </>
    );
};

export default HomePage;
