import ProductCard from "../ProductCard";
import sofaImage from "@assets/generated_images/beige_modern_fixed_sofa.png";

export default function ProductCardExample() {
  return (
    <div className="max-w-sm p-8">
      <ProductCard
        id="1"
        name="Oslo Comfort"
        version="178 cm – Fixe"
        price={1299}
        mainImage={sofaImage}
        type="fixe"
        availability={["store", "stock"]}
        onViewDetails={() => console.log("View details")}
        onAddToSelection={() => console.log("Add to selection")}
      />
    </div>
  );
}
