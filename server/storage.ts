import { db } from "./db";
import { predictions, type InsertPrediction, type HistoryItem } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createPrediction(prediction: InsertPrediction): Promise<HistoryItem>;
  getHistory(): Promise<HistoryItem[]>;
}

export class DatabaseStorage implements IStorage {
  async createPrediction(insertPrediction: InsertPrediction): Promise<HistoryItem> {
    const [item] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return item;
  }

  async getHistory(): Promise<HistoryItem[]> {
    return await db
      .select()
      .from(predictions)
      .orderBy(desc(predictions.createdAt))
      .limit(100);
  }
}

export const storage = new DatabaseStorage();
