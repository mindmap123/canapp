import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { mockSofas } from "@/lib/mockData";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { AvailabilityType } from "@/components/AvailabilityBadge";

export default function Catalog() {
  const [, setLocation] = useLocation();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleViewDetails = (id: string) => {
    console.log("View details for product:", id);
    setLocation(`/product/${id}`);
  };

  const handleAddToSelection = (id: string) => {
    console.log("Add to selection:", id);
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const getAvailability = (sofa: typeof mockSofas[0]): AvailabilityType[] => {
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
                  {mockSofas.length} modèles disponibles
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedProducts.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setLocation("/comparison")}
                  data-testid="button-compare"
                >
                  Comparer ({selectedProducts.length})
                </Button>
              )}
              <Button variant="outline" size="icon" data-testid="button-filters">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSofas.map((sofa) => (
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
              onAddToSelection={() => handleAddToSelection(sofa.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
