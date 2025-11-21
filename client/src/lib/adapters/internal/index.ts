import { Availability, FabricCategory, GalleryItem, LegType, ProductFamily, Variant } from "@shared/domain";

const PLACEHOLDER_URL = "/placeholder.jpg";

// Proxy frontaal wsrv.nl (Weserv) : fiable, gratuit, webp, contournement Cloudflare
export const toLocalFcImage = (originalUrl: string | undefined | null): string => {
  if (!originalUrl) return PLACEHOLDER_URL;

  const encoded = encodeURIComponent(originalUrl);

  // wsrv.nl = images.weserv.nl → proxy gratuit, mondial, infaillible contre Cloudflare
  return `https://wsrv.nl/?url=${encoded}&w=1600&h=1200&output=webp&q=85&aft=sharpen`;
};

function buildFallbackVariantsFromReference(raw: any): Variant[] {
  const baseWidth = raw?.width && raw.width > 50 ? raw.width : 180;
  const baseDepth = raw?.depth && raw.depth > 40 ? raw.depth : 90;
  const baseHeight = raw?.height && raw.height > 30 ? raw.height : 85;

  const variants: Variant[] = [
    {
      id: "fauteuil",
      label: "Fauteuil",
      variantType: "fauteuil",
      dimensions: { width: Math.round(baseWidth * 0.6), depth: baseDepth, height: baseHeight },
      fabricPricing: {},
      legs: [],
      gallery: [],
      availability: [],
    },
    {
      id: "2p",
      label: "2 places",
      variantType: "2p",
      dimensions: { width: baseWidth, depth: baseDepth, height: baseHeight },
      fabricPricing: {},
      legs: [],
      gallery: [],
      availability: [],
    },
    {
      id: "3p",
      label: "3 places",
      variantType: "3p",
      dimensions: { width: baseWidth + 20, depth: baseDepth, height: baseHeight },
      fabricPricing: {},
      legs: [],
      gallery: [],
      availability: [],
    },
  ];

  if (baseWidth >= 190) {
    variants.push({
      id: "4p",
      label: "4 places",
      variantType: "4p",
      dimensions: { width: baseWidth + 40, depth: baseDepth, height: baseHeight },
      fabricPricing: {},
      legs: [],
      gallery: [],
      availability: [],
    });
  }

  variants.push({
    id: "pouf",
    label: "Pouf",
    variantType: "pouf",
    dimensions: {
      width: Math.round(baseWidth * 0.5),
      depth: Math.round(baseDepth * 0.5),
      height: Math.round(baseHeight * 0.6),
    },
    fabricPricing: {},
    legs: [],
    gallery: [],
    availability: [],
  });

  return variants;
}

export function adaptFCReferenceToProductFamily(raw: any): ProductFamily | null {
  if (!raw) return null;

  const title = raw?.francecanape_title || raw?.provider_title || "Référence FC";
  const providerName = raw?.provider?.name || raw?.provider_title || "France Canapé";

  const basePicture = raw?.picture_url ?? "";
  const heroLocal = toLocalFcImage(basePicture);

  const gallery: GalleryItem[] = [
    {
      id: `fc-${raw.id}-hero`,
      url: heroLocal,
      alt: raw.francecanape_title || "Aperçu canapé",
      sourceType: "api",
    },
  ];

  console.log("[FC ADAPTER] hero proxied url =", heroLocal);

  const variants: Variant[] = buildFallbackVariantsFromReference(raw).map((v) => ({
    ...v,
    gallery,
  }));

  return {
    id: String(raw.id),
    name: title,
    description: raw?.description || "-",
    familyType: "fc",
    providerName,
    collectionName: raw?.provider_title || "",
    heroImage: heroLocal,
    gallery,
    variants,
    isActive: true,
    technicalSheetUrl: raw?.technique_url || null,
    priceInfo: undefined,
  };
}

export function adaptFCDimensionsToVariants(_raw: any): Variant[] {
  return [];
}

export function adaptFCTissuCategories(_raw: any): FabricCategory[] {
  return [];
}

export function adaptFCFeetToLegs(_raw: any): LegType[] {
  return [];
}

export function adaptFCStockToAvailability(_raw: any): Availability[] {
  return [];
}

export function adaptFCCOptionsToVariant(_raw: any): void {
  // TODO
}
