import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";

// const rootReducer = combineReducers({
//     auth: authReducer,
//   });

// export const store = configureStore({
//   reducer: rootReducer,
// });

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
