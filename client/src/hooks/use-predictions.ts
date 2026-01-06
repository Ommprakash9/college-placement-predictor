import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PredictionInput, type PredictionResponse } from "@shared/routes";

// Hook to submit a prediction
export function usePredict() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: PredictionInput) => {
      const res = await fetch(api.predict.submit.path, {
        method: api.predict.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to predict");
      }
      
      // We parse with the Success response schema
      // Note: In real production, we'd be stricter with Zod parsing here too
      // but for now we trust the backend's shape mostly match our expectations or let it flow
      const json = await res.json();
      return json as PredictionResponse;
    },
    // When a new prediction is made, we might want to refetch history
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
    },
  });
}

// Hook to fetch prediction history
export function usePredictionHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(api.history.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      const json = await res.json();
      // Using Zod to validate the list response is best practice
      return api.history.list.responses[200].parse(json);
    },
  });
}
