import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import axios from 'axios';
import type { CartItem } from './CartSlice';

export interface Ticket {
  type: string;
  price: number;
  ticketsAvailable: number;
  perks?: string[]; // Optional array of perks for VIP
}

export interface Event {
  id: number;
  name: string;
  date: string;
  venue: string;
  lineup: string[];
  tickets: Ticket[];
  imageUrl: string;
  description: string;
}
interface EventState {
    events: Event[];    
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    searchTerm: string; // Added search term state
}

const initialState: EventState = {
    events: [], // Make sure this is always an array, not null
    status: 'idle',
    searchTerm: '', // Initialize search term
    error: null,
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async () => {
        const response = await axios.get("http://localhost:3000/data");
        return response.data;
    }
);

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload; // Update search term in state
        },  
        purchaseTickets: (state, action: PayloadAction<CartItem[]>) => {
      const purchasedItems = action.payload;

      purchasedItems.forEach(cartItem => {
        // Find the event in the state that matches the purchased item's eventId
        const eventToUpdate = state.events.find(event => event.id === cartItem.eventId);

        if (eventToUpdate) {
          // Find the specific ticket type within that event
          const ticketToUpdate = eventToUpdate.tickets.find(ticket => ticket.type === cartItem.ticketType);

          if (ticketToUpdate) {
            // Decrement the available tickets by the quantity purchased
            ticketToUpdate.ticketsAvailable -= cartItem.quantity;
          }
        }
      });
    },
  
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch events';
            });
            
    },
});
export const { setSearchTerm, purchaseTickets } = eventSlice.actions;

export const selectEvents = (state: RootState) => state.events.events;
export const selectSearchTerm = (state: RootState) => state.events.searchTerm;

export default eventSlice.reducer;
