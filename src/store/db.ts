import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { pload, psave } from "../persistence";
import VTTUnit, { PersistentVTTUnit } from "../VTTUnit";

interface DBState {
  images: Record<string, string>;
  units: Record<string, PersistentVTTUnit>;
}

const initialState: DBState = {
  images: pload("images") || {},
  units: pload("units") || {},
};

function getPersistentUnit(u: VTTUnit | PersistentVTTUnit): PersistentVTTUnit {
  if ("x" in u) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { x, y, initiative, ...data } = u;
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

    saveUnit(state, { payload }: PayloadAction<VTTUnit | PersistentVTTUnit>) {
      state.units[payload.label] = getPersistentUnit(payload);
      psave("units", state.units);
    },
  },
});

export const { saveImage, saveUnit } = slice.actions;
export default slice.reducer;
