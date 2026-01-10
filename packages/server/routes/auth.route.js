const express = require("express");
const router = express.Router();
const passport = require("passport");
const { requireAuth, optionalAuth } = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    generateTokens,
    checkAuth,
    logout,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken); // Changed to GET since we're using cookies
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.get("/check", requireAuth, checkAuth); // Use required auth to trigger 401 for expired tokens
router.post("/logout", logout); // New route for logout

// Update Google OAuth flow
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login",
    }),
    (req, res) => {
        const { accessToken, refreshToken } = generateTokens(req.user);

        // Set tokens as cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect to frontend with success
        res.redirect(`${process.env.CLIENT_URL}/auth-success`);
    }
);

module.exports = router;
