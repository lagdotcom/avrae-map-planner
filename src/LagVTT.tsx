import React, { FC } from "react";
import { MapView } from "./MapView";
import "./LagVTT.scss";
import { AppState } from "./store";
import { connect, ConnectedProps } from "react-redux";
import useGlobalKeyDown from "./useGlobalKeyDown";
import { openUnitPanel } from "./store/ui";
import { moveUnit } from "./store/plan";

const mapStateToProps = (state: AppState) => ({ plan: state.plan });
const mapDispatchToProps = { moveUnit, openUnitPanel };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const LagVTT: FC<Props> = ({ moveUnit, openUnitPanel, plan }) => {
  function onAdd() {
    console.log("todo", "onAdd");
  }

  function onMove(i: number, x: number, y: number) {
    moveUnit({ i, x, y });
  }

  function onSelect(index: number) {
    openUnitPanel(index);
  }

  useGlobalKeyDown(() => openUnitPanel(), ["u"]);

  return (
    <div className="LagVTT">
      <MapView plan={plan} onAdd={onAdd} onMove={onMove} onSelect={onSelect} />
    </div>
  );
};
export default connector(LagVTT);
