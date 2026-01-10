import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authServices } from "shared/src/api/services";
import {
    Container,
    Box,
    Typography,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Paper,
} from "@mui/material";

const ResendVerification = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cooldownTimer, setCooldownTimer] = useState(0);
    const navigate = useNavigate();

    // Cooldown timer effect
    useEffect(() => {
        let interval;
        if (cooldownTimer > 0) {
            interval = setInterval(() => {
                setCooldownTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldownTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setStatus("error");
            setMessage("Please enter your email address.");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus("error");
            setMessage("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        setStatus("loading");
        setMessage("");

        try {
            const response = await authServices.resendVerification(email);
            setStatus("success");
            setMessage(
                response.data.message ||
                    "Verification email sent successfully! Please check your inbox."
            );
            setCooldownTimer(30); // Start 30-second cooldown
        } catch (error) {
            setStatus("error");
            setMessage(
                error.response?.data?.message ||
                    "An error occurred while sending the verification email. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
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
                    Resend Verification Email
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Enter your email address and we'll send you a new
                    verification link.
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ width: "100%" }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        error={status === "error" && email !== ""}
                    />

                    {status === "error" && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    {status === "success" && (
                        <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                            {message}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading || cooldownTimer > 0}
                        startIcon={
                            isLoading ? <CircularProgress size={20} /> : null
                        }
                    >
                        {isLoading
                            ? "Sending..."
                            : cooldownTimer > 0
                            ? `Wait ${cooldownTimer}s before resending`
                            : "Send Verification Email"}
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleBackToLogin}
                        disabled={isLoading}
                        sx={{ mt: 1 }}
                    >
                        Back to Login
                    </Button>

                    {status === "success" && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 3 }}
                        >
                            Didn't receive the email? Check your spam folder
                            {cooldownTimer > 0
                                ? ` or wait ${cooldownTimer} seconds to try again`
                                : " or try again"}
                            .
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ResendVerification;
