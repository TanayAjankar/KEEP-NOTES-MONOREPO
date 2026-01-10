const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String },
        providers: [
            {
                provider: {
                    type: String,
                    enum: ["local", "google"],
                    required: true,
                },
                providerId: { type: String }, // e.g., googleId or null for local
            },
        ],
        verified: { type: Boolean, default: false },
        verificationToken: String,
        verificationExpires: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    { timestamps: true }
);

UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
