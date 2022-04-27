import classnames from "classnames";
import { useCallback } from "react";
import { connect, ConnectedProps } from "react-redux";

import { AppState } from "./store";
import { getUnitsInInitiativeOrder } from "./store/selectors";
import { openUnitPanel, setCurrentUnit } from "./store/ui";
import { mod } from "./tools";

const mapStateToProps = (state: AppState) => ({
  current: state.ui.currentUnit,
  plan: state.plan,
  show: state.ui.initPanel,
  showUnit: state.ui.unitPanel,
  sortedUnits: getUnitsInInitiativeOrder(state),
});
const mapDispatchToProps = { openUnitPanel, setCurrentUnit };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

function InitPanel({
  current,
  openUnitPanel,
  plan,
  setCurrentUnit,
  show,
  showUnit,
  sortedUnits,
}: Props) {
  const select = useCallback(
    (i: number) => () => openUnitPanel(plan.units.indexOf(sortedUnits[i])),
    [openUnitPanel, plan.units, sortedUnits]
  );

  const next = useCallback(() => {
    const i = mod(current + 1, plan.units.length);
    setCurrentUnit(i);
    if (showUnit !== undefined) select(i);
  }, [current, plan.units.length, select, setCurrentUnit, showUnit]);

  return (
    <div className={classnames("Flyout", "InitPanel", { show })}>
      <table>
        <tbody>
          {sortedUnits.map((u, i) => (
            <tr
              key={i}
              onClick={select(i)}
              className={classnames("UnitLine", { current: i === current })}
            >
              <td className="Initiative">{u.initiative}</td>
              <td>{u.label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ButtonBox">
        <button onClick={next}>&gt;</button>
      </div>
    </div>
  );
}
export default connector(InitPanel);
