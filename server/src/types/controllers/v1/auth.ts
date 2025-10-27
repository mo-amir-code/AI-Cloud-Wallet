import { UserDataType } from "../../db/schema/index.js"

type JWTTokenVerifierType = { isExpired: boolean } & UserDataType

type AuthWithGoogleBodyType = {
    redirectUri?: string
    from: "mobile" | "brower"
}


export type {
    JWTTokenVerifierType,
    AuthWithGoogleBodyType
}