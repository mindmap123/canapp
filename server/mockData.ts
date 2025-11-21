import { randomUUID } from "crypto";
import {
  Availability,
  FabricCategory,
  GalleryItem,
  LegColor,
  LegConfig,
  LegType,
  ProductFamily,
  Variant,
} from "@shared/domain";

export const fabricCategories: FabricCategory[] = [
  { id: "A", label: "Collection", code: "A", displayOrder: 1 },
  { id: "B", label: "Edition", code: "B", displayOrder: 2 },
  { id: "C", label: "Distinction", code: "C", displayOrder: 3 },
  { id: "D", label: "Exclusif D", code: "D", displayOrder: 4 },
  { id: "E", label: "Exclusif E", code: "E", displayOrder: 5 },
  { id: "F", label: "Cuir 1 King Royal", code: "F", displayOrder: 6 },
  { id: "G", label: "Cuir Viborg", code: "G", displayOrder: 7 },
  { id: "E1", label: "Editeurs E1", code: "E1", displayOrder: 8 },
  { id: "E2", label: "Editeurs E2", code: "E2", displayOrder: 9 },
  { id: "E3", label: "Editeurs E3", code: "E3", displayOrder: 10 },
  { id: "E4", label: "Editeurs E4", code: "E4", displayOrder: 11 },
  { id: "E5", label: "Editeurs E5", code: "E5", displayOrder: 12 },
];

export const legColors: LegColor[] = [
  { id: "LC-oak", name: "Chêne naturel", code: "ON", hex: "#c8a46a" },
  { id: "LC-walnut", name: "Noyer", code: "NW", hex: "#7b4b2d", priceDelta: 50 },
  { id: "LC-black", name: "Noir mat", code: "BK", hex: "#111111" },
  { id: "LC-brass", name: "Laiton", code: "BR", hex: "#d9b34c", priceDelta: 90 },
  { id: "LC-brushed", name: "Métal brossé", code: "MB", hex: "#b4b7bc" },
];

export const legTypes: LegType[] = [
  {
    id: "LT-wood",
    name: "Pied fuselé bois",
    iconSvgUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect x='28' y='10' width='8' height='36' rx='3' fill='%23c8a46a'/><polygon points='22,46 42,46 38,54 26,54' fill='%238a6d3b'/></svg>",
    allowedColors: [legColors[0], legColors[1], legColors[3]],
  },
  {
    id: "LT-metal",
    name: "Pied métal",
    iconSvgUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect x='30' y='12' width='4' height='34' rx='2' fill='%23b1b4b8'/><rect x='22' y='46' width='20' height='6' rx='2' fill='%238f949a'/></svg>",
    allowedColors: [legColors[2], legColors[4]],
  },
  {
    id: "LT-luge",
    name: "Piètement luge",
    iconSvgUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><path d='M18 20 h6 v22 h-6 z M40 20 h6 v22 h-6 z M18 42 h28 v6 H18z' fill='%23222222' stroke='%23222222' stroke-width='1'/></svg>",
    allowedColors: [legColors[2], legColors[4]],
  },
];

function pricing(values: Record<string, number | null>): Record<string, number | null> {
  return { ...values };
}

function gallery(url: string, alt?: string, hero = false): GalleryItem {
  return { id: randomUUID(), sourceType: "internal", url, alt, isHero: hero };
}

function legConfig(legTypeId: string, colorId: string, deltaPrice?: number, isDefault?: boolean): LegConfig {
  return { legTypeId, colorId, deltaPrice, isDefault };
}

function availability(items: Partial<Availability>[]): Availability[] {
  return items.map((a, idx) => ({
    location: a.location ?? `Showroom ${idx + 1}`,
    state: a.state ?? "stock",
    delay: a.delay,
    quantity: a.quantity,
  }));
}

