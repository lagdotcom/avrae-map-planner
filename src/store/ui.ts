import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  currentUnit: number;
  initPanel: boolean;
  loadPanel: boolean;
  mapPanel: boolean;
  overlayPanel?: number;
  unitPanel?: number;
}

const initialState: UIState = {
  currentUnit: 0,
  initPanel: false,
  loadPanel: false,
  mapPanel: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    closeAllPanels(state) {
      state.loadPanel = false;
      state.mapPanel = false;
      state.overlayPanel = undefined;
      state.unitPanel = undefined;
    },

    openLoadPanel(state) {
      state.loadPanel = true;
      state.mapPanel = false;
      state.overlayPanel = undefined;
      state.unitPanel = undefined;
    },
    closeLoadPanel(state) {
      state.loadPanel = false;
    },

    openMapPanel(state) {
      state.loadPanel = false;
      state.mapPanel = true;
      state.overlayPanel = undefined;
      state.unitPanel = undefined;
    },
    closeMapPanel(state) {
      state.mapPanel = false;
    },

    openOverlayPanel(state, { payload }: PayloadAction<number>) {
      state.loadPanel = false;
      state.mapPanel = false;
      state.overlayPanel = payload;
      state.unitPanel = undefined;
    },

    openUnitPanel(state, { payload }: PayloadAction<number>) {
      state.loadPanel = false;
      state.mapPanel = false;
      state.overlayPanel = undefined;
      state.unitPanel = payload;
    },

    setCurrentUnit(state, { payload }: PayloadAction<number>) {
      state.currentUnit = payload;
    },

    toggleInitPanel(state) {
      state.initPanel = !state.initPanel;
    },
  },
});

export const {
  closeAllPanels,
  closeLoadPanel,
  closeMapPanel,
  openLoadPanel,
  openMapPanel,
  openOverlayPanel,
  openUnitPanel,
  setCurrentUnit,
  toggleInitPanel,
} = slice.actions;
export default slice.reducer;
