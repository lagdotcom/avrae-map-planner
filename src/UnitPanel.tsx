import React, { FC, useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";

import { Colours, Sizes } from "./BattlePlan";
import TableEnumInput from "./inputs/TableEnumInput";
import TableNumberInput from "./inputs/TableNumberInput";
import TableTextInput from "./inputs/TableTextInput";
import { AppState } from "./store";
import { removeUnit } from "./store/actions";
import { saveImage, saveUnit } from "./store/db";
import { patchUnit } from "./store/plan";
import { getCurrentUnit, getCurrentUnitIndex } from "./store/selectors";
import { mod } from "./tools";
import useGlobalKeyDown from "./useGlobalKeyDown";
import VTTUnit, { PersistentVTTUnit } from "./VTTUnit";

function UnitPanel({
  height,
  i,
  images,
  patch,
  remove,
  save,
  saveImg,
  u,
  units,
  width,
}: {
  height: number;
  i: number;
  images: Record<string, string>;
  patch: (u: Partial<VTTUnit>) => void;
  remove: () => void;
  save: () => void;
  saveImg: (url: string) => void;
  u: VTTUnit;
  units: Record<string, PersistentVTTUnit>;
  width: number;
}) {
  const labelRef = useRef<HTMLInputElement>(null);
  const img = images[u.label];

  useGlobalKeyDown(
    () => patch({ x: mod(u.x - 1, width) }),
    ["shift+ArrowLeft"]
  );
  useGlobalKeyDown(() => patch({ y: mod(u.y - 1, height) }), ["shift+ArrowUp"]);
  useGlobalKeyDown(
    () => patch({ x: mod(u.x + 1, width) }),
    ["shift+ArrowRight"]
  );
  useGlobalKeyDown(
    () => patch({ y: mod(u.y + 1, height) }),
    ["shift+ArrowDown"]
  );

  useGlobalKeyDown(() => remove(), ["Delete"]);

  function updateLabel(label: string) {
    if (units[label]) patch(units[label]);
    else patch({ label });
  }

  function setImage() {
    const url = prompt("Image URL", img);
    if (url) saveImg(url);
  }

  useEffect(() => {
    const label = labelRef.current;
    if (label) label.focus();
  }, [i, labelRef.current]);

  return (
    <div className="UnitPanel Flyout show">
      <table>
        <tbody>
          <TableTextInput
            label="Label"
            forwardRef={labelRef}
            value={u.label}
            onChange={updateLabel}
          />
          <TableNumberInput
            label="Init."
            value={u.initiative}
            onChange={(initiative) => patch({ initiative })}
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
        <button onClick={setImage}>Image...</button>
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  i: getCurrentUnitIndex(state),
  images: state.db.images,
  plan: state.plan,
  u: getCurrentUnit(state),
  units: state.db.units,
});
const mapDispatchToProps = { patchUnit, removeUnit, saveImage, saveUnit };
const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

const UnitPanelWrapper: FC<Props> = ({
  i,
  images,
  patchUnit,
  plan,
  removeUnit,
  saveImage,
  saveUnit,
  u,
  units,
}) => {
  function patch(patch: Partial<VTTUnit>) {
    if (i !== undefined) patchUnit({ i, patch });
  }

  function remove() {
    if (i !== undefined) removeUnit(i);
  }

  function save() {
    if (u) saveUnit(u);
  }

  function saveImg(url: string) {
    if (u) saveImage({ name: u.label, url });
  }

  return i !== undefined && u ? (
    <UnitPanel
      patch={patch}
      remove={remove}
      save={save}
      saveImg={saveImg}
      images={images}
      units={units}
      i={i}
      u={u}
      width={plan.width}
      height={plan.height}
    />
  ) : null;
};
export default connector(UnitPanelWrapper);
