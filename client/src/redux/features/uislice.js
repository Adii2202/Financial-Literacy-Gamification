import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isNavBarOpen: false,
    },
    reducers: {
        toggleNavBar: (state) => {
            state.isNavBarOpen = !state.isNavBarOpen;
        },
        setNavBar: (state, action) => {
            state.isNavBarOpen = action.payload;
        },
    },
});

export const { toggleNavBar, setNavBar } = uiSlice.actions;