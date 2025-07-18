import { User } from "@/types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: User | null;
}


const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  setUser: (
    state,
    action: PayloadAction<User>
  ) => {
    state.user = action.payload;
  },
  clearUser: (state) => {
    state.user = null;
  },
},

});

export const { setUser , clearUser } = userSlice.actions;
export default userSlice.reducer;
