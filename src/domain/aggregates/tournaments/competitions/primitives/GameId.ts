import { Id } from "../../../../common/Id.js";

const kind = "game";

/**
 * What a game played in a competition is known by. Two games between the same
 * players with the same scores are still two games, so a game is known by its
 * id and not by what it says. Everything an id does is on {@link Id}.
 */
export class GameId extends Id {
  static create(): GameId {
    return new GameId(Id.mint(kind));
  }

  /** The game id written as `written`, or a validation refusal. */
  static from(written: string): GameId {
    return new GameId(Id.read(kind, written));
  }
}
