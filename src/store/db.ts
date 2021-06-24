import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Unit, UnitMinusXY } from "../BattlePlan";
import { pload, psave } from "../persistence";

interface DBState {
  images: Record<string, string>;
  units: Record<string, UnitMinusXY>;
}

const initialState: DBState = {
  images: pload("images") || {},
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

type ImagePayload = { name: string; url: string };

const slice = createSlice({
  name: "db",
  initialState,
  reducers: {
    saveImage(state, { payload: { name, url } }: PayloadAction<ImagePayload>) {
      state.images[name] = url;
      psave("images", state.images);
    },

    saveUnit(state, { payload }: PayloadAction<Unit | UnitMinusXY>) {
      state.units[payload.label] = getUnitMinusXY(payload);
      psave("units", state.units);
    },
  },
});

export const { saveImage, saveUnit } = slice.actions;
export default slice.reducer;
