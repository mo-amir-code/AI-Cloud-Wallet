import type { UserSettingsType } from "../zustand/user.types";


interface APIResponseType<T> {
    data: T;
    message: string;
    status: number;
}

type UserInfoResponseType = {
    user: any;
    settings: UserSettingsType;
};

export type { APIResponseType, UserInfoResponseType };