import { GamesList } from "@/components/games/GamesList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">iCantAce Game</h1>
          <p className="mt-4 text-gray-600">
            Discover and explore amazing games
          </p>
        </div>

        <GamesList />
      </main>
    </div>
  );
}
