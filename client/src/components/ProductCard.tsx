import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AvailabilityBadge, { AvailabilityType } from "./AvailabilityBadge";
import { Sofa, BedDouble, Armchair, Waves, Eye, Plus } from "lucide-react";
import { SofaType } from "@shared/schema";

interface ProductCardProps {
  id: string;
  name: string;
  version: string;
  price: number;
  mainImage: string;
  type: SofaType;
  availability: AvailabilityType[];
  onViewDetails?: () => void;
  onAddToSelection?: () => void;
}

const typeIcons = {
  fixe: Sofa,
  convertible: BedDouble,
  fauteuil: Armchair,
  meridienne: Waves,
};

export default function ProductCard({
  id,
  name,
  version,
  price,
  mainImage,
  type,
  availability,
  onViewDetails,
  onAddToSelection,
}: ProductCardProps) {
  const TypeIcon = typeIcons[type];

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-product-${id}`}>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover"
          data-testid={`img-product-${id}`}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {availability.map((av) => (
            <AvailabilityBadge key={av} type={av} />
          ))}
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
            <TypeIcon className="w-4 h-4 text-foreground" />
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold" data-testid={`text-product-name-${id}`}>{name}</h3>
          <p className="text-sm text-muted-foreground">{version}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold" data-testid={`text-price-${id}`}>
            {price.toLocaleString("fr-FR")}€
          </span>
          <span className="text-sm text-muted-foreground">TTC</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onViewDetails}
            data-testid={`button-view-details-${id}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir détails
          </Button>
          <Button
            className="flex-1"
            onClick={onAddToSelection}
            data-testid={`button-add-selection-${id}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Sélectionner
          </Button>
        </div>
      </div>
    </Card>
  );
}
