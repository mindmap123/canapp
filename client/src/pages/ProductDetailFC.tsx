import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toLocalFcImage } from "@/lib/adapters/internal";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { VariantTable } from "@/components/VariantTable";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { ActionBar } from "@/components/ActionBar";
import { fetchFCReferenceById } from "@/lib/api";
import { adaptFCReferenceToProductFamily } from "@/lib/adapters/internal";
import { Variant } from "@shared/domain";

export default function ProductDetailFC() {
  const [, params] = useRoute("/product/fc/:id");
  const id = params?.id ?? "";

  const { data: ref, isLoading } = useQuery({
    queryKey: ["fc-reference", id],
    queryFn: () => fetchFCReferenceById(id),
    refetchOnWindowFocus: false,
  });

  // Désactivation complète des autres fetchers PIM pour ne pas bloquer le rendu
  const dimensions = null;
  const tissus = null;
  const couleurs = null;
  const pieds = null;
  const dispo = null;

  const family = useMemo(() => adaptFCReferenceToProductFamily(ref), [ref]);

  const [variantId, setVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (family && !variantId) {
      setVariantId(family.variants[0]?.id ?? null);
    }
  }, [family, variantId]);

  const activeVariant: Variant | null = useMemo(() => {
    if (!family?.variants?.length) return null;
    return family.variants.find((v) => v.id === variantId) ?? family.variants[0];
  }, [family, variantId]);

  const heroUrl = useMemo(() => {
    const rawUrl = activeVariant?.gallery?.[0]?.url || family?.heroImage || (family as any)?.picture_url;

    if (!rawUrl) {
      console.warn("[FC] Aucune source d’image brute → placeholder");
      return "/placeholder.jpg";
    }

    const proxied = toLocalFcImage(rawUrl);
    console.log("[FC FINAL HERO URL] →", proxied, "<-");

    // NOUVEAU GARDE-FOU ULTRA-LARGE (accepte imgproxy.net + ton ancien proxy local + placeholder)
    if (
      !proxied ||
      proxied === "/placeholder.jpg" ||
      (!proxied.startsWith("http") && !proxied.startsWith("/"))
    ) {
      console.warn("[FC] URL finale invalide → fallback forcé", proxied);
      return "/placeholder.jpg";
    }

    // Si on arrive ici → l’URL est valide (imgproxy.net ou locale)
    return proxied;
  }, [activeVariant, family]);

  if (!family) {
    return (
      <div className="p-6 text-center">
        Impossible de charger la référence FC
        <br />
        Merci de vérifier la connexion API ou l’identifiant.
      </div>
    );
  }

  const resolveEntryPrice = (variant: Variant) => {
    const prices = Object.values(variant.fabricPricing).filter(
      (p): p is number => typeof p === "number",
    );
    return prices[0];
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => window.location.assign("/")}
        >
          ← Retour catalogue
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{family.name}</h1>
        {family.providerName && <p className="text-muted-foreground">{family.providerName}</p>}
      </div>

      <Card className="overflow-hidden rounded-2xl">
        <div className="w-full rounded-2xl bg-muted flex items-center justify-center min-h-[360px]">
          {heroUrl ? (
            <img
              src={heroUrl}
              alt={family?.title || "Produit"}
              className="max-h-screen object-contain mx-auto"
              onLoad={() => console.log("[FC] Image hero chargée avec succès !")}
              onError={(e) => {
                if (e.currentTarget.src !== "/placeholder.jpg") {
                  console.error("[FC] Erreur chargement → placeholder");
                  e.currentTarget.src = "/placeholder.jpg";
                }
              }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">📸 Aucune image trouvée pour ce modèle.</div>
          )}
        </div>
      </Card>

      <VariantTable
        variants={family.variants}
        value={variantId ?? family.variants[0]?.id ?? ""}
        onChange={setVariantId}
        entryPriceResolver={resolveEntryPrice}
      />

      <GalleryLightbox items={family.gallery ?? []} />

      {activeVariant && (
        <ActionBar
          familyName={family.name}
          variantLabel={activeVariant.label}
          selectedFabric={undefined}
          selectedLeg={undefined}
        />
      )}
    </div>
  );
}
