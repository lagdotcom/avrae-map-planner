import { createSelector } from "reselect";
import { AppState } from ".";
import { Unit } from "../BattlePlan";

export const getCurrentUnitIndex = (state: AppState): number | undefined =>
  state.ui.unitPanel;
export const getPlanUnits = (state: AppState): Unit[] => state.plan.units;

export const getCurrentUnit = createSelector(
  [getCurrentUnitIndex, getPlanUnits],
  (i, units) => (i === undefined ? undefined : units[i])
);
