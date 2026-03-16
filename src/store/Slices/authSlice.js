import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    setToken: (state, action) => {
      localStorage.setItem("accessToken", action.payload);
      state.isAuthenticated = true;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, setToken, setLoading, logoutUser } = authSlice.actions;

export default authSlice.reducer;