const familiesSeed: ProductFamily[] = [
  {
    id: "oslo-fixe",
    name: "Oslo Fixe",
    description: "Lignes scandinaves, assise tonique.",
    providerName: "FC",
    collectionName: "Nordic 2025",
    familyType: "fixe",
    heroImage: "/api/images/beige_modern_fixed_sofa.png",
    gallery: [gallery("/api/images/beige_modern_fixed_sofa.png", "Hero", true)],
    technicalSheetUrl: "https://example.com/ft-oslo.pdf",
    tags: ["bois", "compact"],
    isActive: true,
    variants: [
      {
        id: "oslo-2p",
        label: "2 places",
        variantType: "2p",
        dimensions: { width: 178, depth: 88, height: 82, seatHeight: 44, seatDepth: 53 },
        fabricPricing: pricing({ A: 1290, B: 1390, C: 1490, D: 1590, E: 1690, E1: 1790 }),
        legs: [
          legConfig("LT-wood", "LC-oak", undefined, true),
          legConfig("LT-wood", "LC-walnut", 50),
          legConfig("LT-wood", "LC-brass", 90),
        ],
        gallery: [
          gallery("/api/images/beige_modern_fixed_sofa.png", "Oslo fixe", true),
          gallery("/api/images/navy_blue_velvet_loveseat.png", "Version velours"),
        ],
        availability: availability([
          { location: "Lyon Part-Dieu", state: "expo" },
          { location: "Entrepôt Rhône", state: "stock", delay: "10 j" },
          { location: "Réseau magasins", state: "instock_stores", delay: "Disponible en boutique" },
        ]),
      },
      {
        id: "oslo-3p",
        label: "3 places",
        variantType: "3p",
        dimensions: { width: 210, depth: 90, height: 82, seatHeight: 44, seatDepth: 55 },
        fabricPricing: pricing({ A: 1490, B: 1590, C: 1690, D: 1790, E: 1890, F: 2290 }),
        legs: [
          legConfig("LT-wood", "LC-oak", undefined, true),
          legConfig("LT-wood", "LC-walnut", 50),
        ],
        gallery: [gallery("/api/images/beige_modern_fixed_sofa.png", "Oslo 3p", true)],
        availability: availability([{ location: "Showroom Paris", state: "commande", delay: "6-8 sem." }]),
      },
    ],
  },
  {
    id: "urban-angle",
    name: "Urban Angle",
    description: "Grand angle lounge modulable.",
    providerName: "FC",
    collectionName: "Urban Loft",
    familyType: "fixe",
    heroImage: "/api/images/charcoal_sectional_lounge_sofa.png",
    gallery: [gallery("/api/images/charcoal_sectional_lounge_sofa.png", "Hero", true)],
    technicalSheetUrl: "https://example.com/ft-urban.pdf",
    tags: ["angle", "deep seat"],
    isActive: true,
    variants: [
      {
        id: "urban-angle-left",
        label: "Angle gauche",
        variantType: "angle",
        dimensions: { width: 280, depth: 105, height: 75, seatHeight: 43, seatDepth: 65 },
        fabricPricing: pricing({ A: 2290, B: 2490, C: 2690, D: 2890, E: 3090, F: 3490 }),
        legs: [
          legConfig("LT-luge", "LC-black", undefined, true),
          legConfig("LT-luge", "LC-brushed", 80),
        ],
        gallery: [gallery("/api/images/charcoal_sectional_lounge_sofa.png", "Urban angle", true)],
        availability: availability([{ location: "Bordeaux", state: "commande", delay: "8 sem." }]),
      },
    ],
  },
  {
    id: "milano-convertible",
    name: "Milano Convertible",
    description: "Convertible quotidien rapido.",
    providerName: "FC",
    collectionName: "Italia",
    familyType: "convertible",
    heroImage: "/api/images/gray_convertible_sofa_bed.png",
    gallery: [gallery("/api/images/gray_convertible_sofa_bed.png", "Hero", true)],
    technicalSheetUrl: "https://example.com/ft-milano.pdf",
    tags: ["rapido", "couchage"],
    isActive: true,
    variants: [
      {
        id: "milano-2p",
        label: "2 places",
        variantType: "2p",
        dimensions: { width: 180, depth: 95, height: 86, seatHeight: 45, seatDepth: 55 },
        fabricPricing: pricing({ A: 1690, B: 1890, C: 2090, D: 2290, F: 2690 }),
        legs: [
          legConfig("LT-metal", "LC-brushed", undefined, true),
          legConfig("LT-metal", "LC-black"),
        ],
        gallery: [gallery("/api/images/gray_convertible_sofa_bed.png", "Milano 2p", true)],
        availability: availability([{ location: "Paris République", state: "expo" }]),
      },
      {
        id: "milano-3p",
        label: "3 places",
        variantType: "3p",
        dimensions: { width: 200, depth: 98, height: 86, seatHeight: 45, seatDepth: 56 },
        fabricPricing: pricing({ A: 1890, B: 2090, C: 2290, D: 2490, E: 2690, F: 2990 }),
        legs: [
          legConfig("LT-metal", "LC-brushed", undefined, true),
          legConfig("LT-metal", "LC-black"),
        ],
        gallery: [
          gallery("/api/images/gray_convertible_sofa_bed.png", "Milano 3p", true),
          gallery("/api/images/beige_modern_fixed_sofa.png", "Détail accoudoir"),
        ],
        availability: availability([{ location: "Commande usine", state: "commande", delay: "6-8 sem." }]),
      },
    ],
  },
  {
    id: "lazio-convertible",
    name: "Lazio Convertible",
    description: "Convertible compact express.",
    providerName: "FC",
    collectionName: "Italia",
    familyType: "convertible",
    heroImage: "/api/images/navy_blue_velvet_loveseat.png",
    gallery: [gallery("/api/images/navy_blue_velvet_loveseat.png", "Hero", true)],
    technicalSheetUrl: "https://example.com/ft-lazio.pdf",
    tags: ["compact", "daily bed"],
    isActive: true,
    variants: [
      {
        id: "lazio-2p",
        label: "2 places",
        variantType: "2p",
        dimensions: { width: 165, depth: 90, height: 85, seatHeight: 45, seatDepth: 54 },
        fabricPricing: pricing({ A: 1390, B: 1490, C: 1590, D: 1690, E: 1790 }),
        legs: [
          legConfig("LT-metal", "LC-black", undefined, true),
          legConfig("LT-metal", "LC-brushed", 60),
        ],
        gallery: [gallery("/api/images/navy_blue_velvet_loveseat.png", "Lazio 2p", true)],
        availability: availability([{ location: "Entrepôt IDF", state: "stock", quantity: 4 }]),
      },
    ],
  },
  {
    id: "fcc-relax",
    name: "FCC Relax",
    description: "Structure prête pour options FCC (données à venir).",
    providerName: "FCC",
    collectionName: "FCC Collection",
    familyType: "fcc",
    heroImage: "/api/images/pink_meridienne_chaise_lounge.png",
    gallery: [gallery("/api/images/pink_meridienne_chaise_lounge.png", "Hero", true)],
    technicalSheetUrl: "https://example.com/ft-fcc-relax.pdf",
    tags: ["fcc"],
    isActive: true,
    variants: [
      {
        id: "fcc-relax-2p",
        label: "2 places",
        variantType: "2p",
        dimensions: { width: 190, depth: 92, height: 90 },
        fabricPricing: pricing({ A: 0 }),
        legs: [],
        gallery: [gallery("/api/images/pink_meridienne_chaise_lounge.png", "FCC relax", true)],
        availability: [],
      },
    ],
  },
  {
    id: "fcc-compact",
    name: "FCC Compact",
    description: "Châssis FCC compact prêt à connecter options.",
    providerName: "FCC",
    collectionName: "FCC Urbain",
    familyType: "fcc",
    heroImage: "/api/images/brown_leather_modern_armchair.png",
    gallery: [gallery("/api/images/brown_leather_modern_armchair.png", "Hero", true)],
    technicalSheetUrl: "https://example.com/ft-fcc-compact.pdf",
    tags: ["fcc", "compact"],
    isActive: true,
    variants: [
      {
        id: "fcc-compact-1p",
        label: "Fauteuil",
        variantType: "fauteuil",
        dimensions: { width: 95, depth: 90, height: 90 },
        fabricPricing: pricing({ A: 0 }),
        legs: [],
        gallery: [gallery("/api/images/brown_leather_modern_armchair.png", "FCC compact", true)],
        availability: [],
      },
    ],
  },
];

