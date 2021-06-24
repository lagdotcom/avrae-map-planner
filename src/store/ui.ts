import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  loadPanel: boolean;
  mapPanel: boolean;
  unitPanel?: number;
}

const initialState: UIState = {
  loadPanel: false,
  mapPanel: false,
  unitPanel: undefined,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    closeAllPanels(state) {
      state.loadPanel = false;
      state.mapPanel = false;
      state.unitPanel = undefined;
    },

    openLoadPanel(state) {
      state.loadPanel = true;
      state.mapPanel = false;
      state.unitPanel = undefined;
    },

    openMapPanel(state) {
      state.loadPanel = false;
      state.mapPanel = true;
      state.unitPanel = undefined;
    },

    openUnitPanel(state, { payload }: PayloadAction<number>) {
      state.loadPanel = false;
      state.mapPanel = false;
      state.unitPanel = payload;
    },
  },
});

export const { closeAllPanels, openLoadPanel, openMapPanel, openUnitPanel } =
  slice.actions;
export default slice.reducer;
