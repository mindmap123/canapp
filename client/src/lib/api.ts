import { Sofa } from "@shared/schema";

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
