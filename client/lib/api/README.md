# Games API with Axios

This API client uses Axios for HTTP requests with built-in error handling, request/response interceptors, and TypeScript support.

## Features

✅ **Axios-based HTTP client** with timeout and interceptors  
✅ **TypeScript support** with proper type definitions  
✅ **Error handling** with detailed error messages  
✅ **Request/Response logging** for debugging  
✅ **Automatic query parameter handling**

## Configuration

Set your API base URL in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Usage Examples

### Basic Usage

```tsx
import { gamesService } from "@/lib/api/game/games";

// Get all games
const response = await gamesService.getAllGames({
  page: 1,
  limit: 20,
  search: "action",
});

// Get single game
const game = await gamesService.getGame("gameId");
```

### With React Hook

```tsx
import { useGames } from "@/lib/hooks/useGames";

function GamesList() {
  const { games, loading, error } = useGames({
    page: 1,
    limit: 20,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {games.map((game) => (
        <div key={game._id}>{game.name}</div>
      ))}
    </div>
  );
}
```

### Direct API Client Usage

```tsx
import { apiClient } from "@/lib/api/config";

// GET request
const games = await apiClient.get("/game/all", {
  params: { page: 1, limit: 20 },
});

// POST request
const result = await apiClient.post("/game/upsert", {
  // request body data
});
```

## API Methods

### Games Service

- `getAllGames(params?)` - Get paginated games with optional search
- `getGame(id)` - Get single game by ID
- `upsertGames()` - Trigger games upsert from RAWG API

### API Client Methods

- `get<T>(endpoint, config?)` - GET request
- `post<T>(endpoint, data?, config?)` - POST request
- `put<T>(endpoint, data?, config?)` - PUT request
- `patch<T>(endpoint, data?, config?)` - PATCH request
- `delete<T>(endpoint, config?)` - DELETE request

## Error Handling

The API client automatically handles different types of errors:

- **Network errors** - No response from server
- **HTTP errors** - Server responded with error status
- **Timeout errors** - Request took too long
- **Request errors** - Invalid request configuration

All errors are logged to the console and thrown as Error objects with descriptive messages.
