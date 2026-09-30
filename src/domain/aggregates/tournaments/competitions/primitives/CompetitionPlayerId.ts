import { Id } from "../../../../common/Id.js";

const kind = "competition-player";

/**
 * What a player in a competition is known by. Everything an id does is on
 * {@link Id}.
 */
export class CompetitionPlayerId extends Id {
  /**
   * What a knockout's bye is known by: every digit 0, so that every bye is
   * known by the same id, and none is ever mistaken for a player's.
   */
  static bye(): CompetitionPlayerId {
    return new CompetitionPlayerId(
      `${kind}/00000000-0000-0000-0000-000000000000`,
    );
  }

  static create(): CompetitionPlayerId {
    return new CompetitionPlayerId(Id.mint(kind));
  }

  /** The competition player id written as `written`, or a validation refusal. */
  static from(written: string): CompetitionPlayerId {
    return new CompetitionPlayerId(Id.read(kind, written));
  }
}
