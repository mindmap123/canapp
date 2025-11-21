import {
  ProductFamily,
  Variant,
  FabricCategory,
  FabricPricing,
  LegType,
  Availability,
  LegConfig,
  GalleryItem,
} from "@shared/domain";

// These adapters are intentionally lightweight and tolerant to schema mismatch.

export function adaptFCReferenceToProductFamily(apiData: any): ProductFamily {
  const variants: Variant[] = adaptFCDimensionsToVariants(apiData?.dimensions ?? []);

  return {
    id: String(apiData?.id ?? apiData?.reference ?? "fc-unknown"),
    name: apiData?.nom ?? "Référence FC",
    description: apiData?.description ?? "",
    providerName: "France Canapé",
    collectionName: apiData?.collection ?? "",
    familyType: (apiData?.categorie ?? "fixe") as ProductFamily["familyType"],
    heroImage: apiData?.image ?? "",
    gallery: [],
    technicalSheetUrl: apiData?.fiche_technique ?? "",
    tags: apiData?.tags ?? [],
    variants,
    isActive: true,
  };
}

export function adaptFCDimensionsToVariants(apiData: any[]): Variant[] {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item, idx) => {
    const fabricPricing: FabricPricing = {};
    Object.entries(item?.prices ?? {}).forEach(([key, val]) => {
      fabricPricing[key] = typeof val === "number" ? val : null;
    });

    const gallery: GalleryItem[] = [];

    const legs: LegConfig[] = [];

    return {
      id: String(item?.id ?? `variant-${idx}`),
      variantType: (item?.type ?? "2p") as Variant["variantType"],
      label: item?.label ?? item?.nom ?? "Variante",
      dimensions: {
        width: item?.largeur ? Number(item.largeur) : undefined,
        depth: item?.profondeur ? Number(item.profondeur) : undefined,
        height: item?.hauteur ? Number(item.hauteur) : undefined,
        seatHeight: item?.hauteur_assise ? Number(item.hauteur_assise) : undefined,
        seatDepth: item?.profondeur_assise ? Number(item.profondeur_assise) : undefined,
      },
      fabricPricing,
      legs,
      availability: [],
      gallery,
      technicalSheetUrl: item?.fiche_technique,
    };
  });
}

export function adaptFCTissuesToFabricCategories(apiData: any[]): FabricCategory[] {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item, idx) => ({
    id: String(item?.code ?? item?.id ?? `cat-${idx}`),
    label: item?.label ?? item?.nom ?? `Catégorie ${item?.code ?? idx + 1}`,
    code: String(item?.code ?? item?.id ?? idx + 1),
    displayOrder: idx + 1,
  }));
}

export function adaptFCFeetToLegTypes(apiData: any[]): LegType[] {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((item, idx) => ({
    id: String(item?.id ?? `leg-${idx}`),
    name: item?.nom ?? "Piètement",
    iconSvgUrl: item?.icon ?? undefined,
    allowedColors: Array.isArray(item?.couleurs)
      ? item.couleurs.map((c: any, i: number) => ({
          id: String(c?.id ?? `color-${i}`),
          name: c?.nom ?? "Coloris",
          code: String(c?.code ?? c?.id ?? i),
          hex: c?.hex,
          priceDelta: c?.delta ?? 0,
        }))
      : [],
  }));
}

export function adaptFCStockToAvailability(apiData: any[]): Availability[] {
  if (!Array.isArray(apiData)) return [];
  return apiData.map((item) => ({
    location: item?.magasin ?? "N/A",
    state: (item?.statut ?? "stock") as Availability["state"],
    delay: item?.delai ?? undefined,
    quantity: item?.quantite ?? undefined,
  }));
}
