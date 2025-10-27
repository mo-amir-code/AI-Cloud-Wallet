import { ApiResponseType } from "@/types/axios";
import { apiClient, ApiRequestOptions } from "@/utils/axios/apiClient";
import { useUserStore } from "@/zustand/userStore";
import { useState } from "react";

const useAPIClient = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserAuthStatus, clearUserInfo } = useUserStore();

  const apiRequest = async (
    endpoint: string,
    options: ApiRequestOptions
  ): Promise<ApiResponseType> => {
    setIsFetching(true);
    const res = await apiClient.request(endpoint, {
      ...options,
      requiresAuth: true,
    });

    if (res.data) {
      setIsSuccess(true);
    } else {
      setIsError(true);
      setError(res.error?.message as string);

      if (res.isUnAuthorized) {
        setUserAuthStatus(false);
        clearUserInfo();
      }
    }

    setIsFetching(false);

    return res;
  };

  return { apiRequest, isFetching, isError, isSuccess, error };
};

export { useAPIClient };
