import BattlePlan, { ColourName, DoorType, Unit, Wall } from "./BattlePlan";

type StringDict = Record<string, string>;
export type XY = [x: number, y: number];

export function en(count: number): number[] {
  return Array.from(Array(count).keys());
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function columnLabel(n: number): string {
  let label = "";
  while (n || !label) {
    label += alphabet[n % 26];
    n = Math.floor(n / 26);
  }

  return label;
}

function parseColumnLabel(l: string) {
  let total = 0;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    const worth = alphabet.indexOf(ch);
    total = total * 26 + worth;
  }

  return total;
}

export function cell(x: number, y: number): string {
  return columnLabel(x) + (y + 1);
}

function parseCellLabel(l: string) {
  for (let i = 0; i < l.length; i++) {
    if ("0123456789".indexOf(l[i]) !== -1) {
      const col = l.substr(0, i).toUpperCase();
      const row = l.substr(i);

      return { x: parseColumnLabel(col), y: parseInt(row, 10) - 1 };
    }
  }

  return { x: 0, y: 0 };
}

export function unitAt(
  plan: BattlePlan,
  x: number,
  y: number
): Unit | undefined {
  return plan.units.find((u) => u.x === x && u.y === y);
}

function q(s: string) {
  if (s.includes(" ")) return `"${s}"`;
  return s;
}

function getMAdd(u: Unit) {
  const parts = [`!i madd ${q(u.type)}`];
  const notes = [`Location: ${cell(u.x, u.y)}`];
  if (u.label) parts.push(`-name ${q(u.label)}`);
  if (u.colour) notes.push(`Color: ${u.colour}`);
  if (u.size !== "M") notes.push(`Size: ${u.size}`);

  if (notes.length) parts.push(`-note "${notes.join(" | ")}"`);
  return parts.join(" ");
}

function getWall(w: Wall) {
  const start = cell(w.sx, w.sy);
  const end = cell(w.ex, w.ey);
  const door = w.door ? "-" + w.door : "";
  const color = w.colour ? "," + w.colour : "";

  return `!map -wall ${start}${door}${end}${color}`;
}

// TODO: don't actually know the syntax for this!
function getLoad(url: string) {
  return `!map -load ${url}`;
}

export function convertToBPlan(plan: BattlePlan): string[] {
  const mapArgs = [`-mapsize ${plan.width}x${plan.height}`];
  if (plan.bg) mapArgs.push(`-bg ${plan.bg}`);

  const id = q(plan.name);
  return [
    `!bplan new ${id}`,
    `!bplan map ${id} set ${mapArgs.join(" ")}`,
    ...plan.units.map((u) => `!bplan add ${id} ${getMAdd(u)}`),
    ...plan.walls.map((w) => `!bplan add ${id} ${getWall(w)}`),
    ...plan.loads.map((url) => `!bplan add ${id} ${getLoad(url)}`),
  ];
}

export function convertToUvar(plan: BattlePlan): string {
  const mapArgs = [`Size: ${plan.width}x${plan.height}`];
  if (plan.bg) mapArgs.push(`Background: ${plan.bg}`);

  return (
    "!uvar Battles " +
    JSON.stringify({
      [plan.name]: [
        "!i add 100 DM -p",
        `!i effect DM map -attack "||${mapArgs.join(" ~ ")}"`,
        ...plan.units.map(getMAdd),
        ...plan.walls.map(getWall),
        ...plan.loads.map(getLoad),
      ],
    })
  );
}

function splitCommand(line: string) {
  let command = "";
  const args: string[] = [];
  const switches: StringDict = {};
  let qmode = false;
  let smode = "";
  let current = "";

  function parseWord() {
    if (!command) command = current;
    else if (current[0] === "-") smode = current;
    else if (smode) {
      switches[smode.substr(1)] = current;
      smode = "";
    } else args.push(current);
    current = "";
  }

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (qmode) {
      if (ch === '"') qmode = false;
      else current += ch;
    } else {
      if (ch === '"') {
        qmode = true;
      } else if (ch === " ") {
        parseWord();
      } else {
        current += ch;
      }
    }
  }
  if (current) parseWord();

  return { command, args, switches };
}

function around(s: string, mid: string) {
  const i = s.indexOf(mid);
  const key = s.substr(0, i);
  const val = s.substr(i + mid.length);

  return [key, val];
}

function applyEffectCmd(plan: BattlePlan, switches: StringDict) {
  switches.attack
    .substr(2)
    .split(" ~ ")
    .forEach((arg) => {
      const [key, val] = around(arg, ": ");

      if (key === "Size") {
        const [width, height] = around(val, "x");
        plan.width = parseInt(width, 10);
        plan.height = parseInt(height, 10);
      } else if (key === "Background") {
        plan.bg = val;
      }
    });
}

