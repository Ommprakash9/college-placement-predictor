import { z } from 'zod';
import { predictionInputSchema, predictions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

export const api = {
  predict: {
    submit: {
      method: 'POST' as const,
      path: '/api/predict',
      input: predictionInputSchema,
      responses: {
        200: z.object({
          placed: z.boolean(),
          probability: z.number(),
          confidence: z.enum(["Low", "Medium", "High"]),
          recommendations: z.array(z.string()),
          roadmap: z.array(z.object({ task: z.string(), status: z.string() })),
          input: predictionInputSchema
        }),
        400: errorSchemas.validation,
        500: z.object({ message: z.string() })
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof predictions.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
