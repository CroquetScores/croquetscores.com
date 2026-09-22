import { Id } from "../../../common/Id.js";

const kind = "tournament-player";

/**
 * What a player in a tournament is known by. Everything an id does is on
 * {@link Id}.
 */
export class TournamentPlayerId extends Id {
  static create(): TournamentPlayerId {
    return new TournamentPlayerId(Id.mint(kind));
  }

  /** The tournament player id written as `written`, or a validation refusal. */
  static from(written: string): TournamentPlayerId {
    return new TournamentPlayerId(Id.read(kind, written));
  }
}
