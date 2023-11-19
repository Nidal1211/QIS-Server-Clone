import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  isAuthenticated: localStorage.getItem("isAuth")
    ? JSON.parse(localStorage.getItem("isAuth"))
    : null,
};
export const authReducer = createReducer(initialState, {
  loginRequest: (state) => {
    state.loading = true;
  },
  loginSuccess: (state, action) => {
    state.loading = false;
    state.isAuthenticated = true;
    state.user = action.payload.user;
    state.message = "logged in";

    state.success = true;
  },
  loginFailure: (state, action) => {
    state.loading = false;
    state.isAuthenticated = false;
    state.error = action.payload;
  },

  logOutRequest: (state) => {
    state.loading = true;
  },
  logOutSuccess: (state, action) => {
    state.user = {};
    state.loading = false;
    state.isAuthenticated = false;
    state.message = action.payload.message;
    state.success = action.payload.success;
  },
  logOutFailure: (state, action) => {
    state.isAuthenticated = false;
    state.error = action.payload;
    state.loading = false;
  },
  clearMessage: (state) => {
    state.message = null;
    state.success = null;
  },
  clearError: (state) => {
    state.error = null;
  },
});
