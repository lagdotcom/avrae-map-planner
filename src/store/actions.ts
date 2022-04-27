import { AppThunk } from "./";
import { spliceUnit } from "./plan";
import { closeAllPanels, setCurrentUnit } from "./ui";

export const removeUnit =
  (i: number): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const max = state.plan.units.length;

    dispatch(spliceUnit(i));

    if (state.ui.unitPanel !== undefined && state.ui.unitPanel >= max)
      dispatch(closeAllPanels());

    if (state.ui.currentUnit >= i)
      dispatch(setCurrentUnit(state.ui.currentUnit - 1));
  };
