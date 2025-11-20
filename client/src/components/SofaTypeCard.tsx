import { Card } from "@/components/ui/card";
import { Sofa, BedDouble, Armchair, Waves } from "lucide-react";
import { SofaType } from "@shared/schema";

interface SofaTypeCardProps {
  type: SofaType;
  selected: boolean;
  onClick: () => void;
}

const typeConfig = {
  fixe: {
    label: "Fixe",
    icon: Sofa,
    description: "Canapé classique",
  },
  convertible: {
    label: "Convertible",
    icon: BedDouble,
    description: "Lit d'appoint",
  },
  fauteuil: {
    label: "Fauteuil",
    icon: Armchair,
    description: "Une place",
  },
  meridienne: {
    label: "Méridienne",
    icon: Waves,
    description: "Chaise longue",
  },
};

export default function SofaTypeCard({ type, selected, onClick }: SofaTypeCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover-elevate active-elevate-2 ${
        selected ? "ring-2 ring-primary border-primary" : ""
      }`}
      onClick={onClick}
      data-testid={`card-sofa-type-${type}`}
    >
      <div className="p-6 flex flex-col items-center gap-4 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{config.label}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>
    </Card>
  );
}
