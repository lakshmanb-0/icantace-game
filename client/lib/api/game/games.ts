import { apiClient } from "../config";
import { Game, GetGamesParams, PaginatedGamesResponse } from "./types";

// Games API service
export class GamesService {
  // Get all games with pagination and search
  async getAllGames(params?: GetGamesParams): Promise<PaginatedGamesResponse> {
    const queryParams: Record<string, string> = {};

    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.search) queryParams.search = params.search;

    return apiClient.get<PaginatedGamesResponse>("/game/all", {
      params: queryParams,
    });
  }

  // Get a single game by ID
  async getGame(id: string): Promise<Game> {
    return apiClient.get<Game>(`/game/get-game/${id}`);
  }
}

// Create and export the games service instance
export const gamesService = new GamesService();
