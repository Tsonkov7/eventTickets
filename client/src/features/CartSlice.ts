import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { Event, Ticket } from './EventSlice'; // Make sure to import both types

// 1. NEW: Define the structure for an item in the cart.
// It includes event details and the specific ticket chosen.
export interface CartItem {
  eventId: number;
  eventName: string;
  ticketType: string;
  price: number;
  quantity: number;
}

// The initial state is an empty array of these cart items.
const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 2. UPDATED: `addToCart` now accepts a payload with both the event and the ticket.
    addToCart: (state, action: PayloadAction<{ event: Event; ticket: Ticket }>) => {
      const { event, ticket } = action.payload;
      const existingItem = state.find(
        (item) => item.eventId === event.id && item.ticketType === ticket.type
      );

      if (existingItem) {
        // If this specific ticket is already in the cart, just increase the quantity.
        existingItem.quantity += 1;
      } else {
        // Otherwise, add a new CartItem to the state.
        state.push({
          eventId: event.id,
          eventName: event.name,
          ticketType: ticket.type,
          price: ticket.price,
          quantity: 1,
        });
      }
    },
    // 3. UPDATED: `removeFromCart` now needs to know which specific ticket to remove.
    removeFromCart: (state, action: PayloadAction<{ eventId: number; ticketType: string }>) => {
      const { eventId, ticketType } = action.payload;
      const existingItemIndex = state.findIndex(
        (item) => item.eventId === eventId && item.ticketType === ticketType
      );

      if (existingItemIndex !== -1) {
        const existingItem = state[existingItemIndex];
        if (existingItem.quantity > 1) {
          // If quantity is more than 1, just decrease it.
          existingItem.quantity -= 1;
        } else {
          // If quantity is 1, remove the item from the array entirely.
          state.splice(existingItemIndex, 1);
        }
      }
    },
    // clearCart remains the same.
    clearCart: () => [],
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// The selector for the entire cart state.
export const selectCart = (state: RootState) => state.cart;

// 4. UPDATED: Selectors now work with the new CartItem structure.
export const amountInCart = (state: RootState) => {
  // Sums up the `quantity` of all items in the cart.
  return state.cart.reduce((total, item) => total + item.quantity, 0);
};

export const selectTotalPrice = (state: RootState) => {
  // Calculates the total price by multiplying each item's price by its quantity.
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export default cartSlice.reducer;