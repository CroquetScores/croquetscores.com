// GET /api/v0/tournaments/{id}/competitions/{id}/standings and .../games: what a
// competition's players stand at, and every game of it, for apps
// (standings.feature, games.feature). They follow the conventions of the
// others (tournaments.ts): the tournament and the competition are named by the
// part of their ids after their kind, and an answer says whether it has
// changed.
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";

import type { Query } from "../../../application/common/Query.js";
import type { CompetitionHead } from "../../../application/operations/tournaments/competitionForApps.js";
import type {
  GameForApps,
  GamesToTell,
} from "../../../application/operations/tournaments/GamesForApps.js";
import { GamesForApps } from "../../../application/operations/tournaments/GamesForApps.js";
import {
  StandingsForApps,
  type StandingsToTell,
} from "../../../application/operations/tournaments/StandingsForApps.js";
import {
  CompetitionOfTournamentForApps,
  type CompetitionToTell,
} from "../../../application/operations/tournaments/CompetitionOfTournamentForApps.js";
import { TournamentOperationRefused } from "../../../application/operations/tournaments/tournamentOperations.js";
import { websiteOf } from "../../common/site.js";
import { refuseKey } from "./apiKey.js";
import { marked, sendConditionally } from "./conditional.js";
import { refusal } from "./errors.js";
import { competitionHref, gamesHref, standingsHref, uriOf } from "./hrefs.js";
import { callerOf } from "./rateLimit.js";

interface Named {
  readonly tournament: string;
  readonly competition: string;
}

// What a refusal of the application is, said as the API says it.
const refusedAs: Readonly<
  Record<string, { status: number; code: string; message: string }>
> = {
  NoSuchTournament: {
    status: 404,
    code: "Tournament.NotFound",
    message: "There is no such tournament.",
  },
  NoSuchCompetition: {
    status: 404,
    code: "Competition.NotFound",
    message: "There is no such competition.",
  },
  NoStandings: {
    status: 404,
    code: "Competition.HasNoStandings",
    message: "A knockout and a test have no standings.",
  },
};

const headOf = (head: CompetitionHead, named: Named) => ({
  id: head.id,
  name: head.name,
  kind: head.kind,
  href: competitionHref(named.tournament, named.competition),
  changedAt: head.changedAt.toISOString(),
});

const gameOf = (game: GameForApps) =>
  marked({
    id: game.id,
    winner: game.winner,
    loser: game.loser,
    drawn: game.drawn,
    withdrawn: game.withdrawn,
    round: game.round ?? null,
    changedAt: game.changedAt.toISOString(),
  });

const standingsSaid = (read: StandingsToTell, named: Named) => ({
  competition: headOf(read.competition, named),
  standings: read.standings.map((each) =>
    marked({
      playerId: each.playerId,
      name: each.name,
      withdrawn: each.withdrawn,
      played: each.played,
      won: each.won,
      // Only a block has these, and a Swiss says nothing of them.
      ...(each.lost === undefined ? {} : { lost: each.lost }),
      ...(each.gamesWon === undefined ? {} : { gamesWon: each.gamesWon }),
      ...(each.netGames === undefined ? {} : { netGames: each.netGames }),
      netHoops: each.netHoops,
      position: each.position ?? null,
      shared: each.shared,
    }),
  ),
});

const gamesSaid = (read: GamesToTell, named: Named) =>
  "matches" in read
    ? {
        competition: headOf(read.competition, named),
        matches: read.matches.map((match) =>
          marked({
            players: match.players,
            games: match.games.map(gameOf),
          }),
        ),
      }
    : {
        competition: headOf(read.competition, named),
        games: read.games.map(gameOf),
      };

// The same for both: who is asking, the ids, and what the application refused.
const answering =
  <Read extends { readonly competition: CompetitionHead }>(
    asking: (
      website: string,
      tournament: string,
      competition: string,
    ) => Query<Read>,
    said: (read: Read, named: Named) => unknown,
    operation: string,
  ) =>
  async (
    request: FastifyRequest<{ Params: Named }>,
    reply: FastifyReply,
  ): Promise<FastifyReply> => {
    // A key that was sent and does not work is refused, and having none is
    // not, as the list's is (tournaments.ts).
    const { key, carriedKey } = callerOf(request);
    if (carriedKey && key === undefined) return refuseKey(reply, true);

    const named = request.params;
    const tournament = `tournament/${named.tournament}`;
    // A key made for one tournament reads that one and no other.
    if (key?.tournament !== undefined && key.tournament !== tournament) {
      return refusal(
        reply,
        403,
        "ApiKey.LimitedToAnotherTournament",
        "The API key was made for another tournament.",
      );
    }
    try {
      const read: Read = await request.server.mediator.query(
        asking(
          websiteOf(request).host,
          tournament,
          `competition/${named.competition}`,
        ),
      );
      return sendConditionally(
        request,
        reply,
        said(read, named),
        read.competition.changedAt,
      );
    } catch (failure) {
      const refused =
        failure instanceof TournamentOperationRefused &&
        failure.code.startsWith(`${operation}.`)
          ? refusedAs[failure.code.slice(operation.length + 1)]
          : undefined;
      if (refused === undefined) throw failure;
      return refusal(reply, refused.status, refused.code, refused.message);
    }
  };

const competitionSaid = (read: CompetitionToTell, named: Named) => ({
  ...headOf(read.competition, named),
  uri: uriOf(read.address),
  // Where the API tells of its games, which every competition has, and of its
  // standings, which only a block and a Swiss have: so a competition that has
  // none says none.
  games: gamesHref(named.tournament, named.competition),
  ...(read.competition.kind === "block" || read.competition.kind === "swiss"
    ? { standings: standingsHref(named.tournament, named.competition) }
    : {}),
});

export const competitionOfApps: FastifyPluginAsync = (server) => {
  const path = "/tournaments/:tournament/competitions/:competition";
  server.get<{ Params: Named }>(
    path,
    answering<CompetitionToTell>(
      (website, tournament, competition) =>
        new CompetitionOfTournamentForApps(website, tournament, competition),
      competitionSaid,
      "CompetitionOfTournamentForApps",
    ),
  );
  server.get<{ Params: Named }>(
    `${path}/standings`,
    answering<StandingsToTell>(
      (website, tournament, competition) =>
        new StandingsForApps(website, tournament, competition),
      standingsSaid,
      "StandingsForApps",
    ),
  );
  server.get<{ Params: Named }>(
    `${path}/games`,
    answering<GamesToTell>(
      (website, tournament, competition) =>
        new GamesForApps(website, tournament, competition),
      gamesSaid,
      "GamesForApps",
    ),
  );
  return Promise.resolve();
};
