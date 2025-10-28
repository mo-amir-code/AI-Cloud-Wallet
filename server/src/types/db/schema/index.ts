


type UserDataType = {
    id: string
    name: string
    email: string
    picture: string | null
}

interface UserSchemaType extends UserDataType {
    driveFileId: string
    refreshToken?: string | null
    accessToken?: string | null
    createdAt: Date
    updatedAt: Date
}

type GetUserByIDOrEmail =
    | { id: string; email?: never }
    | { email: string; id?: never };

type UpdateUserType = {
    name?: string
    email?: string
    picture?: string
    accessToken?: string | null
    refreshToken?: string | null
}

type NetworkModeType = "devnet" | "mainnet";

type SettingsSchemaType = {
    id: string
    userId: string
    mode: NetworkModeType
}


export type {
    UserSchemaType,
    UserDataType,
    GetUserByIDOrEmail,
    UpdateUserType,
    NetworkModeType,
    SettingsSchemaType
}