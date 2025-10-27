

type ApiResponseType = {
    isUnAuthorized?: boolean
} & ({
    data: NonNullable<any>,
    error?: never
} | {
    data?: never
    error: {
        message: string
    }
})

export type {
    ApiResponseType
}
