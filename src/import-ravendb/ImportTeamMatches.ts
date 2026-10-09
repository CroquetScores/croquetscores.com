import { toldOf } from "../application/operations/competitions/competitionOperations.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { Competition } from "../domain/aggregates/tournaments/competitions/Competition.js";
import { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { Team } from "../domain/aggregates/tournaments/Team.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { ExpectedMatches } from "../domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { TestGroup } from "../domain/aggregates/tournaments/value-objects/TestGroup.js";
import { charactersIn } from "../domain/common/charactersIn.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import { Website } from "../domain/common/Website.js";
import { type ImportingCompetitions, addGames } from "./importCompetition.js";
import { ImportRefused, describedFailure } from "./ImportRefused.js";
import { flagOf, tournamentBecome } from "./ImportTournamentPlayers.js";
import { nameToImport, numberedApart } from "./names.js";
import { dayOf } from "./newtonsoft.js";
import { oldShortNameOf, stateNamed } from "./oldSites.js";
import type { TeamMatch } from "./ravendb-models/Competition.js";
import type { Importer, ReadDocument } from "./runImporter.js";
import { bestOfImported } from "./bestOfImported.js";
import { isOldBye } from "./ImportTournamentPlayers.js";
import { TournamentPlayerId } from "../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";

// How the old sites named a team match: "Team A vs Team B".
const VERSUS = " vs ";

// As long as a short name may be (TeamShortName.ts).
const MOST_IN_A_SHORT_NAME = 10;

/**
 * What a team the old sites called `name` is called here: an Australian
 * state named by its short name is called by its whole name, since the site
 * keeps the short name apart.
 */
const teamNameOf = (name: string): string => stateNamed(name) ?? name;

/**
 * A team's short name, as the old sites called it where there was little
 * room: a country's three-letter code or an Australian state's short name, or
 * otherwise the name itself, cut to its first 10 characters where it is longer.
 */
const shortNameOf = (name: string): string =>
  oldShortNameOf(name) ??
  (charactersIn(name) <= MOST_IN_A_SHORT_NAME
    ? name
    : [...name].slice(0, MOST_IN_A_SHORT_NAME).join("").trim());

const sameName = (one: string, other: string): boolean =>
  one.toLowerCase() === other.toLowerCase();

/**
 * `shortName`, or where one of `taken` is the same in any case, as many of
 * its first characters as leave room for a space and a number within a short
 * name's 10, and the first number from 2 that makes it one none of `taken`
 * is, as "New Zeal 2". Two teams can share their first 10 characters, as
 * "New Zealand A's" and "New Zealand B's" do, and the site tells a
 * tournament's teams apart by their short names.
 */
const shortNameApart = (
  shortName: string,
  taken: readonly string[],
): string => {
  const isTaken = (candidate: string): boolean =>
    taken.some((each) => sameName(each, candidate));
  if (!isTaken(shortName)) return shortName;
  for (let number = 2; ; number += 1) {
    const after = ` ${String(number)}`;
    const kept = [...shortName]
      .slice(0, MOST_IN_A_SHORT_NAME - after.length)
      .join("")
      .trimEnd();
    const numbered = `${kept}${after}`;
    if (!isTaken(numbered)) return numbered;
  }
};

/**
 * Brings the old sites' team matches over as tests between their two teams,
 * the first named first (ImportTeamMatches.feature). A team is made the first
 * time a team match of its tournament names it, and a player of it the first
 * time a team match has them, by the number the old sites gave them in the
 * tournament, so that a team or a player named again is the one already made.
 *
 * A player representing neither team, and a game the site refuses, is kept
 * as an error naming it, and the rest are brought over. An archived team match
 * is left behind.
 */
export class ImportTeamMatches implements Importer<TeamMatch> {
  readonly collection = "TeamMatches";

  constructor(private readonly importing: ImportingCompetitions) {}

  async importDocument({
    website,
    id,
    document,
  }: ReadDocument<TeamMatch>): Promise<void> {
    const { unitOfWork, tournaments, competitions, database } = this.importing;
    const documentId = `${website}/${id}`;
    if (document.IsArchived) return;

    await unitOfWork.inTransaction(async () => {
      const tournamentDocument = document.Tournament.Id;
      const tournament = await tournamentBecome(
        database,
        tournaments,
        website,
        tournamentDocument,
      );

      // The site keeps tests only in a tournament played by teams. A team
      // match of any other with no games has nothing in it to lose; one with
      // games is refused naming both, for whoever reads it to find them.
      if (!tournament.format.isTeamFormat) {
        if (document.Games._Games.length === 0) return;
        throw new ImportRefused(
          "ImportTeamMatches.NotPlayedByTeams",
          `The team match ${documentId} has games, and its tournament ${website}/${tournamentDocument} is not played by teams.`,
        );
      }

      const split = document.Name.indexOf(VERSUS);
      if (split === -1) {
        throw new ImportRefused(
          "ImportTeamMatches.NotTwoTeams",
          `The team match "${document.Name}" is not named for two teams.`,
        );
      }
      const written = [
        document.Name.slice(0, split).trim(),
        document.Name.slice(split + VERSUS.length).trim(),
      ] as const;

      // Done as the tournament's first manager, who created it, when it was
      // created.
      const [by] = tournament.managers;
      if (by === undefined) throw new Error("The tournament has no manager.");
      const at = tournament.starts;
      const first = this.#teamCalled(tournament, written[0], by, at);
      const second = this.#teamCalled(tournament, written[1], by, at);

      const competitionId = CompetitionId.create();
      tournament.addTest(
        competitionId,
        {
          firstTeam: first.id,
          secondTeam: second.id,
          starts: dayOf(document.Start),
          finishes: dayOf(document.Finish),
          expectedMatches: ExpectedMatches.from(document.ExpectedMatches),
          bestOf: bestOfImported(document.BestOf),
          group: TestGroup.from(document.Group ?? ""),
        },
        by,
        at,
      );

      // A player is on the team they represented, which they wrote as the
      // team match named it, or by the team's name here.
      const represents = (representing: string, at: 0 | 1, team: Team) =>
        sameName(representing, written[at]) ||
        sameName(representing, team.name.toString());
      const teamRepresented = (representing: string): Team | undefined =>
        represents(representing, 0, first)
          ? first
          : represents(representing, 1, second)
            ? second
            : undefined;

      const players = new Map<number, TeamPlayerId>();
      const made: { readonly number: number; readonly id: TeamPlayerId }[] = [];
      // A player named as a bye is no player of a team, and is kept as the
      // bye by their number, as a tournament's bye is, so that every team
      // match of the tournament knows them for one (ImportTeamMatches.feature).
      const bye = TournamentPlayerId.bye().value;
      const byes = new Set<number>();
      const byesMade: number[] = [];
      for (const player of document.Players._Players) {
        try {
          const already = await database.findPlayerOf(
            website,
            tournamentDocument,
            player._Id,
          );
          if (already === bye) {
            byes.add(player._Id);
            continue;
          }
          if (already === undefined && isOldBye(player.Name)) {
            byes.add(player._Id);
            byesMade.push(player._Id);
            continue;
          }
          if (already !== undefined) {
            players.set(player._Id, TeamPlayerId.from(already));
            continue;
          }
          const team = teamRepresented((player.Representing ?? "").trim());
          if (team === undefined) {
            throw new Error(
              `The player represents ${String(player.Representing)}, which is neither team.`,
            );
          }
          const playerId = TeamPlayerId.create();
          tournament.addTeamPlayer(
            team.id,
            playerId,
            {
              name: numberedApart(
                nameToImport(player.Name),
                (
                  tournament.teams.find((each) => each.id.equals(team.id))
                    ?.players ?? []
                ).map((each) => each.name.toString()),
              ),
            },
            by,
            at,
          );
          players.set(player._Id, playerId);
          made.push({ number: player._Id, id: playerId });
        } catch (failure) {
          await database.recordError(
            documentId,
            `player ${String(player._Id)}: ${describedFailure(failure)}`,
          );
        }
      }

      await tournaments.save(tournament);
      await database.recordImportedCompetition(
        website,
        id,
        tournament.id.value,
        competitionId.value,
      );
      for (const { number, id: playerId } of made) {
        await database.recordImportedPlayer(
          website,
          tournamentDocument,
          number,
          playerId.value,
        );
      }
      for (const number of byesMade) {
        await database.recordImportedPlayer(
          website,
          tournamentDocument,
          number,
          bye,
        );
      }

      const competition = Competition.rebuiltFrom(competitionId, []);
      await addGames(
        database,
        documentId,
        competition,
        // A game against a bye is no game that was played.
        document.Games._Games.filter(
          (game) =>
            !byes.has(game.Winner.PlayerId) && !byes.has(game.Loser.PlayerId),
        ),
        (number) => players.get(number),
        toldOf(tournament, competitionId),
        Website.from(website),
        by,
      );
      await competitions.save(competition);
    });
  }

  // The tournament's team the old sites called `written`, made the first time
  // it is named.
  #teamCalled(
    tournament: Tournament,
    written: string,
    by: AccountId,
    at: ReadOnlyDate,
  ): Team {
    const name = teamNameOf(written);
    const found = (): Team | undefined =>
      tournament.teams.find((team) => sameName(team.name.toString(), name));
    const already = found();
    if (already !== undefined) return already;
    tournament.addTeam(
      TeamId.create(),
      {
        name,
        shortName: shortNameApart(
          shortNameOf(name),
          tournament.teams.map((team) => team.shortName.toString()),
        ),
        flag: flagOf(name),
      },
      by,
      at,
    );
    const made = found();
    if (made === undefined) throw new Error("The team added is not there.");
    return made;
  }
}
