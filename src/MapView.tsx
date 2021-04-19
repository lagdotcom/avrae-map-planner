import React, { useState } from "react";

import BattlePlan, {
  ColourValues,
  LightColours,
  Unit,
  Wall,
} from "./BattlePlan";
import { columnLabel, en } from "./tools";

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
        <MapWall key={"w" + i} plan={plan} wall={w} />
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
