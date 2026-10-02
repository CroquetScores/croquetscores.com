// /api/v1 — JSON, and the same endpoints whether a mobile app or the admin SPA
// is asking. Operations arrive here as features are accepted.
import type {
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import { AddBlock } from "../../../application/operations/tournaments/AddBlock.js";
import { AddKnockout } from "../../../application/operations/tournaments/AddKnockout.js";
import { AddSwiss } from "../../../application/operations/tournaments/AddSwiss.js";
import { UpdateBlock } from "../../../application/operations/tournaments/UpdateBlock.js";
import { UpdateKnockout } from "../../../application/operations/tournaments/UpdateKnockout.js";
import { UpdateSwiss } from "../../../application/operations/tournaments/UpdateSwiss.js";
import { ArchiveTournament } from "../../../application/operations/tournaments/ArchiveTournament.js";
import { ArchiveCompetition } from "../../../application/operations/tournaments/ArchiveCompetition.js";
import { CompetitionsOfTournament } from "../../../application/operations/tournaments/CompetitionsOfTournament.js";
import { CreateTournament } from "../../../application/operations/tournaments/CreateTournament.js";
import { MoveCompetition } from "../../../application/operations/tournaments/MoveCompetition.js";
import { AddGame } from "../../../application/operations/competitions/AddGame.js";
import { ChangeCarryForward } from "../../../application/operations/competitions/ChangeCarryForward.js";
import { ArchiveGame } from "../../../application/operations/competitions/ArchiveGame.js";
import { CorrectGame } from "../../../application/operations/competitions/CorrectGame.js";
import { EnterPlayer } from "../../../application/operations/competitions/EnterPlayer.js";
import { GamesOfCompetition } from "../../../application/operations/competitions/GamesOfCompetition.js";
import { MoveCompetitionPlayer } from "../../../application/operations/competitions/MoveCompetitionPlayer.js";
import { MoveGame } from "../../../application/operations/competitions/MoveGame.js";
import { PlayersOfCompetition } from "../../../application/operations/competitions/PlayersOfCompetition.js";
import { RemovePlayer } from "../../../application/operations/competitions/RemovePlayer.js";
import { RestoreGame } from "../../../application/operations/competitions/RestoreGame.js";
import { ReverseWithdrawal } from "../../../application/operations/competitions/ReverseWithdrawal.js";
import { WithdrawPlayer } from "../../../application/operations/competitions/WithdrawPlayer.js";
import { MovePlayer } from "../../../application/operations/tournaments/MovePlayer.js";
import { AddPlayer } from "../../../application/operations/tournaments/AddPlayer.js";
import { ArchivePlayer } from "../../../application/operations/tournaments/ArchivePlayer.js";
import { PlayersOfTournament } from "../../../application/operations/tournaments/PlayersOfTournament.js";
import { RestorePlayer } from "../../../application/operations/tournaments/RestorePlayer.js";
import { UpdatePlayer } from "../../../application/operations/tournaments/UpdatePlayer.js";
import { AddTeam } from "../../../application/operations/tournaments/AddTeam.js";
import { AddTeamPlayer } from "../../../application/operations/tournaments/AddTeamPlayer.js";
import { AddTest } from "../../../application/operations/tournaments/AddTest.js";
import { ArchiveTeam } from "../../../application/operations/tournaments/ArchiveTeam.js";
import { ArchiveTeamPlayer } from "../../../application/operations/tournaments/ArchiveTeamPlayer.js";
import { MoveTeam } from "../../../application/operations/tournaments/MoveTeam.js";
import { MoveTeamPlayer } from "../../../application/operations/tournaments/MoveTeamPlayer.js";
import { PlayersOfTeam } from "../../../application/operations/tournaments/PlayersOfTeam.js";
import { PlayersOfTest } from "../../../application/operations/competitions/PlayersOfTest.js";
import { RestoreTeam } from "../../../application/operations/tournaments/RestoreTeam.js";
import { RestoreTeamPlayer } from "../../../application/operations/tournaments/RestoreTeamPlayer.js";
import { TeamPage } from "../../../application/operations/tournaments/TeamPage.js";
import { TeamsOfTournament } from "../../../application/operations/tournaments/TeamsOfTournament.js";
import type { TestRequest } from "../../../application/operations/tournaments/testOperations.js";
import { UpdateTeam } from "../../../application/operations/tournaments/UpdateTeam.js";
import { UpdateTeamPlayer } from "../../../application/operations/tournaments/UpdateTeamPlayer.js";
import { UpdateTest } from "../../../application/operations/tournaments/UpdateTest.js";
import { Flags } from "../../../domain/aggregates/tournaments/value-objects/Flags.js";
import type { Assets } from "../../common/assets.js";
import { AddManager } from "../../../application/operations/tournaments/AddManager.js";
import { AddScorer } from "../../../application/operations/tournaments/AddScorer.js";
import { ManagersOfTournament } from "../../../application/operations/tournaments/ManagersOfTournament.js";
import { RemoveManager } from "../../../application/operations/tournaments/RemoveManager.js";
import { RemoveScorer } from "../../../application/operations/tournaments/RemoveScorer.js";
import { RestoreCompetition } from "../../../application/operations/tournaments/RestoreCompetition.js";
import { ScorersOfTournament } from "../../../application/operations/tournaments/ScorersOfTournament.js";
import type { TournamentRequest } from "../../../application/operations/tournaments/tournamentOperations.js";
import { RestoreTournament } from "../../../application/operations/tournaments/RestoreTournament.js";
import { TournamentsOfAccount } from "../../../application/operations/tournaments/TournamentsOfAccount.js";
import { TournamentYearsOfAccount } from "../../../application/operations/tournaments/TournamentYearsOfAccount.js";
import { CompetitionPage } from "../../../application/operations/tournaments/CompetitionPage.js";
import { TournamentPage } from "../../../application/operations/tournaments/TournamentPage.js";
import { TournamentToChange } from "../../../application/operations/tournaments/TournamentToChange.js";
import { UpdateTournament } from "../../../application/operations/tournaments/UpdateTournament.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Countries } from "../../../domain/aggregates/tournaments/value-objects/Countries.js";
import {
  croquetScoresSports,
  gateballScoresSports,
} from "../../../domain/aggregates/tournaments/value-objects/sports.js";
import {
  croquetScoresFormats,
  gateballScoresFormats,
} from "../../../domain/aggregates/tournaments/value-objects/tournamentFormats.js";
import { speakingOf } from "../../common/language.js";
import { readerOf } from "../../common/reader.js";
import { websiteOf } from "../../common/site.js";

// A year as an address writes one: four digits, the first not a nought.
const aYear = /^[1-9]\d{3}$/;

// Only what the reader is signed in to can be asked about, so nobody signed in
// is refused before anything is looked up, rather than shown an empty list
// that says they have no tournaments.
const signedInOrRefused = (
  request: FastifyRequest,
  reply: FastifyReply,
): AccountId | undefined => {
  const reader = readerOf(request);
  if (reader === undefined) {
    void reply
      .code(401)
      .header("cache-control", "no-store")
      .send({ error: "NotSignedIn" });
  }
  return reader;
};

// What a caller sent under `field`, where it is text, and nothing typed where
// it is not: a value of any other kind was not typed into anything, and is
// refused as nothing typed would be rather than failing on the way in.
const textOf = (body: unknown, field: string): string => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "string" ? value : "";
};

