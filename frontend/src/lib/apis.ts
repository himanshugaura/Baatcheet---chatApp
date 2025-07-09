const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// AUTH ENDPOINTS
export const AuthEndpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  REGISTER_API: BASE_URL + "/auth/register",
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  VERIFYOTP_API: BASE_URL + "/auth/verify-otp",
  LOGOUT_API: BASE_URL + "/auth/logout",
  VERIFYUSERNAME_API: BASE_URL + "/auth/check-username",
  VERIFYEMAIL_API: BASE_URL + "/auth/check-email",
  GET_USER_DATA_API: BASE_URL + "/auth/get-user-data",
};

// USER ENDPOINTS
export const UserEndpoints = {
  GET_CHATS_API: BASE_URL + "/user/get-chats",
  GET_ALL_CONTACTS_API: BASE_URL + "/user/contacts",
  ADD_TO_CONTACT_API: BASE_URL + "/user/add-to-contact",
  UPDATE_PROFILE_IMAGE_API: BASE_URL + "/user/update-profile-image",
  UPDATE_PROFILE_API: BASE_URL + "/user/update-profile",
  DELETE_ACCOUNT_API: BASE_URL + "/user/delete-account",
  SEARCH_USER_API : (query: string) =>
  `${BASE_URL}/user/search?query=${encodeURIComponent(query)}`,
  GET_USER_BY_ID : (userId: string) =>
  `${BASE_URL}/user/get-user-data-byID/${userId}`
};

// CHAT ENDPOINTS
export const ChatEndpoints = {
  GET_MESSAGES_API: (senderId: string, receiverId: string) =>
    `${BASE_URL}/chat/messages/${senderId}/${receiverId}`,

  SEND_MESSAGE_API: BASE_URL + "/chat/message",
  GET_ONLINE_STATUS_API: (userId: string) =>
    `${BASE_URL}/online/${userId}/status`,
};
