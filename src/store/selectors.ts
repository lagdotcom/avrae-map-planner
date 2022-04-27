import { createSelector } from "reselect";

import VTTUnit from "../types/VTTUnit";
import { AppState } from "./";

export const getCurrentUnitIndex = (state: AppState): number | undefined =>
  state.ui.unitPanel;
export const getPlanUnits = (state: AppState): VTTUnit[] => state.plan.units;

export const getCurrentUnit = createSelector(
  [getCurrentUnitIndex, getPlanUnits],
  (i, units) => (i === undefined ? undefined : units[i])
);

export const getUnitsInInitiativeOrder = createSelector(
  [getPlanUnits],
  (units) => units.slice().sort((a, b) => b.initiative - a.initiative)
);
