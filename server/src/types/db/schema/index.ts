


type UserDataType = {
    id: string
    name: string
    email: string
    picture: string | null
}

interface UserSchemaType extends UserDataType {
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
}


export type {
    UserSchemaType,
    UserDataType,
    GetUserByIDOrEmail,
    UpdateUserType
}