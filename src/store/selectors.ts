import { createSelector } from "reselect";
import { AppState } from ".";
import VTTUnit from "../VTTUnit";

export const getCurrentUnitIndex = (state: AppState): number | undefined =>
  state.ui.unitPanel;
export const getPlanUnits = (state: AppState): VTTUnit[] => state.plan.units;

export const getCurrentUnit = createSelector(
  [getCurrentUnitIndex, getPlanUnits],
  (i, units) => (i === undefined ? undefined : units[i])
);
