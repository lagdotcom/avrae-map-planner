import React, { FC } from "react";
import { MapView } from "./MapView";
import "./LagVTT.scss";
import { AppState } from "./store";
import { connect, ConnectedProps } from "react-redux";
import useGlobalKeyDown from "./useGlobalKeyDown";
import { closeAllPanels, openMapPanel, openUnitPanel } from "./store/ui";
import { addUnit, moveUnit } from "./store/plan";
import MapPanel from "./MapPanel";
import UnitPanel from "./UnitPanel";
import { getCurrentUnitIndex } from "./store/selectors";
import { mod } from "./tools";

const mapStateToProps = (state: AppState) => ({
  images: state.db.images,
  plan: state.plan,
  selected: getCurrentUnitIndex(state),
});
const mapDispatchToProps = {
  addUnit,
  closeAllPanels,
  moveUnit,
  openMapPanel,
  openUnitPanel,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const LagVTT: FC<Props> = ({
  addUnit,
  closeAllPanels,
  images,
  moveUnit,
  openMapPanel,
  openUnitPanel,
  plan,
  selected,
}) => {
  function onAdd(x: number, y: number) {
    addUnit({ label: "", type: "", x, y, size: "M", initiative: 0 });
    openUnitPanel(plan.units.length);
  }

  function onMove(i: number, x: number, y: number) {
    moveUnit({ i, x, y });
  }

  function onSelect(index: number) {
    openUnitPanel(index);
  }

  // TODO: make these not interrupt typing
  useGlobalKeyDown(() => openMapPanel(), ["shift+M"]);
  useGlobalKeyDown(() => {
    addUnit({ label: "", type: "", x: 0, y: 0, size: "M", initiative: 0 });
    openUnitPanel(plan.units.length);
  }, ["shift+U"]);
  useGlobalKeyDown(() => closeAllPanels(), ["Escape"]);
  useGlobalKeyDown(
    () => openUnitPanel(mod((selected ?? 0) + 1, plan.units.length)),
    ["PageDown"]
  );
  useGlobalKeyDown(
    () => openUnitPanel(mod((selected ?? 0) - 1, plan.units.length)),
    ["PageUp"]
  );

  return (
    <div className="LagVTT">
      <MapView
        onAdd={onAdd}
        onMove={onMove}
        onSelect={onSelect}
        images={images}
        plan={plan}
        selected={selected}
      />
      <MapPanel />
      <UnitPanel />
    </div>
  );
};
export default connector(LagVTT);
