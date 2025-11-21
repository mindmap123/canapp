import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import fetch from "node-fetch";
import fs from "fs";
import {
  addManualImage,
  fabricCategories,
  getFamilies,
  getFamilyById,
  getVariant,
  legColors,
  legTypes,
} from "./mockData";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${randomUUID()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

async function proxyFC(_req: any, res: any, endpoint: string) {
  const token = process.env.FC_API_TOKEN || "LCVsT5AdlorsB6lMCmeDcXSUMZQSyxbxw18S1PPb9cj7JIrDgZdUpnkj4oXRBuN";
  const url = `https://business.francecanape.com/api/${endpoint}?api_token=${token}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    return res.json(json);
  } catch (err) {
    console.error("[FC PROXY]", endpoint, err);
    return res.status(500).json({ error: "proxy_failed" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve generated images (non-FC) and FC cached images
  app.use(
    "/api/images",
    express.static(path.join(process.cwd(), "attached_assets/generated_images"))
  );

  // Serve uploaded images
  app.use("/api/uploads", express.static(uploadsDir));

  // Serve placeholder
  app.get("/placeholder.jpg", (_req, res) => {
    const fullPath = path.resolve(process.cwd(), "public", "placeholder.jpg");
    res.sendFile(fullPath);
  });

  // Proxy FC references (PIM)
  app.get("/api/references", async (_req, res) => {
    const token = process.env.FC_API_TOKEN || "LCVsT5AdlorsB6lMCmeDcXSUMZQSyxbxw18S1PPb9cj7JIrDgZdUpnkj4oXRBuN";
    const url = `https://business.francecanape.com/api/references?api_token=${token}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      return res.json(json);
    } catch (err) {
      console.error("[FC] Proxy error", err);
      return res.status(500).json({ error: "proxy_failed" });
    }
  });

  app.get("/api/dimensions", (req, res) => proxyFC(req, res, "dimensions"));
  app.get("/api/tissutheque", (req, res) => proxyFC(req, res, "tissutheque"));
  app.get("/api/couleurs", (req, res) => proxyFC(req, res, "couleurs"));
  app.get("/api/pieds", (req, res) => proxyFC(req, res, "pieds"));
  app.get("/api/stocks", (req, res) => proxyFC(req, res, "stocks"));

  // Get all sofas
  app.get("/api/sofas", async (req, res) => {
    try {
      const sofas = await storage.getSofas();
      res.json(sofas);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sofas" });
    }
  });

  // Filter sofas
  app.get("/api/sofas/filter", async (req, res) => {
    try {
      const filters = {
        type: req.query.type as string | undefined,
        maxWidth: req.query.maxWidth ? parseInt(req.query.maxWidth as string) : undefined,
        minDepth: req.query.minDepth ? parseInt(req.query.minDepth as string) : undefined,
        maxDepth: req.query.maxDepth ? parseInt(req.query.maxDepth as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        inStore: req.query.inStore !== undefined ? req.query.inStore === "true" : undefined,
        inStock: req.query.inStock !== undefined ? req.query.inStock === "true" : undefined,
        onOrder: req.query.onOrder !== undefined ? req.query.onOrder === "true" : undefined,
      };

      const sofas = await storage.filterSofas(filters);
      res.json(sofas);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter sofas" });
    }
  });

  // Get single sofa
  app.get("/api/sofas/:id", async (req, res) => {
    try {
      const sofa = await storage.getSofaById(req.params.id);
      if (!sofa) {
        return res.status(404).json({ error: "Sofa not found" });
      }
      res.json(sofa);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sofa" });
    }
  });

  // --- Extended domain endpoints ---
  app.get("/api/fabric-categories", (_req, res) => {
    return res.json([...fabricCategories].sort((a, b) => a.displayOrder - b.displayOrder));
  });

  app.get("/api/legs", (_req, res) => {
    return res.json({ types: legTypes, colors: legColors });
  });

  app.get("/api/families", (_req, res) => {
    return res.json(getFamilies());
  });

  app.get("/api/families/:id", (req, res) => {
    const family = getFamilyById(req.params.id);
    if (!family) {
      return res.status(404).json({ error: "Family not found" });
    }
    return res.json(family);
  });

  app.get("/api/families/:id/variants/:variantId", (req, res) => {
    const match = getVariant(req.params.id, req.params.variantId);
    if (!match) {
      return res.status(404).json({ error: "Variant not found" });
    }
    return res.json(match.variant);
  });

  // Upload photo for sofa
  app.post("/api/sofas/:id/photos", upload.single("photo"), async (req, res) => {
    try {
      const sofa = await storage.getSofaById(req.params.id);
      if (!sofa) {
        return res.status(404).json({ error: "Sofa not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No photo file provided" });
      }

      const photoUrl = `/api/uploads/${req.file.filename}`;
      const updatedSofa = await storage.updateSofa(req.params.id, {
        images: [...sofa.images, photoUrl],
      });

      res.json(updatedSofa);
    } catch (error) {
      console.error("Photo upload error:", error);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  });

  app.post("/api/families/:id/variants/:variantId/photos", upload.single("photo"), (req, res) => {
    const { id: familyId, variantId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No photo file provided" });
    }
    const newImageUrl = `/api/uploads/${req.file.filename}`;
    const added = addManualImage(familyId, variantId, newImageUrl);
    if (!added) {
      return res.status(404).json({ error: "Variant not found" });
    }
    const updated = getVariant(familyId, variantId);
    return res.json(updated?.variant ?? { gallery: [] });
  });

  const httpServer = createServer(app);

  return httpServer;
}
