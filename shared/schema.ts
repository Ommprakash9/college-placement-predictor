import { pgTable, text, serial, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === STORAGE SCHEMAS ===
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  cgpa: real("cgpa").notNull(),
  internships: integer("internships").notNull(),
  projects: integer("projects").notNull(),
  skillLevel: integer("skill_level").notNull(),
  communicationScore: integer("communication_score").notNull(),
  prediction: boolean("prediction").notNull(), 
  probability: real("probability").notNull(),
  confidence: text("confidence").notNull().default('Medium'), // Low, Medium, High
  recommendations: jsonb("recommendations").notNull().default([]), // List of personalized tips
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({ 
  id: true, 
  createdAt: true 
});

// === API CONTRACT TYPES ===

export const predictionInputSchema = z.object({
  cgpa: z.number().min(0).max(10),
  internships: z.number().min(0),
  projects: z.number().min(0),
  skillLevel: z.number().min(1).max(10),
  communicationScore: z.number().min(1).max(10),
});

export type PredictionInput = z.infer<typeof predictionInputSchema>;

export type PredictionResponse = {
  placed: boolean;
  probability: number;
  confidence: string;
  recommendations: string[];
  input: PredictionInput;
};

export type HistoryItem = typeof predictions.$inferSelect;
