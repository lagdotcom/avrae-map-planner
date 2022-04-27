import "./MapPlanner.css";

import { Dispatch, SetStateAction, useState } from "react";

import BattlePlan, {
  Colours,
  Doors,
  DoorTypes,
  Sizes,
  Unit,
  Wall,
} from "./BattlePlan";
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

type BattlePlanUpdater = Dispatch<SetStateAction<BattlePlan>>;

function MapSettings({
  plan,
  setPlan,
}: {
  plan: BattlePlan;
  setPlan: BattlePlanUpdater;
}) {
  return (
    <table className="MapSettings">
      <tbody>
        <TableTextInput
          label="Name"
          value={plan.name}
          onChange={(name) => setPlan({ ...plan, name })}
        />
        <TableNumberInput
          label="Width"
          value={plan.width}
          onChange={(width) => setPlan({ ...plan, width: width || 1 })}
        />
        <TableNumberInput
          label="Height"
          value={plan.height}
          onChange={(height) => setPlan({ ...plan, height: height || 1 })}
        />
        <TableNumberInput
          label="Zoom"
          value={plan.zoom}
          onChange={(zoom) => setPlan({ ...plan, zoom: zoom || 1 })}
        />
        <TableNumberInput
          label="Grid Size"
          value={plan.gridsize || 40}
          onChange={(gridsize) => setPlan({ ...plan, gridsize: gridsize || 1 })}
        />
        <TableTextInput
          label="BG"
          value={plan.bg || ""}
          onChange={(bg) => setPlan({ ...plan, bg })}
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
  function add() {
    setPlan({
      ...plan,
      loads: plan.loads.concat(""),
    });
  }

  function remove(idx: number) {
    setPlan({ ...plan, loads: plan.loads.filter((_, i) => i !== idx) });
  }

  function update(idx: number, url: string) {
    setPlan({
      ...plan,
      loads: plan.loads.map((w, i) => (i === idx ? url : w)),
    });
  }

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
                <TextInput value={url} onChange={(url) => update(i, url)} />
              </td>
              <td>
                <button onClick={() => remove(i)}>-</button>
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
  const index = plan.units.indexOf(unit);

  function update(patch: Partial<Unit>) {
    return setPlan({
      ...plan,
      units: plan.units.map((u, i) => (index === i ? { ...u, ...patch } : u)),
    });
  }

  function del() {
    return setPlan({
      ...plan,
      units: plan.units.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="UnitSettings">
      <strong>Unit</strong> <button onClick={del}>Delete</button>
      <table>
        <tbody>
          <TableNumberInput
            label="X"
            value={unit.x}
            onChange={(x) => update({ x })}
          />
          <TableNumberInput
            label="Y"
            value={unit.y}
            onChange={(y) => update({ y })}
          />
          <TableTextInput
            label="Label"
            value={unit.label}
            onChange={(label) => update({ label })}
          />
          <TableTextInput
            label="Type"
            value={unit.type}
            onChange={(type) => update({ type })}
          />
          <TableEnumInput
            label="Colour"
            value={unit.colour}
            empty="(default)"
            options={Colours}
            onChange={(colour) => update({ colour })}
          />
          <TableEnumInput
            label="Size"
            value={unit.size}
            options={Sizes}
            onChange={(size) => update({ size })}
          />
        </tbody>
      </table>
    </div>
  );
}

function MapWalls({
  plan,
  setPlan,
}: {
  plan: BattlePlan;
  setPlan: BattlePlanUpdater;
}) {
  function add() {
    return setPlan({
      ...plan,
      walls: plan.walls.concat({ sx: 0, sy: 0, ex: 0, ey: 0 }),
    });
  }

  function remove(idx: number) {
    return setPlan({ ...plan, walls: plan.walls.filter((_, i) => i !== idx) });
  }

  function update(idx: number, patch: Partial<Wall>) {
    return setPlan({
      ...plan,
      walls: plan.walls.map((w, i) => (i === idx ? { ...w, ...patch } : w)),
    });
  }

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
            <tr key={i} className="line">
              <td>
                <NumberInput
                  value={w.sx}
                  onChange={(sx) => update(i, { sx })}
                />
              </td>
              <td>
                <NumberInput
                  value={w.sy}
                  onChange={(sy) => update(i, { sy })}
                />
              </td>
              <td>
                <NumberInput
                  value={w.ex}
                  onChange={(ex) => update(i, { ex })}
                />
              </td>
              <td>
                <NumberInput
                  value={w.ey}
                  onChange={(ey) => update(i, { ey })}
                />
              </td>
              <td>
                <EnumInput
                  empty="(default)"
                  value={w.colour}
                  options={Colours}
                  onChange={(colour) => update(i, { colour })}
                />
              </td>
              <td>
                <EnumInput
                  empty="wall"
                  value={w.door}
                  options={Doors}
                  label={(k) => DoorTypes[k]}
                  onChange={(door) => update(i, { door })}
                />
              </td>
              <td>
                <button onClick={() => remove(i)}>-</button>
              </td>
            </tr>
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
  const unit = typeof selected === "number" ? plan.units[selected] : undefined;

  return (
    <div className="MapDetails">
      <button onClick={() => window.open(getOTFBMUrl(plan))}>Test</button>
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

  return (
    <textarea
      className="MapCode"
      value={lines}
      onChange={(e) => onChange(e.target.value)}
    />
  );
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
  const [solo, setSolo] = useState<boolean>(false);

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

  function shift(mx: number, my: number) {
    function apply(u: Unit) {
      const { x, y } = u;
      return { ...u, x: mod(x + mx, plan.width), y: mod(y + my, plan.height) };
    }

    setPlan({ ...plan, units: plan.units.map(apply) });
  }

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
        <button onClick={() => setSolo(!solo)}>Solo</button>
        <button onClick={() => shift(-1, 0)}>&lt;</button>
        <button onClick={() => shift(0, -1)}>^</button>
        <button onClick={() => shift(1, 0)}>&gt;</button>
        <button onClick={() => shift(0, 1)}>v</button>
      </div>
    </div>
  );
}