// A number where one was sent, and otherwise one that is no number, which is
// refused as a best-of or a draw's places are when they are not whole.
const numberOf = (body: unknown, field: string): number => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "number" ? value : Number.NaN;
};

// The numbers sent under `field`, each as `numberOf` reads one, and none where
// no list was sent.
const numbersOf = (body: unknown, field: string): number[] => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return Array.isArray(value)
    ? value.map((each) => (typeof each === "number" ? each : Number.NaN))
    : [];
};

// A count of a carry forward, which is nothing where nothing was typed, the
// number typed where it is text, as a dialog's field sends it, and one that is
// no number where it is anything else, so that it is refused as not whole.
// Only digits, with a sign and a fraction, are read as a number: Number()
// alone would read "1e2" as 100 and "0x10" as 16, and keep a count nobody
// typed.
const countOf = (body: unknown, field: string): number | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  if (value === undefined || value === null) return undefined;
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const typed = value.trim();
  if (typed === "") return undefined;
  return /^-?\d+(?:\.\d+)?$/.test(typed) ? Number(typed) : Number.NaN;
};

// Yes or no where it was said, and unsaid otherwise, which the tournament
// decides for itself (create.feature).
const yesOrNoOf = (body: unknown, field: string): boolean | undefined => {
  const value = (body as Record<string, unknown> | null)?.[field];
  return typeof value === "boolean" ? value : undefined;
};

