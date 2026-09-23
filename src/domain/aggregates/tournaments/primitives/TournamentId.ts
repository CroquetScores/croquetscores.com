import { Id } from "../../../common/Id.js";

const kind = "tournament";

/** What a tournament is known by. Everything an id does is on {@link Id}. */
export class TournamentId extends Id {
  static create(): TournamentId {
    return new TournamentId(Id.mint(kind));
  }

  /** The tournament id written as `written`, or a validation refusal. */
  static from(written: string): TournamentId {
    return new TournamentId(Id.read(kind, written));
  }
}
