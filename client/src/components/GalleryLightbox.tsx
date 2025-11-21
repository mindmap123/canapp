import { useState } from "react";
import { GalleryItem } from "@shared/domain";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface GalleryLightboxProps {
  items: GalleryItem[];
  onUpload?: () => void;
  uploading?: boolean;
}

export function GalleryLightbox({ items, onUpload, uploading }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const activeItem = items[activeIndex];

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden rounded-2xl">
        <div className="aspect-video bg-muted relative">
          {activeItem ? (
            <img
              src={activeItem.url}
              alt={activeItem.alt}
              className="w-full h-full object-contain max-h-[480px]"
              referrerPolicy="no-referrer"
              onError={() => console.warn("[FC] image cassée dans lightbox", activeItem.url)}
              onClick={() => setOpen(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Aucune image
            </div>
          )}
        </div>
      </Card>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(idx)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              activeIndex === idx ? "border-primary" : "border-transparent"
            }`}
          >
            <img
              src={item.url}
              alt={item.alt}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={() => console.warn("[FC] image cassée dans lightbox", item.url)}
            />
          </button>
        ))}
        {onUpload && (
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 w-20 h-20"
            onClick={onUpload}
            disabled={uploading}
          >
            <Upload className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          {activeItem && (
            <div className="w-full">
              <img
                src={activeItem.url}
                alt={activeItem.alt ?? "Image de la galerie"}
                className="w-full h-full object-contain max-h-[75vh]"
                referrerPolicy="no-referrer"
                onError={() => console.warn("[FC] image cassée dans lightbox", activeItem.url)}
              />
              <div className="mt-3 text-sm text-muted-foreground flex items-center justify-between">
                <span>{activeItem.alt}</span>
                <span className="uppercase text-xs">{activeItem.sourceType}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
