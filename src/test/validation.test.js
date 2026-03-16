import { describe, it, expect } from "vitest";
import { loginSchema } from "@/utils/validation/loginSchema";
import { signupSchema } from "@/utils/validation/signupSchema";
import { forgotPasswordSchema } from "@/utils/validation/forgotPasswordSchema";
import { resetPasswordSchema } from "@/utils/validation/resetPasswordSchema";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should pass with valid email and password", async () => {
      const data = { email: "user@test.com", password: "password123" };
      await expect(loginSchema.validate(data)).resolves.toBeDefined();
    });

    it("should fail with invalid email", async () => {
      const data = { email: "not-an-email", password: "password123" };
      await expect(loginSchema.validate(data)).rejects.toThrow("Please enter a valid email address");
    });

    it("should fail with short password", async () => {
      const data = { email: "user@test.com", password: "123" };
      await expect(loginSchema.validate(data)).rejects.toThrow("Password must be at least 6 characters");
    });

    it("should fail with empty fields", async () => {
      await expect(loginSchema.validate({})).rejects.toThrow();
    });
  });

  describe("signupSchema", () => {
    it("should pass with valid data", async () => {
      const data = {
        name: "John Doe",
        email: "john@test.com",
        password: "Password1",
        confirmPassword: "Password1",
        role: "Student",
      };
      await expect(signupSchema.validate(data)).resolves.toBeDefined();
    });

    it("should fail when passwords do not match", async () => {
      const data = {
        name: "John Doe",
        email: "john@test.com",
        password: "Password1",
        confirmPassword: "Different1",
        role: "Student",
      };
      await expect(signupSchema.validate(data)).rejects.toThrow("Passwords do not match");
    });

    it("should fail without name", async () => {
      const data = {
        email: "john@test.com",
        password: "Password1",
        confirmPassword: "Password1",
        role: "Student",
      };
      await expect(signupSchema.validate(data)).rejects.toThrow();
    });

    it("should fail with weak password (no uppercase)", async () => {
      const data = {
        name: "John",
        email: "john@test.com",
        password: "password1",
        confirmPassword: "password1",
        role: "Student",
      };
      await expect(signupSchema.validate(data)).rejects.toThrow("uppercase");
    });

    it("should reject invalid role", async () => {
      const data = {
        name: "John",
        email: "john@test.com",
        password: "Password1",
        confirmPassword: "Password1",
        role: "Admin",
      };
      await expect(signupSchema.validate(data)).rejects.toThrow();
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should pass with valid email", async () => {
      const data = { email: "user@test.com" };
      await expect(forgotPasswordSchema.validate(data)).resolves.toBeDefined();
    });

    it("should fail with invalid email", async () => {
      const data = { email: "not-valid" };
      await expect(forgotPasswordSchema.validate(data)).rejects.toThrow();
    });
  });

  describe("resetPasswordSchema", () => {
    it("should pass with matching passwords", async () => {
      const data = { password: "NewPass123", confirmPassword: "NewPass123" };
      await expect(resetPasswordSchema.validate(data)).resolves.toBeDefined();
    });

    it("should fail when passwords do not match", async () => {
      const data = { password: "NewPass123", confirmPassword: "Different1" };
      await expect(resetPasswordSchema.validate(data)).rejects.toThrow();
    });
  });
});
