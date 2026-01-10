const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

module.exports = function (passport) {
    // Serialize user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // Local Strategy
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    // Find user by email
                    const user = await User.findOne({
                        email: email.toLowerCase(),
                    });

                    if (!user) {
                        return done(null, false, {
                            message: "Invalid email or password",
                        });
                    }

                    // Check password
                    const isMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (!isMatch) {
                        return done(null, false, {
                            message: "Invalid email or password",
                        });
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    // Google OAuth Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Find user with this Google ID in providers array
                    let user = await User.findOne({
                        providers: {
                            $elemMatch: {
                                provider: "google",
                                providerId: profile.id,
                            },
                        },
                    });

                    if (user) {
                        return done(null, user);
                    }

                    // Check if user exists with same email
                    const existingUser = await User.findOne({
                        email: profile.emails[0].value,
                    });
                    if (existingUser) {
                        // Check if already linked to Google
                        const hasGoogle = existingUser.providers.some(
                            (p) => p.provider === "google"
                        );
                        if (hasGoogle) {
                            return done(null, existingUser);
                        }
                        // Link Google to existing user
                        existingUser.providers.push({
                            provider: "google",
                            providerId: profile.id,
                        });
                        existingUser.verified = true;
                        await existingUser.save();
                        return done(null, existingUser);
                    }

                    // If no existing user, create new user
                    user = await User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        avatar: profile.photos[0].value,
                        providers: [
                            { provider: "google", providerId: profile.id },
                        ],
                        verified: true,
                    });

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
};
