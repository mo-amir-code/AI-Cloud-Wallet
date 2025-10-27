import { Request } from "express";


const getGoogleCallbackURL = (req: Request) => {
  const serverUrl = req.headers['x-forwarded-proto']
    ? `${req.headers['x-forwarded-proto']}://${(req as any).actualHost}`
    : `http://${(req as any).actualHost}`;

  return serverUrl + "/api/v1/auth/google/callback";
}

const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",

  // Google Drive scopes
  "https://www.googleapis.com/auth/drive.file", // Create & access files created by your app
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata", // Hidden app storage folder (good for app-only data)
];


export {
  GOOGLE_OAUTH_SCOPES,
  getGoogleCallbackURL
}