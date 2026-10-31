import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { TournamentPlayer } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddPlayers, playerFieldNamed } from "./AddPlayers.js";

/**
 * What a list of players to be added must be, asked on the way in.
 *
 * Its shape first: that it names fields, only ones there are, each once and
 * Name among them, and that every player has as many values as there are
 * fields. A list whose shape is wrong is not asked what its players are, since
 * what a value is of depends on its field. Then each player is asked what
 * AddPlayer asks of one. The fields named are `fields`, and a player's is
 * `rows.` and their place in the list, counting from 0, so that whoever typed
 * the list is told which of them broke a rule. Every one that does is named,
 * not only the first, since a list sent once for each fault in it would be a
 * poor way to be told.
 */
export class AddPlayersValidator extends CommandValidator<AddPlayers> {
  readonly validates: RequestType<AddPlayers> = AddPlayers;

  validate(command: AddPlayers): readonly BrokenRule[] {
    const shape = this.#shapeBrokenBy(command);
    if (shape.length > 0) return shape;
    return command
      .players()
      .flatMap((player, place) =>
        brokenBy(`rows.${String(place)}`, () =>
          TournamentPlayer.ensureValid(player),
        ),
      );
  }

  #shapeBrokenBy(command: AddPlayers): readonly BrokenRule[] {
    const fields = ["fields"];
    if (command.fields.length === 0) {
      return [{ code: "AddPlayers.FieldsMissing", fields }];
    }
    const named = command.fields.map((field) => field.trim().toLowerCase());
    const broken: BrokenRule[] = [];
    named.forEach((field, place) => {
      if (playerFieldNamed[field] === undefined) {
        broken.push({ code: "AddPlayers.FieldNotAllowed", fields });
      } else if (named.indexOf(field) !== place) {
        broken.push({ code: "AddPlayers.FieldRepeated", fields });
      }
    });
    if (!named.includes("name")) {
      broken.push({ code: "AddPlayers.NameMissing", fields });
    }
    if (broken.length > 0) return broken;
    if (command.rows.length === 0) {
      return [{ code: "AddPlayers.PlayersMissing", fields: ["rows"] }];
    }
    return command.rows.flatMap((row, place) =>
      row.length === named.length
        ? []
        : [
            {
              code: "AddPlayers.ValuesMismatched",
              fields: [`rows.${String(place)}`],
            },
          ],
    );
  }
}
