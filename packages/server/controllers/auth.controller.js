const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

function generateTokens(user) {
    // Create access token
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
}

/**
 * Register a new user
 * @route POST /auth/register
 */
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                message:
                    "Please provide all required fields: name, email, and password",
            });
        }

        // Validate field types
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "All fields must be valid strings",
            });
        }

        // Validate name field
        if (name.trim().length < 3) {
            return res.status(400).json({
                message: "Name must be at least 3 characters long",
            });
        }

        // Additional name validation - only allow letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(name.trim())) {
            return res.status(400).json({
                message:
                    "Name can only contain letters, spaces, hyphens, and apostrophes",
            });
        }

        // Prevent excessively long names
        if (name.trim().length > 50) {
            return res.status(400).json({
                message: "Name must be less than 50 characters",
            });
        }

        // Validate email format and length
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
            });
        }

        if (password.length > 128) {
            return res.status(400).json({
                message: "Password must be less than 128 characters",
            });
        }

        // Check for basic password complexity
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return res.status(400).json({
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res
                .status(400)
                .json({ message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create verification token with 1-hour expiry
        const verificationToken = crypto.randomBytes(20).toString("hex");
        const verificationExpires = Date.now() + 3600000; // 1 hour from now

        // Create new user
        user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            verificationToken,
            verificationExpires,
            providers: [{ provider: "local" }],
        });

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        //This goes to frontend to handle verification

        const emailHtml = `
            <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                <h1 style="color: #333; margin: 0;">Keep Notes</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #333;">Verify Your Email Address</h2>
                <p>Hi ${user.name},</p>
                <p>Thank you for registering. Please click the button below to verify your email address and complete your registration.</p>
                <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #007bff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Verify Email Address</a>
                </div>
                <p>This verification link is valid for 1 hour.</p>
                <p>If you did not sign up for this account, you can ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">This is an automated message, please do not reply.</p>
            </div>
            </div>
        `;

        // Build the verification email page
        await sendEmail({
            email: user.email,
            subject: "Verify your email",
            text: `Please click on the following link to verify your email: ${verificationUrl}`,
            html: emailHtml,
        });

        res.status(201).json({
            message:
                "Registration successful. Please check your email to verify your account.",
        });
    } catch (err) {
        console.error("Registration error:", err);
        // Send back more specific error message while still maintaining security
        const errorMessage =
            err.code === 11000
                ? "Email already exists"
                : "Error creating user. Please try again later.";
        res.status(500).json({
            message: errorMessage,
            error:
                process.env.NODE_ENV === "development"
                    ? err.message
                    : undefined,
        });
    }
};

