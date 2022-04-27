import "./MapPlanner.css";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import EnumInput from "./inputs/EnumInput";
import NumberInput from "./inputs/NumberInput";
import TableEnumInput from "./inputs/TableEnumInput";
import TableNumberInput from "./inputs/TableNumberInput";
import TableTextInput from "./inputs/TableTextInput";
import TextInput from "./inputs/TextInput";
import { MapView } from "./MapView";
import {
  convertFromUVar,
  convertToBPlan,
  convertToUvar,
  getOTFBMUrl,
  mod,
} from "./tools";
import BattlePlan, {
  Colours,
  Doors,
  DoorTypes,
  Sizes,
  Unit,
  Wall,
} from "./types/BattlePlan";
import usePatch from "./usePatch";
import useToggle from "./useToggle";

type BattlePlanUpdater = Dispatch<SetStateAction<BattlePlan>>;

const orOne = (v?: number) => v || 1;

function MapSettings({
  plan,
  setPlan,
}: {
  plan: BattlePlan;
  setPlan: BattlePlanUpdater;
}) {
  const patch = usePatch(setPlan);

  return (
    <table className="MapSettings">
      <tbody>
        <TableTextInput
          label="Name"
          value={plan.name}
          onChange={patch("name")}
        />
        <TableNumberInput
          label="Width"
          value={plan.width}
          onChange={patch("width", orOne)}
        />
        <TableNumberInput
          label="Height"
          value={plan.height}
          onChange={patch("height", orOne)}
        />
        <TableNumberInput
          label="Zoom"
          value={plan.zoom}
          onChange={patch("zoom", orOne)}
        />
        <TableNumberInput
          label="Grid Size"
          value={plan.gridsize || 40}
          onChange={patch("gridsize", orOne)}
        />
        <TableTextInput
          label="BG"
          value={plan.bg || ""}
          onChange={patch("bg")}
        />
      </tbody>
    </table>
  );
}