const familiesStore: Map<string, ProductFamily> = new Map(familiesSeed.map((f) => [f.id, f]));

export function getFamilies(): ProductFamily[] {
  return Array.from(familiesStore.values());
}

export function getFamilyById(id: string): ProductFamily | undefined {
  return familiesStore.get(id);
}

export function getVariant(familyId: string, variantId: string): { family: ProductFamily; variant: Variant } | null {
  const family = familiesStore.get(familyId);
  if (!family) return null;
  const variant = family.variants.find((v) => v.id === variantId);
  if (!variant) return null;
  return { family, variant };
}

export function addManualImage(familyId: string, variantId: string, url: string): GalleryItem | null {
  const match = getVariant(familyId, variantId);
  if (!match) return null;
  const sticker: GalleryItem = {
    id: randomUUID(),
    sourceType: "manual",
    url,
    alt: `${match.family.name} – ${match.variant.label} (upload)`,
  };
  const updatedVariant: Variant = {
    ...match.variant,
    gallery: [...match.variant.gallery, sticker],
  };
  const updatedFamily: ProductFamily = {
    ...match.family,
    variants: match.family.variants.map((v) => (v.id === variantId ? updatedVariant : v)),
  };
  familiesStore.set(updatedFamily.id, updatedFamily);
  return sticker;
}
