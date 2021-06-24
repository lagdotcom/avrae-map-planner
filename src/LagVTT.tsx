import React, { FC, KeyboardEvent } from "react";
import { MapView } from "./MapView";
import "./LagVTT.scss";
import { AppState, store } from "./store";
import { connect, ConnectedProps, Provider } from "react-redux";

const mapStateToProps = (state: AppState) => ({ plan: state.plan });
const mapDispatchToProps = {};
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const LagVTT: FC<Props> = ({ plan }) => {
  function onAdd() {
    console.log("todo", "onAdd");
  }

  function onSelect() {
    console.log("todo", "onSelect");
  }

  function onKey(e: KeyboardEvent) {
    console.log("LagVTT", "onKey", e.key);
  }

  return (
    <Provider store={store}>
      <div className="LagVTT" onKeyPressCapture={onKey}>
        <MapView plan={plan} onAdd={onAdd} onSelect={onSelect} />
      </div>
    </Provider>
  );
};
export default connector(LagVTT);
