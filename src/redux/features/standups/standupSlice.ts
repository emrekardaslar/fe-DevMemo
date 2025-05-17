import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Standup, StandupsState } from './types';
import { 
  fetchStandups, 
  fetchStandup, 
  createStandup, 
  updateStandup, 
  deleteStandup, 
  toggleHighlight 
} from './thunks';

// Initial state, same as the previous reducer
const initialState: StandupsState = {
  standups: [],
  currentStandup: null,
  loading: false,
  error: null,
  success: false
};

// Create the slice
export const standupSlice = createSlice({
  name: 'standups',
  initialState,
  reducers: {
    // Clear current standup
    clearStandup: (state) => {
      state.currentStandup = null;
      state.error = null;
    },

    // Reset success flag
    resetSuccess: (state) => {
      state.success = false;
      state.error = null;
    },

    // Optimistic update for toggling highlight
    setHighlightStatus: (state, action: PayloadAction<{ date: string, isHighlight: boolean }>) => {
      const { date, isHighlight } = action.payload;
      state.standups = state.standups.map(standup => 
        standup.date === date ? { ...standup, isHighlight } : standup
      );
      if (state.currentStandup?.date === date) {
        state.currentStandup = { ...state.currentStandup, isHighlight };
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch all standups
    builder
      .addCase(fetchStandups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandups.fulfilled, (state, action: PayloadAction<Standup[]>) => {
        state.loading = false;
        state.standups = action.payload;
        state.error = null;
      })
      .addCase(fetchStandups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch standups';
      });

    // Fetch single standup
    builder
      .addCase(fetchStandup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStandup.fulfilled, (state, action: PayloadAction<Standup>) => {
        state.loading = false;
        state.currentStandup = action.payload;
        state.error = null;
      })
      .addCase(fetchStandup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch standup';
      });

    // Create standup
    builder
      .addCase(createStandup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createStandup.fulfilled, (state, action: PayloadAction<Standup>) => {
        state.loading = false;
        state.standups = [action.payload, ...state.standups];
        state.currentStandup = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(createStandup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create standup';
        state.success = false;
      });

    // Update standup
    builder
      .addCase(updateStandup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateStandup.fulfilled, (state, action: PayloadAction<Standup>) => {
        state.loading = false;
        state.standups = state.standups.map(standup => 
          standup.date === action.payload.date ? action.payload : standup
        );
        state.currentStandup = action.payload;
        state.error = null;
        state.success = true;
      })
      .addCase(updateStandup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update standup';
        state.success = false;
      });

    // Delete standup
    builder
      .addCase(deleteStandup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteStandup.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.standups = state.standups.filter(standup => standup.date !== action.payload);
        if (state.currentStandup?.date === action.payload) {
          state.currentStandup = null;
        }
        state.error = null;
        state.success = true;
      })
      .addCase(deleteStandup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to delete standup';
        state.success = false;
      });

    // Toggle highlight
    builder
      .addCase(toggleHighlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleHighlight.fulfilled, (state, action: PayloadAction<Standup>) => {
        // Make sure we have valid payload data
        if (!action.payload || !action.payload.date) {
          console.error('Invalid payload in toggleHighlightSuccess:', action.payload);
          state.loading = false;
          state.error = 'Invalid response data for highlight toggle';
          return;
        }
        
        state.loading = false;
        state.standups = state.standups.map(standup => 
          standup.date === action.payload.date ? action.payload : standup
        );
        if (state.currentStandup?.date === action.payload.date) {
          state.currentStandup = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleHighlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to toggle highlight';
      });
  }
});

// Export actions
export const {
  clearStandup,
  resetSuccess,
  setHighlightStatus
} = standupSlice.actions;

// Export reducer
export default standupSlice.reducer; 