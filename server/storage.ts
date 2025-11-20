import { type Sofa, type InsertSofa } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getSofas(): Promise<Sofa[]>;
  getSofaById(id: string): Promise<Sofa | undefined>;
  createSofa(sofa: InsertSofa): Promise<Sofa>;
  updateSofa(id: string, sofa: Partial<InsertSofa>): Promise<Sofa | undefined>;
  filterSofas(filters: {
    type?: string;
    maxWidth?: number;
    minDepth?: number;
    maxDepth?: number;
    maxPrice?: number;
    inStore?: boolean;
    inStock?: boolean;
    onOrder?: boolean;
  }): Promise<Sofa[]>;
}

export class MemStorage implements IStorage {
  private sofas: Map<string, Sofa>;

  constructor() {
    this.sofas = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockSofas: Omit<Sofa, "id">[] = [
      {
        name: "Oslo Comfort",
        type: "fixe",
        width: 178,
        depth: 88,
        height: 82,
        price: "1299.00",
        comfort: "Confort ferme, assise haute",
        inStore: true,
        inStock: true,
        onOrder: false,
        mainImage: "/api/images/beige_modern_fixed_sofa.png",
        images: ["/api/images/beige_modern_fixed_sofa.png"],
        description: "Canapé fixe au design scandinave épuré, parfait pour les espaces contemporains.",
        features: ["Tissu anti-taches", "Pieds en chêne massif", "Coussins déhoussables"],
      } as Omit<Sofa, "id">,
      {
        name: "Milano Convertible",
        type: "convertible",
        width: 200,
        depth: 95,
        height: 85,
        price: "1899.00",
        comfort: "Confort moelleux, convertible express",
        inStore: false,
        inStock: true,
        onOrder: false,
        mainImage: "/api/images/gray_convertible_sofa_bed.png",
        images: ["/api/images/gray_convertible_sofa_bed.png"],
        description: "Canapé convertible haut de gamme avec système de couchage quotidien.",
        features: ["Matelas 14cm inclus", "Mécanisme rapido", "Coffre de rangement"],
      },
      {
        name: "Churchill Classic",
        type: "fauteuil",
        width: 95,
        depth: 92,
        height: 98,
        price: "899.00",
        comfort: "Confort d'exception, cuir pleine fleur",
        inStore: true,
        inStock: false,
        onOrder: true,
        mainImage: "/api/images/brown_leather_modern_armchair.png",
        images: ["/api/images/brown_leather_modern_armchair.png"],
        description: "Fauteuil en cuir véritable, inspiré du design anglais classique.",
        features: ["Cuir aniline", "Structure hêtre massif", "Dossier ergonomique"],
      },
      {
        name: "Élégance Méridienne",
        type: "meridienne",
        width: 165,
        depth: 75,
        height: 78,
        price: "1499.00",
        comfort: "Confort raffiné, assise profonde",
        inStore: false,
        inStock: false,
        onOrder: true,
        mainImage: "/api/images/pink_meridienne_chaise_lounge.png",
        images: ["/api/images/pink_meridienne_chaise_lounge.png"],
        description: "Méridienne au design élégant, idéale pour créer un coin lecture.",
        features: ["Velours haute qualité", "Pieds laiton brossé", "Accoudoir asymétrique"],
      },
      {
        name: "Urban Lounge",
        type: "fixe",
        width: 280,
        depth: 105,
        height: 75,
        price: "2499.00",
        comfort: "Confort lounge, assise extra profonde",
        inStore: true,
        inStock: true,
        onOrder: false,
        mainImage: "/api/images/charcoal_sectional_lounge_sofa.png",
        images: ["/api/images/charcoal_sectional_lounge_sofa.png"],
        description: "Grand canapé d'angle au confort exceptionnel pour une détente maximale.",
        features: ["Configuration modulable", "Têtières réglables", "Assise ultra-profonde"],
      },
      {
        name: "Bijou Velours",
        type: "fixe",
        width: 140,
        depth: 82,
        height: 80,
        price: "1099.00",
        comfort: "Confort élégant, assise compacte",
        inStore: false,
        inStock: true,
        onOrder: false,
        mainImage: "/api/images/navy_blue_velvet_loveseat.png",
        images: ["/api/images/navy_blue_velvet_loveseat.png"],
        description: "Petit canapé 2 places au design raffiné, parfait pour les petits espaces.",
        features: ["Velours premium", "Design compact", "Pieds dorés"],
      },
    ];

    mockSofas.forEach((sofa) => {
      const id = randomUUID();
      const fullSofa: Sofa = { 
        ...sofa, 
        id,
        description: sofa.description ?? null,
        features: sofa.features ?? null
      };
      this.sofas.set(id, fullSofa);
    });
  }

  async getSofas(): Promise<Sofa[]> {
    return Array.from(this.sofas.values());
  }

  async getSofaById(id: string): Promise<Sofa | undefined> {
    return this.sofas.get(id);
  }

  async createSofa(insertSofa: InsertSofa): Promise<Sofa> {
    const id = randomUUID();
    const sofa: Sofa = { ...insertSofa, id };
    this.sofas.set(id, sofa);
    return sofa;
  }

  async updateSofa(id: string, updates: Partial<InsertSofa>): Promise<Sofa | undefined> {
    const sofa = this.sofas.get(id);
    if (!sofa) return undefined;

    const updated = { ...sofa, ...updates };
    this.sofas.set(id, updated);
    return updated;
  }

  async filterSofas(filters: {
    type?: string;
    maxWidth?: number;
    minDepth?: number;
    maxDepth?: number;
    maxPrice?: number;
    inStore?: boolean;
    inStock?: boolean;
    onOrder?: boolean;
  }): Promise<Sofa[]> {
    let results = Array.from(this.sofas.values());

    if (filters.type) {
      results = results.filter((s) => s.type === filters.type);
    }

    if (filters.maxWidth) {
      results = results.filter((s) => s.width <= filters.maxWidth!);
    }

    if (filters.minDepth) {
      results = results.filter((s) => s.depth >= filters.minDepth!);
    }

    if (filters.maxDepth) {
      results = results.filter((s) => s.depth <= filters.maxDepth!);
    }

    if (filters.maxPrice) {
      results = results.filter((s) => parseFloat(s.price) <= filters.maxPrice!);
    }

    // Availability filters - if any are true, include sofas that match ANY of them
    const availabilityFilters = [
      filters.inStore,
      filters.inStock,
      filters.onOrder,
    ].filter(Boolean);

    if (availabilityFilters.length > 0) {
      results = results.filter((s) => {
        return (
          (filters.inStore && s.inStore) ||
          (filters.inStock && s.inStock) ||
          (filters.onOrder && s.onOrder)
        );
      });
    }

    return results;
  }
}

export const storage = new MemStorage();
