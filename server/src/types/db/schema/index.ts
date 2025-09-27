


type UserDataType = {
    id: string
    name: string
    email: string
    picture: string | null
}

interface UserSchemaType extends UserDataType {
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


export type {
    UserSchemaType,
    UserDataType,
    GetUserByIDOrEmail,
    UpdateUserType
}