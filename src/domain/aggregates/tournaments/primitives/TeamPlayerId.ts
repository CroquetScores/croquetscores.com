import { Id } from "../../../common/Id.js";

const kind = "team-player";

/**
 * What a player in a team is known by, and what a game in a test names them
 * by. Everything an id does is on {@link Id}.
 */
export class TeamPlayerId extends Id {
  static create(): TeamPlayerId {
    return new TeamPlayerId(Id.mint(kind));
  }

  /** The team player id written as `written`, or a validation refusal. */
  static from(written: string): TeamPlayerId {
    return new TeamPlayerId(Id.read(kind, written));
  }

  /**
   * Whether `written` is a team player id's writing, for what reads back an id
   * that may be one of several kinds, such as a game's player.
   */
  static isWriting(written: string): boolean {
    return written.startsWith(`${kind}/`);
  }
}