// A game's player as the score dialog sends them: a competition's player by
// the part of their id after "competition-player/", and a test's, who is a
// player in one of its teams, by their whole id, since a test's players are
// not its own (gamesInATest.feature). Nothing where nobody was chosen, for
// the game to refuse.
const gamePlayerOf = (said: string): string | undefined =>
  said === ""
    ? undefined
    : said.startsWith("team-player/")
      ? said
      : `competition-player/${said}`;

// What a tournament is to be, as a form sends it to create one or to change
// one. Notes left empty are no notes, and a region left empty is none.
const tournamentFrom = (body: unknown): TournamentRequest => {
  const notes = textOf(body, "notes");
  const region = textOf(body, "region");
  return {
    name: textOf(body, "name"),
    starts: textOf(body, "starts"),
    finishes: textOf(body, "finishes"),
    format: textOf(body, "format"),
    sport: textOf(body, "sport"),
    country: textOf(body, "country"),
    ...(region === "" ? {} : { region }),
    ...(notes === "" ? {} : { notes }),
    handicap: yesOrNoOf(body, "handicap"),
    drawsAllowed: yesOrNoOf(body, "drawsAllowed"),
    levelTestsDrawn: yesOrNoOf(body, "levelTestsDrawn"),
    worldRankings: yesOrNoOf(body, "worldRankings"),
    national: yesOrNoOf(body, "national"),
    international: yesOrNoOf(body, "international"),
  };
};

// A tournament's address, from the three parts of an API address that carry
// it, so that it reads as the admin's own address does.
interface AtAddress {
  readonly year: string;
  readonly sport: string;
  readonly slug: string;
}
const addressOf = ({ year, sport, slug }: AtAddress): string =>
  `${year}/${sport}/${slug}`;

/** What the API is given besides its routes. */
export interface ApiV1Options {
  /** Where the site's own files are found, for the address of a flag's image. */
  readonly assets: Assets;
}

