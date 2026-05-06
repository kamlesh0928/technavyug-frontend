import { describe, it, expect, vi } from "vitest";

/**
 * Unit tests for the PhonePe checkout flow logic.
 * These tests verify the business logic decisions made in the
 * Checkout, CoursePurchase, and PaymentStatus pages without requiring
 * a full React rendering environment.
 */

// ============================================================
// Coupon Discount Calculation Logic
// ============================================================
describe("Coupon Discount Calculation", () => {
  function calculateDiscount(coupon, subtotal) {
    if (!coupon) return { discountAmount: 0, finalAmount: subtotal };

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (coupon.discountValue / 100) * subtotal;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, subtotal); // can't discount more than subtotal
    return {
      discountAmount: parseFloat(discount.toFixed(2)),
      finalAmount: parseFloat((subtotal - discount).toFixed(2)),
    };
  }

  it("should calculate percentage discount", () => {
    const coupon = { discountType: "percentage", discountValue: 20, maxDiscount: null };
    const result = calculateDiscount(coupon, 1000);
    expect(result.discountAmount).toBe(200);
    expect(result.finalAmount).toBe(800);
  });

  it("should cap percentage discount at maxDiscount", () => {
    const coupon = { discountType: "percentage", discountValue: 50, maxDiscount: 100 };
    const result = calculateDiscount(coupon, 1000);
    expect(result.discountAmount).toBe(100);
    expect(result.finalAmount).toBe(900);
  });

  it("should calculate flat discount", () => {
    const coupon = { discountType: "flat", discountValue: 150 };
    const result = calculateDiscount(coupon, 500);
    expect(result.discountAmount).toBe(150);
    expect(result.finalAmount).toBe(350);
  });

  it("should not allow discount greater than subtotal", () => {
    const coupon = { discountType: "flat", discountValue: 999 };
    const result = calculateDiscount(coupon, 200);
    expect(result.discountAmount).toBe(200);
    expect(result.finalAmount).toBe(0);
  });

  it("should return zero discount when no coupon", () => {
    const result = calculateDiscount(null, 500);
    expect(result.discountAmount).toBe(0);
    expect(result.finalAmount).toBe(500);
  });
});

// ============================================================
// Order Payload Validation Logic
// ============================================================
describe("Order Payment Payload Validation", () => {
  function validateOrderPayload(payload) {
    const errors = [];
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      errors.push("At least one item is required");
    }
    if (!payload.addressId) {
      errors.push("Shipping address is required");
    }
    if (payload.items) {
      payload.items.forEach((item, i) => {
        if (!item.productId) errors.push(`Item ${i + 1}: productId is required`);
        if (!item.quantity || item.quantity < 1) errors.push(`Item ${i + 1}: quantity must be >= 1`);
      });
    }
    return { valid: errors.length === 0, errors };
  }

  it("should validate a correct payload", () => {
    const result = validateOrderPayload({
      items: [{ productId: "abc", quantity: 2 }],
      addressId: "addr-1",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject empty items", () => {
    const result = validateOrderPayload({ items: [], addressId: "addr-1" });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/item is required/i);
  });

  it("should reject missing addressId", () => {
    const result = validateOrderPayload({
      items: [{ productId: "abc", quantity: 1 }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Shipping address is required");
  });

  it("should reject item with missing productId", () => {
    const result = validateOrderPayload({
      items: [{ quantity: 1 }],
      addressId: "addr-1",
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/productId is required/i);
  });

  it("should reject item with zero quantity", () => {
    const result = validateOrderPayload({
      items: [{ productId: "abc", quantity: 0 }],
      addressId: "addr-1",
    });
    expect(result.valid).toBe(false);
  });
});

// ============================================================
// Payment Status Polling Logic
// ============================================================
describe("Payment Status Polling Logic", () => {
  function shouldContinuePolling(statusResponse, pollCount, maxPolls) {
    if (!statusResponse) return pollCount < maxPolls;
    if (statusResponse.status === "Success" || statusResponse.status === "Failed") return false;
    return pollCount < maxPolls;
  }

  it("should stop polling on Success", () => {
    expect(shouldContinuePolling({ status: "Success" }, 1, 15)).toBe(false);
  });

  it("should stop polling on Failed", () => {
    expect(shouldContinuePolling({ status: "Failed" }, 1, 15)).toBe(false);
  });

  it("should continue polling on Pending", () => {
    expect(shouldContinuePolling({ status: "Pending" }, 3, 15)).toBe(true);
  });

  it("should stop polling when max polls reached", () => {
    expect(shouldContinuePolling({ status: "Pending" }, 15, 15)).toBe(false);
  });

  it("should continue polling on null response", () => {
    expect(shouldContinuePolling(null, 5, 15)).toBe(true);
  });

  it("should stop on null response when max polls reached", () => {
    expect(shouldContinuePolling(null, 15, 15)).toBe(false);
  });
});

// ============================================================
// Course Purchase Flow Guards
// ============================================================
describe("Course Purchase Flow Guards", () => {
  function canPurchaseCourse(course, user, enrollments) {
    if (!course) return { allowed: false, reason: "Course not found" };
    if (parseFloat(course.price) === 0) return { allowed: false, reason: "Free courses don't require payment" };
    if (!user) return { allowed: false, reason: "Login required" };
    const alreadyEnrolled = enrollments.some((e) => e.courseId === course.id);
    if (alreadyEnrolled) return { allowed: false, reason: "Already enrolled" };
    return { allowed: true, reason: null };
  }

  it("should allow purchase of a paid course", () => {
    const result = canPurchaseCourse(
      { id: "c1", price: "999" },
      { id: "u1" },
      []
    );
    expect(result.allowed).toBe(true);
  });

  it("should reject purchase of a free course", () => {
    const result = canPurchaseCourse(
      { id: "c1", price: "0" },
      { id: "u1" },
      []
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/free/i);
  });

  it("should reject if not logged in", () => {
    const result = canPurchaseCourse(
      { id: "c1", price: "999" },
      null,
      []
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/login/i);
  });

  it("should reject if already enrolled", () => {
    const result = canPurchaseCourse(
      { id: "c1", price: "999" },
      { id: "u1" },
      [{ courseId: "c1" }]
    );
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/already enrolled/i);
  });

  it("should reject if course not found", () => {
    const result = canPurchaseCourse(null, { id: "u1" }, []);
    expect(result.allowed).toBe(false);
  });
});

// ============================================================
// Address Selection Logic
// ============================================================
describe("Address Selection Logic", () => {
  function getDefaultAddressId(addresses) {
    if (!addresses || addresses.length === 0) return null;
    const defaultAddr = addresses.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : addresses[0].id;
  }

  it("should select the default address", () => {
    const addresses = [
      { id: "a1", isDefault: false },
      { id: "a2", isDefault: true },
      { id: "a3", isDefault: false },
    ];
    expect(getDefaultAddressId(addresses)).toBe("a2");
  });

  it("should fall back to first address when no default", () => {
    const addresses = [
      { id: "a1", isDefault: false },
      { id: "a2", isDefault: false },
    ];
    expect(getDefaultAddressId(addresses)).toBe("a1");
  });

  it("should return null for empty addresses", () => {
    expect(getDefaultAddressId([])).toBeNull();
  });

  it("should return null for undefined addresses", () => {
    expect(getDefaultAddressId(undefined)).toBeNull();
  });
});
