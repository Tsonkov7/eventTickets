import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';
import eventReducer from './EventSlice';

export const store = configureStore({
    reducer: {
        
        cart: cartReducer,
        events: eventReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;