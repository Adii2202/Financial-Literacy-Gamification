import { createSlice } from "@reduxjs/toolkit";

export const profSlice = createSlice({
    name: 'prof',
    initialState: {
        userProf: false,
    },
    reducers: {
        toggleprof: (state) => {
            state.userProf = !state.userProf;
        },
        setprof: (state, action) => {
            state.userProf = action.payload;
        },
    },
});

export const { toggleprof, setprof } = profSlice.actions;