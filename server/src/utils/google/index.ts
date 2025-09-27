import { ENV_VARS } from "../../config/constants.js";

const regenerateAccessTokenWithRefreshToken = async (refreshToken: string): Promise<string | null> => {
    try {
        console.log("🔄 Regenerating access token using refresh token...");

        // Make request to Google's token endpoint
        const response = await fetch(ENV_VARS.GOOGLE.ACCESS_TOKEN_URL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: ENV_VARS.GOOGLE.CLIENT_ID!,
                client_secret: ENV_VARS.GOOGLE.CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        });

        // Check if request was successful
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Token refresh failed: ${response.status} - ${errorText}`);

            // Handle specific error cases
            if (response.status === 400) {
                console.error("🚫 Possible causes: Invalid refresh token, expired refresh token, or wrong client credentials");
            } else if (response.status === 401) {
                console.error("🚫 Authentication failed: Check your client_id and client_secret");
            }

            return null;
        }

        const tokenData = await response.json();

        // Check for errors in response
        if ('error' in tokenData || !tokenData.access_token) {
            console.error("❌ Token refresh error:", tokenData);
            return null;
        }

        console.log("✅ Access token regenerated successfully");
        console.log("📊 Token expires in:", tokenData.expires_in, "seconds");

        // Return only the access token
        return tokenData.access_token;

    } catch (error) {
        console.error("❌ Error regenerating access token:", error);
        return null;
    }
};

export {
    regenerateAccessTokenWithRefreshToken
}