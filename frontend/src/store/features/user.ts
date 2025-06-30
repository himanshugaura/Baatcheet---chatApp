import { User } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  followedUsers: User[];
  users: User[]; 
}

const initialState: ChatState = {
  followedUsers: [],
  users: [], 
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setFollowedUsers: (state, action: PayloadAction<User[]>) => {
      state.followedUsers = action.payload;
    },
    setAllUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setFollowedUsers, setAllUsers } = chatSlice.actions;
export default chatSlice.reducer;
