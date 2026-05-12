import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from "@/store/Slices/cartSlice";

const createStore = (preloadedState) =>
  configureStore({ reducer: { cart: cartReducer }, preloadedState });

const sampleProduct = {
  id: "prod-1",
  name: "Test Widget",
  price: "499.99",
  stock: 10,
  type: "Physical",
  images: "[]",
};

const sampleProduct2 = {
  id: "prod-2",
  name: "Digital Asset",
  price: "199.00",
  stock: 50,
  type: "Digital",
  images: "[]",
};

describe("cartSlice", () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it("should have correct initial state", () => {
    const state = store.getState().cart;
    expect(state.items).toEqual([]);
    expect(state.isOpen).toBe(false);
  });

  it("should add a product to cart", () => {
    store.dispatch(addToCart(sampleProduct));
    const items = selectCartItems({ cart: store.getState().cart });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("prod-1");
    expect(items[0].quantity).toBe(1);
  });

  it("should increment quantity when adding same product again", () => {
    store.dispatch(addToCart(sampleProduct));
    store.dispatch(addToCart(sampleProduct));
    const items = selectCartItems({ cart: store.getState().cart });
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("should add multiple different products", () => {
    store.dispatch(addToCart(sampleProduct));
    store.dispatch(addToCart(sampleProduct2));
    const items = selectCartItems({ cart: store.getState().cart });
    expect(items).toHaveLength(2);
  });

  it("should calculate total correctly", () => {
    store.dispatch(addToCart(sampleProduct));   // 499.99
    store.dispatch(addToCart(sampleProduct2));  // 199.00
    const total = selectCartTotal({ cart: store.getState().cart });
    expect(total).toBeCloseTo(698.99, 2);
  });

  it("should calculate total with quantity", () => {
    store.dispatch(addToCart(sampleProduct));
    store.dispatch(addToCart(sampleProduct)); // qty = 2
    const total = selectCartTotal({ cart: store.getState().cart });
    expect(total).toBeCloseTo(999.98, 2);
  });

  it("should count total items", () => {
    store.dispatch(addToCart(sampleProduct));   // 1
    store.dispatch(addToCart(sampleProduct));   // 2
    store.dispatch(addToCart(sampleProduct2));  // 1
    const count = selectCartCount({ cart: store.getState().cart });
    expect(count).toBe(3);
  });

  it("should remove a product from cart", () => {
    store.dispatch(addToCart(sampleProduct));
    store.dispatch(addToCart(sampleProduct2));
    store.dispatch(removeFromCart("prod-1"));
    const items = selectCartItems({ cart: store.getState().cart });
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("prod-2");
  });

  it("should update quantity", () => {
    store.dispatch(addToCart(sampleProduct));
    store.dispatch(updateQuantity({ id: "prod-1", quantity: 5 }));
    const items = selectCartItems({ cart: store.getState().cart });
    expect(items[0].quantity).toBe(5);
  });

  it("should clear cart", () => {
    store.dispatch(addToCart(sampleProduct));
    store.dispatch(addToCart(sampleProduct2));
    store.dispatch(clearCart());
    const items = selectCartItems({ cart: store.getState().cart });
    expect(items).toHaveLength(0);
  });

  it("should open and close cart drawer", () => {
    store.dispatch(openCart());
    expect(store.getState().cart.isOpen).toBe(true);
    store.dispatch(closeCart());
    expect(store.getState().cart.isOpen).toBe(false);
  });
});
