// src/hooks/usePollingStage.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlayerStatus } from "@/api/player";

export const usePollingStage = (playerId: string | null) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerId) return;
    const interval = setInterval(async () => {
      try {
        const status = await getPlayerStatus(playerId);
        console.log("Polling stage:", status.stage);

        if (status.stage === "question") {
          navigate(`/play/${playerId}/question`);
        } else if (status.stage === "result") {
          navigate(`/play/${playerId}/result`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [playerId, navigate]);
};
