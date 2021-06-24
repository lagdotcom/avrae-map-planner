import React, { FC, useEffect, useRef } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Colours, Sizes, Unit, UnitMinusXY } from "./BattlePlan";
import TableEnumInput from "./inputs/TableEnumInput";
import TableTextInput from "./inputs/TableTextInput";
import { AppState } from "./store";
import { removeUnit } from "./store/actions";
import { saveImage, saveUnit } from "./store/db";
import { patchUnit } from "./store/plan";
import { getCurrentUnit, getCurrentUnitIndex } from "./store/selectors";
import { mod } from "./tools";
import useGlobalKeyDown from "./useGlobalKeyDown";

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
  patch: (u: Partial<Unit>) => void;
  remove: () => void;
  save: () => void;
  saveImg: (url: string) => void;
  u: Unit;
  units: Record<string, UnitMinusXY>;
  width: number;
}) {
  const labelRef = useRef<HTMLInputElement>(null);
  const img = images[u.label];

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
  function patch(patch: Partial<Unit>) {
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
