export type VariantType = "2p" | "3p" | "4p" | "angle" | "meridienne" | "pouf" | "fauteuil";

export interface Dimensions {
  width?: number;
  depth?: number;
  height?: number;
  seatHeight?: number;
  seatDepth?: number;
}

export interface FabricCategory {
  id: string;
  label: string;
  code: string;
  displayOrder: number;
}

export type FabricPricing = Record<string, number | null>;

export interface LegColor {
  id: string;
  name: string;
  code: string;
  hex?: string;
  priceDelta?: number;
}

export interface LegType {
  id: string;
  name: string;
  iconSvgUrl?: string;
  allowedColors: LegColor[];
}

export interface LegConfig {
  legTypeId: string;
  colorId: string;
  deltaPrice?: number;
  isDefault?: boolean;
}

export interface GalleryItem {
  id: string;
  sourceType: "internal" | "api" | "manual";
  url: string;
  alt?: string;
  isHero?: boolean;
}

export interface Availability {
  location: string;
  state: "expo" | "stock" | "commande" | "instock_stores";
  delay?: string;
  quantity?: number;
}

export interface PriceInfo {
  basePrice?: number;
  promoPrice?: number;
  ecoTax?: number;
  coefficient?: number;
}

export interface Variant {
  id: string;
  label: string;
  variantType: VariantType;
  dimensions: Dimensions;
  fabricPricing: FabricPricing;
  legs: LegConfig[];
  gallery: GalleryItem[];
  availability: Availability[];
  technicalSheetUrl?: string;
  priceInfo?: PriceInfo;
}

export interface ProductFamily {
  id: string;
  name: string;
  description?: string;
  providerName?: string;
  collectionName?: string;
  familyType: "fixe" | "convertible" | "fcc" | "fauteuil" | "meridienne" | "fc";
  heroImage?: string;
  gallery: GalleryItem[];
  technicalSheetUrl?: string;
  tags?: string[];
  variants: Variant[];
  isActive: boolean;
}
