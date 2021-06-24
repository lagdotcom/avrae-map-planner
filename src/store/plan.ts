import { createSlice } from "@reduxjs/toolkit";
import BattlePlan from "../BattlePlan";

const initialState: BattlePlan = {
  name: "name",
  width: 5,
  height: 5,
  zoom: 1,
  units: [],
  walls: [],
  loads: [],
};

const slice = createSlice({
  name: "plan",
  initialState,
  reducers: {},
});

export default slice.reducer;
