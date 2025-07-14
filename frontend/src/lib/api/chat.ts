
import {  setMessages } from "@/store/features/chat.slice";
import { AppDispatch } from "@/store/store";
import { ChatEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { Message } from "@/types/type";

export const fetchMessages = (userId: string, receiverId: string) => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector<Message[]>("GET", ChatEndpoints.GET_MESSAGES_API(userId , receiverId));

    if (res.success && res.data) {
      dispatch(setMessages(res.data));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("GetUserMessages error:", error);
    return false;
  }
};

export const sendMessage = (senderId: string , receiverId: string , text : string , roomId : string , replyTo : string | null) => async (dispatch: AppDispatch): Promise<boolean> => {
  try {
    const res = await apiConnector<Message>("POST", ChatEndpoints.SEND_MESSAGE_API , {senderId, receiverId, text, roomId, replyTo});
      
    if (res.success && res.data) {
      dispatch(fetchMessages(senderId , receiverId));
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("sendMessage error:", error);
    return false;
  }
};



