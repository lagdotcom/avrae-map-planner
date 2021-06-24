import React, { FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Colours, Sizes, Unit } from "./BattlePlan";
import TableEnumInput from "./inputs/TableEnumInput";
import TableNumberInput from "./inputs/TableNumberInput";
import TableTextInput from "./inputs/TableTextInput";
import { AppState } from "./store";
import { removeUnit } from "./store/actions";
import { saveUnit } from "./store/db";
import { patchUnit } from "./store/plan";
import { getCurrentUnit, getCurrentUnitIndex } from "./store/selectors";
import { mod } from "./tools";
import useGlobalKeyDown from "./useGlobalKeyDown";

function ActualUnitPanel({
  db,
  height,
  i,
  patch,
  remove,
  save,
  u,
  width,
}: {
  db: Record<string, Unit>;
  height: number;
  i: number;
  patch: (u: Partial<Unit>) => void;
  remove: () => void;
  save: () => void;
  u: Unit;
  width: number;
}) {
  useGlobalKeyDown(
    (e) => {
      patch({ x: mod(u.x - 1, width) });
      e.stopPropagation();
    },
    ["shift+ArrowLeft"]
  );
  useGlobalKeyDown(
    (e) => {
      patch({ y: mod(u.y - 1, height) });
      e.stopPropagation();
    },
    ["shift+ArrowUp"]
  );
  useGlobalKeyDown(
    (e) => {
      patch({ x: mod(u.x + 1, width) });
      e.stopPropagation();
    },
    ["shift+ArrowRight"]
  );
  useGlobalKeyDown(
    (e) => {
      patch({ y: mod(u.y + 1, height) });
      e.stopPropagation();
    },
    ["shift+ArrowDown"]
  );

  useGlobalKeyDown(() => remove(), ["Delete"]);

  function updateLabel(label: string) {
    if (db[label]) {
      const { x, y, ...rest } = db[label];
      patch(rest);
    } else patch({ label });
  }

  return (
    <div className="UnitPanel Flyout show">
      <table>
        <tbody>
          <TableNumberInput
            label="X"
            value={u.x}
            onChange={(x) => patch({ x })}
          />
          <TableNumberInput
            label="Y"
            value={u.y}
            onChange={(y) => patch({ y })}
          />
          <TableTextInput
            label="Label"
            value={u.label}
            onChange={updateLabel}
          />
          <TableTextInput
            label="Type"
            value={u.type}
            onChange={(type) => patch({ type })}
          />
          <TableEnumInput
            label="Colour"
            value={u.colour}
            empty="(default)"
            options={Colours}
            onChange={(colour) => patch({ colour })}
          />
          <TableEnumInput
            label="Size"
            value={u.size}
            options={Sizes}
            onChange={(size) => patch({ size })}
          />
        </tbody>
      </table>

      <div className="ButtonBox">
        <button onClick={save}>Save</button>
        <button onClick={remove}>Remove</button>
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  db: state.db.units,
  i: getCurrentUnitIndex(state),
  plan: state.plan,
  u: getCurrentUnit(state),
});
const mapDispatchToProps = { patchUnit, removeUnit, saveUnit };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const UnitPanel: FC<Props> = ({
  db,
  i,
  patchUnit,
  plan,
  removeUnit,
  saveUnit,
  u,
}) => {
  function patch(patch: Partial<Unit>) {
    if (i !== undefined) patchUnit({ i, patch });
  }

  function remove() {
    if (i !== undefined) removeUnit(i);
  }

  function save() {
    if (u) saveUnit(u);
  }

  return i !== undefined && u ? (
    <ActualUnitPanel
      i={i}
      u={u}
      patch={patch}
      remove={remove}
      save={save}
      db={db}
      width={plan.width}
      height={plan.height}
    />
  ) : null;
};
export default connector(UnitPanel);
