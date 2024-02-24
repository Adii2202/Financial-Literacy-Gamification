import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./features/uislice";
import { pfpSlice } from "./features/pfpslice";
import { profSlice } from "./features/profslice";
// import {slice}
import { llmInferenceReducer, BotOpen } from "./features/llmslice";

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    pfp: pfpSlice.reducer,
    prof: profSlice.reducer,
    llmInference: llmInferenceReducer,
    BotOpener: BotOpen.reducer,
  },
});

export default store;
