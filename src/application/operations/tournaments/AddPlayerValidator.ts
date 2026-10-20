import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { TournamentPlayer } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddPlayer } from "./AddPlayer.js";

/**
 * What a player to be added must carry, asked on the way in: a person's name,
 * and a flag there is if there is one. Asked by making the player, which asks
 * both.
 */
export class AddPlayerValidator extends CommandValidator<AddPlayer> {
  readonly validates: RequestType<AddPlayer> = AddPlayer;

  validate(command: AddPlayer): readonly BrokenRule[] {
    return brokenBy("player", () =>
      TournamentPlayer.ensureValid(command.player),
    );
  }
}
