import { createAsyncThunk } from "@reduxjs/toolkit";
import { authServices } from "shared";
import {
    loginStart,
    loginSuccess,
    loginFailure,
    registerSuccess,
    logout as logoutAction,
    sessionExpired,
    setAuthChecked,
    startAuthCheck,
} from "../slices/authSlice";

// Login thunk
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart());

            const response = await authServices.login(credentials);
            const { user, message } = response.data;

            dispatch(loginSuccess({ user }));

            return {
                user,
                message,
            };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Login failed";
            dispatch(loginFailure(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

// Register thunk
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart());

            const response = await authServices.register(userData);
            const { message } = response.data;

            dispatch(registerSuccess());

            return { message };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Registration failed";
            dispatch(loginFailure(errorMessage));
            return rejectWithValue(errorMessage);
        }
    }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { dispatch }) => {
        try {
            await authServices.logout();
            dispatch(logoutAction());
        } catch (error) {
            // Even if server request fails, log out on client side
            dispatch(logoutAction());
        }
    }
);

// Check authentication status thunk
export const checkAuthStatus = createAsyncThunk(
    "auth/checkAuthStatus",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            dispatch(startAuthCheck());
            
            const response = await authServices.checkAuth();
            const { authenticated, user } = response.data;

            if (authenticated && user) {
                // User is authenticated, update state
                dispatch(loginSuccess({ user }));
                dispatch(setAuthChecked());
                return { user, authenticated: true };
            } else {
                // User is not authenticated, clear state
                dispatch(logoutAction());
                dispatch(setAuthChecked());
                return { authenticated: false };
            }
        } catch (error) {
            // If check auth fails, clear authentication state
            dispatch(logoutAction());
            dispatch(setAuthChecked());
            return rejectWithValue("Authentication check failed");
        }
    }
);
