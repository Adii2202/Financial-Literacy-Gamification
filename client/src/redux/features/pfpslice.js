import { createSlice } from "@reduxjs/toolkit";

export const pfpSlice = createSlice({
    name: 'pfp',
    initialState: {
        userPfp: false,
    },
    reducers: {
        togglePfp: (state) => {
            state.userPfp = !state.userPfp;
        },
        setPfp: (state, action) => {
            state.userPfp = action.payload;
        },
    },
});

export const { togglePfp, setPfp } = pfpSlice.actions;