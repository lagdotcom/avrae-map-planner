import classnames from "classnames";
import { useState } from "react";
import BattlePlan, {
  Colours,
  ColourValues,
  LightColours,
  Sizes,
  Unit,
} from "./BattlePlan";
import "./MapPlanner.scss";
import { unitAt, cellLabel, en, columnLabel, convertToUvar } from "./tools";

type coord = [x: number, y: number];
type BattlePlanUpdater = React.Dispatch<React.SetStateAction<BattlePlan>>;

function MapTile({
  onClick,
  plan,
  x,
  y,
}: {
  onClick: (x: number, y: number) => void;
  plan: BattlePlan;
  x: number;
  y: number;
}) {
  const unit = unitAt(plan, x, y);
  const colour = unit?.colour || "r";

  return (
    <td className="cell" onClick={() => onClick(x, y)}>
      <span className="label">{cellLabel(x, y)}</span>
      {unit && (
        <span
          className={classnames("Unit", "size-" + unit.size)}
          style={{
            backgroundColor: ColourValues[colour],
            color: LightColours.includes(colour) ? "black" : "white",
          }}
        >
          {unit.label || " "}
        </span>
      )}
    </td>
  );
}

function MapView({
  onClick,
  plan,
}: {
  onClick: (x: number, y: number) => void;
  plan: BattlePlan;
}) {
  return (
    <table className="MapView">
      <tbody>
        <tr className="top-row">
          <th className="x">x</th>
          {en(plan.width).map((x) => (
            <th key={x} className="col-label">
              {columnLabel(x)}
            </th>
          ))}
        </tr>
        {en(plan.height).map((y) => (
          <tr key={y} className="row">
            <th className="row-label">{y + 1}</th>
            {en(plan.width).map((x) => (
              <MapTile key={x} onClick={onClick} plan={plan} x={x} y={y} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      </td>
    </tr>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <tr>
      <th>{label}</th>
      <td>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
        />
      </td>
    </tr>
  );
}

function EnumInput<T extends string>({
  empty,
  label,
  value,
  options,
  onChange,
}: {
  empty?: string;
  label: string;
  value: T | undefined;
  options: T[];
  onChange: (value: T | undefined) => void;
}) {
  function resolve(val: string) {
    if (val !== empty) return val as T;
    return undefined;
  }

  return (
    <tr>
      <th>{label}</th>
      <td>
        <select
          value={value}
          onChange={(e) => onChange(resolve(e.target.value))}
        >
          {empty && <option>{empty}</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

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
        <TextInput
          label="Name"
          value={plan.name}
          onChange={(name) => setPlan({ ...plan, name })}
        />
        <NumberInput
          label="Width"
          value={plan.width}
          onChange={(width) => setPlan({ ...plan, width: width || 1 })}
        />
        <NumberInput
          label="Height"
          value={plan.height}
          onChange={(height) => setPlan({ ...plan, height: height || 1 })}
        />
      </tbody>
    </table>
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
      units: plan.units.map((u, n) => (index === n ? { ...u, ...patch } : u)),
    });
  }

  return (
    <table className="UnitSettings">
      <tbody>
        <TextInput
          label="Label"
          value={unit.label}
          onChange={(label) => update({ label })}
        />
        <TextInput
          label="Type"
          value={unit.type}
          onChange={(type) => update({ type })}
        />
        <EnumInput
          label="Colour"
          value={unit.colour}
          empty="(default)"
          options={Colours}
          onChange={(colour) => update({ colour })}
        />
        <EnumInput
          label="Size"
          value={unit.size}
          options={Sizes}
          onChange={(size) => update({ size })}
        />
      </tbody>
    </table>
  );
}

function MapDetails({
  plan,
  selection,
  setPlan,
}: {
  plan: BattlePlan;
  selection?: coord;
  setPlan: BattlePlanUpdater;
}) {
  const unit = selection && unitAt(plan, ...selection);

  return (
    <div className="MapDetails">
      <MapSettings plan={plan} setPlan={setPlan} />
      {unit && <UnitSettings plan={plan} setPlan={setPlan} unit={unit} />}
    </div>
  );
}

function MapCode({ plan }: { plan: BattlePlan }) {
  const lines = convertToUvar(plan);

  return <div className="MapCode">{lines}</div>;
}

export default function MapPlanner() {
  const [plan, setPlan] = useState<BattlePlan>({
    name: "name",
    width: 5,
    height: 5,
    units: [],
  });

  const [selection, setSelection] = useState<coord>();
  function select(x: number, y: number) {
    const current = selection && unitAt(plan, ...selection);

    const unit = unitAt(plan, x, y);
    if (!unit)
      setPlan({
        ...plan,
        units: [
          ...plan.units,
          {
            x,
            y,
            size: "M",
            label: current?.label || "",
            type: current?.type || "",
          },
        ],
      });

    setSelection([x, y]);
  }

  return (
    <div className="MapPlanner">
      <MapView onClick={select} plan={plan} />
      <MapDetails plan={plan} setPlan={setPlan} selection={selection} />
      <MapCode plan={plan} />
    </div>
  );
}
