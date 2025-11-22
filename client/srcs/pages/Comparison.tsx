import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import { useSelection } from "@/lib/selectionContext";
import { fetchFamilies, fetchFabricCategories } from "@/lib/api";
import { ArrowLeft, X } from "lucide-react";
import { AvailabilityType } from "@/components/AvailabilityBadge";
import { ProductFamily, Variant } from "@shared/domain";

export default function Comparison() {
  const [, setLocation] = useLocation();
  const { selectedIds, removeFromSelection } = useSelection();

  const { data: families, isLoading } = useQuery({
    queryKey: ["families"],
    queryFn: fetchFamilies,
  });

  const { data: categories } = useQuery({
    queryKey: ["fabric-categories"],
    queryFn: fetchFabricCategories,
  });

  const selectedVariants: Variant[] =
    families
      ?.flatMap((f) => f.variants)
      .filter((v) => selectedIds.includes(v.id)) ?? [];

  const lookupFamily = (variant: Variant): ProductFamily | undefined =>
    families?.find((f) => f.variants.some((v) => v.id === variant.id));

  const getAvailability = (variant: Variant): AvailabilityType[] => {
    const availability: AvailabilityType[] = [];
    const states = variant.availability.map((a) => a.state);
    if (states.includes("expo")) availability.push("store");
    if (states.includes("stock")) availability.push("stock");
    if (states.includes("commande")) availability.push("order");
    if (states.includes("instock_stores")) availability.push("instock_stores");
    return availability;
  };

  const variantPrice = (variant: Variant) => {
    if (!categories) return undefined;
    const match = categories.find((c) => variant.fabricPricing[c.id] !== undefined);
    return match ? variant.fabricPricing[match.id] : undefined;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/catalog")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[600px] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedVariants.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Aucun produit sélectionné</h1>
          <Button onClick={() => setLocation("/catalog")}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/catalog")}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Comparaison</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedVariants.length} modèles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedVariants.map((variant) => {
            const family = lookupFamily(variant);
            const price = variantPrice(variant);
            return (
              <Card key={variant.id} className="overflow-hidden" data-testid={`card-comparison-${variant.id}`}>
                <div className="relative">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={variant.gallery[0]?.url || "/api/images/beige_modern_fixed_sofa.png"}
                      alt={family?.name ?? "Sofa"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 rounded-full"
                    onClick={() => removeFromSelection(variant.id)}
                    data-testid={`button-remove-${variant.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{family?.name}</h3>
                      <Badge variant="outline" className="capitalize ml-2">
                        {variant.variantType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getAvailability(variant).map((av) => (
                        <AvailabilityBadge key={av} type={av} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 py-3 border-y">
                    <span className="text-3xl font-bold">
                      {price ? price.toLocaleString("fr-FR") : "—"}€
                    </span>
                    <span className="text-sm text-muted-foreground">TTC</span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Dimensions
                      </div>
                      <div>
                        L {variant.dimensions.width ?? "—"} × P {variant.dimensions.depth ?? "—"} × H {variant.dimensions.height ?? "—"} cm
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">
                        Collection
                      </div>
                      <div>{family?.collectionName ?? "—"}</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation(`/product/local/${family?.id}`)}
                    data-testid={`button-view-details-${variant.id}`}
                  >
                    Voir détails
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
