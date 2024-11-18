import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    order: orderReducer,
  },
});
