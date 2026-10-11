import { toldOf } from "../application/operations/competitions/competitionOperations.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { Competition } from "../domain/aggregates/tournaments/competitions/Competition.js";
import { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import type { Team } from "../domain/aggregates/tournaments/Team.js";
import type { TeamPlayer } from "../domain/aggregates/tournaments/TeamPlayer.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { ExpectedMatches } from "../domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { TestGroup } from "../domain/aggregates/tournaments/value-objects/TestGroup.js";
import { charactersIn } from "../domain/common/charactersIn.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import { Website } from "../domain/common/Website.js";
import { DocumentErrors } from "./AcceptedImportErrors.js";
import {
  AGAINST_A_BYE,
  type ImportingCompetitions,
  addGames,
  gamesInOrder,
  type Instead,
  nameOfIn,
  type PutRight,
  withItsLists,
  withWinnersFromScores,
} from "./importCompetition.js";
import { ImportRefused } from "./ImportRefused.js";
import { flagOf, tournamentBecome } from "./ImportTournamentPlayers.js";
import { nameToImport, numberedApart } from "./names.js";
import { dayOf } from "./newtonsoft.js";
import { oldShortNameOf, stateNamed } from "./oldSites.js";
import type {
  Game as OldGame,
  TeamMatch,
} from "./ravendb-models/Competition.js";
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

// Whether two players' names are the same name, in any case and with any
// spaces, and without the number a team puts after a name it has twice, as
// "Sam Someone (2)".
const sameBaseName = (one: string, other: string): boolean => {
  const base = (name: string): string =>
    name
      .replace(/\s*\(\d+\)\s*$/, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  return base(one) === base(other);
};

// A name without what is in brackets at its end, as "Real Club Puerta de
// Hierro" of "Real Club Puerta de Hierro (Group A)".
const beforeBrackets = (name: string): string =>
  name.replace(/\s*\([^()]*\)$/, "").trim();

// Team matches whose games were entered out of the order they were played,
// by the website and the document, with the numbers of the games in the order
// they were played (ImportTeamMatches.feature). TeamMatches/359, Germany vs
// Belgium at the 2012 GC World Team Championship: Bruno Hess beat
// Charles-Eric Vilain 7-4, lost 3-7, and won 7-5.
const PLAYED_IN_ORDER: ReadonlyMap<string, readonly number[]> = new Map([
  ["croquetscores.com/teammatches/359", [6, 17, 10]],
]);

/**
 * `games` in the order the old sites numbered them, but those `inOrder`
 * names in the order it names them, in the places they had between them, so
 * that every other game keeps its own.
 */
const reordered = (
  games: readonly OldGame[],
  inOrder: readonly number[],
): OldGame[] => {
  const numbered = gamesInOrder(games);
  const named = inOrder
    .map((id) => numbered.find((game) => game.Id === id))
    .filter((game): game is OldGame => game !== undefined);
  let next = 0;
  return numbered.map((game) =>
    inOrder.includes(game.Id) ? (named[next++] ?? game) : game,
  );
};

// A pair, rather than one player: a name with ",", "/", "&" or "and" in it,
// as "Ann Able & Ben Baker" (ImportTeamMatches.feature).
const isAPair = (name: string): boolean => /,|\/|&|\band\b/i.test(name);

const scoresOf = (game: OldGame): string =>
  `${String(game.Winner.PlayerId)} ${game.Winner.Score._Score} ${String(game.Loser.PlayerId)} ${game.Loser.Score._Score}`;

const playedBetween = (
  games: readonly OldGame[],
  one: number,
  other: number,
): boolean =>
  games.some(
    (game) =>
      (game.Winner.PlayerId === one && game.Loser.PlayerId === other) ||
      (game.Winner.PlayerId === other && game.Loser.PlayerId === one),
  );

// "v" or "vs" between two names, as "Glamorgan v Bristol".
const VERSUS_WORD = /\s+(?:vs|v)\s+/i;

/**
 * `name` written "A vs B", as a team match is named, where it is named for two
 * teams with "v" or "vs" between them; nothing where it is not.
 */
export const namedForTwoTeams = (name: string): string | undefined => {
  const found = VERSUS_WORD.exec(name);
  if (found === null) return undefined;
  return `${name.slice(0, found.index).trim()}${VERSUS}${name.slice(found.index + found[0].length).trim()}`;
};

/**
 * Whether `document` could be brought over as a team match
 * (ImportWholeTournaments.feature): it is named for two teams, "A vs B", it
 * has a player, and every player who is no bye represents one of them, as a
 * team match's players do. Asked of a block, knockout or Swiss of a
 * tournament played by teams before it is tried as one, so that one whose
 * players would all be refused is not.
 */
export const couldBeATeamMatch = (document: {
  readonly Name: string;
  readonly Players: {
    readonly _Players: readonly {
      readonly Name: string;
      readonly Representing: string | null;
    }[];
  };
}): boolean => {
  const named = namedForTwoTeams(document.Name);
  if (named === undefined) return false;
  const split = named.indexOf(VERSUS);
  const names = [
    named.slice(0, split).trim(),
    named.slice(split + VERSUS.length).trim(),
  ].flatMap((name) => [name, teamNameOf(name), beforeBrackets(name)]);
  const players = document.Players._Players.filter(
    (player) => !isOldBye(player.Name),
  );
  return (
    players.length > 0 &&
    players.every((player) =>
      names.some((name) => sameName((player.Representing ?? "").trim(), name)),
    )
  );
};

/**
 * How many matches a team match's games say it had (ImportTeamMatches.feature):
 * for each two players who met, the games between them over its best-of,
 * rounded up, so that a match won two games to one is one match. Its games
 * against a bye are no games, and say nothing.
 */
const matchesPlayedIn = (document: TeamMatch): number => {
  const byes = new Set(
    document.Players._Players
      .filter((player) => isOldBye(player.Name))
      .map((player) => player._Id),
  );
  const between = new Map<string, number>();
  for (const game of document.Games._Games) {
    const { PlayerId: winner } = game.Winner;
    const { PlayerId: loser } = game.Loser;
    if (byes.has(winner) || byes.has(loser)) continue;
    const pair = [winner, loser].sort((one, other) => one - other).join(" ");
    between.set(pair, (between.get(pair) ?? 0) + 1);
  }
  const bestOf = bestOfImported(document.BestOf).games;
  let matches = 0;
  for (const games of between.values()) matches += Math.ceil(games / bestOf);
  return matches;
};

/**
 * `shortName`, or where one of `taken` is the same in any case, as many of
 * its first characters as leave room for a space and a number within `most`,
 * and the first number from 2 that makes it one none of `taken` is, as "New
 * Zeal 2". Two teams can share their first 10 characters, as "New Zealand
 * A's" and "New Zealand B's" do, and the site tells a tournament's teams
 * apart by their short names. `most` is a short name's 10, or fewer where
 * the team's name is shorter, since the site refuses a short name longer
 * than the name: "Newcastle" beside "Newcastle NPCC", cut to "Newcastle", is
 * "Newcast 2".
 */
const shortNameApart = (
  shortName: string,
  taken: readonly string[],
  most: number,
): string => {
  const isTaken = (candidate: string): boolean =>
    taken.some((each) => sameName(each, candidate));
  if (!isTaken(shortName)) return shortName;
  for (let number = 2; ; number += 1) {
    const after = ` ${String(number)}`;
    const kept = [...shortName]
      .slice(0, Math.max(0, most - after.length))
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
    document: read,
  }: ReadDocument<TeamMatch>): Promise<void> {
    const { document, swapped, marked } = withWinnersFromScores(
      withItsLists(read),
      Website.from(website),
    );
    const {
      unitOfWork,
      tournaments,
      competitions,
      database,
      accepting,
      correcting,
    } = this.importing;
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
      const errors = new DocumentErrors(
        database,
        accepting,
        correcting,
        documentId,
        website,
        tournament,
        { name: document.Name, oldSlug: document.Slug },
      );

      // Done as the tournament's first manager, who created it, when it was
      // created.
      const [by] = tournament.managers;
      if (by === undefined) throw new Error("The tournament has no manager.");
      const at = tournament.starts;
      const first = this.#teamCalled(tournament, written[0], by, at);
      const second = this.#teamCalled(tournament, written[1], by, at);

      // As many as the old site kept, or as many as its games say where they
      // say more, since it kept many as fewer than were played.
      const played = matchesPlayedIn(document);
      const expectedMatches = Math.max(1, document.ExpectedMatches, played);
      const competitionId = CompetitionId.create();
      tournament.addTest(
        competitionId,
        {
          firstTeam: first.id,
          secondTeam: second.id,
          starts: dayOf(document.Start),
          finishes: dayOf(document.Finish),
          expectedMatches: ExpectedMatches.from(expectedMatches),
          bestOf: bestOfImported(document.BestOf),
          group: TestGroup.from(document.Group ?? ""),
        },
        by,
        at,
      );
      errors.added(competitionId);
      for (const game of swapped) {
        await errors.gameCorrected(
          game,
          nameOfIn(document),
          "ImportCompetition.WinnerFromScore",
          "was kept the other way round, and is brought over as won by the player who scored more.",
        );
      }
      for (const game of marked) {
        await errors.gameCorrected(
          game,
          nameOfIn(document),
          "ImportCompetition.EqualScoreMarked",
          "was kept on equal points with neither score marked, and its winner's score is marked, so that the player the old site said won it did.",
        );
      }

      // A player is on the team they represented, which they wrote as the
      // team match named it, or by the team's name here, or by either before
      // the group some managers named in brackets after it.
      const represents = (representing: string, at: 0 | 1, team: Team) =>
        [written[at], team.name.toString()].some(
          (name) =>
            sameName(representing, name) ||
            sameName(representing, beforeBrackets(name)),
        );
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
          const team = teamRepresented((player.Representing ?? "").trim());
          // A number found again is the player it was, unless they are a
          // player of another team than the one they represent here: the old
          // site sometimes gave a number to two people, of two teams. Then
          // they are the player of the same name in their own team, made the
          // first time, and the number stays the other player's.
          let numbered = true;
          if (already !== undefined) {
            const known = TeamPlayerId.from(already);
            const theirs = tournament.teams.find((each) =>
              each.players.some((one) => one.id.equals(known)),
            );
            // The same player where they are of the same team and have
            // the same name, in any case and with any spaces. Of the same
            // team under another name, or of another team, they are the
            // player of this name in their own team.
            const theirName = theirs?.players
              .find((one) => one.id.equals(known))
              ?.name.toString();
            if (
              team === undefined ||
              theirs === undefined ||
              (theirs.id.equals(team.id) &&
                theirName !== undefined &&
                sameBaseName(theirName, nameToImport(player.Name)))
            ) {
              players.set(player._Id, known);
              continue;
            }
            const named = team.players.find((one) =>
              sameBaseName(one.name.toString(), nameToImport(player.Name)),
            );
            if (named !== undefined) {
              players.set(player._Id, named.id);
              continue;
            }
            numbered = false;
          }
          if (team === undefined) {
            throw new ImportRefused(
              "ImportTeamMatches.RepresentsNeitherTeam",
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
          if (numbered) made.push({ number: player._Id, id: playerId });
        } catch (failure) {
          await errors.playerRefused(player._Id, player.Name, failure);
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
      if (played > document.ExpectedMatches) {
        await errors.corrected(
          "",
          "ImportTeamMatches.ExpectedMatchesWorkedOut",
          `${errors.place} was kept as expected to have ${String(document.ExpectedMatches)} matches, and its games say ${String(played)}, so it is expected to have ${String(played)}.`,
        );
      }
      // A game against a bye is no game that was played.
      const againstABye = (game: OldGame): boolean =>
        byes.has(game.Winner.PlayerId) || byes.has(game.Loser.PlayerId);
      for (const game of gamesInOrder(document.Games._Games)) {
        if (!againstABye(game)) continue;
        await errors.gameLeftOut(
          game,
          nameOfIn(document),
          AGAINST_A_BYE.code,
          AGAINST_A_BYE.because,
        );
      }
      // Where the import names the order its games were played in, they are
      // added in it, and said as corrected.
      const inOrder = PLAYED_IN_ORDER.get(documentId.toLowerCase());
      if (inOrder !== undefined) {
        await errors.corrected(
          "",
          "ImportTeamMatches.GamesReordered",
          `${errors.place} has its games ${inOrder.join(", ")} added in that order, the order they were played in, rather than the order they were entered in.`,
        );
      }
      // A game of a team match of single games refused because its two
      // players already met was most often entered against the wrong one:
      // it is the game against whoever on the other team one of them has
      // not played, of the same kind, single or pair, where there is one
      // only. One with the very scores of a game they already played is
      // the same game entered twice, and is not (ImportTeamMatches.feature).
      const gamesPlayed = document.Games._Games.filter(
        (game) => !againstABye(game),
      );
      const nameOf = nameOfIn(document);
      const sideOf = (number: number): Team | undefined => {
        const player = document.Players._Players.find(
          (each) => each._Id === number,
        );
        return player === undefined
          ? undefined
          : teamRepresented((player.Representing ?? "").trim());
      };
      const opponentCorrected: PutRight = (game, failure) => {
        const refusedAs = (failure as { code?: unknown }).code;
        if (
          refusedAs !== "Competition.MatchDecided" ||
          bestOfImported(document.BestOf).games !== 1
        ) {
          return Promise.resolve(false);
        }
        if (
          gamesPlayed.some(
            (each) => each !== game && scoresOf(each) === scoresOf(game),
          )
        ) {
          return Promise.resolve(false);
        }
        const winner = game.Winner.PlayerId;
        const loser = game.Loser.PlayerId;
        // Whoever, on the side of `replaced`, `kept` has not played.
        const notPlayed = (kept: number, replaced: number): number[] => {
          const side = sideOf(replaced);
          if (side === undefined) return [];
          return document.Players._Players
            .map((each) => each._Id)
            .filter(
              (number) =>
                number !== replaced &&
                players.has(number) &&
                sideOf(number)?.id.equals(side.id) === true &&
                isAPair(nameOf(number)) === isAPair(nameOf(replaced)) &&
                !playedBetween(gamesPlayed, kept, number),
            );
        };
        const insteadOfLoser = notPlayed(winner, loser);
        const insteadOfWinner = notPlayed(loser, winner);
        if (insteadOfLoser.length + insteadOfWinner.length !== 1) {
          return Promise.resolve(false);
        }
        const [newLoser] = insteadOfLoser;
        const [newWinner] = insteadOfWinner;
        const kept = newLoser === undefined ? loser : winner;
        const replaced = newLoser === undefined ? winner : loser;
        const playing = newLoser ?? newWinner ?? replaced;
        const corrected: OldGame = {
          ...game,
          Winner: {
            ...game.Winner,
            PlayerId: newWinner ?? winner,
          },
          Loser: { ...game.Loser, PlayerId: newLoser ?? loser },
        };
        return Promise.resolve({
          game: corrected,
          corrected: async () => {
            // Played from then on, so that no other game is put right as
            // the one it now is.
            gamesPlayed[gamesPlayed.indexOf(game)] = corrected;
            await errors.gameCorrected(
              game,
              nameOf,
              "ImportTeamMatches.OpponentCorrected",
              `was entered against ${nameOf(replaced)}, whom ${nameOf(kept)} had already played, and is brought over against ${nameOf(playing)}, whom ${nameOf(kept)} had not.`,
            );
          },
        });
      };
      // Two players who met again once their match was decided, in a game not
      // entered against the wrong player nor the very scores of another, who
      // played more games than one match of the best-of holds: the loser is
      // played by a player made for it on their team, called by their name
      // and " - meet again", and the game is added between the winner and
      // them. The games of one meeting again are all against that player,
      // whoever won them, and a third meeting is against another, numbered
      // apart (ImportTeamMatches.feature).
      let told = toldOf(tournament, competitionId);
      const bestOf = bestOfImported(document.BestOf).games;
      // A player made for meeting again has a number of the import's own,
      // below any the old sites gave, so that a game can name them.
      const numbered = new Map<string, number>();
      const numberOf = (id: TeamPlayerId): number => {
        const found = numbered.get(id.value);
        if (found !== undefined) return found;
        const number = -1 - numbered.size;
        numbered.set(id.value, number);
        players.set(number, id);
        return number;
      };
      const teamOfPlayer = (id: TeamPlayerId): Team | undefined =>
        tournament.teams.find((team) =>
          team.players.some((player) => player.id.equals(id)),
        );
      const meetingAgainName = (number: number): string =>
        `${nameToImport(nameOf(number))} - meet again`;
      // The players made for `number` meeting again, in the order made.
      const meetingAgainOf = (number: number): TeamPlayer[] => {
        const id = players.get(number);
        const team = id === undefined ? undefined : teamOfPlayer(id);
        if (team === undefined) return [];
        const made = meetingAgainName(number);
        return team.players.filter((player) => {
          const name = player.name.toString();
          return name === made || name.startsWith(`${made} (`);
        });
      };
      const decidedBetween = (one: TeamPlayerId, other: TeamPlayerId) => {
        const between = competition.games.filter(
          (game) =>
            !game.archived &&
            ((game.winner.equals(one) && game.loser.equals(other)) ||
              (game.winner.equals(other) && game.loser.equals(one))),
        );
        const needed = Math.floor(bestOf / 2) + 1;
        return (
          between.length >= bestOf ||
          [one, other].some(
            (id) =>
              between.filter((game) => !game.drawn && game.winner.equals(id))
                .length >= needed,
          )
        );
      };
      const meetAgain: PutRight = (game, failure) => {
        const refusedAs = (failure as { code?: unknown }).code;
        const winner = game.Winner.PlayerId;
        const loser = game.Loser.PlayerId;
        const winnerId = players.get(winner);
        const loserId = players.get(loser);
        if (
          refusedAs !== "Competition.MatchDecided" ||
          winnerId === undefined ||
          loserId === undefined ||
          gamesPlayed.some(
            (each) => each !== game && scoresOf(each) === scoresOf(game),
          ) ||
          gamesPlayed.filter(
            (each) =>
              (each.Winner.PlayerId === winner &&
                each.Loser.PlayerId === loser) ||
              (each.Winner.PlayerId === loser &&
                each.Loser.PlayerId === winner),
          ).length <= bestOf
        ) {
          return Promise.resolve(false);
        }
        const instead = (replaced: number, playedBy: TeamPlayer): Instead => ({
          game: {
            ...game,
            Winner: {
              ...game.Winner,
              PlayerId: replaced === winner ? numberOf(playedBy.id) : winner,
            },
            Loser: {
              ...game.Loser,
              PlayerId: replaced === loser ? numberOf(playedBy.id) : loser,
            },
          },
          corrected: () =>
            errors.gameCorrected(
              game,
              nameOf,
              "ImportTeamMatches.MeetAgain",
              `came once ${nameOf(winner)} and ${nameOf(loser)} had met in a match already decided, and ${nameOf(replaced)} is played in it by ${playedBy.name.toString()}, a player made for meeting again, since two players of a test meet in one match.`,
            ),
        });
        // A meeting again of the two already begun, and not decided, on
        // whichever side it was made for.
        for (const [side, other] of [
          [winner, loserId],
          [loser, winnerId],
        ] as const) {
          const begun = meetingAgainOf(side).find(
            (player) => !decidedBetween(player.id, other),
          );
          if (begun !== undefined) return Promise.resolve(instead(side, begun));
        }
        const team = teamOfPlayer(loserId);
        if (team === undefined) return Promise.resolve(false);
        const madeId = TeamPlayerId.create();
        tournament.addTeamPlayer(
          team.id,
          madeId,
          {
            name: numberedApart(
              meetingAgainName(loser),
              (teamOfPlayer(loserId)?.players ?? []).map((each) =>
                each.name.toString(),
              ),
            ),
          },
          by,
          at,
        );
        told = toldOf(tournament, competitionId);
        const made = teamOfPlayer(madeId)?.players.find((each) =>
          each.id.equals(madeId),
        );
        return Promise.resolve(
          made === undefined ? false : instead(loser, made),
        );
      };
      await addGames(
        errors,
        competition,
        gamesPlayed,
        (number) => players.get(number),
        nameOf,
        () => told,
        Website.from(website),
        by,
        inOrder === undefined
          ? gamesInOrder
          : (games) => reordered(games, inOrder),
        undefined,
        async (game, failure, toCome) => {
          const put = await opponentCorrected(game, failure, toCome);
          return put === false ? meetAgain(game, failure, toCome) : put;
        },
      );
      // Again, for the players made for meeting again.
      await tournaments.save(tournament);
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
          Math.min(MOST_IN_A_SHORT_NAME, charactersIn(name)),
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
