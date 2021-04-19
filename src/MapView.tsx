import React, { useState } from "react";

import BattlePlan, {
  ColourValues,
  LightColours,
  Unit,
  Wall,
} from "./BattlePlan";
import { columnLabel, en, lerp } from "./tools";

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
  selected,
  unit: u,
}: {
  onClick: (x: number, y: number) => void;
  plan: BattlePlan;
  selected: boolean;
  unit: Unit;
}) {
  const [hover, setHover] = useState(false);

  const size = plan.gridsize || 40;
  const colour = u.colour || "r";
  const scale = sizeLookup[u.size];
  const ssize = scale * size;
  const x = (u.x + Math.max(scale, 0.5)) * size;
  const y = (u.y + Math.max(scale, 0.5)) * size;
  const click = () => onClick(u.x, u.y);

  return (
    <g
      className="unit"
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <circle
        cx={x}
        cy={y}
        r={ssize - 2}
        stroke="black"
        strokeWidth={hover || selected ? 4 : 1}
        fill={ColourValues[colour]}
        onClick={click}
      />
      {colour !== "w" && (
        <circle
          cx={x}
          cy={y}
          r={ssize - 3}
          stroke="white"
          fill="transparent"
          onClick={click}
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

function getMiddle(wall: Wall, diff = 0.5) {
  const dx = wall.sx - wall.ex;
  const dy = wall.sy - wall.ey;
  const len = Math.sqrt(dx * dx + dy * dy);
  const p1 = (len - diff) / 2;
  const p2 = (len + diff) / 2;
  const x1 = lerp(wall.sx, wall.ex, p1 / len);
  const y1 = lerp(wall.sy, wall.ey, p1 / len);
  const x2 = lerp(wall.sx, wall.ex, p2 / len);
  const y2 = lerp(wall.sy, wall.ey, p2 / len);
  const xm = lerp(wall.sx, wall.ex, 0.5);
  const ym = lerp(wall.sy, wall.ey, 0.5);

  return { x1, y1, x2, y2, xm, ym };
}

function MapWall({ plan, wall }: { plan: BattlePlan; wall: Wall }) {
  const size = plan.gridsize || 40;

  return (
    <line
      x1={wall.sx * size}
      y1={wall.sy * size}
      x2={wall.ex * size}
      y2={wall.ey * size}
      stroke={ColourValues[wall.colour || "k"]}
      strokeWidth={2}
    />
  );
}

function MapOpenDoor({ plan, wall }: { plan: BattlePlan; wall: Wall }) {
  const size = plan.gridsize || 40;
  const { x1, y1, x2, y2 } = getMiddle(wall);

  return (
    <>
      <line
        x1={wall.sx * size}
        y1={wall.sy * size}
        x2={wall.ex * size}
        y2={wall.ey * size}
        stroke={ColourValues[wall.colour || "k"]}
        strokeWidth={2}
      />
      <line
        x1={x1 * size}
        y1={y1 * size}
        x2={x2 * size}
        y2={y2 * size}
        stroke="white"
        strokeWidth={3}
      />
    </>
  );
}

function MapClosedDoor({ plan, wall }: { plan: BattlePlan; wall: Wall }) {
  const size = plan.gridsize || 40;
  const stroke = ColourValues[wall.colour || "k"];
  const { x1, y1, x2, y2 } = getMiddle(wall);

  return (
    <>
      <line
        x1={wall.sx * size}
        y1={wall.sy * size}
        x2={wall.ex * size}
        y2={wall.ey * size}
        stroke={stroke}
        strokeWidth={2}
      />
      <line
        x1={x1 * size}
        y1={y1 * size}
        x2={x2 * size}
        y2={y2 * size}
        stroke={stroke}
        strokeWidth={6}
      />
      <line
        x1={x1 * size}
        y1={y1 * size}
        x2={x2 * size}
        y2={y2 * size}
        stroke="white"
        strokeWidth={4}
      />
    </>
  );
}

function MapDoubleDoor({ plan, wall }: { plan: BattlePlan; wall: Wall }) {
  const size = plan.gridsize || 40;
  const stroke = ColourValues[wall.colour || "k"];
  const { x1, y1, x2, y2 } = getMiddle(wall, 0.6);
  const { x1: x3, y1: y3, x2: x4, y2: y4 } = getMiddle(wall, 0.05);

  return (
    <>
      <line
        x1={wall.sx * size}
        y1={wall.sy * size}
        x2={wall.ex * size}
        y2={wall.ey * size}
        stroke={stroke}
        strokeWidth={2}
      />
      <line
        x1={x1 * size}
        y1={y1 * size}
        x2={x2 * size}
        y2={y2 * size}
        stroke={stroke}
        strokeWidth={6}
      />
      <line
        x1={x1 * size}
        y1={y1 * size}
        x2={x3 * size}
        y2={y3 * size}
        stroke="white"
        strokeWidth={4}
      />
      <line
        x1={x2 * size}
        y1={y2 * size}
        x2={x4 * size}
        y2={y4 * size}
        stroke="white"
        strokeWidth={4}
      />
    </>
  );
}

function MapSecretDoor({ plan, wall }: { plan: BattlePlan; wall: Wall }) {
  const size = plan.gridsize || 40;
  const stroke = ColourValues[wall.colour || "k"];
  const { xm, ym } = getMiddle(wall);

  return (
    <>
      <MapOpenDoor plan={plan} wall={wall} />
      <text
        x={xm * size}
        y={ym * size}
        textAnchor="middle"
        dominantBaseline="central"
        stroke={stroke}
        strokeWidth={2}
        pointerEvents="none"
      >
        S
      </text>
    </>
  );
}

function MapLine({ plan, wall }: { plan: BattlePlan; wall: Wall }) {
  switch (wall.door) {
    case "o":
      return <MapOpenDoor plan={plan} wall={wall} />;
    case "d":
      return <MapClosedDoor plan={plan} wall={wall} />;
    case "s":
      return <MapSecretDoor plan={plan} wall={wall} />;
    case "b":
      return <MapDoubleDoor plan={plan} wall={wall} />;
    default:
      return <MapWall plan={plan} wall={wall} />;
  }
}

export function MapView({
  onAdd,
  onSelect,
  plan,
  selected,
}: {
  onAdd: (x: number, y: number) => void;
  onSelect: (i: number) => void;
  plan: BattlePlan;
  selected?: number;
}): JSX.Element {
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
              onClick={() => onAdd(x, y)}
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
      {plan.walls.map((w, i) => (
        <MapLine key={"w" + i} plan={plan} wall={w} />
      ))}
      {plan.units.map((u, i) => (
        <MapUnit
          key={"u" + i}
          onClick={() => onSelect(i)}
          plan={plan}
          selected={selected === i}
          unit={u}
        />
      ))}
    </svg>
  );
}