export const apiV1: FastifyPluginCallback<ApiV1Options> = (
  server,
  { assets },
  done,
) => {
  server.get("/health", () => ({ status: "ok" }));

  // The reader's own, which is who "my" is. Nothing a caller sends can name
  // another account.
  server.get<{ Querystring: { year?: string } }>(
    "/my/tournaments",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const year = request.query.year ?? "";
      if (!aYear.test(year)) {
        return reply
          .code(400)
          .header("cache-control", "no-store")
          .send({ error: "YearUnreadable" });
      }
      const tournaments = await request.server.mediator.query(
        new TournamentsOfAccount(
          reader.value,
          websiteOf(request).host,
          Number(year),
        ),
      );
      return reply.header("cache-control", "no-store").send({ tournaments });
    },
  );

  server.get("/my/tournament-years", async (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const years = await request.server.mediator.query(
      new TournamentYearsOfAccount(reader.value, websiteOf(request).host),
    );
    return reply.header("cache-control", "no-store").send({ years });
  });

  // What a new tournament can be on the website asked: the sports and formats
  // its site offers, in the site's order, and every country with its regions.
  // Each format says whether it is played by teams and whether it draws a
  // level test unless said not to, so that the form asks about level tests as
  // creating one decides them.
  // Asked of the domain rather than written out again here, so that the form
  // offers exactly what creating a tournament accepts. Each is sent back by
  // its code, and named in the reader's language: a format by the name the
  // domain knows it by, since that is what creating one takes. The countries
  // are in order of their names as the reader's language has them, which is
  // the order a reader looks for one in. A region is named as it was recorded,
  // since there are hundreds, most already in their own country's language.
  server.get("/tournaments/new", (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const speaking = speakingOf(request);
    const gateball = websiteOf(request).site === "gateballScores";
    const byName = new Intl.Collator(speaking.language.tag);
    return reply.header("cache-control", "no-store").send({
      sports: (gateball ? gateballScoresSports : croquetScoresSports).map(
        (sport) => ({
          code: sport.code,
          name: speaking.say(`sport.${sport.code}`),
        }),
      ),
      formats: (gateball ? gateballScoresFormats : croquetScoresFormats).map(
        (format) => ({
          code: format.name,
          name: speaking.say(`format.${format.code}`),
          teams: format.isTeamFormat,
          drawsLevelTests: format.drawsLevelTests,
        }),
      ),
      countries: Countries.thereAre.all
        .map((country) => ({
          code: country.code,
          name: speaking.say(`country.${country.code}`),
          regions: country.regions.map((region) => ({
            code: region.code,
            name: region.name,
          })),
        }))
        .sort((one, other) => byName.compare(one.name, other.name)),
    });
  });

  // A tournament created by the reader, on the website asked, and answered
  // with where it is found. What breaks a rule is refused with every rule it
  // breaks, and what the tournament refuses with its code (errors.ts).
  server.post("/tournaments", async (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const tournament = tournamentFrom(request.body);
    const created = await request.server.mediator.send(
      new CreateTournament(
        reader.value,
        websiteOf(request).host,
        tournament,
        request.requestedAt,
      ),
    );
    return reply
      .code(201)
      .header("cache-control", "no-store")
      .send({ id: created.id.value, address: created.address.toString() });
  });

  // The tournament found at an address, now or before, as the reader would
  // change it, with where it is found now. Refused where they do not manage it,
  // where it is archived, and where nothing has been found there.
  server.get<{ Params: AtAddress }>(
    "/tournaments/at/:year/:sport/:slug",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const tournament = await request.server.mediator.query(
        new TournamentToChange(reader.value, addressOf(request.params)),
      );
      return reply.header("cache-control", "no-store").send(tournament);
    },
  );

  // The tournament found at an address as its page shows it to the reader,
  // with their part in it. Refused where they have no part in it, where it is
  // archived, and where nothing has been found there.
  server.get<{ Params: AtAddress }>(
    "/tournaments/at/:year/:sport/:slug/page",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const tournament = await request.server.mediator.query(
        new TournamentPage(reader.value, addressOf(request.params)),
      );
      return reply.header("cache-control", "no-store").send(tournament);
    },
  );

  // A competition found beneath the tournament at an address, as its page
  // shows it to the reader, with their part in the tournament.
  server.get<{ Params: AtAddress & { competition: string } }>(
    "/tournaments/at/:year/:sport/:slug/competitions/:competition/page",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const competition = await request.server.mediator.query(
        new CompetitionPage(
          reader.value,
          addressOf(request.params),
          request.params.competition,
        ),
      );
      return reply.header("cache-control", "no-store").send(competition);
    },
  );

  // The tournament found at an address changed, and answered with where it is
  // found afterwards, which is somewhere else when its year or its sport
  // changed. Found at the address it was asked at both times, which still
  // leads to it after it has moved.
  server.put<{ Params: AtAddress }>(
    "/tournaments/at/:year/:sport/:slug",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const asked = new TournamentToChange(
        reader.value,
        addressOf(request.params),
      );
      const before = await request.server.mediator.query(asked);
      await request.server.mediator.send(
        new UpdateTournament(
          reader.value,
          before.id,
          tournamentFrom(request.body),
          request.requestedAt,
        ),
      );
      const after = await request.server.mediator.query(asked);
      return reply
        .header("cache-control", "no-store")
        .send({ address: after.address });
    },
  );

  // The tournament by the part of its id after "tournament/", so that the id
  // is one segment of the address rather than two.
  for (const [action, making] of [
    ["archive", ArchiveTournament],
    ["restore", RestoreTournament],
  ] as const) {
    server.post<{ Params: { id: string } }>(
      `/tournaments/:id/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        await request.server.mediator.send(
          new making(
            reader.value,
            `tournament/${request.params.id}`,
            request.requestedAt,
          ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A tournament's competitions, as its manager lists them, in the
  // tournament's order.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/competitions",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const competitions = await request.server.mediator.query(
        new CompetitionsOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ competitions });
    },
  );

  // A competition added, as the competition dialog sends it: its kind, its
  // name, and the shape its kind has. Answered with its id.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/competitions",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const tournament = `tournament/${request.params.id}`;
      const body = request.body;
      const name = textOf(body, "name");
      const at = request.requestedAt;
      const kind = textOf(body, "kind");
      const added = await request.server.mediator.send(
        kind === "knockout"
          ? new AddKnockout(
              reader.value,
              tournament,
              name,
              numberOf(body, "places"),
              numbersOf(body, "rounds"),
              at,
            )
          : kind === "swiss"
            ? new AddSwiss(
                reader.value,
                tournament,
                name,
                numberOf(body, "bestOf"),
                at,
              )
            : new AddBlock(
                reader.value,
                tournament,
                name,
                numberOf(body, "bestOf"),
                at,
              ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added.value });
    },
  );

  // A competition changed, as the competition dialog sends it opened from
  // Edit: its name and the shape its kind has. The kind is said rather than
  // looked up, so that the command is the one the dialog meant, and a kind
  // that is not the competition's is refused by the tournament as any other
  // mistaken update is.
  server.put<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const tournament = `tournament/${request.params.id}`;
      const competition = `competition/${request.params.competition}`;
      const body = request.body;
      const name = textOf(body, "name");
      const at = request.requestedAt;
      const kind = textOf(body, "kind");
      await request.server.mediator.send(
        kind === "knockout"
          ? new UpdateKnockout(
              reader.value,
              tournament,
              competition,
              name,
              numberOf(body, "places"),
              numbersOf(body, "rounds"),
              at,
            )
          : kind === "swiss"
            ? new UpdateSwiss(
                reader.value,
                tournament,
                competition,
                name,
                numberOf(body, "bestOf"),
                at,
              )
            : new UpdateBlock(
                reader.value,
                tournament,
                competition,
                name,
                numberOf(body, "bestOf"),
                at,
              ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A competition moved a place, archived or restored, named by the part of
  // its id after "competition/", as the tournament is by its own.
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; competition: string } }>(
      `/tournaments/:id/competitions/:competition/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const tournament = `tournament/${request.params.id}`;
        const competition = `competition/${request.params.competition}`;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveCompetition(reader.value, tournament, competition, at)
            : action === "restore"
              ? new RestoreCompetition(
                  reader.value,
                  tournament,
                  competition,
                  at,
                )
              : new MoveCompetition(
                  reader.value,
                  tournament,
                  competition,
                  action,
                  at,
                ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A competition's players, as its tournament's managers and scorers list
  // them, each flag as it is seen. The competition is named by the part of
  // its id after "competition/", as the tournament is by its own.
  server.get<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/players",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const listed = await request.server.mediator.query(
        new PlayersOfCompetition(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
        ),
      );
      const players = listed.map(({ flag, ...player }) => ({
        ...player,
        flag: flag === undefined ? undefined : flagAsSeen(request, flag),
      }));
      return reply.header("cache-control", "no-store").send({ players });
    },
  );

  // One of the tournament's players entered, by the part of their id after
  // "tournament-player/", and answered with their id in the competition.
  server.post<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/players",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const entered = await request.server.mediator.send(
        new EnterPlayer(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
          `tournament-player/${textOf(request.body, "player")}`,
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: entered });
    },
  );

  // A competition's player moved a place, withdrawn, unwithdrawn or removed,
  // by the part of their id after "competition-player/", and a bye by its
  // order as well.
  for (const action of [
    "up",
    "down",
    "withdraw",
    "unwithdraw",
    "remove",
  ] as const) {
    server.post<{
      Params: { id: string; competition: string; player: string };
      Querystring: { order?: string };
    }>(
      `/tournaments/:id/competitions/:competition/players/:player/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const asked = [
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
          `competition-player/${request.params.player}`,
        ] as const;
        const at = request.requestedAt;
        // Every bye has the same id, so a bye is named by its order too.
        const { order } = request.query;
        const byeOrder = order === undefined ? undefined : Number(order);
        await request.server.mediator.send(
          action === "withdraw"
            ? new WithdrawPlayer(...asked, at)
            : action === "unwithdraw"
              ? new ReverseWithdrawal(...asked, at)
              : action === "remove"
                ? new RemovePlayer(...asked, at, byeOrder)
                : new MoveCompetitionPlayer(...asked, action, at, byeOrder),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // What a competition's player carries forward, by the part of their id after
  // "competition-player/": all six counts said again, each as it was typed.
  server.put<{ Params: { id: string; competition: string; player: string } }>(
    "/tournaments/:id/competitions/:competition/players/:player/carry-forward",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new ChangeCarryForward(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
          `competition-player/${request.params.player}`,
          {
            matchWins: countOf(request.body, "matchWins"),
            matchLosses: countOf(request.body, "matchLosses"),
            gameWins: countOf(request.body, "gameWins"),
            gameLosses: countOf(request.body, "gameLosses"),
            hoopsFor: countOf(request.body, "hoopsFor"),
            hoopsAgainst: countOf(request.body, "hoopsAgainst"),
          },
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A competition's games, as its tournament's managers and scorers list them.
  server.get<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/games",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const games = await request.server.mediator.query(
        new GamesOfCompetition(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ games });
    },
  );

  // A game's score added, as the score dialog sends it, its players by the
  // part of their ids after "competition-player/", or a test's by their whole
  // ids (gamePlayerOf), and answered with the game's id. What was left empty is left out, for the game to refuse.
  server.post<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/games",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const player = (field: string): string | undefined =>
        gamePlayerOf(textOf(request.body, field));
      const score = (field: string): string | undefined => {
        const said = textOf(request.body, field);
        return said === "" ? undefined : said;
      };
      const added = await request.server.mediator.send(
        new AddGame(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
          {
            winner: player("winner"),
            winnerScore: score("winnerScore"),
            loser: player("loser"),
            loserScore: score("loserScore"),
          },
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added });
    },
  );

  // A game's scores corrected, as the score dialog sends them, by the part of
  // its id after "game/", and its players where they are sent, as adding a
  // game sends them. A player not sent is the game's
  // own. A score left empty is left out, for the command to refuse.
  server.post<{ Params: { id: string; competition: string; game: string } }>(
    "/tournaments/:id/competitions/:competition/games/:game/correct",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const score = (field: string): string | undefined => {
        const said = textOf(request.body, field);
        return said === "" ? undefined : said;
      };
      const player = (field: string): string | undefined =>
        gamePlayerOf(textOf(request.body, field));
      await request.server.mediator.send(
        new CorrectGame(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
          `game/${request.params.game}`,
          {
            winnerScore: score("winnerScore"),
            loserScore: score("loserScore"),
            winner: player("winner"),
            loser: player("loser"),
          },
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A test's score moved a place, up or down, by the part of its id after
  // "game/".
  for (const direction of ["up", "down"] as const) {
    server.post<{ Params: { id: string; competition: string; game: string } }>(
      `/tournaments/:id/competitions/:competition/games/:game/${direction}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        await request.server.mediator.send(
          new MoveGame(
            reader.value,
            `tournament/${request.params.id}`,
            `competition/${request.params.competition}`,
            `game/${request.params.game}`,
            direction,
            request.requestedAt,
          ),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A game's score archived or restored, by the part of its id after "game/".
  for (const action of ["archive", "restore"] as const) {
    server.post<{ Params: { id: string; competition: string; game: string } }>(
      `/tournaments/:id/competitions/:competition/games/:game/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const asked = [
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
          `game/${request.params.game}`,
          request.requestedAt,
        ] as const;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveGame(...asked)
            : new RestoreGame(...asked),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A tournament's scorers, as its manager lists them.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/scorers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const scorers = await request.server.mediator.query(
        new ScorersOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ scorers });
    },
  );

  // Somebody made a scorer, by their email address.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/scorers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new AddScorer(
          reader.value,
          `tournament/${request.params.id}`,
          textOf(request.body, "emailAddress"),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A scorer taken off, by the part of their account's id after "account/".
  server.post<{ Params: { id: string; account: string } }>(
    "/tournaments/:id/scorers/:account/remove",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new RemoveScorer(
          reader.value,
          `tournament/${request.params.id}`,
          `account/${request.params.account}`,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A tournament's managers, as its manager lists them.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/managers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const managers = await request.server.mediator.query(
        new ManagersOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ managers });
    },
  );

  // Somebody made a manager, by their email address.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/managers",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new AddManager(
          reader.value,
          `tournament/${request.params.id}`,
          textOf(request.body, "emailAddress"),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A manager taken off, by the part of their account's id after "account/".
  server.post<{ Params: { id: string; account: string } }>(
    "/tournaments/:id/managers/:account/remove",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new RemoveManager(
          reader.value,
          `tournament/${request.params.id}`,
          `account/${request.params.account}`,
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A flag, as a reader sees it: its picture, and the name of the place it is
  // the flag of, in the reader's language.
  const flagAsSeen = (
    request: FastifyRequest,
    code: string,
  ): { code: string; name: string; image: string } | undefined => {
    const flag = Flags.thereAre.find(code);
    if (flag === undefined) return undefined;
    return {
      code: String(flag),
      name: speakingOf(request).say(`country.${String(flag)}`),
      image: assets.url(`images/${flag.relativePath}`),
    };
  };

  // Every flag a player can fly, in order of its name in the reader's
  // language, which is the order a reader looks for one in.
  server.get("/flags", (request, reply) => {
    const reader = signedInOrRefused(request, reply);
    if (reader === undefined) return reply;
    const byName = new Intl.Collator(speakingOf(request).language.tag);
    const flags = Flags.thereAre.all
      .map((flag) => flagAsSeen(request, String(flag)))
      .filter((flag) => flag !== undefined)
      .sort((one, other) => byName.compare(one.name, other.name));
    return reply.header("cache-control", "no-store").send({ flags });
  });

  // A tournament's players, as its manager lists them, each flag as it is seen.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/players",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const listed = await request.server.mediator.query(
        new PlayersOfTournament(
          reader.value,
          `tournament/${request.params.id}`,
        ),
      );
      const players = listed.map(({ flag, ...player }) => ({
        ...player,
        flag: flag === undefined ? undefined : flagAsSeen(request, flag),
      }));
      return reply.header("cache-control", "no-store").send({ players });
    },
  );

  // What a player is, as the player dialog sends it. What they represent and
  // their flag are left out where nothing was said.
  const playerFrom = (body: unknown) => {
    const representing = textOf(body, "representing");
    const flag = textOf(body, "flag");
    return {
      name: textOf(body, "name"),
      ...(representing === "" ? {} : { representing }),
      ...(flag === "" ? {} : { flag }),
    };
  };

  // A player added, and answered with their id.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/players",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const added = await request.server.mediator.send(
        new AddPlayer(
          reader.value,
          `tournament/${request.params.id}`,
          playerFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added.value });
    },
  );

  // A player changed, by the part of their id after "tournament-player/".
  server.put<{ Params: { id: string; player: string } }>(
    "/tournaments/:id/players/:player",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new UpdatePlayer(
          reader.value,
          `tournament/${request.params.id}`,
          `tournament-player/${request.params.player}`,
          playerFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A player moved a place, archived or restored.
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; player: string } }>(
      `/tournaments/:id/players/:player/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const tournament = `tournament/${request.params.id}`;
        const player = `tournament-player/${request.params.player}`;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchivePlayer(reader.value, tournament, player, at)
            : action === "restore"
              ? new RestorePlayer(reader.value, tournament, player, at)
              : new MovePlayer(reader.value, tournament, player, action, at),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A team's page, found beneath the tournament at an address, as its manager
  // sees it, its flag as it is seen.
  server.get<{ Params: AtAddress & { team: string } }>(
    "/tournaments/at/:year/:sport/:slug/teams/:team/page",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const { flag, ...team } = await request.server.mediator.query(
        new TeamPage(
          reader.value,
          addressOf(request.params),
          request.params.team,
        ),
      );
      return reply.header("cache-control", "no-store").send({
        ...team,
        flag: flag === undefined ? undefined : flagAsSeen(request, flag),
      });
    },
  );

  // A tournament's teams, as its manager lists them, each flag as it is seen.
  server.get<{ Params: { id: string } }>(
    "/tournaments/:id/teams",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const listed = await request.server.mediator.query(
        new TeamsOfTournament(reader.value, `tournament/${request.params.id}`),
      );
      const teams = listed.map(({ flag, ...team }) => ({
        ...team,
        flag: flag === undefined ? undefined : flagAsSeen(request, flag),
      }));
      return reply.header("cache-control", "no-store").send({ teams });
    },
  );

  // What a team is, as the team dialog sends it. Its flag is left out where
  // none was chosen.
  const teamFrom = (body: unknown) => {
    const flag = textOf(body, "flag");
    return {
      name: textOf(body, "name"),
      shortName: textOf(body, "shortName"),
      ...(flag === "" ? {} : { flag }),
    };
  };

  // A team added, and answered with its id.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/teams",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const added = await request.server.mediator.send(
        new AddTeam(
          reader.value,
          `tournament/${request.params.id}`,
          teamFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added.value });
    },
  );

  // A team changed, by the part of its id after "team/".
  server.put<{ Params: { id: string; team: string } }>(
    "/tournaments/:id/teams/:team",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new UpdateTeam(
          reader.value,
          `tournament/${request.params.id}`,
          `team/${request.params.team}`,
          teamFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A team moved a place, archived or restored.
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; team: string } }>(
      `/tournaments/:id/teams/:team/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const tournament = `tournament/${request.params.id}`;
        const team = `team/${request.params.team}`;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveTeam(reader.value, tournament, team, at)
            : action === "restore"
              ? new RestoreTeam(reader.value, tournament, team, at)
              : new MoveTeam(reader.value, tournament, team, action, at),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // A team's players, as its manager lists them.
  server.get<{ Params: { id: string; team: string } }>(
    "/tournaments/:id/teams/:team/players",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const players = await request.server.mediator.query(
        new PlayersOfTeam(
          reader.value,
          `tournament/${request.params.id}`,
          `team/${request.params.team}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ players });
    },
  );

  // A player added to a team, as the team player dialog sends them: their
  // name, which is all a player in a team has. Answered with their id.
  server.post<{ Params: { id: string; team: string } }>(
    "/tournaments/:id/teams/:team/players",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const added = await request.server.mediator.send(
        new AddTeamPlayer(
          reader.value,
          `tournament/${request.params.id}`,
          `team/${request.params.team}`,
          { name: textOf(request.body, "name") },
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added.value });
    },
  );

  // A team's player changed, by the part of their id after "team-player/".
  server.put<{ Params: { id: string; team: string; player: string } }>(
    "/tournaments/:id/teams/:team/players/:player",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new UpdateTeamPlayer(
          reader.value,
          `tournament/${request.params.id}`,
          `team/${request.params.team}`,
          `team-player/${request.params.player}`,
          { name: textOf(request.body, "name") },
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A team's player moved a place, archived or restored.
  for (const action of ["up", "down", "archive", "restore"] as const) {
    server.post<{ Params: { id: string; team: string; player: string } }>(
      `/tournaments/:id/teams/:team/players/:player/${action}`,
      async (request, reply) => {
        const reader = signedInOrRefused(request, reply);
        if (reader === undefined) return reply;
        const asked = [
          reader.value,
          `tournament/${request.params.id}`,
          `team/${request.params.team}`,
          `team-player/${request.params.player}`,
        ] as const;
        const at = request.requestedAt;
        await request.server.mediator.send(
          action === "archive"
            ? new ArchiveTeamPlayer(...asked, at)
            : action === "restore"
              ? new RestoreTeamPlayer(...asked, at)
              : new MoveTeamPlayer(...asked, action, at),
        );
        return reply.code(204).header("cache-control", "no-store").send();
      },
    );
  }

  // What a test is, as the test dialog sends it: its teams by the part of
  // their ids after "team/", nothing where none was chosen, for the request
  // to refuse.
  const testFrom = (body: unknown): TestRequest => {
    const team = (field: string): string | undefined => {
      const said = textOf(body, field);
      return said === "" ? undefined : `team/${said}`;
    };
    return {
      firstTeam: team("firstTeam"),
      secondTeam: team("secondTeam"),
      starts: textOf(body, "starts"),
      finishes: textOf(body, "finishes"),
      expectedMatches: numberOf(body, "expectedMatches"),
      bestOf: numberOf(body, "bestOf"),
      group: textOf(body, "group"),
    };
  };

  // A test added, and answered with its id, which is a competition's. It is
  // moved, archived and restored as any competition is.
  server.post<{ Params: { id: string } }>(
    "/tournaments/:id/tests",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const added = await request.server.mediator.send(
        new AddTest(
          reader.value,
          `tournament/${request.params.id}`,
          testFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply
        .code(201)
        .header("cache-control", "no-store")
        .send({ id: added.value });
    },
  );

  // A test changed, by the part of its id after "competition/".
  server.put<{ Params: { id: string; test: string } }>(
    "/tournaments/:id/tests/:test",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      await request.server.mediator.send(
        new UpdateTest(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.test}`,
          testFrom(request.body),
          request.requestedAt,
        ),
      );
      return reply.code(204).header("cache-control", "no-store").send();
    },
  );

  // A test's two teams and their players in use, as its managers and scorers
  // choose a game's players from them.
  server.get<{ Params: { id: string; competition: string } }>(
    "/tournaments/:id/competitions/:competition/teams",
    async (request, reply) => {
      const reader = signedInOrRefused(request, reply);
      if (reader === undefined) return reply;
      const teams = await request.server.mediator.query(
        new PlayersOfTest(
          reader.value,
          `tournament/${request.params.id}`,
          `competition/${request.params.competition}`,
        ),
      );
      return reply.header("cache-control", "no-store").send({ teams });
    },
  );

  done();
};
