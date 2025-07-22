import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from './store';
import axios from 'axios';

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
  // CHANGED: price and ticketsAvailable are replaced by the tickets array
  tickets: Ticket[];
  imageUrl: string;
  description: string;
}
interface EventState {
    events: Event[];    
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: EventState = {
    events: [], // Make sure this is always an array, not null
    status: 'idle',
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
    reducers: {},
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

export const selectEvents = (state: RootState) => state.events.events;

export default eventSlice.reducer;
