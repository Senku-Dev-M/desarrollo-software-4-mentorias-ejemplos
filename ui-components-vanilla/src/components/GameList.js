import { EmptyState } from "./EmptyState.js";
import { GameCard } from "./GameCard.js";

export function GameList({ games, wishlistIds, emptyState }) {
  if (games.length === 0) {
    return EmptyState(emptyState);
  }

  return `
    <div class="game-list">
      ${games
        .map((game) =>
          GameCard({
            game,
            isWishlisted: wishlistIds.has(game.id),
          }),
        )
        .join("")}
    </div>
  `;
}
