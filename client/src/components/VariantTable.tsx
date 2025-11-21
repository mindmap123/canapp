import { Variant } from "@shared/domain";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VariantTableProps {
  variants: Variant[];
  value: string;
  onChange: (variantId: string) => void;
  entryPriceResolver: (variant: Variant) => number | undefined;
}

const variantLabels: Record<string, string> = {
  "2p": "2 places",
  "3p": "3 places",
  angle: "Angle",
  meridienne: "Méridienne",
  pouf: "Pouf",
  fauteuil: "Fauteuil",
};

export function VariantTable({ variants, value, onChange, entryPriceResolver }: VariantTableProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Variantes</h3>
          <p className="text-sm text-muted-foreground">Choisissez la configuration</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2 px-2">Variante</th>
              <th className="text-left py-2 px-2">Dimensions</th>
              <th className="text-left py-2 px-2">Prix d’entrée</th>
              <th className="text-right py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => {
              const price = entryPriceResolver(variant);
              const isActive = value === variant.id;
              return (
                <tr key={variant.id} className="border-b last:border-0">
                  <td className="py-3 px-2 font-semibold">
                    {variantLabels[variant.variantType] ?? variant.label}
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">
                    L {variant.dimensions.width} × P {variant.dimensions.depth} × H {variant.dimensions.height} cm
                  </td>
                  <td className="py-3 px-2 font-medium">
                    {price ? `${price.toLocaleString("fr-FR")}€` : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Button
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => onChange(variant.id)}
                    >
                      {isActive ? "Sélectionné" : "Sélectionner"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
