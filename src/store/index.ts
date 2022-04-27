import { AnyAction, configureStore, ThunkAction } from "@reduxjs/toolkit";

import db from "./db";
import plan from "./plan";
import ui from "./ui";

export const store = configureStore({ reducer: { db, plan, ui } });
export type AppState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<unknown, AppState, void, AnyAction>;
