import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Unit, UnitMinusXY } from "../BattlePlan";
import { pload, psave } from "../persistence";

interface DBState {
  units: Record<string, UnitMinusXY>;
}

const initialState: DBState = {
  units: pload("units") || {},
};

function getUnitMinusXY(u: Unit | UnitMinusXY): UnitMinusXY {
  if ("x" in u) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { x, y, ...data } = u;
    return data;
  }

  return u;
}

const slice = createSlice({
  name: "db",
  initialState,
  reducers: {
    saveUnit(state, { payload }: PayloadAction<Unit | UnitMinusXY>) {
      state.units[payload.label] = getUnitMinusXY(payload);
      psave("units", state.units);
    },
  },
});

export const { saveUnit } = slice.actions;
export default slice.reducer;
