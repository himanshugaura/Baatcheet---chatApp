import axios, { Method } from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true, 
});

export const apiConnector = async (
  method: Method,
  url: string,
  bodyData?: any,
  headers?: any,
  params?: Record<string, any>
) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData || null,
      headers,
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message,
        status: error.response.status,
      };
    }
    return {
      success: false,
      message: "Unexpected error",
    };
  }
};
