export const ColourValues = {
  w: "white",
  k: "black",
  e: "grey",
  r: "red",
  g: "green",
  b: "blue",
  y: "yellow",
  p: "purple",
  c: "cyan",
  n: "brown",
  o: "orange",
  pk: "pink",
};
type ColourName = keyof typeof ColourValues;
export const Colours = Object.keys(ColourValues) as ColourName[];
export const LightColours = ["w", "y", "c", "pk"] as ColourName[];

export const Sizes = ["T", "S", "M", "L", "H", "G"];

export interface Unit {
  label: string;
  type: string;
  x: number;
  y: number;
  colour?: ColourName;
  size: string;
}

export default interface BattlePlan {
  name: string;
  width: number;
  height: number;
  units: Unit[];
}
