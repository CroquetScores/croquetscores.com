// The tournaments a scenario that knows the site only by its address cannot
// make without signing in and filling in the form each time. Part of the test
// control (testControl.ts), and guarded as it is.
//
// Made by the commands the site's own pages send, as an account that is there,
// so that a tournament a scenario says is there is one the site could have. A
// scenario says what the tournament is in the form's own words and gets back
// an id and an address, and no domain type leaves the site.
import type { FastifyInstance } from "fastify";

import { AddGame } from "../application/operations/competitions/AddGame.js";
import { ArchiveGame } from "../application/operations/competitions/ArchiveGame.js";
import { MoveCompetitionPlayer } from "../application/operations/competitions/MoveCompetitionPlayer.js";
import { ArchivePlayer } from "../application/operations/tournaments/ArchivePlayer.js";
import { UpdateTeam } from "../application/operations/tournaments/UpdateTeam.js";
import { ChangePlayerWorldRankingName } from "../application/operations/tournaments/ChangePlayerWorldRankingName.js";
import { AddManagerNote } from "../application/operations/tournaments/AddManagerNote.js";
import { DeleteManagerNote } from "../application/operations/tournaments/DeleteManagerNote.js";
import { EditManagerNote } from "../application/operations/tournaments/EditManagerNote.js";
import { AddComment } from "../application/operations/commentaries/AddComment.js";
import { DeleteComment } from "../application/operations/commentaries/DeleteComment.js";
import { EditComment } from "../application/operations/commentaries/EditComment.js";
import { StartCommentary } from "../application/operations/tournaments/StartCommentary.js";
import { AddTeam } from "../application/operations/tournaments/AddTeam.js";
import { AddTeamPlayer } from "../application/operations/tournaments/AddTeamPlayer.js";
import { AddTest } from "../application/operations/tournaments/AddTest.js";
import { ArchiveTeam } from "../application/operations/tournaments/ArchiveTeam.js";
import { UpdateTest } from "../application/operations/tournaments/UpdateTest.js";
import type { TestRequest } from "../application/operations/tournaments/testOperations.js";
import { ArchiveCompetition } from "../application/operations/tournaments/ArchiveCompetition.js";
import { WithdrawGame } from "../application/operations/competitions/WithdrawGame.js";
import { WithdrawPlayer } from "../application/operations/competitions/WithdrawPlayer.js";
import { EnterPlayer } from "../application/operations/competitions/EnterPlayer.js";
import { AddKnockout } from "../application/operations/tournaments/AddKnockout.js";
import { AddSwiss } from "../application/operations/tournaments/AddSwiss.js";
import { AddBlock } from "../application/operations/tournaments/AddBlock.js";
import { AddPlayer } from "../application/operations/tournaments/AddPlayer.js";
import { ArchiveTournament } from "../application/operations/tournaments/ArchiveTournament.js";
import { CreateTournament } from "../application/operations/tournaments/CreateTournament.js";
import { RestoreTournament } from "../application/operations/tournaments/RestoreTournament.js";
import type { TournamentRequest } from "../application/operations/tournaments/tournamentOperations.js";
import { UpdateTournament } from "../application/operations/tournaments/UpdateTournament.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { CompetitionRulesSaid } from "../domain/aggregates/tournaments/value-objects/CompetitionRules.js";
import type { TeamDetails } from "../domain/aggregates/tournaments/Team.js";
import type { TeamPlayerDetails } from "../domain/aggregates/tournaments/TeamPlayer.js";
import type { TournamentPlayerDetails } from "../domain/aggregates/tournaments/TournamentPlayer.js";
import type { ReaderMaking } from "./testControlReaders.js";
import { sameToken, testControlHeader } from "./testControl.js";

interface Asked {
  commentary?: unknown;
  comment?: unknown;
  text?: unknown;
  title?: unknown;
  description?: unknown;
  note?: unknown;
  at?: unknown;
  details?: unknown;
  places?: unknown;
  team?: unknown;
  test?: unknown;
  rules?: unknown;
  direction?: unknown;
  game?: unknown;
  competition?: unknown;
  player?: unknown;
  name?: unknown;
  bestOf?: unknown;
  rounds?: unknown;
  tieBreak?: unknown;
  winner?: unknown;
  winnerScore?: unknown;
  loser?: unknown;
  loserScore?: unknown;
  manager?: unknown;
  website?: unknown;
  id?: unknown;
  tournament?: unknown;
}

