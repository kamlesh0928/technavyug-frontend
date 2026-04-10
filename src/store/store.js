import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import cartReducer from "./Slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});