function applyMAddCommand(
  plan: BattlePlan,
  args: string[],
  switches: StringDict
) {
  const type = args[1];
  const label = switches.name;
  let location = "";
  let colour = undefined;
  let size = "M";
  switches.note.split(" | ").forEach((arg) => {
    const [key, val] = around(arg, ": ");

    if (key === "Location") {
      location = val;
    } else if (key === "Color") {
      colour = val;
    } else if (key === "Size") {
      size = val;
    }
  });

  plan.units.push({
    type,
    label,
    colour,
    size,
    ...parseCellLabel(location),
  });
}

function addWall(plan: BattlePlan, data: string) {
  const parts = data.split("_");

  parts.forEach((part) => {
    const bits = /([A-Z]+\d+)(?:-(\w))?([A-Z]+\d+)(?:,(\w+))?/.exec(part);
    if (!bits) return;

    const [, start, door, end, color] = bits;
    const { x: sx, y: sy } = parseCellLabel(start);
    const { x: ex, y: ey } = parseCellLabel(end);

    const wall: Wall = { sx, sy, ex, ey };
    if (door) wall.door = door as DoorType;
    if (color) wall.colour = color as ColourName;
    plan.walls.push(wall);
  });
}

function addLoad(plan: BattlePlan, data: string) {
  plan.loads.push(data);
}

export function convertFromUVar(s: string): BattlePlan {
  const val: { [key: string]: string[] } = JSON.parse(s);
  const name = Object.keys(val)[0];
  const plan: BattlePlan = {
    name,
    width: 1,
    height: 1,
    zoom: 1,
    units: [],
    walls: [],
    loads: [],
    overlays: [],
  };
  val[name].forEach((line) => {
    const { command, args, switches } = splitCommand(line);
    if (["!i", "!init"].includes(command)) {
      switch (args[0]) {
        case "effect":
          applyEffectCmd(plan, switches);
          break;

        case "madd":
          applyMAddCommand(plan, args, switches);
          break;
      }
    } else if (command === "!map") {
      if (switches.wall) addWall(plan, switches.wall);
      if (switches.load) addLoad(plan, switches.load);
    }
  });

  return plan;
}

export function getOTFBMUrl(plan: BattlePlan): string {
  let url = "https://otfbm.io/";

  if (plan.startx || plan.starty)
    url += cell(plan.startx || 0, plan.starty || 0) + ":";
  url += `${plan.width}x${plan.height}`;
  if (plan.zoom !== 1) url += `/@${plan.zoom}`;
  if (plan.gridsize) url += `/@c${plan.gridsize}`;
  if (plan.bgx || plan.bgy) url += `/@o${plan.bgx || 0}:${plan.bgy || 0}`;

  if (plan.walls.length) {
    let cursor = "";
    let colour = "k";
    url += "/";
    plan.walls.forEach((w) => {
      const from = cell(w.sx, w.sy);
      if (w.colour && w.colour !== colour) {
        url += `_-c${w.colour}${from}`;
        colour = w.colour;
      } else if (from !== cursor) {
        url += "_" + from;
      }
      if (w.door) url += "-" + w.door;
      cursor = cell(w.ex, w.ey);
      url += cursor;
    });
  }

  plan.units.forEach((u) => {
    url += "/" + cell(u.x, u.y);
    if (u.size !== "M") url += u.size;
    url += u.colour || "r";
    if (u.label) url += "-" + u.label;
    if (u.token) {
      url += "~" + u.token;
      if (u.noface) url += "~";
    }
  });

  plan.overlays.forEach((o) => {
    url += "/*";
    if (o.under) url += "u";

    switch (o.type) {
      case "arrow":
        url += "a";
        if (o.colour) url += o.colour;
        url += cell(o.sx, o.sy);
        url += cell(o.ex, o.ey);
        break;

      case "circle":
        url += "c";
        if (o.topLeftAnchor) url += "t";
        url += o.diameter.toString();
        if (o.colour) url += o.colour;
        url += cell(o.sx, o.sy);
        break;

      case "cone":
        url += `t${o.length}`;
        if (o.colour) url += o.colour;
        url += cell(o.sx, o.sy);
        url += cell(o.ex, o.ey);
        break;

      case "line":
        url += `l${o.length}`;
        if (o.width) url += `,${o.width}`;
        if (o.colour) url += o.colour;
        url += cell(o.sx, o.sy);
        url += cell(o.ex, o.ey);
        break;

      case "square":
        url += "s";
        if (o.topLeftAnchor) url += "t";
        url += o.size.toString();
        if (o.colour) url += o.colour;
        url += cell(o.sx, o.sy);
        if (!o.topLeftAnchor) url += cell(o.ex, o.ey);
        break;
    }
  });

  const queries: string[] = [];
  if (plan.bg) queries.push("bg=" + plan.bg);
  plan.loads.forEach((data) => queries.push("load=" + data));

  if (queries.length) url += "?" + queries.join("&");
  return url;
}

export function lerp(a: number, b: number, r: number): number {
  return a * (1 - r) + b * r;
}

export function mod(n: number, x: number): number {
  while (n < 0) n += x;
  return n % x;
}

export function deg(rad: number): number {
  return (rad / (2 * Math.PI)) * 360;
}
