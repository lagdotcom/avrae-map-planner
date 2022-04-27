import BattlePlan from "./BattlePlan";
import VTTUnit from "./VTTUnit";

export default interface VTTPlan extends BattlePlan {
  units: VTTUnit[];
}
