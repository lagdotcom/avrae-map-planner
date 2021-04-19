import "./MapPlanner.scss";

import React, { useState } from "react";

import BattlePlan, {
  Colours,
  ColourValues,
  LightColours,
  Sizes,
  Unit,
} from "./BattlePlan";
import {
  columnLabel,
  convertFromUVar,
  convertToBPlan,
  convertToUvar,
  en,
  getOTFBMUrl,
  unitAt,
} from "./tools";

type XY = [x: number, y: number];
type BattlePlanUpdater = React.Dispatch<React.SetStateAction<BattlePlan>>;

const sizeLookup: { [size: string]: number } = {
  T: 0.3,
  S: 0.45,
  M: 0.5,
  L: 1,
  H: 1.5,
  G: 2,
};
function MapUnit({
  onClick,
  plan,
  unit: u,
}: {
  onClick: (x: number, y: number) => void;
  plan: BattlePlan;
  unit: Unit;
}) {
  const size = plan.gridsize || 40;
  const colour = u.colour || "r";
  const scale = sizeLookup[u.size];
  const ssize = scale * size;
  const x = (u.x + Math.max(scale, 0.5)) * size;
  const y = (u.y + Math.max(scale, 0.5)) * size;

  return (
    <g onClick={() => onClick(u.x, u.y)}>
      <circle
        cx={x}
        cy={y}
        r={ssize - 2}
        stroke="black"
        fill={ColourValues[colour]}
        pointerEvents="none"
      />
      {colour !== "w" && (
        <circle
          cx={x}
          cy={y}
          r={ssize - 3}
          stroke="white"
          fill="transparent"
          pointerEvents="none"
        />
      )}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={LightColours.includes(colour) ? "black" : "white"}
        fontSize={ssize * 0.6}
        pointerEvents="none"
      >
        {u.label}
      </text>
    </g>
  );
}

function MapView({
  onClick,
  plan,
}: {
  onClick: (x: number, y: number) => void;
  plan: BattlePlan;
}) {
  const size = plan.gridsize || 40;
  const sx = plan.width * size;
  const sy = plan.height * size;
  const padx = (plan.width + 2) * size;
  const pady = (plan.height + 2) * size;

  return (
    <svg
      className="MapView"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${-size} ${-size} ${padx} ${pady}`}
    >
      <g>
        {en(plan.width).map((x) => (
          <text
            key={"col" + x}
            x={size * (x + 0.5)}
            y="-20"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {columnLabel(x)}
          </text>
        ))}
        {en(plan.height).map((y) => (
          <text
            key={"row" + y}
            x="-20"
            y={size * (y + 0.5)}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {y + 1}
          </text>
        ))}
      </g>
      <g stroke="grey" fill="white">
        {en(plan.width).map((x) =>
          en(plan.height).map((y) => (
            <rect
              key={`${x},${y}`}
              x={size * x}
              y={size * y}
              width={size}
              height={size}
              onClick={() => onClick(x, y)}
            />
          ))
        )}
      </g>
      <rect
        x="0"
        y="0"
        width={sx}
        height={sy}
        stroke="black"
        strokeWidth="2"
        fill="transparent"
        pointerEvents="none"
      />
      {plan.units.map((u, i) => (
        <MapUnit key={"u" + i} onClick={onClick} plan={plan} unit={u} />
      ))}
    </svg>
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
        <TextInput
          label="BG"
          value={plan.bg || ""}
          onChange={(bg) => setPlan({ ...plan, bg })}
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
      <button onClick={del}>Delete</button>
      <table>
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
    </div>
  );
}

function MapDetails({
  plan,
  selection,
  setPlan,
}: {
  plan: BattlePlan;
  selection?: XY;
  setPlan: BattlePlanUpdater;
}) {
  const unit = selection && unitAt(plan, ...selection);

  return (
    <div className="MapDetails">
      <button onClick={() => window.open(getOTFBMUrl(plan))}>Test</button>
      <MapSettings plan={plan} setPlan={setPlan} />
      {unit && <UnitSettings plan={plan} setPlan={setPlan} unit={unit} />}
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
    units: [],
    walls: [],
  });

  const [selection, setSelection] = useState<XY>();
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
            size: current?.size || "M",
            label: current?.label || "",
            type: current?.type || "",
            colour: current?.colour,
          },
        ],
      });

    setSelection([x, y]);
  }

  function parse(s: string) {
    const stripped = s.startsWith("!uvar Battles ") ? s.substr(14) : s;
    setPlan(convertFromUVar(stripped));
  }

  return (
    <div className="MapPlanner">
      <MapView onClick={select} plan={plan} />
      <MapDetails plan={plan} setPlan={setPlan} selection={selection} />
      <MapCode onChange={parse} plan={plan} uvar={true} />
    </div>
  );
}
