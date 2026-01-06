import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

// Model weights type
interface ModelWeights {
  intercept: number[];
  coefficients: number[][]; // Scikit-learn structure: [[c1, c2, ...]]
  classes: number[];
}

// Load model weights at startup
let modelWeights: ModelWeights | null = null;
const MODEL_PATH = path.join(process.cwd(), 'model', 'model.json');

try {
  if (fs.existsSync(MODEL_PATH)) {
    const data = fs.readFileSync(MODEL_PATH, 'utf-8');
    modelWeights = JSON.parse(data);
    console.log("ML Model loaded successfully.");
  } else {
    console.warn("Model file not found. Predictions will use fallback logic until trained.");
  }
} catch (error) {
  console.error("Error loading model:", error);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Prediction Endpoint
  app.post(api.predict.submit.path, async (req, res) => {
    try {
      const input = api.predict.submit.input.parse(req.body);
      
      let probability = 0.5;
      let placed = false;

      if (modelWeights) {
        // Logistic Regression Inference: z = intercept + (coef * features)
        // Feature order MUST match training: [cgpa, internships, projects, skillLevel, communicationScore]
        const features = [
          input.cgpa,
          input.internships,
          input.projects,
          input.skillLevel,
          input.communicationScore
        ];

        // coefficients is usually shape (1, n_features) for binary classification
        const coefs = modelWeights.coefficients[0];
        const intercept = modelWeights.intercept[0];

        let logit = intercept;
        for (let i = 0; i < features.length; i++) {
          logit += features[i] * coefs[i];
        }

        // Sigmoid function
        probability = 1 / (1 + Math.exp(-logit));
        placed = probability > 0.5;

      } else {
        // Fallback Heuristic if model missing (e.g., first run)
        // High CGPA (>8) + Skills (>7) usually means placed
        const score = 
          (input.cgpa * 1.5) + 
          (input.skillLevel * 1.0) + 
          (input.communicationScore * 0.8) +
          (input.internships * 2.0) +
          (input.projects * 1.5);
          
        // Normalize roughly to 0-1 range based on max possible score
        // Max ~ (10*1.5 + 10*1 + 10*0.8 + 5*2 + 5*1.5) = 15+10+8+10+7.5 = 50.5
        probability = Math.min(Math.max(score / 45, 0), 1);
        placed = probability > 0.6;
      }

      // Store in DB
      await storage.createPrediction({
        cgpa: input.cgpa,
        internships: input.internships,
        projects: input.projects,
        skillLevel: input.skillLevel,
        communicationScore: input.communicationScore,
        prediction: placed,
        probability: probability
      });

      res.json({
        placed,
        probability,
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

  // History Endpoint
  app.get(api.history.list.path, async (req, res) => {
    const history = await storage.getHistory();
    res.json(history);
  });

  // Seed data if empty
  const history = await storage.getHistory();
  if (history.length === 0 && fs.existsSync('dataset/placement.csv')) {
    console.log("Seeding database with initial data...");
    const csvContent = fs.readFileSync('dataset/placement.csv', 'utf-8');
    const rows = csvContent.split('\n').slice(1).filter(r => r.trim()); // Skip header
    
    // Insert last 20 rows as "recent predictions"
    const seedRows = rows.slice(-20);
    for (const row of seedRows) {
      const cols = row.split(',');
      if (cols.length >= 6) {
        await storage.createPrediction({
          cgpa: parseFloat(cols[0]),
          internships: parseInt(cols[1]),
          projects: parseInt(cols[2]),
          skillLevel: parseInt(cols[3]),
          communicationScore: parseInt(cols[4]),
          prediction: parseInt(cols[5]) === 1,
          probability: parseInt(cols[5]) === 1 ? 0.9 : 0.1 // Mock probability for seed data
        });
      }
    }
    console.log("Seeding complete.");
  }

  return httpServer;
}
