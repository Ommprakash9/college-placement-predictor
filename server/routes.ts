import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Model weights type
interface ModelWeights {
  intercept: number[];
  coefficients: number[][];
  classes: number[];
}

// Load model weights at startup
let modelWeights: ModelWeights | null = null;
const MODEL_PATH = path.join(process.cwd(), "model", "model.json");

try {
  if (fs.existsSync(MODEL_PATH)) {
    const data = fs.readFileSync(MODEL_PATH, "utf-8");
    modelWeights = JSON.parse(data);
    console.log("ML Model loaded successfully.");
  } else {
    console.warn("Model file not found. Using fallback logic.");
  }
} catch (error) {
  console.error("Error loading model:", error);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============================
  // PREDICTION ENDPOINT (WORKING)
  // ============================
  app.post(api.predict.submit.path, async (req, res) => {
    try {
      const input = api.predict.submit.input.parse(req.body);

      let probability = 0.5;
      let placed = false;

      if (modelWeights) {
        const features = [
          input.cgpa,
          input.internships,
          input.projects,
          input.skillLevel,
          input.communicationScore
        ];

        const coefs = modelWeights.coefficients[0];
        const intercept = modelWeights.intercept[0];

        let logit = intercept;
        for (let i = 0; i < features.length; i++) {
          logit += features[i] * coefs[i];
        }

        probability = 1 / (1 + Math.exp(-logit));
        placed = probability > 0.5;
      } else {
        const score =
          input.cgpa * 1.5 +
          input.skillLevel * 1.0 +
          input.communicationScore * 0.8 +
          input.internships * 2.0 +
          input.projects * 1.5;

        probability = Math.min(Math.max(score / 45, 0), 1);
        placed = probability > 0.6;
      }

      const confidence =
        probability > 0.8 ? "High" :
        probability > 0.4 ? "Medium" :
        "Low";

      const recommendations: string[] = [];
      const roadmap: { title: string; status: "complete" | "pending" }[] = [];

      if (input.cgpa < 8) {
        recommendations.push("Improve CGPA to 8+.");
        roadmap.push({ title: "Academic Excellence (CGPA 8+)", status: "pending" });
      } else {
        roadmap.push({ title: "Academic Excellence (CGPA 8+)", status: "complete" });
      }

      if (input.internships < 1) {
        recommendations.push("Get at least one internship.");
        roadmap.push({ title: "Industry Internship", status: "pending" });
      } else {
        roadmap.push({ title: "Industry Internship", status: "complete" });
      }

      if (input.projects < 3) {
        recommendations.push("Build more projects.");
        roadmap.push({ title: "Project Portfolio (3+ Projects)", status: "pending" });
      } else {
        roadmap.push({ title: "Project Portfolio (3+ Projects)", status: "complete" });
      }

      if (input.skillLevel < 7) {
        recommendations.push("Upskill technical strengths.");
        roadmap.push({ title: "Advanced Technical Upskilling", status: "pending" });
      } else {
        roadmap.push({ title: "Advanced Technical Upskilling", status: "complete" });
      }

      if (input.communicationScore < 7) {
        recommendations.push("Improve communication skills.");
        roadmap.push({ title: "Soft Skills & Mock Interviews", status: "pending" });
      } else {
        roadmap.push({ title: "Soft Skills & Mock Interviews", status: "complete" });
      }

      // SAVE PREDICTION (DB WRITE IS OK)
      await storage.createPrediction({
        cgpa: input.cgpa,
        internships: input.internships,
        projects: input.projects,
        skillLevel: input.skillLevel,
        communicationScore: input.communicationScore,
        prediction: placed,
        probability,
        confidence,
        recommendations,
        roadmap
      });

      res.json({
        placed,
        probability,
        confidence,
        recommendations,
        roadmap,
        input
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input" });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==========================================
  // HISTORY ENDPOINT (TEMPORARILY DISABLED)
  // ==========================================
  // app.get(api.history.list.path, async (req, res) => {
  //   const history = await storage.getHistory();
  //   res.json(history);
  // });

  // ==========================================
  // SEEDING LOGIC (TEMPORARILY DISABLED)
  // ==========================================
  // const history = await storage.getHistory();
  // if (history.length === 0 && fs.existsSync("dataset/placement.csv")) {
  //   console.log("Seeding database...");
  // }

  return httpServer;
}
