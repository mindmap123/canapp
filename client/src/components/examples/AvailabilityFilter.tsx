import { useState } from "react";
import AvailabilityFilter from "../AvailabilityFilter";

export default function AvailabilityFilterExample() {
  const [availability, setAvailability] = useState({
    store: true,
    stock: true,
    order: false,
  });

  return (
    <div className="p-8 max-w-md">
      <AvailabilityFilter value={availability} onChange={setAvailability} />
    </div>
  );
}
