import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setUser, setToken, setLoading, logoutUser } from "@/store/Slices/authSlice";

// Mock localStorage for jsdom
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

const createStore = (preloadedState) =>
  configureStore({ reducer: { auth: authReducer }, preloadedState });

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should have correct initial state", () => {
    const store = createStore();
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
  });

  it("should set user via setUser", () => {
    const store = createStore();
    const user = { id: 1, name: "John", email: "john@test.com", role: "Student" };
    store.dispatch(setUser(user));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.name).toBe("John");
    expect(state.user.role).toBe("Student");
    // Should persist to localStorage
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(user);
  });

  it("should set token via setToken", () => {
    const store = createStore();
    store.dispatch(setToken("jwt-token-abc"));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("jwt-token-abc");
  });

  it("should toggle loading via setLoading", () => {
    const store = createStore();
    store.dispatch(setLoading(true));
    expect(store.getState().auth.loading).toBe(true);

    store.dispatch(setLoading(false));
    expect(store.getState().auth.loading).toBe(false);
  });

  it("should clear state on logoutUser", () => {
    const store = createStore({
      auth: {
        user: { id: 1, name: "John" },
        isAuthenticated: true,
        loading: false,
      },
    });
    localStorage.setItem("accessToken", "some-token");
    localStorage.setItem("user", JSON.stringify({ id: 1 }));

    store.dispatch(logoutUser());

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should handle setUser with different roles", () => {
    const store = createStore();
    const roles = ["Admin", "Instructor", "Student", "Sub Admin"];

    roles.forEach((role) => {
      store.dispatch(setUser({ id: 1, name: "Test", role }));
      expect(store.getState().auth.user.role).toBe(role);
    });
  });
});
