import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  mapPanel: boolean;
  unitPanel: boolean;
  activeUnit?: number;
}

const initialState: UIState = {
  mapPanel: false,
  unitPanel: false,
};

const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openMapPanel(state) {
      state.mapPanel = true;
      state.unitPanel = false;
    },

    openUnitPanel(state, { payload }: PayloadAction<number | undefined>) {
      state.mapPanel = false;
      state.unitPanel = true;
      state.activeUnit = payload;
    },
  },
});

export const { openMapPanel, openUnitPanel } = slice.actions;
export default slice.reducer;
