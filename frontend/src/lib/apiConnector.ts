import axios, { Method, AxiosRequestHeaders, AxiosResponse, AxiosError } from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
});

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  status?: number;
  data?: T;
}

export const apiConnector = async <T = any>(
  method: Method,
  url: string,
  bodyData?: Record<string, any>,
  headers?: AxiosRequestHeaders,
  params?: Record<string, any>
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance({
      method,
      url,
      data: bodyData || null,
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;
    if (err.response) {
      return {
        success: false,
        message: err.response.data?.message,
        status: err.response.status,
      };
    }

    return {
      success: false,
      message: "Unexpected error",
    };
  }
};
