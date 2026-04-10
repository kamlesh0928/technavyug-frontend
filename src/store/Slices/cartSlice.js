import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        // Cap at available stock
        const max = product.stock || 99;
        existing.quantity = Math.min(existing.quantity + 1, max);
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCart(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = Math.min(quantity, item.stock || 99);
        }
      }
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, i) => acc + parseFloat(i.price) * i.quantity, 0);
export const selectCartOpen = (state) => state.cart.isOpen;

export default cartSlice.reducer;
