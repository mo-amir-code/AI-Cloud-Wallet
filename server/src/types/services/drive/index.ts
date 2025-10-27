import { drive_v3 } from "googleapis"
import { UserSchemaType } from "../../db/schema/index.js"
import { SolanaWalletType } from "../../solana/index.js"
import { Request } from "express"

type DriveAuthType = {
    accessToken: string
    refreshToken: string
}

type GetDriveType = {
    user: UserSchemaType | DriveAuthType
    req: Request
}

type GetDriveFoldersIdsType = {
    drive: drive_v3.Drive,
}

type GetDriveFilesByFolderIdType = {
    folderId: string,
    drive: drive_v3.Drive
}

type DriveFolderIdType = {
    id: string
    name: string
}

type NewContactType = {
    name: string
    address: string
}

type UpdateContactType = {
    id: string
    name?: string
    address?: string
}

type ContactType = {
    id: string,
    name: string
    address: string
}

type DriveFileType = {
    name: string
    email: string
    wallet: SolanaWalletType
    contacts: ContactType[]
}

export type {
    GetDriveType,
    GetDriveFoldersIdsType,
    GetDriveFilesByFolderIdType,
    DriveFolderIdType,
    ContactType,
    DriveFileType,
    DriveAuthType,
    UpdateContactType,
    NewContactType
}