import { useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import AvailabilityBadge from "@/components/AvailabilityBadge";
import ProductCard from "@/components/ProductCard";
import { useSelection } from "@/lib/selectionContext";
import { queryClient } from "@/lib/queryClient";
import { fetchSofaById, fetchSofas, uploadPhotoToSofa } from "@/lib/api";
import { ArrowLeft, Plus, Ruler, Sofa as SofaIcon, Check, Upload } from "lucide-react";
import { AvailabilityType } from "@/components/AvailabilityBadge";
import { Sofa } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleSelection } = useSelection();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: sofa, isLoading } = useQuery({
    queryKey: ["/api/sofas", params?.id],
    queryFn: () => fetchSofaById(params!.id),
    enabled: !!params?.id,
  });

  const { data: allSofas } = useQuery({
    queryKey: ["/api/sofas"],
    queryFn: fetchSofas,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadPhotoToSofa(params!.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sofas", params?.id] });
      toast({
        title: "Photo ajoutée",
        description: "La photo a été ajoutée à la galerie avec succès",
      });
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

  if (isLoading) {
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

  if (!sofa) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button onClick={() => setLocation("/catalog")}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  const getAvailability = (): AvailabilityType[] => {
    const availability: AvailabilityType[] = [];
    if (sofa.inStore) availability.push("store");
    if (sofa.inStock) availability.push("stock");
    if (sofa.onOrder) availability.push("order");
    return availability;
  };

  const variants = allSofas?.filter(
    (s) => s.type === sofa.type && s.id !== sofa.id
  ) || [];

  const getVariantAvailability = (variant: Sofa): AvailabilityType[] => {
    const av: AvailabilityType[] = [];
    if (variant.inStore) av.push("store");
    if (variant.inStock) av.push("stock");
    if (variant.onOrder) av.push("order");
    return av;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/catalog")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted">
              <img
                src={sofa.images[currentImageIndex] || sofa.mainImage}
                alt={sofa.name}
                className="w-full h-full object-cover"
                data-testid="img-product-hero"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {sofa.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  data-testid={`button-thumbnail-${idx}`}
                >
                  <img
                    src={img}
                    alt={`${sofa.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <Button
                variant="outline"
                className="flex-shrink-0 w-20 h-20"
                data-testid="button-add-photo"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? (
                  <Upload className="w-5 h-5 animate-pulse" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-4xl font-bold" data-testid="text-product-name">
                  {sofa.name}
                </h1>
                <Badge variant="outline" className="capitalize">
                  {sofa.type}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {getAvailability().map((av) => (
                  <AvailabilityBadge key={av} type={av} />
                ))}
              </div>
              <p className="text-muted-foreground text-lg">{sofa.description}</p>
            </div>

            <div className="flex items-baseline gap-2 py-6 border-y">
              <span className="text-5xl font-bold" data-testid="text-price">
                {parseFloat(sofa.price).toLocaleString("fr-FR")}€
              </span>
              <span className="text-lg text-muted-foreground">TTC</span>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14" 
              data-testid="button-add-to-selection"
              onClick={() => toggleSelection(sofa.id)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter à ma sélection
            </Button>
          </div>
        </div>

        {/* Specifications */}
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
                  L {sofa.width} × P {sofa.depth} × H {sofa.height} cm
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <SofaIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium mb-1">Confort</div>
                <div className="text-sm text-muted-foreground">{sofa.comfort}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-medium mb-1">Type</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {sofa.type}
                </div>
              </div>
            </div>
          </div>

          {sofa.features && sofa.features.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Points forts</h3>
              <ul className="space-y-2">
                {sofa.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-availability-store mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Variants */}
        {variants.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Autres variantes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {variants.map((variant) => (
                <ProductCard
                  key={variant.id}
                  id={variant.id}
                  name={variant.name}
                  version={`${variant.width} cm – ${variant.type}`}
                  price={parseFloat(variant.price)}
                  mainImage={variant.mainImage}
                  type={variant.type as any}
                  availability={getVariantAvailability(variant)}
                  onViewDetails={() => setLocation(`/product/${variant.id}`)}
                  onAddToSelection={() => toggleSelection(variant.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
