import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BattlePlan from "../BattlePlan";

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

const slice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    moveUnit(state, { payload: { i, x, y } }: PayloadAction<MoveUnitPayload>) {
      state.units[i].x = x;
      state.units[i].y = y;
    },
  },
});

export const { moveUnit } = slice.actions;
export default slice.reducer;
