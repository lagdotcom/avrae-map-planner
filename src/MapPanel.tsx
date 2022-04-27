import classnames from "classnames";
import { useCallback } from "react";
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

function MapPanel({ patchPlan, plan, shiftUnits, show }: Props) {
  const shift = useCallback(
    (x: number, y: number) => () => shiftUnits([x, y]),
    [shiftUnits]
  );

  const patchName = useCallback(
    (name: string) => patchPlan({ name }),
    [patchPlan]
  );
  const patchWidth = useCallback(
    (width: number) => patchPlan({ width: width || 1 }),
    [patchPlan]
  );
  const patchHeight = useCallback(
    (height: number) => patchPlan({ height: height || 1 }),
    [patchPlan]
  );
  const patchBg = useCallback((bg: string) => patchPlan({ bg }), [patchPlan]);

  return (
    <div className={classnames("MapPanel", "Flyout", { show })}>
      <table>
        <tbody>
          <TableTextInput label="Name" value={plan.name} onChange={patchName} />
          <TableNumberInput
            label="Width"
            value={plan.width}
            onChange={patchWidth}
          />
          <TableNumberInput
            label="Height"
            value={plan.height}
            onChange={patchHeight}
          />
          <TableTextInput label="BG" value={plan.bg || ""} onChange={patchBg} />
        </tbody>
      </table>
      <div className="ButtonBox">
        <button onClick={shift(-1, 0)}>&lt;</button>
        <button onClick={shift(0, -1)}>^</button>
        <button onClick={shift(1, 0)}>&gt;</button>
        <button onClick={shift(0, 1)}>v</button>
      </div>
    </div>
  );
}
export default connector(MapPanel);
