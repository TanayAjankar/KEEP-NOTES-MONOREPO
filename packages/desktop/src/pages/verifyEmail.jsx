import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authServices } from "shared/src/api/services";
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Paper,
} from "@mui/material";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState(
        "We are verifying your email address..."
    );
    const navigate = useNavigate();
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) {
            return;
        }

        const verify = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setStatus("error");
                setMessage("No verification token found in the URL.");
                return;
            }

            try {
                const response = await authServices.verifyEmail(token);
                setStatus("success");
                setMessage(
                    response.data.message || "Email verified successfully!"
                );
            } catch (error) {
                setStatus("error");
                setMessage(
                    error.response?.data?.message ||
                        "An error occurred during verification. The token might be invalid or expired."
                );
            }
        };

        verify();

        return () => {
            effectRan.current = true;
        };
    }, []);

    const handleLoginRedirect = () => {
        navigate("/?login=true");
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    marginTop: 8,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Email Verification
                </Typography>

                {status === "verifying" && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <CircularProgress />
                        <Typography>{message}</Typography>
                    </Box>
                )}

                {status === "success" && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Alert severity="success" sx={{ width: "100%" }}>
                            {message}
                        </Alert>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLoginRedirect}
                        >
                            Proceed to Login
                        </Button>
                    </Box>
                )}

                {status === "error" && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <Alert severity="error" sx={{ width: "100%" }}>
                            {message}
                        </Alert>
                        <Typography variant="body2">
                            If the problem persists, please try requesting a new
                            verification email.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/resend-verification")}
                        >
                            Resend Verification Email
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default VerifyEmail;
