import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Clock } from "lucide-react";

export type AvailabilityType = "store" | "stock" | "order";

interface AvailabilityBadgeProps {
  type: AvailabilityType;
  className?: string;
}

const availabilityConfig = {
  store: {
    label: "En magasin",
    icon: MapPin,
    className: "bg-availability-store/10 text-availability-store border-availability-store/20",
  },
  stock: {
    label: "En stock",
    icon: Package,
    className: "bg-availability-stock/10 text-availability-stock border-availability-stock/20",
  },
  order: {
    label: "Sur commande",
    icon: Clock,
    className: "bg-availability-order/10 text-availability-order border-availability-order/20",
  },
};

export default function AvailabilityBadge({ type, className = "" }: AvailabilityBadgeProps) {
  const config = availabilityConfig[type];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} gap-1.5`}
      data-testid={`badge-availability-${type}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </Badge>
  );
}
