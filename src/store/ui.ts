import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  initPanel: boolean;
  loadPanel: boolean;
  mapPanel: boolean;
  unitPanel?: number;
}

const initialState: UIState = {
  initPanel: false,
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

    toggleInitPanel(state) {
      state.initPanel = !state.initPanel;
    },
  },
});

export const {
  closeAllPanels,
  openLoadPanel,
  openMapPanel,
  openUnitPanel,
  toggleInitPanel,
} = slice.actions;
export default slice.reducer;
