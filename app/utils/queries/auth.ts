import { ROUTES } from "../axios";
import { apiClient } from "../axios/apiClient";


const getOAuthUrl = async (appRedirectUri: string) => {
    try {
        const res = await apiClient.request(ROUTES.AUTH.GET_REDIRECT_URL, {
            method: "post",
            body: { redirectUri: appRedirectUri, from: "mobile" }
        });
        return res.data.data.redirect_url;
    } catch (err) {
        console.log('Error fetching OAuth URL:', err);
        return null;
    }
};

const isUserAuthenticated = async () => {
    const res = await apiClient.request(ROUTES.AUTH.ROOT, {
        method: "get",
        requiresAuth: true,
    });

    // console.log("RESPONSE-0: ", res)

    if (res.error) return false;
    return true;
}



export {
    getOAuthUrl,
    isUserAuthenticated
};

