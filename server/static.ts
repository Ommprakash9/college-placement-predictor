import path from "path";
import { fileURLToPath } from "url";
import type { Express } from "express";
import express from "express";

// ESM-safe __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const publicPath = path.resolve(__dirname, "public");

  // Only serve static files if folder exists
  app.use(express.static(publicPath));
}
