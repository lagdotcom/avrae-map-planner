import classnames from "classnames";
import { useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";

import { AppState } from "./store";
import {
  closeLoadPanel,
  closeMapPanel,
  openLoadPanel,
  openMapPanel,
  toggleInitPanel,
} from "./store/ui";

function ToggleButton({
  onClick,
  label,
  selected,
  title,
}: {
  onClick(): void;
  label: string;
  selected?: boolean;
  title?: string;
}) {
  return (
    <button
      className={classnames("ToggleButton", { selected })}
      onClick={onClick}
      title={title}
    >
      {label}
    </button>
  );
}

const mapStateToProps = (state: AppState) => ({
  showInit: state.ui.initPanel,
  showLoad: state.ui.loadPanel,
  showMap: state.ui.mapPanel,
});
const mapDispatchToProps = {
  closeLoadPanel,
  closeMapPanel,
  openLoadPanel,
  openMapPanel,
  toggleInitPanel,
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function VTTButtonPanel({
  showInit,
  showLoad,
  showMap,
  closeLoadPanel,
  closeMapPanel,
  openLoadPanel,
  openMapPanel,
  toggleInitPanel,
}: Props) {
  const toggleLoad = useCallback(() => {
    if (showLoad) closeLoadPanel();
    else openLoadPanel();
  }, [closeLoadPanel, openLoadPanel, showLoad]);
  const toggleMap = useCallback(() => {
    if (showMap) closeMapPanel();
    else openMapPanel();
  }, [closeMapPanel, openMapPanel, showMap]);

  return (
    <div className={classnames("VTTButtonPanel", "Flyout", "show")}>
      <ToggleButton
        label="🏃"
        title="Initiative"
        selected={showInit}
        onClick={toggleInitPanel}
      />
      <ToggleButton
        label="🔃"
        title="Load"
        selected={showLoad}
        onClick={toggleLoad}
      />
      <ToggleButton
        label="🗺️"
        title="Map"
        selected={showMap}
        onClick={toggleMap}
      />
    </div>
  );
}
export default connector(VTTButtonPanel);
