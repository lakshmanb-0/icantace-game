"use client";

import { useEffect, useState } from "react";
import { gamesService } from "../api/game/games";
import { Game, GetGamesParams } from "../api/game/types";

interface UseGamesReturn {
  games: Game[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  refetch: () => void;
}

export function useGames(params?: GetGamesParams): UseGamesReturn {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await gamesService.getAllGames(params);

      setGames(response.games);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [params?.page, params?.limit, params?.search]);

  return {
    games,
    loading,
    error,
    total,
    page,
    totalPages,
    refetch: fetchGames,
  };
}
