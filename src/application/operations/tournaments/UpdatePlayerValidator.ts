import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { TournamentPlayer } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";
import { brokenBy } from "./tournamentOperations.js";
import { UpdatePlayer } from "./UpdatePlayer.js";

/**
 * What a player's update must carry, asked on the way in, as adding a player
 * asks it.
 */
export class UpdatePlayerValidator extends CommandValidator<UpdatePlayer> {
  readonly validates: RequestType<UpdatePlayer> = UpdatePlayer;

  validate(command: UpdatePlayer): readonly BrokenRule[] {
    return brokenBy("player", () =>
      TournamentPlayer.from(TournamentPlayerId.create(), command.player),
    );
  }
}
