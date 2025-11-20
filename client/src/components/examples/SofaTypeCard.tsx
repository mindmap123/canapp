import { useState } from "react";
import SofaTypeCard from "../SofaTypeCard";
import { SofaType } from "@shared/schema";

export default function SofaTypeCardExample() {
  const [selected, setSelected] = useState<SofaType>("fixe");

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
      <SofaTypeCard type="fixe" selected={selected === "fixe"} onClick={() => setSelected("fixe")} />
      <SofaTypeCard type="convertible" selected={selected === "convertible"} onClick={() => setSelected("convertible")} />
      <SofaTypeCard type="fauteuil" selected={selected === "fauteuil"} onClick={() => setSelected("fauteuil")} />
      <SofaTypeCard type="meridienne" selected={selected === "meridienne"} onClick={() => setSelected("meridienne")} />
    </div>
  );
}
