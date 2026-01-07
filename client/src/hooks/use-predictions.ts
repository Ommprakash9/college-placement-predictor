import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PredictionInput, type PredictionResponse } from "@shared/routes";

const BACKEND_URL = "https://college-placement-backend-vscs.onrender.com";

export function usePredict() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PredictionInput) => {
      const res = await fetch(
        `${BACKEND_URL}${api.predict.submit.path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to predict");
      }

      const json = await res.json();
      return json as PredictionResponse;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.history.list.path],
      });
    },
  });
}

export function usePredictionHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_URL}${api.history.list.path}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch history");
      }

      const json = await res.json();
      return api.history.list.responses[200].parse(json);
    },
  });
}
