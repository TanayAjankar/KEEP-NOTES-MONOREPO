import axios from "axios";

// Session expiry callback - will be set by the frontend app
let onSessionExpired = null;
let onLogout = null;
let onAuthRequired = null; // New callback for unauthenticated users

export const setSessionCallbacks = (sessionExpiredCallback, logoutCallback, authRequiredCallback) => {
    onSessionExpired = sessionExpiredCallback;
    onLogout = logoutCallback;
    onAuthRequired = authRequiredCallback;
};

export const apiConfig = {
    baseURL: "http://localhost:3000",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Important: allows cookies to be sent
};

export const apiClient = axios.create(apiConfig);

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor with automatic token refresh
let refreshing = null;
let failedQueue = [];
let userWasAuthenticated = false; // Track if user was authenticated before

// Set user authentication status (to be called by frontend)
export const setAuthenticationStatus = (isAuthenticated) => {
    userWasAuthenticated = isAuthenticated;
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't retry if:
        // 1. Not a 401 error
        // 2. Already retried this request
        // 3. The failed request was the refresh endpoint itself
        if (
            error.response?.status !== 401 ||
            originalRequest._retry || 
            originalRequest.url?.includes('/auth/refresh')
        ) {
            return Promise.reject(error);
        }

        // Mark this request as retried
        originalRequest._retry = true;

        // If we're already refreshing, queue this request
        if (refreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                // Retry the original request after refresh completes
                return apiClient(originalRequest);
            }).catch((err) => {
                return Promise.reject(err);
            });
        }

        // Start the refresh process
        refreshing = true;

        try {
            // Attempt to refresh the token
            await apiClient.get("/auth/refresh");
            
            // Refresh successful
            refreshing = false;
            processQueue(null);
            
            // Retry the original request
            return apiClient(originalRequest);
        } catch (refreshError) {
            // Refresh failed
            refreshing = false;
            processQueue(refreshError);
            
            // Handle different types of refresh failures
            if (refreshError.response?.status === 401) {
                // Only trigger session expired if user was actually authenticated
                if (userWasAuthenticated) {
                    console.log('Session expired - refresh token invalid');
                    
                    // Reset authentication status
                    userWasAuthenticated = false;
                    
                    // Trigger session expired modal/handling
                    if (onSessionExpired) {
                        onSessionExpired();
                    }
                    
                    return Promise.reject(new Error('SESSION_EXPIRED'));
                } else {
                    // User was never authenticated - show auth required modal
                    console.log('Authentication required - user not logged in');
                    
                    if (onAuthRequired) {
                        onAuthRequired();
                    }
                    
                    return Promise.reject(new Error('AUTH_REQUIRED'));
                }
            } else if (refreshError.response?.status === 403) {
                // Account disabled, security event, etc.
                console.log('Account access revoked');
                
                userWasAuthenticated = false;
                
                if (onLogout) {
                    onLogout('ACCOUNT_REVOKED');
                }
                
                return Promise.reject(new Error('ACCOUNT_REVOKED'));
            } else {
                // Network or server errors - don't logout, just reject
                console.error('Token refresh failed due to network/server error:', refreshError.message);
                return Promise.reject(error);
            }
        }
    }
);
