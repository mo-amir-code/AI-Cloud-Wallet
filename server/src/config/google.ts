import { ENV_VARS } from "./constants.js";

const GOOGLE_CALLBACK_URL =
  ENV_VARS.SERVER_ORIGIN + "/api/v1/auth/google/callback";

const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",

  // Google Drive scopes
  "https://www.googleapis.com/auth/drive.file", // Create & access files created by your app
  "https://www.googleapis.com/auth/drive", 
  "https://www.googleapis.com/auth/drive.appdata", // Hidden app storage folder (good for app-only data)
];


export {
  GOOGLE_CALLBACK_URL,
  GOOGLE_OAUTH_SCOPES
}