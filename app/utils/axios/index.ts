import { SECRETS } from "@/config/secrets";
import axios from "axios";

const httpAxios = axios.create({
    baseURL: SECRETS.API_BASE_URL + "/api/v1",
    withCredentials: true
});

const ROUTES = {
    AUTH: {
        ROOT: "/auth",
        GET_REDIRECT_URL: "/auth/google",
        CALLBACK: "/auth/google/callback",
        REFRESH_TOKEN: "/auth/google/token/refresh"
    },
    USER: {
        ROOT: '/user',
    },
    CONTACTS: {
        ROOT: "/contacts"
    },
    TRANSACTION: {
        ROOT: "/transaction"
    }
}

export {
    httpAxios, ROUTES
};
