import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import fs from "fs";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve generated images
  app.use(
    "/api/images",
    express.static(path.join(process.cwd(), "attached_assets/generated_images"))
  );

  // Serve uploaded images
  app.use("/api/uploads", express.static(uploadsDir));

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

  const httpServer = createServer(app);

  return httpServer;
}
