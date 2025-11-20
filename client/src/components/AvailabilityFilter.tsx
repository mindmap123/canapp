import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Package, Clock } from "lucide-react";

interface AvailabilityFilterProps {
  value: {
    store: boolean;
    stock: boolean;
    order: boolean;
  };
  onChange: (value: { store: boolean; stock: boolean; order: boolean }) => void;
}

const availabilityOptions = [
  { key: "store" as const, label: "En magasin", icon: MapPin, colorClass: "text-availability-store" },
  { key: "stock" as const, label: "En stock", icon: Package, colorClass: "text-availability-stock" },
  { key: "order" as const, label: "Sur commande", icon: Clock, colorClass: "text-availability-order" },
];

export default function AvailabilityFilter({ value, onChange }: AvailabilityFilterProps) {
  return (
    <div className="space-y-3">
      <label className="text-base font-medium">Disponibilité</label>
      <div className="space-y-3">
        {availabilityOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div key={option.key} className="flex items-center space-x-3">
              <Checkbox
                id={`availability-${option.key}`}
                checked={value[option.key]}
                onCheckedChange={(checked) =>
                  onChange({ ...value, [option.key]: !!checked })
                }
                data-testid={`checkbox-availability-${option.key}`}
              />
              <Label
                htmlFor={`availability-${option.key}`}
                className="flex items-center gap-2 cursor-pointer font-normal"
              >
                <Icon className={`w-4 h-4 ${option.colorClass}`} />
                <span>{option.label}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
