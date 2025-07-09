import { User } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  chats: User[];
  contacts: User[]; 
  searchedUsers: User[],
  SelectedContact: User | null,
}

const initialState: ChatState = {
  chats: [],
  contacts: [], 
  searchedUsers: [],
  SelectedContact: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<User[]>) => {
      state.chats = action.payload;
    },
    setContacts: (state, action: PayloadAction<User[]>) => {
      state.contacts = action.payload;
    },
    setSearchedUsers: (state, action: PayloadAction<User[]>) => {
      state.searchedUsers = action.payload;
    },
    setSelectedContact: (state, action: PayloadAction<User>) => {
      state.SelectedContact = action.payload;
    },
  },
});

export const { setSearchedUsers ,setChats , setContacts  , setSelectedContact} = userSlice.actions;
export default userSlice.reducer;
