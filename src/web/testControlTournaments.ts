// The tournaments a scenario that knows the site only by its address cannot
// make without signing in and filling in the form each time. Part of the test
// control (testControl.ts), and guarded as it is.
//
// Made by the commands the site's own pages send, as an account that is there,
// so that a tournament a scenario says is there is one the site could have. A
// scenario says what the tournament is in the form's own words and gets back
// an id and an address, and no domain type leaves the site.
import type { FastifyInstance } from "fastify";

import { ArchiveTournament } from "../application/operations/tournaments/ArchiveTournament.js";
import { CreateTournament } from "../application/operations/tournaments/CreateTournament.js";
import { RestoreTournament } from "../application/operations/tournaments/RestoreTournament.js";
import type { TournamentRequest } from "../application/operations/tournaments/tournamentOperations.js";
import { UpdateTournament } from "../application/operations/tournaments/UpdateTournament.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import type { ReaderMaking } from "./testControlReaders.js";
import { sameToken, testControlHeader } from "./testControl.js";

interface Asked {
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
      const at = (): ReadOnlyDate => ReadOnlyDate.from(making.clock());

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
              at(),
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
              at(),
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
              at(),
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
              at(),
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
