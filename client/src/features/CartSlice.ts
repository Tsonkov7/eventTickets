import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { Event, Ticket } from './EventSlice';

export interface CartItem {
  eventId: number;
  eventName: string;
  ticketType: string;
  price: number;
  quantity: number;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // The payload now includes 'quantity' ---
    addToCart: (state, action: PayloadAction<{ event: Event; ticket: Ticket; quantity: number }>) => {
      const { event, ticket, quantity } = action.payload;

      // Prevent adding if quantity is zero or less
      if (quantity <= 0) {
        return; 
      }

      const existingItem = state.find(
        (item) => item.eventId === event.id && item.ticketType === ticket.type
      );

      if (existingItem) {
        // If the item already exists, add the new quantity to the old one
        existingItem.quantity += quantity;
      } else {
        // Otherwise, add a new item with the specified quantity
        state.push({
          eventId: event.id,
          eventName: event.name,
          ticketType: ticket.type,
          price: ticket.price,
          quantity: quantity, // Use the quantity from the payload
        });
      }
    },
     incrementQuantity: (state, action: PayloadAction<{ eventId: number; ticketType: string }>) => {
      const item = state.find(i => i.eventId === action.payload.eventId && i.ticketType === action.payload.ticketType);
      if (item) {
        item.quantity++;
      }
    },

    //  Reducer to specifically decrease quantity
    decrementQuantity: (state, action: PayloadAction<{ eventId: number; ticketType: string }>) => {
      const itemIndex = state.findIndex(i => i.eventId === action.payload.eventId && i.ticketType === action.payload.ticketType);
      if (itemIndex !== -1) {
        const item = state[itemIndex];
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          // If quantity is 1, remove the item completely
          state.splice(itemIndex, 1);
        }
      }
    },
    // The rest of your slice remains the same
    removeItem: (state, action: PayloadAction<{ eventId: number; ticketType: string }>) => {
      const { eventId, ticketType } = action.payload;
      // Return a new array containing all items EXCEPT the one that matches.
      return state.filter(item => !(item.eventId === eventId && item.ticketType === ticketType));
    },
    clearCart: () => [],
  },
});

export const { addToCart, removeItem, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
export const amountInCart = (state: RootState) => state.cart.reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state: RootState) => state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;