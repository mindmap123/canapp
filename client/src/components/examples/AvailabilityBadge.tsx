import AvailabilityBadge from "../AvailabilityBadge";

export default function AvailabilityBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3 p-8">
      <AvailabilityBadge type="store" />
      <AvailabilityBadge type="stock" />
      <AvailabilityBadge type="order" />
      <AvailabilityBadge type="instock_stores" />
    </div>
  );
}