const text = (value: unknown, name: string): string => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${name} is needed.`);
  }
  return value;
};

/** Mounts the tournaments on the test control, answering only to `token`. */
export const registerTestControlTournaments = (
  server: FastifyInstance,
  token: string,
  making: ReaderMaking,
): void => {
  void server.register(
    (scope, _options, done) => {
      scope.addHook("onRequest", async (request, reply) => {
        if (!sameToken(request.headers[testControlHeader], token)) {
          return reply.callNotFound();
        }
        return undefined;
      });

      const accountOf = async (written: unknown): Promise<string> => {
        const address = text(written, "A manager");
        const id = await making.inTransaction(() =>
          making.accountIdFor(EmailAddress.from(address)),
        );
        if (id === undefined) throw new Error(`No account for ${address}.`);
        return id.value;
      };
      // The moment the site stamps the command with: the moment the scenario
      // names where it names one, so that what is said of how long ago it was is
      // the same whenever it is run, and the site's own clock where it does not.
      const at = (asked?: Asked): ReadOnlyDate => {
        const named =
          typeof asked?.at === "string" ? new Date(asked.at) : undefined;
        if (named !== undefined && Number.isNaN(named.getTime())) {
          throw new Error("The moment is not one.");
        }
        return ReadOnlyDate.from(named ?? making.clock());
      };

      const refusing =
        (
          work: (asked: Asked) => Promise<object | undefined>,
          answered: 200 | 201,
        ) =>
        async (
          request: { body: unknown },
          reply: {
            code: (status: number) => { send: (body?: unknown) => unknown };
          },
        ) => {
          try {
            const body = await work(request.body ?? {});
            return reply.code(answered).send(body);
          } catch (failure) {
            return reply.code(400).send({
              message: failure instanceof Error ? failure.message : "",
            });
          }
        };

      // A tournament, as the form says one, made by an account that is there.
      scope.post(
        "/tournaments",
        refusing(async (asked) => {
          const created = await making.mediator.send(
            new CreateTournament(
              await accountOf(asked.manager),
              typeof asked.website === "string"
                ? asked.website
                : "croquetscores.com",
              asked.tournament as TournamentRequest,
              at(asked),
            ),
          );
          return { id: created.id.value, address: created.address.toString() };
        }, 201),
      );

      // What a tournament is now, said again in full, as updating one is.
      scope.post(
        "/tournaments/update",
        refusing(async (asked) => {
          await making.mediator.send(
            new UpdateTournament(
              await accountOf(asked.manager),
              text(asked.id, "A tournament"),
              asked.tournament as TournamentRequest,
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/archive",
        refusing(async (asked) => {
          await making.mediator.send(
            new ArchiveTournament(
              await accountOf(asked.manager),
              text(asked.id, "A tournament"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/restore",
        refusing(async (asked) => {
          await making.mediator.send(
            new RestoreTournament(
              await accountOf(asked.manager),
              text(asked.id, "A tournament"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      // A player of the tournament, who is not yet in any competition.
      scope.post(
        "/tournaments/players",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddPlayer(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              asked.player as TournamentPlayerDetails,
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      // A block, which has no players until some are entered.
      scope.post(
        "/tournaments/blocks",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddBlock(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.name, "A name"),
              typeof asked.bestOf === "number" ? asked.bestOf : 1,
              typeof asked.rounds === "number" ? asked.rounds : 1,
              at(asked),
              asked.rules as CompetitionRulesSaid | undefined,
              typeof asked.tieBreak === "string" ? asked.tieBreak : undefined,
            ),
          );
          return { id: id.value };
        }, 201),
      );

      // One of the tournament's players, entered in a competition. The id it
      // answers with is the player's in that competition, which is what a game
      // names.
      scope.post(
        "/competitions/players",
        refusing(async (asked) => {
          const entered = await making.mediator.send(
            new EnterPlayer(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              text(asked.player, "A player"),
              at(asked),
            ),
          );
          return { id: entered };
        }, 201),
      );

      // A game, by the winner's and the loser's ids in the competition.
      scope.post(
        "/competitions/games",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddGame(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              {
                winner: asked.winner as string | undefined,
                winnerScore: asked.winnerScore as string | undefined,
                loser: asked.loser as string | undefined,
                loserScore: asked.loserScore as string | undefined,
              },
              at(asked),
            ),
          );
          return { id };
        }, 201),
      );

      scope.post(
        "/competitions/games/withdraw",
        refusing(async (asked) => {
          await making.mediator.send(
            new WithdrawGame(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              text(asked.game, "A game"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/competitions/players/withdraw",
        refusing(async (asked) => {
          await making.mediator.send(
            new WithdrawPlayer(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              text(asked.player, "A player"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/competitions/players/move",
        refusing(async (asked) => {
          await making.mediator.send(
            new MoveCompetitionPlayer(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              text(asked.player, "A player"),
              text(asked.direction, "A direction"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/competitions/games/archive",
        refusing(async (asked) => {
          await making.mediator.send(
            new ArchiveGame(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              text(asked.game, "A game"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/competitions/archive",
        refusing(async (asked) => {
          await making.mediator.send(
            new ArchiveCompetition(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.competition, "A competition"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/teams",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddTeam(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              asked.team as TeamDetails,
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/tournaments/teams/players",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddTeamPlayer(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.team, "A team"),
              asked.player as TeamPlayerDetails,
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/tournaments/teams/archive",
        refusing(async (asked) => {
          await making.mediator.send(
            new ArchiveTeam(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.team, "A team"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      // A test between two teams, which is a competition of its own.
      scope.post(
        "/tournaments/tests",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddTest(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              asked.test as TestRequest,
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/tournaments/tests/update",
        refusing(async (asked) => {
          await making.mediator.send(
            new UpdateTest(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.id, "A test"),
              asked.test as TestRequest,
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/players/archive",
        refusing(async (asked) => {
          await making.mediator.send(
            new ArchivePlayer(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.player, "A player"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      // A knockout of a number of places, each round the best of some games.
      scope.post(
        "/tournaments/knockouts",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddKnockout(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.name, "A name"),
              typeof asked.places === "number" ? asked.places : 4,
              Array.isArray(asked.rounds) ? (asked.rounds as number[]) : [1, 1],
              at(asked),
              asked.rules as CompetitionRulesSaid | undefined,
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/tournaments/swisses",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddSwiss(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.name, "A name"),
              typeof asked.bestOf === "number" ? asked.bestOf : 1,
              at(asked),
              asked.rules as CompetitionRulesSaid | undefined,
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/tournaments/teams/update",
        refusing(async (asked) => {
          await making.mediator.send(
            new UpdateTeam(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.team, "A team"),
              asked.details as TeamDetails,
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/players/world-ranking-name",
        refusing(async (asked) => {
          await making.mediator.send(
            new ChangePlayerWorldRankingName(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.player, "A player"),
              text(asked.name, "A name"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      // A manager's note, which readers of the tournament see when it is
      // public.
      scope.post(
        "/tournaments/notes",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddManagerNote(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.title, "A title"),
              typeof asked.description === "string" ? asked.description : "",
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/tournaments/notes/edit",
        refusing(async (asked) => {
          await making.mediator.send(
            new EditManagerNote(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.note, "A note"),
              text(asked.title, "A title"),
              typeof asked.description === "string" ? asked.description : "",
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/notes/delete",
        refusing(async (asked) => {
          await making.mediator.send(
            new DeleteManagerNote(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.note, "A note"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/tournaments/commentaries",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new StartCommentary(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.title, "A title"),
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      // A comment, whoever writes it: any account that is there may comment.
      scope.post(
        "/commentaries/comments",
        refusing(async (asked) => {
          const id = await making.mediator.send(
            new AddComment(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.commentary, "A commentary"),
              text(asked.text, "A text"),
              at(asked),
            ),
          );
          return { id: id.value };
        }, 201),
      );

      scope.post(
        "/commentaries/comments/edit",
        refusing(async (asked) => {
          await making.mediator.send(
            new EditComment(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.commentary, "A commentary"),
              text(asked.comment, "A comment"),
              text(asked.text, "A text"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      scope.post(
        "/commentaries/comments/delete",
        refusing(async (asked) => {
          await making.mediator.send(
            new DeleteComment(
              await accountOf(asked.manager),
              text(asked.tournament, "A tournament"),
              text(asked.commentary, "A commentary"),
              text(asked.comment, "A comment"),
              at(asked),
            ),
          );
          return undefined;
        }, 200),
      );

      done();
    },
    { prefix: "/__test" },
  );
};
