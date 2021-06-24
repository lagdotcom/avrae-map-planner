import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import MapPlanner from "./MapPlanner";
import LagVTT from "./LagVTT";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        {window.location.hash === "#vtt" ? <LagVTT /> : <MapPlanner />}
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