/**
 * Login user
 * @route POST /auth/login
 */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields and types
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return res
                .status(400)
                .json({ message: "Email and password must be valid strings" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password is set
        if (!user.password) {
            return res.status(400).json({
                message:
                    "Password has not been set for this account. Please use the 'Forgot Password' option to set your password.",
            });
        }
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if email is verified for local accounts
        const hasLocal = user.providers.some((p) => p.provider === "local");
        if (hasLocal && !user.verified) {
            return res
                .status(400)
                .json({ message: "Please verify your email first" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Set tokens as HTTP-only cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 1000, // 15 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/auth/refresh", // Only sent to refresh endpoint
            // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            maxAge: 2 * 60 * 1000,
        });

        // Return only user data, not tokens
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error logging in" });
    }
};

/**
 * Refresh access token using refresh token
 * @route POST /auth/refresh
 */
exports.refreshToken = (req, res) => {
    // Get refresh token from cookie instead of request body
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Generate new access token
        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );

        // Set new access token as cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        // No need to send token in response body
        res.json({ success: true });
    } catch (err) {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

/**
 * Verify email address
 * @route GET /auth/verify-email
 */
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res
                .status(400)
                .json({ message: "Verification token is required" });
        }

        // Find user with the verification token
        const user = await User.findOne({
            verificationToken: token,
        });

        // If no user is found with the token, it's invalid
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid verification token" });
        }

        // If user is already verified, no need to proceed
        if (user.verified) {
            return res
                .status(200)
                .json({ message: "Email has already been verified" });
        }

        // Check if the token has expired
        if (user.verificationExpires < Date.now()) {
            return res
                .status(400)
                .json({ message: "Expired verification token" });
        }

        // Update user verification status
        user.verified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        await user.save();

        // Send confirmation email with user-friendly HTML
        const emailHtml = `
            <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f7f7f7; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                <h1 style="color: #333; margin: 0;">Keep Notes</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #28a745;">✓ Email Verification Successful</h2>
                <p>Hi ${user.name},</p>
                <p>Great news! Your email address has been successfully verified. You can now log in to your Keep Notes account and start organizing your thoughts.</p>
                <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}?login=true" style="background-color: #007bff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Login to Your Account</a>
                </div>
                <p>Welcome to Keep Notes! We're excited to have you on board.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">This is an automated message, please do not reply.</p>
            </div>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: "Email Verification Successful - Welcome to Keep Notes!",
            text: "Your email has been successfully verified. You can now log in to your account.",
            html: emailHtml,
        });

        res.json({ message: "Email verified successfully" });
    } catch (err) {
        console.error("Email verification error:", err);
        res.status(500).json({ message: "Error verifying email" });
    }
};

/**
 * Resend verification email
 * @route POST /auth/resend-verification
 */
exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already verified
        if (user.verified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generate new verification token with 1-hour expiry
        const verificationToken = crypto.randomBytes(20).toString("hex");
        user.verificationToken = verificationToken;
        user.verificationExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await sendEmail({
            email: user.email,
            subject: "Verify your email",
            text: `Please click on the following link to verify your email: ${verificationUrl}`,
        });

        res.json({ message: "Verification email sent successfully" });
    } catch (err) {
        console.error("Resend verification error:", err);
        res.status(500).json({ message: "Error sending verification email" });
    }
};

/**
 * Request password reset
 * @route POST /auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email input
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Valid email is required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If password is not set, instruct user to use social login
        if (!user.password) {
            return res.status(400).json({
                message:
                    "Password has not been set for this account. Please log in with your social account or If you wish to set a password, use the 'Forgot Password' option from the login page.",
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send reset email
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`,
        });

        res.json({ message: "Password reset email sent" });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Error processing password reset" });
    }
};

/**
 * Reset password using token
 * @route POST /auth/reset-password
 */
exports.resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const { password } = req.body;

        // Validate token
        if (!token || typeof token !== "string") {
            return res
                .status(400)
                .json({ message: "Valid reset token is required" });
        }

        // Validate password
        if (!password || typeof password !== "string") {
            return res.status(400).json({ message: "Password is required" });
        }

        if (password.length < 8 || password.length > 128) {
            return res.status(400).json({
                message: "Password must be between 8 and 128 characters long",
            });
        }

        // Check for basic password complexity
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return res.status(400).json({
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Add "local" to providers if not already present
        if (!user.providers.some((p) => p.provider === "local")) {
            user.providers.push({ provider: "local" });
        }

        await user.save();

        // Send confirmation email
        await sendEmail({
            email: user.email,
            subject: "Password Reset Successful",
            text: "Your password has been successfully reset.",
        });

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Error resetting password" });
    }
};

/**
 * Check email verification status
 * @route POST /auth/check-email
 */
exports.checkEmailStatus = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email input
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Valid email is required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) || email.length > 254) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.json({
                status: "available",
                message: "Email is available for registration",
            });
        }

        if (user.verified) {
            return res.json({
                status: "exists-verified",
                message: "Email is already registered and verified",
            });
        } else {
            return res.json({
                status: "exists-unverified",
                message: "Email is registered but not verified",
            });
        }
    } catch (err) {
        console.error("Check email status error:", err);
        res.status(500).json({ message: "Error checking email status" });
    }
};

exports.generateTokens = generateTokens;

/**
 * Check authentication status
 * @route GET /auth/check
 */
exports.checkAuth = async (req, res) => {
    try {
        // If no user is attached by middleware, user is not authenticated
        if (!req.user) {
            return res.json({
                authenticated: false,
                user: null,
            });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.json({
                authenticated: false,
                user: null,
            });
        }

        return res.json({
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Logout user
 * @route POST /auth/logout
 */
exports.logout = (req, res) => {
    // Clear access token cookie - must match the httpOnly option used when setting
    res.clearCookie("accessToken", {
        httpOnly: true,
    });

    // Clear refresh token cookie - must match httpOnly and path options used when setting
    res.clearCookie("refreshToken", {
        httpOnly: true,
        path: "/auth/refresh",
    });

    res.json({ success: true, message: "Logged out successfully" });
};
