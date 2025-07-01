const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// AUTH ENDPOINTS
export const AuthEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  REGISTER_API: BASE_URL + "/auth/register",
  SENDOTP_API: BASE_URL + "/auth/sendOTP",
  VERIFYOTP_API: BASE_URL + "/auth/verifyOTP",
  LOGOUT_API: BASE_URL + "/auth/logout",
  VERIFYUSERNAME_API: BASE_URL + "/auth/check-username",
  VERIFYEMAIL_API: BASE_URL + "/auth/check-email",
  GET_USER_DATA_API: BASE_URL + "/auth/get-user-data",
  
};

// CHAT ENDPOINTS
export const UserEndpoints = {
  GET_FOLLOWED_USERS_API: BASE_URL + "/user/following",
  GET_ALL_USERS_API: BASE_URL + "/user/get-all-users",
  TOGGLE_FOLLOW_USER_API: BASE_URL + "/user/toggle-follow-user",
};

