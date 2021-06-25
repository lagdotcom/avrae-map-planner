import React, { FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { AppState } from "./store";
import classnames from "classnames";
import { openUnitPanel, setCurrentUnit } from "./store/ui";
import { mod } from "./tools";
import { getUnitsInInitiativeOrder } from "./store/selectors";

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

const InitPanel: FC<Props> = ({
  current,
  openUnitPanel,
  plan,
  setCurrentUnit,
  show,
  showUnit,
  sortedUnits,
}) => {
  function select(i: number) {
    openUnitPanel(plan.units.indexOf(sortedUnits[i]));
  }

  function next() {
    const i = mod(current + 1, plan.units.length);
    setCurrentUnit(i);
    if (showUnit !== undefined) select(i);
  }

  return (
    <div className={classnames("Flyout", "InitPanel", { show })}>
      <table>
        <tbody>
          {sortedUnits.map((u, i) => (
            <tr
              key={i}
              onClick={() => select(i)}
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
};
export default connector(InitPanel);
