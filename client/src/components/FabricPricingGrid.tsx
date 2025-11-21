import { FabricCategory, FabricPricing } from "@shared/domain";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FabricPricingGridProps {
  categories: FabricCategory[];
  pricing: FabricPricing;
}

export function FabricPricingGrid({ categories, pricing }: FabricPricingGridProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Tarifs tissus & cuirs</h3>
        <p className="text-sm text-muted-foreground">Vue rapide par catégorie</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {categories.map((cat) => (
                <th key={cat.id} className="py-2 text-center font-semibold">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="px-2 py-1 rounded-md hover:bg-muted transition">
                        {cat.code}
                      </TooltipTrigger>
                      <TooltipContent>{cat.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {categories.map((cat) => {
                const value = pricing[cat.code] ?? pricing[cat.id];
                return (
                  <td key={cat.id} className="py-3 text-center font-medium">
                    {typeof value === "number" ? `${value.toLocaleString("fr-FR")}€` : <span className="text-muted-foreground">—</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
