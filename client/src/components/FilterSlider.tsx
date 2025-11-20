import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface FilterSliderProps {
  label: string;
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

export default function FilterSlider({
  label,
  value,
  onValueChange,
  min,
  max,
  step = 1,
  unit = "",
  formatValue,
}: FilterSliderProps) {
  const displayValue = formatValue ? formatValue(value[0]) : `${value[0]}${unit}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label}</Label>
        <span className="text-lg font-semibold text-primary">{displayValue}</span>
      </div>
      <Slider
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer"
        data-testid={`slider-${label.toLowerCase().replace(/\s+/g, "-")}`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
