import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SofaTypeCard from "@/components/SofaTypeCard";
import FilterSlider from "@/components/FilterSlider";
import DepthSelector from "@/components/DepthSelector";
import AvailabilityFilter from "@/components/AvailabilityFilter";
import { SofaType, DepthType } from "@shared/schema";
import { Sparkles } from "lucide-react";

const depthRanges = {
  shallow: { min: 0, max: 85 },
  standard: { min: 85, max: 95 },
  lounge: { min: 95, max: 999 },
};

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<SofaType | null>(null);
  const [maxWidth, setMaxWidth] = useState([250]);
  const [depth, setDepth] = useState<DepthType | null>(null);
  const [budget, setBudget] = useState([3000]);
  const [availability, setAvailability] = useState({
    store: false,
    stock: false,
    order: false,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (selectedType) params.append("type", selectedType);
    if (maxWidth[0]) params.append("maxWidth", maxWidth[0].toString());
    if (depth) {
      const range = depthRanges[depth];
      params.append("minDepth", range.min.toString());
      params.append("maxDepth", range.max.toString());
    }
    if (budget[0]) params.append("maxPrice", budget[0].toString());
    if (availability.store) params.append("inStore", "true");
    if (availability.stock) params.append("inStock", "true");
    if (availability.order) params.append("onOrder", "true");

    setLocation(`/catalog?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Interface Premium 2025</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Trouvez votre canapé idéal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez vos critères pour découvrir les modèles qui correspondent parfaitement à vos besoins
          </p>
        </div>

        <Card className="p-8 md:p-12 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Type de canapé</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SofaTypeCard
                type="fixe"
                selected={selectedType === "fixe"}
                onClick={() => setSelectedType("fixe")}
              />
              <SofaTypeCard
                type="convertible"
                selected={selectedType === "convertible"}
                onClick={() => setSelectedType("convertible")}
              />
              <SofaTypeCard
                type="fauteuil"
                selected={selectedType === "fauteuil"}
                onClick={() => setSelectedType("fauteuil")}
              />
              <SofaTypeCard
                type="meridienne"
                selected={selectedType === "meridienne"}
                onClick={() => setSelectedType("meridienne")}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FilterSlider
              label="Largeur max"
              value={maxWidth}
              onValueChange={setMaxWidth}
              min={120}
              max={300}
              step={10}
              unit=" cm"
            />
            <FilterSlider
              label="Budget"
              value={budget}
              onValueChange={setBudget}
              min={500}
              max={5000}
              step={100}
              formatValue={(v) => `${v.toLocaleString("fr-FR")}€`}
            />
          </div>

          <DepthSelector value={depth} onChange={setDepth} />

          <AvailabilityFilter value={availability} onChange={setAvailability} />

          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleSearch}
            data-testid="button-search"
          >
            Voir les modèles compatibles
          </Button>
        </Card>
      </div>
    </div>
  );
}
