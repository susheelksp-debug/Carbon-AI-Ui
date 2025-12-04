// src/store/snackbarSlice.js
import { createSlice } from '@reduxjs/toolkit';

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState: { queue: [] }, // { id, message, variant }
    reducers: {
        enqueue(state, action) {
            const id = Date.now() + Math.random();
            state.queue.push({ id, ...action.payload });
        },
        dequeue(state, action) {
            state.queue = state.queue.filter(q => q.id !== action.payload);
        },
        clearAll(state) {
            state.queue = [];
        }
    }
});

export const { enqueue, dequeue, clearAll } = snackbarSlice.actions;
export default snackbarSlice.reducer;
