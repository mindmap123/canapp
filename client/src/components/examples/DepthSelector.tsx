import { useState } from "react";
import DepthSelector from "../DepthSelector";
import { DepthType } from "@shared/schema";

export default function DepthSelectorExample() {
  const [depth, setDepth] = useState<DepthType | null>("standard");

  return (
    <div className="p-8 max-w-2xl">
      <DepthSelector value={depth} onChange={setDepth} />
    </div>
  );
}
