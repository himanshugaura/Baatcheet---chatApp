import { configureStore } from "@reduxjs/toolkit";
import { ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice";
import chatReducer from "./features/user";
import socketReducer from "./features/socket.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    socket : socketReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
