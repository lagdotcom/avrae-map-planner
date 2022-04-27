import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { mod, XY } from "../tools";
import VTTPlan from "../types/VTTPlan";
import VTTUnit from "../types/VTTUnit";

const initialState: VTTPlan = {
  name: "name",
  width: 5,
  height: 5,
  zoom: 1,
  units: [],
  walls: [],
  loads: [],
  overlays: [],
};

type MoveUnitPayload = { i: number; x: number; y: number };
type PatchUnitPayload = { i: number; patch: Partial<VTTUnit> };

const slice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    addUnit(state, { payload }: PayloadAction<VTTUnit>) {
      state.units.push(payload);
    },

    moveUnit(state, { payload: { i, x, y } }: PayloadAction<MoveUnitPayload>) {
      state.units[i].x = x;
      state.units[i].y = y;
    },

    patchPlan(state, { payload }: PayloadAction<Partial<VTTPlan>>) {
      return { ...state, ...payload };
    },

    patchUnit(
      state,
      { payload: { i, patch } }: PayloadAction<PatchUnitPayload>
    ) {
      state.units[i] = { ...state.units[i], ...patch };
    },

    shiftUnits(state, { payload: [x, y] }: PayloadAction<XY>) {
      for (const u of state.units) {
        u.x = mod(u.x + x, state.width);
        u.y = mod(u.y + y, state.height);
      }
    },

    spliceUnit(state, { payload }: PayloadAction<number>) {
      state.units.splice(payload, 1);
    },
  },
});

export const {
  addUnit,
  moveUnit,
  patchPlan,
  patchUnit,
  shiftUnits,
  spliceUnit,
} = slice.actions;
export default slice.reducer;
