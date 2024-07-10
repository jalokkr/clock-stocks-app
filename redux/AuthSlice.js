import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  isLoggedIn: false,
  status: "Not logged in",
  user: "",
  userData: [],
  errors: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSuccessfulSignIn: (state, { payload }) => {
      state.user = payload.token;
      state.isLoggedIn = true;
      state.status = "success";
      state.userData = payload.user;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.status = "";
      state.userData = null;
    },
  },
});

export const { setSuccessfulSignIn, clearUser } = authSlice.actions;

export default authSlice.reducer;
