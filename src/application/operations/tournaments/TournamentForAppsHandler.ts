import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  TournamentOperationRefused,
  tournamentFor,
} from "./tournamentOperations.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";
import {
  type CompetitionForApps,
  TournamentForApps,
  type TournamentForAppsRead,
} from "./TournamentForApps.js";

// In the order a reader looks for a name in a list, capitals or none.
const byName = new Intl.Collator("en");

const later = (one: ReadOnlyDate, other: ReadOnlyDate): ReadOnlyDate =>
  other.toDate() > one.toDate() ? other : one;

const noSuchTournament = (): TournamentOperationRefused =>
  new TournamentOperationRefused(
    "TournamentForApps.NoSuchTournament",
    "There is no such tournament.",
  );

export class TournamentForAppsHandler extends QueryHandler<
  TournamentForApps,
  TournamentForAppsRead
> {
  readonly handles: RequestType<TournamentForApps> = TournamentForApps;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly changes: Pick<TournamentsByWebsite, "changedAtOfStreams">,
  ) {
    super();
  }

  async handle(query: TournamentForApps): Promise<TournamentForAppsRead> {
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "TournamentForApps",
    ).catch((failure: unknown) => {
      if (!(failure instanceof ValidationError)) throw failure;
      throw noSuchTournament();
    });
    // A tournament is of the website it was created on, and one archived is
    // not one an app is sent to, as a reader is not.
    if (
      !tournament.website.equals(Website.from(query.website)) ||
      tournament.archived
    ) {
      throw noSuchTournament();
    }

    const inUse = tournament.competitions.filter(
      ({ reference }) => !reference.archived,
    );
    const changedAt = await this.changes.changedAtOfStreams([
      tournament.id.value,
      // Every competition's, archived or not, as the list's date is: one
      // archived has gone from the answer, which is a change of it.
      ...tournament.competitions.map(({ reference }) => reference.id.value),
    ]);
    const ofTheTournament = changedAt.get(tournament.id.value);
    if (ofTheTournament === undefined) {
      throw new Error(`Nothing was kept of ${tournament.id.value}.`);
    }
    // A competition has a stream of its own only once something is done in
    // it, such as a player entered, and what makes it, names it and renames it
    // is said in the tournament's. So it has changed when either has, which is
    // never earlier than it truly did, and an app that asks again because of
    // it is only asking once more than it had to.
    const competitions: CompetitionForApps[] = inUse.map(
      ({ reference, shape }) => ({
        id: reference.id.value,
        name: reference.name.toString(),
        kind: shape.kind,
        // A test has its own part of the tournament's address, as its page does.
        address: `${tournament.address.toString()}/${shape.kind === "test" ? "tests" : "competitions"}/${reference.slug.toString()}`,
        changedAt: later(
          ofTheTournament,
          changedAt.get(reference.id.value) ?? ofTheTournament,
        ),
      }),
    );
    // The tournament has changed when it or any of its competitions has.
    const latest = tournament.competitions.reduce(
      (soFar, { reference }) =>
        later(soFar, changedAt.get(reference.id.value) ?? soFar),
      ofTheTournament,
    );

    return {
      id: tournament.id.value,
      name: tournament.name.toString(),
      starts: tournament.starts.toISOString().slice(0, 10),
      finishes: tournament.finishes.toISOString().slice(0, 10),
      country: tournament.country.code,
      region: tournament.region?.code,
      sport: tournament.sport.code,
      address: tournament.address.toString(),
      national: tournament.national,
      international: tournament.international,
      changedAt: latest,
      competitions,
      players: tournament.players
        .filter((player) => !player.archived)
        .map((player) => ({
          id: player.id.value,
          name: player.name.toString(),
          // Every player has one, but a player kept before that was so may
          // not, and is known by their name as the rest are.
          worldRankingName:
            player.worldRankingName?.toString() ?? player.name.toString(),
          handicap: player.handicap,
          representing: player.representing,
        }))
        .sort((one, other) => byName.compare(one.name, other.name)),
      teams: tournament.teams
        .filter((team) => !team.archived)
        .map((team) => ({
          id: team.id.value,
          name: team.name.toString(),
          shortName: team.shortName.toString(),
          players: team.players
            .filter((player) => !player.archived)
            .map((player) => ({
              id: player.id.value,
              name: player.name.toString(),
              worldRankingName:
                player.worldRankingName?.toString() ?? player.name.toString(),
            }))
            .sort((one, other) => byName.compare(one.name, other.name)),
        })),
    };
  }
}
