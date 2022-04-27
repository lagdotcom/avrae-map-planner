import "./LagVTT.css";

import { connect, ConnectedProps } from "react-redux";

import InitPanel from "./InitPanel";
import LoadPanel from "./LoadPanel";
import MapPanel from "./MapPanel";
import { MapView } from "./MapView";
import { AppState } from "./store";
import { addUnit, moveUnit } from "./store/plan";
import { getCurrentUnitIndex } from "./store/selectors";
import { closeAllPanels, openUnitPanel } from "./store/ui";
import { mod } from "./tools";
import UnitPanel from "./UnitPanel";
import useGlobalKeyDown from "./useGlobalKeyDown";
import VTTButtonPanel from "./VTTButtonPanel";

const mapStateToProps = (state: AppState) => ({
  images: state.db.images,
  plan: state.plan,
  selected: getCurrentUnitIndex(state),
});
const mapDispatchToProps = {
  addUnit,
  closeAllPanels,
  moveUnit,
  openUnitPanel,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function LagVTT({
  addUnit,
  closeAllPanels,
  images,
  moveUnit,
  openUnitPanel,
  plan,
  selected,
}: Props) {
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
      <InitPanel />
      <LoadPanel />
      <MapPanel />
      <UnitPanel />
      <VTTButtonPanel />
    </div>
  );
}
export default connector(LagVTT);
