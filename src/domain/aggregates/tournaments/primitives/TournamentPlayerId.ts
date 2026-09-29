import { Id } from "../../../common/Id.js";

const kind = "tournament-player";

/**
 * What a player in a tournament is known by. Everything an id does is on
 * {@link Id}.
 */
export class TournamentPlayerId extends Id {
  /**
   * What a knockout's bye is known by: every digit 0, so that every bye is
   * known by the same id, and none is ever mistaken for a player's.
   */
  static bye(): TournamentPlayerId {
    return new TournamentPlayerId(
      `${kind}/00000000-0000-0000-0000-000000000000`,
    );
  }

  static create(): TournamentPlayerId {
    return new TournamentPlayerId(Id.mint(kind));
  }

  /** The tournament player id written as `written`, or a validation refusal. */
  static from(written: string): TournamentPlayerId {
    return new TournamentPlayerId(Id.read(kind, written));
  }
}
