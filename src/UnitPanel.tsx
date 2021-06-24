import classnames from "classnames";
import React, { FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Colours, Sizes } from "./BattlePlan";
import TableEnumInput from "./inputs/TableEnumInput";
import TableNumberInput from "./inputs/TableNumberInput";
import TableTextInput from "./inputs/TableTextInput";
import { AppState } from "./store";
import { removeUnit } from "./store/actions";
import { patchUnit } from "./store/plan";
import { getCurrentUnit, getCurrentUnitIndex } from "./store/selectors";

const mapStateToProps = (state: AppState) => ({
  i: getCurrentUnitIndex(state),
  u: getCurrentUnit(state),
});
const mapDispatchToProps = { patchUnit, removeUnit };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const UnitPanel: FC<Props> = ({ i, u, patchUnit, removeUnit }) => {
  function remove() {
    if (i !== undefined) removeUnit(i);
  }

  return i !== undefined && u ? (
    <div className={classnames("UnitPanel", "Flyout", "show")}>
      <table>
        <tbody>
          <TableNumberInput
            label="X"
            value={u.x}
            onChange={(x) => patchUnit({ i, patch: { x } })}
          />
          <TableNumberInput
            label="Y"
            value={u.y}
            onChange={(y) => patchUnit({ i, patch: { y } })}
          />
          <TableTextInput
            label="Label"
            value={u.label}
            onChange={(label) => patchUnit({ i, patch: { label } })}
          />
          <TableTextInput
            label="Type"
            value={u.type}
            onChange={(type) => patchUnit({ i, patch: { type } })}
          />
          <TableEnumInput
            label="Colour"
            value={u.colour}
            empty="(default)"
            options={Colours}
            onChange={(colour) => patchUnit({ i, patch: { colour } })}
          />
          <TableEnumInput
            label="Size"
            value={u.size}
            options={Sizes}
            onChange={(size) => patchUnit({ i, patch: { size } })}
          />
        </tbody>
      </table>

      <button onClick={remove}>Remove</button>
    </div>
  ) : null;
};
export default connector(UnitPanel);
