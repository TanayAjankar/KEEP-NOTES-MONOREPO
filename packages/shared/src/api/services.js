import { apiClient, API_ENDPOINTS } from "../index.js";

export const testService = {
    // Test API connection
    testConnection: () => apiClient.get(API_ENDPOINTS.TEST),

    testProtectedConnection: () => apiClient.get(API_ENDPOINTS.TEST_PROTECTED),
};

export const authServices = {
    // User registration
    register: (userData) =>
        apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),

    // User login
    login: (credentials) =>
        apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),

    // Refresh access token - now uses cookies automatically
    refreshToken: () => apiClient.get(API_ENDPOINTS.AUTH.REFRESH_TOKEN),

    // Logout user
    logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),

    // Verify email address
    verifyEmail: (token) =>
        apiClient.get(`${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?token=${token}`),

    // Resend email verification
    resendVerification: (email) =>
        apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email }),

    // Request password reset
    forgotPassword: (email) =>
        apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

    // Reset password with token
    resetPassword: (token, newPassword) =>
        apiClient.patch(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${token}`, {
            password: newPassword,
        }),

    // Get Google auth URL (for redirecting users)
    getGoogleAuthUrl: () => API_ENDPOINTS.AUTH.GOOGLE_AUTH,

    // Check current authentication status
    checkAuth: () => apiClient.get(API_ENDPOINTS.AUTH.CHECK),
};
