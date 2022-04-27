import { useCallback, useState } from "react";
import tinycolor2 from "tinycolor2";

import { columnLabel, deg, en, lerp, XY } from "./tools";
import BattlePlan, {
  CircleOverlay,
  ColourName,
  ColourValues,
  ConeOverlay,
  LightColours,
  LineOverlay,
  Overlay,
  SquareOverlay,
  Unit,
  Wall,
} from "./types/BattlePlan";

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
  onMouseDown,
  onMouseUp,
  image,
  plan,
  selected,
  unit: u,
}: {
  onClick?: (x: number, y: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  image?: string;
  plan: BattlePlan;
  selected: boolean;
  unit: Unit;
}) {
  const [hover, setHover] = useState(false);

  const size = plan.gridsize || 40;
  const colour = u.colour || "r";
  const cvalue = ColourValues[colour];
  const scale = sizeLookup[u.size];
  const ssize = scale * size;
  const x = (u.x + Math.max(scale, 0.5)) * size;
  const y = (u.y + Math.max(scale, 0.5)) * size;
  const click = useCallback(() => {
    if (onClick) onClick(u.x, u.y);
  }, [onClick, u.x, u.y]);
  const mouseDown = useCallback(() => {
    if (onMouseDown) onMouseDown();
  }, [onMouseDown]);
  const mouseUp = useCallback(() => {
    if (onMouseUp) onMouseUp();
  }, [onMouseUp]);

  const mouseOver = useCallback(() => setHover(true), []);
  const mouseOut = useCallback(() => setHover(false), []);

  return image ? (
    <g className="unit" onMouseOver={mouseOver} onMouseOut={mouseOut}>
      <circle cx={x} cy={y} r={ssize} fill={cvalue} />
      <circle
        cx={x}
        cy={y}
        r={ssize}
        stroke={cvalue}
        strokeWidth={hover || selected ? 4 : 1}
        fill={`url(#img${u.label})`}
        onClick={click}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
      />
    </g>
  ) : (
    <g className="unit" onMouseOver={mouseOver} onMouseOut={mouseOut}>
      <circle
        cx={x}
        cy={y}
        r={ssize}
        stroke="black"
        strokeWidth={hover || selected ? 4 : 1}
        fill={cvalue}
        onClick={click}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
      />
      {colour !== "w" && (
        <circle
          cx={x}
          cy={y}
          r={ssize - 1}
          stroke="white"
          fill="transparent"
          onClick={click}
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
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

function MeasureLine({
  scale,
  size,
  source,
  target,
}: {
  scale: number;
  size: number;
  source: XY;
  target: XY;
}) {
  const [sx, sy] = source;
  const [tx, ty] = target;
  const h = size / 2;

  const dx = sx - tx;
  const dy = sy - ty;
  const distance = scale * Math.sqrt(dx * dx + dy * dy);

  const x1 = sx * size + h;
  const y1 = sy * size + h;
  const x2 = tx * size + h;
  const y2 = ty * size + h;

  return distance ? (
    <g pointerEvents="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="green" strokeWidth={3} />
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size / 3}
      >
        {distance.toFixed(1)} ft.
      </text>
    </g>
  ) : null;
}

function getColourPair(c?: ColourName) {
  const solid = ColourValues[c || "r"];
  const fade = tinycolor2(solid).setAlpha(0.5).toHex8String();

  return [solid, fade];
}

type OverlayArgs<T> = { nscale(n: number): number; o: T; size: number };

function MapCircleOverlay({ nscale, o, size }: OverlayArgs<CircleOverlay>) {
  const [stroke, fill] = getColourPair(o.colour);
  const h = size / 2;

  const x1 = o.sx * size + h;
  const y1 = o.sy * size + h;

  return (
    <circle
      pointerEvents="none"
      stroke={stroke}
      fill={fill}
      cx={x1}
      cy={y1}
      r={nscale(o.diameter)}
    />
  );
}

function MapConeOverlay({ nscale, o, size }: OverlayArgs<ConeOverlay>) {
  const [stroke, fill] = getColourPair(o.colour);
  const h = size / 2;

  const sx = o.sx * size + h;
  const sy = o.sy * size + h;
  const ex = o.ex * size + h;
  const ey = o.ey * size + h;
  const angle = Math.atan2(ey - sy, ex - sx);
  const length = nscale(o.length) / size;
  const xm = Math.cos(angle);
  const ym = Math.sin(angle);
  const xmod = xm * h;
  const ymod = ym * h;

  const points = [
    [0, 0],
    [length, length / -2],
    [length, length / 2],
    [0, 0],
  ]
    .map(([x, y]) => `${sx + x * size},${sy + y * size}`)
    .join(" ");

  return (
    <polyline
      points={points}
      pointerEvents="none"
      stroke={stroke}
      fill={fill}
      transform={`rotate(${deg(angle)} ${sx + xmod} ${sy + ymod})`}
    />
  );
}

function MapLineOverlay({
  nscale,
  o,
  size,
}: OverlayArgs<LineOverlay | SquareOverlay>) {
  const [stroke, fill] = getColourPair(o.colour);
  const h = size / 2;

  const x1 = o.sx * size + h;
  const y1 = o.sy * size + h;
  const x2 = o.ex * size + h;
  const y2 = o.ey * size + h;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const xmod = Math.cos(angle) * h;
  const ymod = Math.sin(angle) * h;
  const height = nscale(o.type === "line" ? o.width || 10 : o.size);

  return (
    <rect
      pointerEvents="none"
      stroke={stroke}
      fill={fill}
      x={x1 + xmod}
      y={y1 + ymod - height / 2}
      width={nscale(o.type === "line" ? o.length : o.size)}
      height={height}
      transform={`rotate(${deg(angle)} ${x1 + xmod} ${y1 + ymod})`}
    />
  );
}

function MapOverlay({
  overlay: o,
  scale,
  size,
}: {
  overlay: Overlay;
  scale: number;
  size: number;
}) {
  const cvalue = ColourValues[o.colour || "r"];
  const h = size / 2;

  const x1 = o.sx * size + h;
  const y1 = o.sy * size + h;
  let x2 = 0;
  let y2 = 0;

  if ("ex" in o) {
    x2 = o.ex * size + h;
    y2 = o.ey * size + h;
  }

  function nscale(n: number) {
    return (n * size) / scale;
  }

  switch (o.type) {
    case "arrow":
      // TODO
      return (
        <line
          pointerEvents="none"
          stroke={cvalue}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      );

    case "circle":
      return <MapCircleOverlay nscale={nscale} o={o} size={size} />;

    case "cone":
      return <MapConeOverlay nscale={nscale} o={o} size={size} />;

    case "line":
    case "square":
      return <MapLineOverlay nscale={nscale} o={o} size={size} />;
  }
}

export function MapView({
  onAdd,
  onMove,
  onSelect,
  images,
  plan,
  selected,
}: {
  onAdd?: (x: number, y: number) => void;
  onMove?: (i: number, x: number, y: number) => void;
  onSelect?: (i: number) => void;
  images?: Record<string, string>;
  plan: BattlePlan;
  selected?: number;
}): JSX.Element {
  const size = plan.gridsize || 40;
  const sx = plan.width * size;
  const sy = plan.height * size;
  const padx = (plan.width + 2) * size;
  const pady = (plan.height + 2) * size;

  const [drag, setDrag] = useState<number>();
  const [source, setSource] = useState<XY>();
  const [target, setTarget] = useState<XY>();

  const add = useCallback(
    (x: number, y: number) => () => {
      if (onAdd && drag === undefined) onAdd(x, y);
    },
    [drag, onAdd]
  );

  const select = useCallback(
    (i: number) => () => {
      if (onSelect) onSelect(i);
    },
    [onSelect]
  );

  const over = useCallback(
    (x: number, y: number) => () => setTarget([x, y]),
    []
  );

  const startDrag = useCallback(
    (i: number) => () => {
      const u = plan.units[i];
      setDrag(i);
      setSource([u.x, u.y]);
    },
    [plan.units]
  );

  const endDrag = useCallback(
    (x: number, y: number) => () => {
      if (drag !== undefined && onMove) {
        onMove(drag, x, y);
        setDrag(undefined);
        setSource(undefined);
      }
    },
    [drag, onMove]
  );

  return (
    <svg
      className="MapView"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMin"
      viewBox={`${-size} ${-size} ${padx} ${pady}`}
    >
      <defs>
        {images &&
          Object.entries(images).map(([name, url]) => (
            <pattern
              key={"img" + name}
              id={"img" + name}
              width="100%"
              height="100%"
              patternContentUnits="objectBoundingBox"
            >
              <image width={1} height={1} xlinkHref={url} />
            </pattern>
          ))}
      </defs>
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
      {plan.bg && (
        <image xlinkHref={plan.bg} x={plan.bgx || 0} y={plan.bgy || 0} />
      )}
      <g stroke="grey" fill="transparent">
        {en(plan.width).map((x) =>
          en(plan.height).map((y) => (
            <rect
              key={`${x},${y}`}
              x={size * x}
              y={size * y}
              width={size}
              height={size}
              onClick={add(x, y)}
              onMouseOver={over(x, y)}
              onMouseUp={endDrag(x, y)}
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
      {/* TODO: clip to battlefield */}
      <g>
        {plan.overlays
          .filter((o) => o.under)
          .map((o, i) => (
            <MapOverlay key={`under${i}`} overlay={o} scale={5} size={size} />
          ))}
        {plan.walls.map((w, i) => (
          <MapLine key={"w" + i} plan={plan} wall={w} />
        ))}
        {plan.units.map((u, i) => (
          <MapUnit
            key={"u" + i}
            onClick={select(i)}
            onMouseDown={startDrag(i)}
            onMouseUp={endDrag(u.x, u.y)}
            plan={plan}
            selected={selected === i}
            unit={u}
            image={images && images[u.label]}
          />
        ))}
        {plan.overlays
          .filter((o) => !o.under)
          .map((o, i) => (
            <MapOverlay key={`over${i}`} overlay={o} scale={5} size={size} />
          ))}
      </g>
      {source && target && (
        <MeasureLine scale={5} size={size} source={source} target={target} />
      )}
    </svg>
  );
}
