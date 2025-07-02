import { Message } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  messages: Message[];
  isReceiverOnline: boolean;
}

const initialState: ChatState = {
  messages: [],
  isReceiverOnline: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setReceiverOnline(state, action: PayloadAction<boolean>) {
      state.isReceiverOnline = action.payload;
    },
  },
});

export const { setMessages, addMessage, setReceiverOnline } = chatSlice.actions;
export default chatSlice.reducer;
