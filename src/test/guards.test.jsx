import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/Slices/authSlice";

// Helper: render with providers
const renderWithProviders = (ui, { authState = {}, route = "/" } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        ...authState,
      },
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
    store,
  };
};

describe("Route Guards", () => {
  it("AuthGuard should redirect unauthenticated users", async () => {
    const { default: AuthGuard } = await import("@/guards/Auth.guard");
    const { Routes, Route } = await import("react-router-dom");

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <div>Protected Content</div>
            </AuthGuard>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { authState: { isAuthenticated: false } }
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("AuthGuard should allow authenticated users", async () => {
    const { default: AuthGuard } = await import("@/guards/Auth.guard");

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>,
      {
        authState: {
          isAuthenticated: true,
          user: { id: 1, name: "Test", role: "Student" },
          accessToken: "token",
        },
      }
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("AdminGuard should reject non-admin users", async () => {
    const { default: AdminGuard } = await import("@/guards/Admin.guard");
    const { Routes, Route } = await import("react-router-dom");

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <AdminGuard>
              <div>Admin Content</div>
            </AdminGuard>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        authState: {
          isAuthenticated: true,
          user: { id: 1, name: "Student User", role: "Student" },
          accessToken: "token",
        },
      }
    );

    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("AdminGuard should allow Admin users", async () => {
    const { default: AdminGuard } = await import("@/guards/Admin.guard");

    renderWithProviders(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>,
      {
        authState: {
          isAuthenticated: true,
          user: { id: 1, name: "Admin User", role: "Admin" },
          accessToken: "token",
        },
      }
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("InstructorGuard should allow Instructor users", async () => {
    const { default: InstructorGuard } = await import(
      "@/guards/Instructor.guard"
    );

    renderWithProviders(
      <InstructorGuard>
        <div>Instructor Content</div>
      </InstructorGuard>,
      {
        authState: {
          isAuthenticated: true,
          user: { id: 1, name: "Instructor", role: "Instructor" },
          accessToken: "token",
        },
      }
    );

    expect(screen.getByText("Instructor Content")).toBeInTheDocument();
  });

  it("StudentGuard should allow Student users", async () => {
    const { default: StudentGuard } = await import("@/guards/Student.guard");

    renderWithProviders(
      <StudentGuard>
        <div>Student Content</div>
      </StudentGuard>,
      {
        authState: {
          isAuthenticated: true,
          user: { id: 1, name: "Student", role: "Student" },
          accessToken: "token",
        },
      }
    );

    expect(screen.getByText("Student Content")).toBeInTheDocument();
  });
});
