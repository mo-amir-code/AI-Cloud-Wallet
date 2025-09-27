import { UserDataType } from "../../db/schema/index.js"

type JWTTokenVerifierType = { isExpired: boolean } & UserDataType


export type {
    JWTTokenVerifierType
}