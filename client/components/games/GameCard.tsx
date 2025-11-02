import { Game } from "@/lib/api/game/types";
import Image from "next/image";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {game.background_image && (
        <div className="relative h-48 w-full">
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {game.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Released: {game.released || "TBA"}</span>
          {game.metacritic && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {game.metacritic}
            </span>
          )}
        </div>

        {game.genres && game.genres.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {game.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre._id}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
