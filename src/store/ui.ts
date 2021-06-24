import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  mapPanel: boolean;
  unitPanel?: number;
}

const initialState: UIState = {
  mapPanel: false,
  unitPanel: undefined,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    closeAllPanels(state) {
      state.mapPanel = false;
      state.unitPanel = undefined;
    },

    openMapPanel(state) {
      state.mapPanel = true;
      state.unitPanel = undefined;
    },

    openUnitPanel(state, { payload }: PayloadAction<number>) {
      state.mapPanel = false;
      state.unitPanel = payload;
    },
  },
});

export const { closeAllPanels, openMapPanel, openUnitPanel } = slice.actions;
export default slice.reducer;
