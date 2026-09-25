import { Id } from "../../../common/Id.js";

const kind = "competition-player";

/**
 * What a player in a competition is known by. Everything an id does is on
 * {@link Id}.
 */
export class CompetitionPlayerId extends Id {
  static create(): CompetitionPlayerId {
    return new CompetitionPlayerId(Id.mint(kind));
  }

  /** The competition player id written as `written`, or a validation refusal. */
  static from(written: string): CompetitionPlayerId {
    return new CompetitionPlayerId(Id.read(kind, written));
  }
}
