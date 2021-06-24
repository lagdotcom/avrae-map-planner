import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BattlePlan, { Unit } from "../BattlePlan";

const initialState: BattlePlan = {
  name: "name",
  width: 5,
  height: 5,
  zoom: 1,
  units: [
    {
      label: "test",
      type: "",
      x: 3,
      y: 3,
      size: "M",
    },
  ],
  walls: [],
  loads: [],
};

type MoveUnitPayload = { i: number; x: number; y: number };
type PatchUnitPayload = { i: number; patch: Partial<Unit> };

const slice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    addUnit(state, { payload }: PayloadAction<Unit>) {
      state.units.push(payload);
    },

    moveUnit(state, { payload: { i, x, y } }: PayloadAction<MoveUnitPayload>) {
      state.units[i].x = x;
      state.units[i].y = y;
    },

    patchPlan(state, { payload }: PayloadAction<Partial<BattlePlan>>) {
      return { ...state, ...payload };
    },

    patchUnit(
      state,
      { payload: { i, patch } }: PayloadAction<PatchUnitPayload>
    ) {
      state.units[i] = { ...state.units[i], ...patch };
    },

    spliceUnit(state, { payload }: PayloadAction<number>) {
      state.units.splice(payload, 1);
    },
  },
});

export const { addUnit, moveUnit, patchPlan, patchUnit, spliceUnit } =
  slice.actions;
export default slice.reducer;
