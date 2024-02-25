import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLLMInference = createAsyncThunk(
  "llmInference/fetchLLMInference",
  async (msg, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("text", msg);
      const response = await axios.post("http://127.0.0.1:5000/chat", formData);
      return response.data.toString();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const BotOpen = createSlice({
  name: "BotUI",
  initialState: {
    isBotOpen: false,
  },
  reducers: {
    togglebot: (state) => {
      state.isBotOpen = !state.isBotOpen;
    },
    setBot: (state, action) => {
      state.isBotOpen = action.payload;
    },
  },
});

export const llmInferenceSlice = createSlice({
  name: "llmInference",
  initialState: {
    inferenceResult: "",
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLLMInference.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLLMInference.fulfilled, (state, action) => {
        state.status = "idle";
        state.inferenceResult = action.payload;
      })
      .addCase(fetchLLMInference.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const selectInferenceResult = (state) =>
  state.llmInference.inferenceResult;

export const isbotOpen = (state) => state.BotUI.isBotOpen;

export default llmInferenceSlice.reducer;
