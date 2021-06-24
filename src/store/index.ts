import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";
import plan from "./plan";
import ui from "./ui";

export const store = configureStore({ reducer: { plan, ui } });
export type AppState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<unknown, AppState, void, AnyAction>;
