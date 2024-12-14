// store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk for fetching user data from localStorage
export const loadUserFromLocalStorage = createAsyncThunk(
  "user/loadUserFromLocalStorage",
  async () => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      return JSON.parse(localUser);
    }
    return null;
  }
);

// userSlice.ts
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    resetForm: (state, action) => {
      if (state.user) {
        state.user = action.payload || null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadUserFromLocalStorage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadUserFromLocalStorage.fulfilled, (state, action) => {
      state.user = action.payload || null; // Ensure user is set correctly
      state.loading = false;
    });
    builder.addCase(loadUserFromLocalStorage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load user data";
    });
  },
});

export const { resetForm } = userSlice.actions;
export default userSlice.reducer;
