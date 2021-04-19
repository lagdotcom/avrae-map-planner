export const ColourValues = {
  w: "white",
  k: "black",
  e: "grey",
  r: "#f33",
  g: "#3c6",
  b: "#37b",
  y: "#fd8",
  p: "#c6a",
  c: "skyblue",
  n: "#422",
  o: "#f80",
  pk: "#fce",
};
export type ColourName = keyof typeof ColourValues;
export const Colours = Object.keys(ColourValues) as ColourName[];
export const LightColours = ["w", "g", "y", "c", "o", "pk"] as ColourName[];

export const Sizes = ["T", "S", "M", "L", "H", "G"];

export interface Unit {
  label: string;
  type: string;
  x: number;
  y: number;
  colour?: ColourName;
  size: string;
  token?: string;
  noface?: boolean;
}

export const DoorTypes = {
  o: "open",
  d: "closed",
  b: "double",
  s: "secret",
};
export type DoorType = keyof typeof DoorTypes;
export const Doors = Object.keys(DoorTypes) as DoorType[];

export interface Wall {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  colour?: ColourName;
  door?: DoorType;
}

export default interface BattlePlan {
  name: string;
  width: number;
  height: number;
  units: Unit[];
  bg?: string;
  bgx?: number;
  bgy?: number;
  startx?: number;
  starty?: number;
  gridsize?: number;
  walls: Wall[];
}
