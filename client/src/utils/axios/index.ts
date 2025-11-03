import { SECRETS } from "../../config/secrets";
import axios from "axios";

const httpAxios = axios.create({
    baseURL: SECRETS.API_BASE_URL + "/api/v1",
    withCredentials: true
});

const ROUTES = {
    AUTH: {
        ROOT: "/auth",
        LOGOUT: "/auth/google/logout",
        GET_REDIRECT_URL: "/auth/google",
        CALLBACK: "/auth/google/callback",
        REFRESH_TOKEN: "/auth/google/token/refresh"
    },
    USER: {
        ROOT: '/user',
        SECRET: "/user/secret"
    },
    CONTACTS: {
        ROOT: "/contacts"
    },
    TRANSACTION: {
        ROOT: "/transaction"
    },
    SETTINGS: {
        ROOT: "/settings"
    },
    AI: {
        ROOT: "/ai"
    }
} as const;

export {
    httpAxios, ROUTES
};
