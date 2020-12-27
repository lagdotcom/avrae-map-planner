import BattlePlan, { Unit } from "./BattlePlan";

export function en(count: number) {
  return [...Array(count).keys()];
}

export function columnLabel(n: number) {
  var label = "";
  while (n || !label) {
    label += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[n % 26];
    n = Math.floor(n / 26);
  }

  return label;
}

export function cellLabel(x: number, y: number) {
  return columnLabel(x) + (y + 1);
}

export function unitAt(plan: BattlePlan, x: number, y: number) {
  return plan.units.find((u) => u.x === x && u.y === y);
}

function q(s: string) {
  if (s.includes(" ")) return `"${s}"`;
  return s;
}

function getMAdd(u: Unit) {
  const parts = [`!i madd ${q(u.type)}`];
  const notes = [`Location: ${cellLabel(u.x, u.y)}`];
  if (u.label) parts.push(`-name ${q(u.label)}`);
  if (u.colour) notes.push(`Color: ${u.colour}`);
  if (u.size !== "M") notes.push(`Size: ${u.size}`);

  if (notes.length) parts.push(`-note "${notes.join(" | ")}"`);
  return parts.join(" ");
}

export function convertToBPlan(plan: BattlePlan) {
  const cmds: string[] = [];
  const id = q(plan.name);
  cmds.push(
    `!bplan new ${id}`,
    `!bplan map ${id} set -mapsize ${plan.width}x${plan.height}`
  );
  cmds.push(...plan.units.map((u) => `!bplan add ${id} ${getMAdd(u)}`));

  return cmds;
}

export function convertToUvar(plan: BattlePlan) {
  const cmds: string[] = [];
  cmds.push(
    "!i add 100 DM -p",
    `!i effect DM map -attack "||Size: ${plan.width}x${plan.height}"`
  );
  cmds.push(...plan.units.map(getMAdd));

  return "!uvar Battles " + JSON.stringify({ [plan.name]: cmds });
}
