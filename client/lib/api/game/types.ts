// Game-related types
export interface Game {
  _id: string;
  id: number;
  slug: string;
  name: string;
  name_original?: string;
  description_raw?: string;
  metacritic?: number;
  released?: string;
  background_image?: string;
  background_image_additional?: string;
  playtime?: number;
  rating?: number;
  rating_top?: number;
  ratings_count?: number;
  publishers?: EntityBase[];
  developers?: EntityBase[];
  genres?: EntityBase[];
  esrb_rating?: EntityBase;
  createdAt?: string;
  updatedAt?: string;
}

export interface EntityBase {
  _id: string;
  id: number;
  name: string;
  slug: string;
  type: string;
}

export interface PaginatedGamesResponse {
  games: Game[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetGamesParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Generic pagination response interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Generic pagination params interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}
