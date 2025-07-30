import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { Event, Ticket } from "./EventSlice";

export interface CartItem {
  eventId: number;
  eventName: string;
  ticketType: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        event: Event;
        ticket: Ticket;
        quantity: number;
        imageUrl?: string;
      }>
    ) => {
      const { event, ticket, quantity, imageUrl } = action.payload;

      // Prevents adding if quantity is zero or less
      if (quantity <= 0) {
        return;
      }

      const existingItem = state.find(
        (item) => item.eventId === event.id && item.ticketType === ticket.type
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.push({
          eventId: event.id,
          eventName: event.name,
          ticketType: ticket.type,
          price: ticket.price,
          quantity: quantity,
          imageUrl: imageUrl,
        });
      }
    },
    incrementQuantity: (
      state,
      action: PayloadAction<{ eventId: number; ticketType: string }>
    ) => {
      const item = state.find(
        (i) =>
          i.eventId === action.payload.eventId &&
          i.ticketType === action.payload.ticketType
      );
      if (item) {
        item.quantity++;
      }
    },

    decrementQuantity: (
      state,
      action: PayloadAction<{ eventId: number; ticketType: string }>
    ) => {
      const itemIndex = state.findIndex(
        (i) =>
          i.eventId === action.payload.eventId &&
          i.ticketType === action.payload.ticketType
      );
      if (itemIndex !== -1) {
        const item = state[itemIndex];
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.splice(itemIndex, 1);
        }
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ eventId: number; ticketType: string }>
    ) => {
      const { eventId, ticketType } = action.payload;
      return state.filter(
        (item) => !(item.eventId === eventId && item.ticketType === ticketType)
      );
    },
    clearCart: () => [],
  },
});

export const {
  addToCart,
  removeItem,
  clearCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
export const amountInCart = (state: RootState) =>
  state.cart.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state: RootState) =>
  state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
