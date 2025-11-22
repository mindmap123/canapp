import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Download, Plus, Ruler, Sofa as SofaIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import ProductCard from "@/components/ProductCard";
import { useSelection } from "@/lib/selectionContext";
import {
  fetchFabricCategories,
  fetchFamilies,
  fetchFamilyById,
  fetchLegData,
  uploadPhotoToVariant,
  fetchFCReferenceById,
} from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { FabricCategory, LegConfig, ProductFamily, Variant } from "@shared/domain";
import { VariantTable } from "@/components/VariantTable";
import { FabricPricingGrid } from "@/components/FabricPricingGrid";
import { LegSelector } from "@/components/LegSelector";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { ActionBar } from "@/components/ActionBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adaptFCReferenceToProductFamily, toLocalFcImage } from "@/lib/adapters/internal";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:type/:id");
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toggleSelection } = useSelection();
  const { toast } = useToast();

  const familyId = params?.id || "";
  const type = params?.type || "local";

  const { data: familyData, isLoading: isLoadingLocal } = useQuery({
    queryKey: ["family", familyId],
    queryFn: () => fetchFamilyById(familyId),
    enabled: !!familyId && type === "local",
  });

  const { data: fcReference, isLoading: isLoadingFC } = useQuery({
    queryKey: ["fc-reference", familyId],
    queryFn: () => fetchFCReferenceById(familyId),
    enabled: !!familyId && type === "fc",
  });

  const family = useMemo(() => {
    if (type === 'fc' && fcReference) {
      return adaptFCReferenceToProductFamily(fcReference);
    }
    return familyData;
  }, [type, fcReference, familyData]);

  const isLoading = isLoadingLocal || isLoadingFC;

  const { data: categories } = useQuery({
    queryKey: ["fabric-categories"],
    queryFn: fetchFabricCategories,
  });

  const { data: legData } = useQuery({
    queryKey: ["legs"],
    queryFn: fetchLegData,
  });

  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [selectedLeg, setSelectedLeg] = useState<LegConfig | null>(null);
  const [techOpen, setTechOpen] = useState(false);

  useEffect(() => {
    if (family && !activeVariantId) {
      setActiveVariantId(family.variants[0]?.id ?? null);
    }
  }, [family, activeVariantId]);

  const activeVariant: Variant | null = useMemo(() => {
    return family?.variants.find((v) => v.id === activeVariantId) ?? null;
  }, [family, activeVariantId]);

  useEffect(() => {
    if (activeVariant) {
      const defaultLeg = activeVariant.legs.find((l) => l.isDefault) ?? activeVariant.legs[0] ?? null;
      setSelectedLeg(defaultLeg ?? null);
    }
  }, [activeVariant]);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadPhotoToVariant(familyId, activeVariantId!, file),
    onSuccess: (variant) => {
      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée à la galerie avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["family", familyId] });
      queryClient.invalidateQueries({ queryKey: ["families"] });
      // Update active variant gallery
      setActiveVariantId(variant.id);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la photo",
        variant: "destructive",
      });
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const { data: families } = useQuery({
    queryKey: ["families"],
    queryFn: fetchFamilies,
  });

  const relatedFamilies: ProductFamily[] =
    families?.filter((f) => f.id !== familyId && f.familyType === family?.familyType).slice(0, 3) ?? [];

  const handleVariantChange = (variantId: string) => {
    setActiveVariantId(variantId);
  };

  const availabilityBadges = (variant: Variant | null) => {
    const badges: ("store" | "stock" | "order" | "instock_stores")[] = [];
    if (!variant) return badges;
    const states = variant.availability.map((a) => a.state);
    if (states.includes("expo")) badges.push("store");
    if (states.includes("stock")) badges.push("stock");
    if (states.includes("commande")) badges.push("order");
    if (states.includes("instock_stores")) badges.push("instock_stores");
    return badges;
  };

  if (isLoading || !family || !activeVariant) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/catalog")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-video rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const heroPrice = (() => {
    const ordered = categories ?? [];
    const first = ordered.find(
      (c) => activeVariant.fabricPricing[c.code] !== undefined || activeVariant.fabricPricing[c.id] !== undefined,
    );
    return first ? (activeVariant.fabricPricing[first.code] ?? activeVariant.fabricPricing[first.id]) ?? undefined : undefined;
  })();

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/catalog")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => toggleSelection(activeVariantId!)}>
            Ajouter à ma sélection
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
          <GalleryLightbox
              items={activeVariant.gallery.map(item => ({...item, url: toLocalFcImage(item.url)}))}
              onUpload={() => fileInputRef.current?.click()}
              uploading={uploadMutation.isPending}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">{family.familyType}</p>
                  <h1 className="text-4xl font-bold" data-testid="text-product-name">
                    {family.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">{family.description}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {activeVariant.variantType}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {availabilityBadges(activeVariant).map((av) => (
                  <AvailabilityBadge key={av} type={av} />
                ))}
              </div>
            </div>

            <div className="flex items-baseline gap-2 py-6 border-y">
              <span className="text-5xl font-bold" data-testid="text-price">
                {heroPrice ? `${heroPrice.toLocaleString("fr-FR")}€` : "Tarif sur demande"}
              </span>
              <span className="text-lg text-muted-foreground">TTC</span>
            </div>

            <VariantTable
              variants={family.variants}
              value={activeVariantId!}
              onChange={handleVariantChange}
              entryPriceResolver={(variant) => {
                const match = categories?.find(
                  (c) => variant.fabricPricing[c.code] !== undefined || variant.fabricPricing[c.id] !== undefined,
                );
                if (!match) return undefined;
                return (variant.fabricPricing[match.code] ?? variant.fabricPricing[match.id]) ?? undefined;
              }}
            />

            <Button
              size="lg"
              variant="outline"
              className="w-full h-14 flex items-center justify-center gap-2"
              onClick={() => setTechOpen(true)}
              disabled={!activeVariant.technicalSheetUrl}
            >
              <Download className="w-4 h-4" />
              Fiche technique
            </Button>
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Caractéristiques</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Ruler className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium mb-1">Dimensions</div>
                <div className="text-sm text-muted-foreground">
                  L {activeVariant.dimensions.width} × P {activeVariant.dimensions.depth} × H {activeVariant.dimensions.height} cm
                </div>
                {activeVariant.dimensions.seatHeight && (
                  <div className="text-xs text-muted-foreground">Assise {activeVariant.dimensions.seatHeight} cm</div>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SofaIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium mb-1">Collection</div>
                <div className="text-sm text-muted-foreground">{family.collectionName ?? "Collection"}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium mb-1">Notes</div>
                <div className="text-sm text-muted-foreground">
                  {family.tags?.join(" · ") ?? "Finitions premium"}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {categories && (
          <FabricPricingGrid categories={categories} pricing={activeVariant.fabricPricing} />
        )}

        {legData && activeVariant.legs.length > 0 && (
          <LegSelector
            legs={activeVariant.legs}
            legTypes={legData.types}
            legColors={legData.colors}
            value={selectedLeg}
            onChange={setSelectedLeg}
          />
        )}

        {activeVariant.availability.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Disponibilités</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {activeVariant.availability.map((av) => (
                <div key={`${av.location}-${av.state}`} className="p-4 rounded-xl border hover-elevate">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{av.location}</div>
                    <Badge variant="outline">
                      {av.state === "expo" ? "Expo" : av.state === "stock" ? "Stock" : "Commande"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {av.delay ?? "Délai standard"}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {relatedFamilies.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Autres modèles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedFamilies.map((fam) => {
                const defaultVariant = fam.variants[0];
                const matchCat = categories?.find(
                  (c) =>
                    defaultVariant.fabricPricing[c.code] !== undefined ||
                    defaultVariant.fabricPricing[c.id] !== undefined,
                );
                const displayPrice = matchCat
                  ? (defaultVariant.fabricPricing[matchCat.code] ?? defaultVariant.fabricPricing[matchCat.id]) ?? undefined
                  : undefined;
                return (
                  <ProductCard
                    key={fam.id}
                    id={fam.id}
                    name={fam.name}
                    version={`${defaultVariant.dimensions.width ?? "—"} cm – ${defaultVariant.variantType}`}
                    price={displayPrice ?? undefined}
                    mainImage={defaultVariant.gallery[0]?.url || "/api/images/beige_modern_fixed_sofa.png"}
                    type={fam.familyType as any}
                    availability={availabilityBadges(defaultVariant as Variant)}
                    onViewDetails={() => setLocation(`/product/local/${fam.id}`)}
                    onAddToSelection={() => toggleSelection(defaultVariant.id)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ActionBar
        familyName={family.name}
        variantLabel={activeVariant.label}
        selectedFabric={
          categories?.find(
            (c) => activeVariant.fabricPricing[c.code] !== undefined || activeVariant.fabricPricing[c.id] !== undefined,
          )?.label
        }
        selectedLeg={
          selectedLeg
            ? `${legData?.types.find((t) => t.id === selectedLeg.legTypeId)?.name ?? ""} / ${
                legData?.colors.find((c) => c.id === selectedLeg.colorId)?.name ?? ""
              }`
            : undefined
        }
      />

      <Dialog open={techOpen} onOpenChange={setTechOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Fiche technique</DialogTitle>
          </DialogHeader>
          {activeVariant.technicalSheetUrl ? (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">Le lien s’ouvre dans un nouvel onglet.</p>
              <Button asChild>
                <a href={activeVariant.technicalSheetUrl} target="_blank" rel="noreferrer">
                  Ouvrir la fiche PDF
                </a>
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Aucune fiche disponible.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
