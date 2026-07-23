import { Waves } from "lucide-react";
import { Label } from "./Label";
import { SurfHeightCard } from "./SurfHeightCard";

export const ConditionCard = ({ conditions }) => (
  <section className="card condition-card bg-[#ECF9F0] px-6 pb-6 pt-5 text-[#2D834B]">
    <Label icon={Waves}>Surf Conditions</Label>
    <SurfHeightCard condition={conditions.condition} waterTemp={conditions.waterTemp} tide={conditions.tide} />
  </section>
);
