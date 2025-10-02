import { drive_v3, google } from "googleapis"
import { ENV_VARS } from "../../config/constants.js";
import { GOOGLE_CALLBACK_URL } from "../../config/google.js";
import { GetDriveType } from "../../types/services/drive/index.js";

const getDrive = ({ user }: GetDriveType): drive_v3.Drive => {
    // Initialize oauth2 client
    const oauth2Client = new google.auth.OAuth2(
        ENV_VARS.GOOGLE.CLIENT_ID,
        ENV_VARS.GOOGLE.CLIENT_SECRET,
        GOOGLE_CALLBACK_URL
    );

    // Set credentials
    oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
    });

    // Initialize Google Drive API
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    return drive;
}


export {
    getDrive
}