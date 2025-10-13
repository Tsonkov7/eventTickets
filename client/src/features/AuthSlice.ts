import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store.ts";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}
const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.token = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth.isLoggedIn;

export default authSlice.reducer;
