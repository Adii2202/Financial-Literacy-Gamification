import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./features/uislice";
import { pfpSlice } from "./features/pfpslice";
import { profSlice } from "./features/profslice";

const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        pfp: pfpSlice.reducer,
        prof: profSlice.reducer,
    },
});

export default store;