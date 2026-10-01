import { Id } from "../../../common/Id.js";

const kind = "team";

/**
 * What a team in a tournament played by teams is known by. Everything an id
 * does is on {@link Id}.
 */
export class TeamId extends Id {
  static create(): TeamId {
    return new TeamId(Id.mint(kind));
  }

  /** The team id written as `written`, or a validation refusal. */
  static from(written: string): TeamId {
    return new TeamId(Id.read(kind, written));
  }
}
