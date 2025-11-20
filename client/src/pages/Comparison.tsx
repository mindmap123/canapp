import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import { useSelection } from "@/lib/selectionContext";
import { fetchSofas } from "@/lib/api";
import { ArrowLeft, X } from "lucide-react";
import { AvailabilityType } from "@/components/AvailabilityBadge";
import { Sofa } from "@shared/schema";

export default function Comparison() {
  const [, setLocation] = useLocation();
  const { selectedIds, removeFromSelection } = useSelection();

  const { data: allSofas, isLoading } = useQuery({
    queryKey: ["/api/sofas"],
    queryFn: fetchSofas,
  });

  const selectedSofas = allSofas?.filter((s) => selectedIds.includes(s.id)) || [];

  const getAvailability = (sofa: Sofa): AvailabilityType[] => {
    const availability: AvailabilityType[] = [];
    if (sofa.inStore) availability.push("store");
    if (sofa.inStock) availability.push("stock");
    if (sofa.onOrder) availability.push("order");
    return availability;
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

  if (selectedSofas.length === 0) {
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
                  {selectedSofas.length} modèles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedSofas.map((sofa) => (
            <Card key={sofa.id} className="overflow-hidden" data-testid={`card-comparison-${sofa.id}`}>
              <div className="relative">
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={sofa.mainImage}
                    alt={sofa.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 rounded-full"
                  onClick={() => removeFromSelection(sofa.id)}
                  data-testid={`button-remove-${sofa.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">{sofa.name}</h3>
                    <Badge variant="outline" className="capitalize ml-2">
                      {sofa.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getAvailability(sofa).map((av) => (
                      <AvailabilityBadge key={av} type={av} />
                    ))}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 py-3 border-y">
                  <span className="text-3xl font-bold">
                    {parseFloat(sofa.price).toLocaleString("fr-FR")}€
                  </span>
                  <span className="text-sm text-muted-foreground">TTC</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Dimensions
                    </div>
                    <div className="text-sm">
                      L {sofa.width} × P {sofa.depth} × H {sofa.height} cm
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Confort
                    </div>
                    <div className="text-sm">{sofa.comfort}</div>
                  </div>

                  {sofa.features && sofa.features.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Caractéristiques
                      </div>
                      <ul className="space-y-1">
                        {sofa.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs flex items-start gap-1">
                            <span className="text-availability-store">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation(`/product/${sofa.id}`)}
                  data-testid={`button-view-details-${sofa.id}`}
                >
                  Voir détails
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
