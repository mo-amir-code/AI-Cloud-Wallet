import { drive_v3, google } from "googleapis"
import { ENV_VARS } from "../../config/constants.js";
import { GetDriveType } from "../../types/services/drive/index.js";
import { getGoogleCallbackURL } from "../../config/google.js";

const getDrive = ({ user, req }: GetDriveType): drive_v3.Drive => {
    // Initialize oauth2 client
    const oauth2Client = new google.auth.OAuth2(
        ENV_VARS.GOOGLE.CLIENT_ID,
        ENV_VARS.GOOGLE.CLIENT_SECRET,
        getGoogleCallbackURL(req)
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