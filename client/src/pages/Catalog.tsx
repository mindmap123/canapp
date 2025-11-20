import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ProductCard";
import { useSelection } from "@/lib/selectionContext";
import { filterSofas } from "@/lib/api";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { AvailabilityType } from "@/components/AvailabilityBadge";
import { Sofa } from "@shared/schema";

export default function Catalog() {
  const [location, setLocation] = useLocation();
  const { selectedIds, toggleSelection } = useSelection();
  
  // Parse filters from URL
  const params = new URLSearchParams(location.split("?")[1] || "");
  const filters = {
    type: params.get("type") || undefined,
    maxWidth: params.get("maxWidth") ? parseInt(params.get("maxWidth")!) : undefined,
    minDepth: params.get("minDepth") ? parseInt(params.get("minDepth")!) : undefined,
    maxDepth: params.get("maxDepth") ? parseInt(params.get("maxDepth")!) : undefined,
    maxPrice: params.get("maxPrice") ? parseFloat(params.get("maxPrice")!) : undefined,
    inStore: params.has("inStore") ? params.get("inStore") === "true" : undefined,
    inStock: params.has("inStock") ? params.get("inStock") === "true" : undefined,
    onOrder: params.has("onOrder") ? params.get("onOrder") === "true" : undefined,
  };

  const { data: sofas, isLoading } = useQuery({
    queryKey: ["/api/sofas/filter", filters],
    queryFn: () => filterSofas(filters),
  });

  const handleViewDetails = (id: string) => {
    setLocation(`/product/${id}`);
  };

  const getAvailability = (sofa: Sofa): AvailabilityType[] => {
    const availability: AvailabilityType[] = [];
    if (sofa.inStore) availability.push("store");
    if (sofa.inStock) availability.push("stock");
    if (sofa.onOrder) availability.push("order");
    return availability;
  };

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
                  {isLoading ? "Chargement..." : `${sofas?.length || 0} modèles disponibles`}
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
        ) : sofas && sofas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sofas.map((sofa) => (
              <ProductCard
                key={sofa.id}
                id={sofa.id}
                name={sofa.name}
                version={`${sofa.width} cm – ${sofa.type.charAt(0).toUpperCase() + sofa.type.slice(1)}`}
                price={parseFloat(sofa.price)}
                mainImage={sofa.mainImage}
                type={sofa.type as any}
                availability={getAvailability(sofa)}
                onViewDetails={() => handleViewDetails(sofa.id)}
                onAddToSelection={() => toggleSelection(sofa.id)}
              />
            ))}
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
