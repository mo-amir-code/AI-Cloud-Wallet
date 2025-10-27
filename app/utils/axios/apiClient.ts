// utils/api/client.ts
import { ApiResponseType } from "@/types/axios";
import * as SecureStore from "expo-secure-store";
import { httpAxios, ROUTES } from ".";

export interface ApiRequestOptions extends RequestInit {
    requiresAuth?: boolean;
    method: HttpMethod,
    body?: any,
    headers?: {
        Authorization?: string
    }
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options';

class ApiClient {
    private isRefreshing = false;
    private refreshPromise: Promise<string | null> | null = null;

    /**
     * Get the stored auth token
     */
    private async getToken(): Promise<string | null> {
        try {
            const token = await SecureStore.getItemAsync("auth_token");
            // console.log("Token:::::::::::: ", token)
            return token;
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    }

    /**
     * Store a new auth token
     */
    private async setToken(token: string): Promise<void> {
        try {
            await SecureStore.setItemAsync("auth_token", token);
        } catch (error) {
            console.error("Error storing token:", error);
        }
    }

    /**
     * Clear auth data (logout)
     */
    async clearAuth(): Promise<void> {
        try {
            await SecureStore.deleteItemAsync("auth_token");
        } catch (error) {
            console.error("Error clearing auth:", error);
        }
    }

    /**
     * Refresh the access token
     */
    private async refreshToken(): Promise<string | null> {
        // If already refreshing, return the existing promise
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;

        this.refreshPromise = (async () => {
            try {
                const response = await httpAxios.post(ROUTES.AUTH.REFRESH_TOKEN)

                const data = response.data.data;
                const newToken = data.token || data.jwt;

                if (newToken) {
                    await this.setToken(newToken);
                    return newToken;
                }

                return null;
            } catch (error) {
                console.log("Token refresh failed:", error);
                // Clear auth data if refresh fails
                // await this.clearAuth();
                return null;
            } finally {
                this.isRefreshing = false;
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    /**
     * Make an API request with automatic token refresh
     */
    async request(
        endpoint: string,
        options: ApiRequestOptions
    ): Promise<ApiResponseType> {
        const { method, requiresAuth, headers = undefined, body = undefined } = options;

        // console.log("Requires Auth: ====?>    ", requiresAuth)

        // Get token if authentication is required
        let token = requiresAuth ? await this.getToken() : null;

        // Setup headers
        let requestHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            ...headers,
        };

        if (token) {
            requestHeaders = {
                ...requestHeaders,
                "authorization": `Bearer ${token}`
            };
        }

        // console.log("Request Headers: ", requestHeaders)

        // Make the request
        let response = {
            data: null
        } as ApiResponseType;

        try {
            response = await httpAxios({
                method,
                url: endpoint,
                data: body,
                headers: requestHeaders
            });

            response = {
                data: (response as any).data
            };
        } catch (error: any) {

            // console.log("Response in Error: ==========================================> ,   ", error?.response?.data)

            // If unauthorized and requires auth, try to refresh token
            if (error?.response?.status === 401 && requiresAuth && token) {
                console.log("Token expired, attempting refresh...");

                const newToken = await this.refreshToken();

                if (newToken) {
                    // Retry the request with the new token
                    requestHeaders.Authorization = `Bearer ${newToken}`;
                    try {
                        response = await httpAxios({
                            method,
                            url: endpoint,
                            data: body,
                            headers: requestHeaders
                        });
                        response = {
                            data: (response as any).data
                        };
                    } catch (error) {
                        this.clearAuth();
                        response = {
                            isUnAuthorized: true,
                            error: {
                                message: "session has expired"
                            }
                        };
                    }
                } else {
                    this.clearAuth();
                    response = {
                        error: {
                            message: error?.response?.data?.message || "Something went wrong"
                        }
                    };
                }
            } else {
                response = {
                    error: {
                        message: error?.response?.data?.message || "Something went wrong"
                    }
                };
            }
        }

        // Return parsed JSON
        return response;
    }
}

// Export a singleton instance
export const apiClient = new ApiClient();