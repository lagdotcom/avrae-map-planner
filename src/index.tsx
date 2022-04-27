import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import LagVTT from "./LagVTT";
import MapPlanner from "./MapPlanner";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";

const container = document.getElementById("root");
if (!container) throw Error("No #root container");

const root = createRoot(container);
root.render(
  <StrictMode>
    <Provider store={store}>
      {window.location.hash === "#vtt" ? <LagVTT /> : <MapPlanner />}
    </Provider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
