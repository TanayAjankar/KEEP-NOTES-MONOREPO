import { createSlice } from "@reduxjs/toolkit";

// Helper functions for localStorage - only store user data
const getStoredUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error reading user from localStorage:", error);
        return null;
    }
};

const setStoredUser = (user) => {
    try {
        if (user) localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
        console.error("Error storing user in localStorage:", error);
    }
};

const clearStoredUser = () => {
    try {
        localStorage.removeItem("user");
    } catch (error) {
        console.error("Error clearing user from localStorage:", error);
    }
};

// Get initial state from localStorage
const storedUser = getStoredUser();

const initialState = {
    isAuthenticated: false, // Start as false, will be validated on app load
    user: storedUser, // Keep stored user for display until validation
    loading: true, // Start with loading true for initial auth check
    error: null,
    authChecked: false, // Track if initial auth check has been completed
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            const { user } = action.payload;
            state.loading = false;
            state.isAuthenticated = true;
            state.user = user;
            state.error = null;

            // Store only user data in localStorage
            setStoredUser(user);
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;

            // Clear localStorage
            clearStoredUser();
        },
        registerSuccess: (state) => {
            state.loading = false;
            state.error = null;
            // Don't set authentication state - user needs to verify email first
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;

            // Clear localStorage
            clearStoredUser();
        },
        sessionExpired: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = "Your session has expired. Please log in again.";

            // Clear localStorage
            clearStoredUser();
        },
        authRequired: (state) => {
            state.error = "Authentication required. Please log in to continue.";
        },
        clearError: (state) => {
            state.error = null;
        },
        setAuthChecked: (state) => {
            state.authChecked = true;
            state.loading = false;
        },
        startAuthCheck: (state) => {
            state.loading = true;
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerSuccess,
    logout,
    sessionExpired,
    authRequired,
    clearError,
    setAuthChecked,
    startAuthCheck,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthChecked = (state) => state.auth.authChecked;
