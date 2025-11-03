import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../utils/axios/queries';
import type { APIResponseType, UserInfoResponseType } from '../../types/react-query';

export const useUserInfo = () => {
    return useQuery<APIResponseType<UserInfoResponseType>>({
        queryKey: ['userInfo'],
        queryFn: userApi.getUserInfo,
        enabled: false, // Only fetch when manually triggered
    });
};