import { Unit } from "./BattlePlan";

export default interface VTTUnit extends Unit {
  initiative: number;
}

export type PersistentVTTUnit = Omit<VTTUnit, "x" | "y" | "initiative">;
