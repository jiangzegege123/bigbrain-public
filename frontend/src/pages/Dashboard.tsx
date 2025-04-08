import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchGames } from "@/lib/utils";
import Navbar from "@/components/NavBar";
import type { Game, Question } from "@/types/index";

export default function Dashboard() {
  const { token } = useAuth();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames(token!);
        setGames(data.games);
      } catch (err) {
        console.error("Failed to fetch games", err);
      }
    };
    loadGames();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Games</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <div key={game.id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{game.name}</h2>
              <p>Questions: {game.questions.length}</p>
              <p>
                Total Duration:{" "}
                {game.questions.reduce(
                  (sum: number, q: Question) => sum + q.duration,
                  0
                )}{" "}
                seconds
              </p>
              {/* TODO: Add thumbnail and link to edit */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
