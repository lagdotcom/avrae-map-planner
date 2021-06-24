import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Unit } from "../BattlePlan";
import { pload, psave } from "../persistence";

interface DBState {
  units: Record<string, Unit>;
}

const initialState: DBState = {
  units: pload("units") || {},
};

const slice = createSlice({
  name: "db",
  initialState,
  reducers: {
    saveUnit(state, { payload }: PayloadAction<Unit>) {
      state.units[payload.label] = payload;
      psave("units", state.units);
    },
  },
});

export const { saveUnit } = slice.actions;
export default slice.reducer;
