import { Request } from "express";
import { CorsOptions } from "cors";
import { WHITELISTED_ORIGINS } from "./constants.js";

// CORS function
const customizedCors = (req: Request, callback: (err: Error | null, options?: CorsOptions) => void) => {
    // console.log(`[CORS LOG] Method: ${req.method}, Path: ${req.path}, Origin: ${req.headers.origin}`);

    let corsOptions: CorsOptions;

    console.log(req.headers.origin)

    if (req.path === "/api/v1/auth/google/callback") {
        // Allow any origin for OAuth callback
        corsOptions = {
            origin: "*",
            methods: ["GET"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: false, // cookies not needed
        };
    } else {
        // Restricted CORS for other routes
        corsOptions = {
            origin: WHITELISTED_ORIGINS.some((url) => url?.toString() === req.headers.origin?.toString()),
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true, // allow cookies/auth headers
        };
    }

    callback(null, corsOptions);
};

export {
    customizedCors
}
