import { useMemo } from "react";
import { LegColor, LegConfig, LegType } from "@shared/domain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LegSelectorProps {
  legs: LegConfig[];
  legTypes: LegType[];
  legColors: LegColor[];
  value: LegConfig | null;
  onChange: (config: LegConfig) => void;
}

export function LegSelector({ legs, legTypes, legColors, value, onChange }: LegSelectorProps) {
  const defaultOption = legs.find((o) => o.isDefault) ?? legs[0];
  const current = value ?? defaultOption;

  const availableTypes = useMemo(() => {
    const ids = Array.from(new Set(legs.map((o) => o.legTypeId)));
    return legTypes.filter((t) => ids.includes(t.id));
  }, [legs, legTypes]);

  const availableColors = useMemo(() => {
    const ids = Array.from(new Set(legs.map((o) => o.colorId)));
    return legColors.filter((c) => ids.includes(c.id));
  }, [legs, legColors]);

  const selectedType = legTypes.find((t) => t.id === current.legTypeId);
  const selectedColor = legColors.find((c) => c.id === current.colorId);
  const priceDelta = current.deltaPrice ?? 0;

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pieds</h3>
          <p className="text-sm text-muted-foreground">Type et coloris compatibles</p>
        </div>
        {priceDelta > 0 && (
          <Badge variant="outline" className="text-primary border-primary/30">
            +{priceDelta.toLocaleString("fr-FR")}€
          </Badge>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {legs.map((option) => {
          const type = availableTypes.find((t) => t.id === option.legTypeId);
          const color = availableColors.find((c) => c.id === option.colorId);
          if (!type || !color) return null;
          const active = current.legTypeId === option.legTypeId && current.colorId === option.colorId;
          return (
            <button
              key={`${option.legTypeId}-${option.colorId}`}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition hover-elevate ${
                active ? "border-primary bg-primary/5" : "border-card-border"
              }`}
              onClick={() => onChange(option)}
            >
              {type.iconSvgUrl ? (
                <img
                  src={type.iconSvgUrl}
                  alt={type.name}
                  className="w-12 h-12 rounded-lg border object-contain bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg border bg-muted" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{type.name}</div>
                <div className="text-xs text-muted-foreground">{color.name}</div>
                {option.deltaPrice ? (
                  <div className="text-xs text-primary mt-1">+{option.deltaPrice.toLocaleString("fr-FR")}€</div>
                ) : (
                  <div className="text-xs text-muted-foreground mt-1">Inclus</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
