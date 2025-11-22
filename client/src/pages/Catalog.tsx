import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { useSelection } from "@/lib/selectionContext";
import { fetchFamilies, fetchFabricCategories } from "@/lib/api";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { AvailabilityType } from "@/components/AvailabilityBadge";
import { ProductFamily, Variant } from "@shared/domain";

export default function Catalog() {
  const [location, setLocation] = useLocation();
  const { selectedIds, toggleSelection } = useSelection();
  
  const params = new URLSearchParams(location.split("?")[1] || "");
  const filters = {
    type: params.get("type") || undefined,
    maxWidth: params.get("maxWidth") ? parseInt(params.get("maxWidth")!) : undefined,
    minDepth: params.get("minDepth") ? parseInt(params.get("minDepth")!) : undefined,
    maxDepth: params.get("maxDepth") ? parseInt(params.get("maxDepth")!) : undefined,
    maxPrice: params.get("maxPrice") ? parseFloat(params.get("maxPrice")!) : undefined,
  };

  const { data: families, isLoading } = useQuery({
    queryKey: ["families"],
    queryFn: fetchFamilies,
  });

  const { data: categories } = useQuery({
    queryKey: ["fabric-categories"],
    queryFn: fetchFabricCategories,
  });

  const handleViewDetails = (id: string) => {
    setLocation(`/product/local/${id}`);
  };

  const getAvailability = (variant: Variant): AvailabilityType[] => {
    const availability: AvailabilityType[] = [];
    const states = variant.availability.map((a) => a.state);
    if (states.includes("expo")) availability.push("store");
    if (states.includes("stock")) availability.push("stock");
    if (states.includes("commande")) availability.push("order");
    if (states.includes("instock_stores")) availability.push("instock_stores");
    return availability;
  };

  const displayFamilies: ProductFamily[] =
    families?.filter((f) => {
      const variant = f.variants[0];
      const widthOk = !filters.maxWidth || (variant.dimensions.width ?? 0) <= filters.maxWidth;
      const depthOk =
        (!filters.minDepth || (variant.dimensions.depth ?? 0) >= filters.minDepth) &&
        (!filters.maxDepth || (variant.dimensions.depth ?? 0) <= filters.maxDepth);
      const typeOk = !filters.type || f.familyType === filters.type;
      let priceOk = true;
      if (filters.maxPrice && categories) {
        const matchCat = categories.find((c) => variant.fabricPricing[c.id] !== undefined);
        const price = matchCat ? variant.fabricPricing[matchCat.id] : undefined;
        priceOk = !price || price <= filters.maxPrice;
      }
      return widthOk && depthOk && typeOk && priceOk;
    }) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation("/")}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Catalogue</h1>
                <p className="text-sm text-muted-foreground">
                  {isLoading ? "Chargement..." : `${displayFamilies.length || 0} modèles disponibles`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setLocation("/comparison")}
                  data-testid="button-compare"
                >
                  Comparer ({selectedIds.length})
                </Button>
              )}
              <Button variant="outline" onClick={() => setLocation("/product/fc/306")} >
                Tester un modèle réel FC
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                data-testid="button-filters"
                onClick={() => setLocation("/")}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-2xl" />
            ))}
          </div>
        ) : displayFamilies && displayFamilies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFamilies.map((family) => {
              const variant = family.variants[0];
              const priceCategory = categories?.find((c) => variant.fabricPricing[c.id] !== undefined);
              const price = priceCategory ? variant.fabricPricing[priceCategory.id] ?? 0 : 0;
              return (
                <ProductCard
                  key={family.id}
                id={family.id}
                name={family.name}
                version={`${variant.dimensions.width ?? "—"} cm – ${variant.variantType}`}
                price={price}
                mainImage={variant.gallery[0]?.url || "/api/images/beige_modern_fixed_sofa.png"}
                type={family.familyType as any}
                availability={getAvailability(variant)}
                onViewDetails={() => handleViewDetails(family.id)}
                onAddToSelection={() => toggleSelection(variant.id)}
              />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Aucun résultat</h2>
            <p className="text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={() => setLocation("/")}>
              Retour à la recherche
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
