import { Sofa } from "@shared/schema";
import {
  FabricCategory,
  GalleryItem,
  LegColor,
  LegType,
  ProductFamily,
  Variant,
} from "@shared/domain";

export async function fetchSofas(): Promise<Sofa[]> {
  const response = await fetch("/api/sofas");
  if (!response.ok) {
    throw new Error("Failed to fetch sofas");
  }
  return response.json();
}

export async function fetchSofaById(id: string): Promise<Sofa> {
  const response = await fetch(`/api/sofas/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch sofa");
  }
  return response.json();
}

export async function filterSofas(filters: {
  type?: string;
  maxWidth?: number;
  minDepth?: number;
  maxDepth?: number;
  maxPrice?: number;
  inStore?: boolean;
  inStock?: boolean;
  onOrder?: boolean;
}): Promise<Sofa[]> {
  const params = new URLSearchParams();
  
  if (filters.type) params.append("type", filters.type);
  if (filters.maxWidth !== undefined) params.append("maxWidth", filters.maxWidth.toString());
  if (filters.minDepth !== undefined) params.append("minDepth", filters.minDepth.toString());
  if (filters.maxDepth !== undefined) params.append("maxDepth", filters.maxDepth.toString());
  if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
  if (filters.inStore !== undefined) params.append("inStore", filters.inStore.toString());
  if (filters.inStock !== undefined) params.append("inStock", filters.inStock.toString());
  if (filters.onOrder !== undefined) params.append("onOrder", filters.onOrder.toString());

  const response = await fetch(`/api/sofas/filter?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to filter sofas");
  }
  return response.json();
}

export async function uploadPhotoToSofa(id: string, file: File): Promise<Sofa> {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(`/api/sofas/${id}/photos`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload photo");
  }
  return response.json();
}

// --- New domain-aware API (mock for now) ---

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed for ${url}`);
  }
  return res.json();
}

export async function fetchFamilies(): Promise<ProductFamily[]> {
  return jsonFetch<ProductFamily[]>("/api/families");
}

export async function fetchFamilyById(id: string): Promise<ProductFamily | null> {
  try {
    return await jsonFetch<ProductFamily>(`/api/families/${id}`);
  } catch {
    return null;
  }
}

export async function fetchVariant(
  familyId: string,
  variantId: string,
): Promise<Variant | null> {
  try {
    return await jsonFetch<Variant>(`/api/families/${familyId}/variants/${variantId}`);
  } catch {
    return null;
  }
}

export async function fetchFabricCategories(): Promise<FabricCategory[]> {
  return jsonFetch<FabricCategory[]>("/api/fabric-categories");
}

export async function fetchLegTypes(): Promise<LegType[]> {
  const res = await jsonFetch<{ types: LegType[]; colors: LegColor[] }>("/api/legs");
  // Merge for caller convenience
  return res.types.map((type) => ({
    ...type,
    // preserve shape; colors returned separately
  }));
}

export async function fetchLegData(): Promise<{ types: LegType[]; colors: LegColor[] }> {
  return jsonFetch<{ types: LegType[]; colors: LegColor[] }>("/api/legs");
}

export async function fetchGallery(
  familyId: string,
  variantId: string,
): Promise<GalleryItem[]> {
  const variant = await fetchVariant(familyId, variantId);
  return variant?.gallery ?? [];
}

export async function uploadPhotoToVariant(
  familyId: string,
  variantId: string,
  file: File,
): Promise<Variant> {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await fetch(`/api/families/${familyId}/variants/${variantId}/photos`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to upload photo");
  }
  const variant = (await res.json()) as Variant;
  return variant;
}

// --- France Canapé PIM placeholders (raw JSON, tolerant) ---

const FC_TOKEN = "LCVsT5AdlorsB6lMCmeDcXSUMZQSyxbxw18S1PPb9cj7JIrDgZdUpnkj4oXRBuN";

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchFCReferences(): Promise<any> {
  const url = `/api/references`;
  console.log("[FC] fetchFCReferences → called:", url);
  const json = (await safeFetchJson(url)) ?? {};
  console.log("[FC] fetchFCReferences → raw response:", json);
  return json;
}

export async function fetchFCReferenceById(id: string | number): Promise<any> {
  try {
    console.log("[FC] fetchFCReferenceById → id:", id);
    const list = await fetchFCReferences();
    console.log("[FC] fetchFCReferenceById → list:", list);
    console.log("[FC] fetchFCReferenceById → list.data length:", list?.data?.length);
    if (!list || !Array.isArray(list.data)) return null;

    const num = Number(id);
    const ref = list.data.find((item: any) => item.id === num);

    console.log("[FC] fetchFCReferenceById → found:", ref);
    return ref || null;
  } catch (err) {
    console.error("FC reference lookup failed", err);
    return null;
  }
}

export async function fetchFCDimensions(): Promise<any> {
  const url = `/api/dimensions`;
  return (await safeFetchJson(url)) ?? {};
}

export async function fetchFCTissutheque(): Promise<any> {
  const url = `/api/tissutheque`;
  return (await safeFetchJson(url)) ?? {};
}

export async function fetchFCCouleurs(): Promise<any> {
  const url = `/api/couleurs`;
  return (await safeFetchJson(url)) ?? {};
}

export async function fetchFCPieds(): Promise<any> {
  const url = `/api/pieds`;
  return (await safeFetchJson(url)) ?? {};
}

export async function fetchFCStocks(): Promise<any> {
  const url = `/api/stocks`;
  return (await safeFetchJson(url)) ?? {};
}

// Aliases with naming used by FC test page instructions
export const fetchFCTissuTheque = fetchFCTissutheque;
export const fetchFCColors = fetchFCCouleurs;
export const fetchFCFeet = fetchFCPieds;
export const fetchFCStock = fetchFCStocks;
