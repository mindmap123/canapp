import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ActionBarProps {
  familyName: string;
  variantLabel: string;
  selectedFabric?: string;
  selectedLeg?: string;
}

export function ActionBar({ familyName, variantLabel, selectedFabric, selectedLeg }: ActionBarProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    city: "",
    note: "",
  });

  const isValid = useMemo(
    () =>
      form.firstName &&
      form.lastName &&
      form.phone &&
      form.email &&
      form.address &&
      form.postalCode &&
      form.city,
    [form],
  );

  const Summary = () => (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Famille</Badge>
        <span>{familyName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline">Variante</Badge>
        <span>{variantLabel}</span>
      </div>
      {selectedFabric && (
        <div className="flex items-center gap-2">
          <Badge variant="outline">Tissu</Badge>
          <span>{selectedFabric}</span>
        </div>
      )}
      {selectedLeg && (
        <div className="flex items-center gap-2">
          <Badge variant="outline">Pieds</Badge>
          <span>{selectedLeg}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">Configuration sélectionnée</div>
            <div className="font-semibold">{familyName} — {variantLabel}</div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setQuoteOpen(true)}>
              Créer un devis
            </Button>
            <Button size="lg" onClick={() => setOrderOpen(true)}>
              Passer la commande
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer un devis</DialogTitle>
            <DialogDescription>Préparez l’intention de devis avec la configuration actuelle.</DialogDescription>
          </DialogHeader>
          <Summary />
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="Prénom"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <Input
                required
                placeholder="Nom"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Input
              required
              placeholder="Adresse"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="Code postal"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
              <Input
                required
                placeholder="Ville"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Notes commerciales"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setQuoteOpen(false)} disabled={!isValid}>Préparer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Passer la commande</DialogTitle>
            <DialogDescription>Collecte minimale avant envoi vers le back-office.</DialogDescription>
          </DialogHeader>
          <Summary />
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="Prénom"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <Input
                required
                placeholder="Nom"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <Input
              required
              placeholder="Adresse"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="Code postal"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
              <Input
                required
                placeholder="Ville"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Adresse / commentaires"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setOrderOpen(false)} disabled={!isValid}>Valider la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
