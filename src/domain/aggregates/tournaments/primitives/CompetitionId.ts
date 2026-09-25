import { Id } from "../../../common/Id.js";

const kind = "competition";

/** What a competition is known by. Everything an id does is on {@link Id}. */
export class CompetitionId extends Id {
  static create(): CompetitionId {
    return new CompetitionId(Id.mint(kind));
  }

  /** The competition id written as `written`, or a validation refusal. */
  static from(written: string): CompetitionId {
    return new CompetitionId(Id.read(kind, written));
  }
}