function MapLoads({
  plan,
  setPlan,
}: {
  plan: BattlePlan;
  setPlan: BattlePlanUpdater;
}) {
  const add = useCallback(
    () => setPlan((plan) => ({ ...plan, loads: plan.loads.concat("") })),
    [setPlan]
  );

  const change = useCallback(
    (idx: number) => (url: string) =>
      setPlan((plan) => ({
        ...plan,
        loads: plan.loads.map((old, i) => (i === idx ? url : old)),
      })),
    [setPlan]
  );

  const remove = useCallback(
    (idx: number) => () =>
      setPlan((plan) => ({
        ...plan,
        loads: plan.loads.filter((_, i) => i !== idx),
      })),
    [setPlan]
  );

  return (
    <div className="MapLoads">
      <strong>JSON Data Loads</strong> <button onClick={add}>Add</button>
      <table>
        <thead>
          <tr>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {plan.loads.map((url, i) => (
            <tr key={i}>
              <td>
                <TextInput value={url} onChange={change(i)} />
              </td>
              <td>
                <button onClick={remove(i)}>-</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnitSettings({
  plan,
  setPlan,
  unit,
}: {
  plan: BattlePlan;
  setPlan: BattlePlanUpdater;
  unit: Unit;
}) {
  const index = useMemo(() => plan.units.indexOf(unit), [plan.units, unit]);

  const del = useCallback(
    () =>
      setPlan((old) => ({
        ...old,
        units: old.units.filter((_, i) => i !== index),
      })),
    [index, setPlan]
  );

  const patch = useCallback(
    function patch<T extends keyof Unit>(field: T) {
      return (value?: Unit[T]) =>
        setPlan((old) => ({
          ...old,
          units: old.units.map((u, i) =>
            i === index ? { ...u, [field]: value } : u
          ),
        }));
    },
    [index, setPlan]
  );

  return (
    <div className="UnitSettings">
      <strong>Unit</strong> <button onClick={del}>Delete</button>
      <table>
        <tbody>
          <TableNumberInput label="X" value={unit.x} onChange={patch("x")} />
          <TableNumberInput label="Y" value={unit.y} onChange={patch("y")} />
          <TableTextInput
            label="Label"
            value={unit.label}
            onChange={patch("label")}
          />
          <TableTextInput
            label="Type"
            value={unit.type}
            onChange={patch("type")}
          />
          <TableEnumInput
            label="Colour"
            value={unit.colour}
            empty="(default)"
            options={Colours}
            onChange={patch("colour")}
          />
          <TableEnumInput
            label="Size"
            value={unit.size}
            options={Sizes}
            onChange={patch("size")}
          />
        </tbody>
      </table>
    </div>
  );
}

function MapWallInputs({
  index,
  w,
  setPlan,
}: {
  index: number;
  w: Wall;
  setPlan: BattlePlanUpdater;
}) {
  const getDoorLabel = useCallback(
    (k: keyof typeof DoorTypes) => DoorTypes[k],
    []
  );

  const remove = useCallback(
    (idx: number) => () =>
      setPlan((old) => ({
        ...old,
        walls: old.walls.filter((_, i) => i !== idx),
      })),
    [setPlan]
  );

  const patch = useCallback(
    function patch<T extends keyof Wall>(field: T) {
      return (value?: Wall[T]) =>
        setPlan((old) => ({
          ...old,
          walls: old.walls.map((u, i) =>
            i === index ? { ...u, [field]: value } : u
          ),
        }));
    },
    [index, setPlan]
  );

  return (
    <tr className="line">
      <td>
        <NumberInput value={w.sx} onChange={patch("sx")} />
      </td>
      <td>
        <NumberInput value={w.sy} onChange={patch("sy")} />
      </td>
      <td>
        <NumberInput value={w.ex} onChange={patch("ex")} />
      </td>
      <td>
        <NumberInput value={w.ey} onChange={patch("ey")} />
      </td>
      <td>
        <EnumInput
          empty="(default)"
          value={w.colour}
          options={Colours}
          onChange={patch("colour")}
        />
      </td>
      <td>
        <EnumInput
          empty="wall"
          value={w.door}
          options={Doors}
          label={getDoorLabel}
          onChange={patch("door")}
        />
      </td>
      <td>
        <button onClick={remove(index)}>-</button>
      </td>
    </tr>
  );
}

function MapWalls({
  plan,
  setPlan,
}: {
  plan: BattlePlan;
  setPlan: BattlePlanUpdater;
}) {
  const add = useCallback(
    () =>
      setPlan((old) => ({
        ...old,
        walls: old.walls.concat({ sx: 0, sy: 0, ex: 0, ey: 0 }),
      })),
    [setPlan]
  );

  return (
    <div className="MapWalls">
      <strong>Walls</strong> <button onClick={add}>Add</button>
      <table>
        <thead>
          <tr>
            <th>SX</th>
            <th>SY</th>
            <th>EX</th>
            <th>EY</th>
            <th>Col</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {plan.walls.map((w, i) => (
            <MapWallInputs key={i} index={i} w={w} setPlan={setPlan} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MapDetails({
  plan,
  selected,
  setPlan,
}: {
  plan: BattlePlan;
  selected?: number;
  setPlan: BattlePlanUpdater;
}) {
  const test = useCallback(() => window.open(getOTFBMUrl(plan)), [plan]);

  const unit = typeof selected === "number" ? plan.units[selected] : undefined;

  return (
    <div className="MapDetails">
      <button onClick={test}>Test</button>
      <MapSettings plan={plan} setPlan={setPlan} />
      <MapLoads plan={plan} setPlan={setPlan} />
      {unit && <UnitSettings plan={plan} setPlan={setPlan} unit={unit} />}
      <MapWalls plan={plan} setPlan={setPlan} />
    </div>
  );
}

function MapCode({
  onChange,
  plan,
  uvar,
}: {
  onChange: (s: string) => void;
  plan: BattlePlan;
  uvar: boolean;
}) {
  const lines = uvar ? convertToUvar(plan) : convertToBPlan(plan).join("\n");

  const change = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    [onChange]
  );

  return <textarea className="MapCode" value={lines} onChange={change} />;
}

export default function MapPlanner(): JSX.Element {
  const [plan, setPlan] = useState<BattlePlan>({
    name: "name",
    width: 5,
    height: 5,
    zoom: 1,
    units: [],
    walls: [],
    loads: [],
    overlays: [],
  });
  const [solo, toggleSolo] = useToggle(false);

  const [selected, setSelected] = useState<number>();
  function add(x: number, y: number) {
    const unit =
      typeof selected === "number" ? plan.units[selected] : undefined;

    setSelected(plan.units.length);
    setPlan({
      ...plan,
      units: [
        ...plan.units,
        {
          x,
          y,
          size: unit?.size || "M",
          label: unit?.label || "",
          type: unit?.type || "",
          colour: unit?.colour,
        },
      ],
    });
  }

  const shift = useCallback(
    (mx: number, my: number) => () => {
      setPlan({
        ...plan,
        units: plan.units.map((u) => {
          const { x, y } = u;
          return {
            ...u,
            x: mod(x + mx, plan.width),
            y: mod(y + my, plan.height),
          };
        }),
      });
    },
    [plan]
  );

  function parse(s: string) {
    const stripped = s.startsWith("!uvar Battles ") ? s.substr(14) : s;
    setPlan(convertFromUVar(stripped));
  }

  return (
    <div className={`MapPlanner ${solo ? "solo" : ""}`}>
      <MapView
        onSelect={setSelected}
        onAdd={add}
        plan={plan}
        selected={selected}
      />
      <MapDetails plan={plan} setPlan={setPlan} selected={selected} />
      <MapCode onChange={parse} plan={plan} uvar={true} />
      <div className="ButtonBox">
        <button onClick={toggleSolo}>Solo</button>
        <button onClick={shift(-1, 0)}>&lt;</button>
        <button onClick={shift(0, -1)}>^</button>
        <button onClick={shift(1, 0)}>&gt;</button>
        <button onClick={shift(0, 1)}>v</button>
      </div>
    </div>
  );
}
