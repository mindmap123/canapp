import { Card } from "@/components/ui/card";
import { DepthType } from "@shared/schema";

interface DepthSelectorProps {
  value: DepthType | null;
  onChange: (value: DepthType) => void;
}

const depthOptions: { value: DepthType; label: string; description: string }[] = [
  { value: "shallow", label: "Pas profonde", description: "75-85 cm" },
  { value: "standard", label: "Standard", description: "85-95 cm" },
  { value: "lounge", label: "Lounge", description: "95+ cm" },
];

export default function DepthSelector({ value, onChange }: DepthSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-base font-medium">Profondeur</label>
      <div className="grid grid-cols-3 gap-3">
        {depthOptions.map((option) => (
          <Card
            key={option.value}
            className={`cursor-pointer transition-all duration-200 hover-elevate active-elevate-2 ${
              value === option.value ? "ring-2 ring-primary border-primary" : ""
            }`}
            onClick={() => onChange(option.value)}
            data-testid={`card-depth-${option.value}`}
          >
            <div className="p-4 text-center space-y-1">
              <div className={`font-semibold text-sm ${
                value === option.value ? "text-primary" : "text-foreground"
              }`}>
                {option.label}
              </div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
