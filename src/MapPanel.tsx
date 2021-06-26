import classnames from "classnames";
import React, { FC } from "react";
import { connect, ConnectedProps } from "react-redux";

import TableNumberInput from "./inputs/TableNumberInput";
import TableTextInput from "./inputs/TableTextInput";
import { AppState } from "./store";
import { patchPlan, shiftUnits } from "./store/plan";

const mapStateToProps = (state: AppState) => ({
  plan: state.plan,
  show: state.ui.mapPanel,
});
const mapDispatchToProps = { patchPlan, shiftUnits };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const MapPanel: FC<Props> = ({ patchPlan, plan, shiftUnits, show }) => {
  return (
    <div className={classnames("MapPanel", "Flyout", { show })}>
      <table>
        <tbody>
          <TableTextInput
            label="Name"
            value={plan.name}
            onChange={(name) => patchPlan({ name })}
          />
          <TableNumberInput
            label="Width"
            value={plan.width}
            onChange={(width) => patchPlan({ width: width || 1 })}
          />
          <TableNumberInput
            label="Height"
            value={plan.height}
            onChange={(height) => patchPlan({ height: height || 1 })}
          />
          <TableTextInput
            label="BG"
            value={plan.bg || ""}
            onChange={(bg) => patchPlan({ bg })}
          />
        </tbody>
      </table>
      <div className="ButtonBox">
        <button onClick={() => shiftUnits([-1, 0])}>&lt;</button>
        <button onClick={() => shiftUnits([0, -1])}>^</button>
        <button onClick={() => shiftUnits([1, 0])}>&gt;</button>
        <button onClick={() => shiftUnits([0, 1])}>v</button>
      </div>
    </div>
  );
};
export default connector(MapPanel);
