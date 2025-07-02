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

export const userSlice = createSlice({
  name: "user",
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

export const { setFollowedUsers, setAllUsers } = userSlice.actions;
export default userSlice.reducer;
