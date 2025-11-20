import { useState } from "react";
import FilterSlider from "../FilterSlider";

export default function FilterSliderExample() {
  const [width, setWidth] = useState([200]);
  const [budget, setBudget] = useState([2000]);

  return (
    <div className="space-y-8 p-8 max-w-md">
      <FilterSlider
        label="Largeur max"
        value={width}
        onValueChange={setWidth}
        min={120}
        max={300}
        step={10}
        unit=" cm"
      />
      <FilterSlider
        label="Budget"
        value={budget}
        onValueChange={setBudget}
        min={500}
        max={5000}
        step={100}
        formatValue={(v) => `${v.toLocaleString("fr-FR")}€`}
      />
    </div>
  );
}
