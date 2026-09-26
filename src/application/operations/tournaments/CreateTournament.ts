import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { TournamentAddress } from "../../../domain/aggregates/tournaments/value-objects/TournamentAddress.js";
import type { TournamentRequest } from "./tournamentOperations.js";

/** A tournament created: its id, and where it is found. */
export interface CreatedTournament {
  readonly id: TournamentId;
  readonly address: TournamentAddress;
}

/**
 * Creating a tournament: the account the reader is signed in to, who creates
 * it, the website the request came to, and what the tournament is to be. It is
 * answered with the new tournament's id and the address it is found at, so that
 * the reader can be taken to it.
 */
export class CreateTournament extends Command<CreatedTournament> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The host the request came to, which the tournament is created on. */
    readonly website: string,
    readonly tournament: TournamentRequest,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
