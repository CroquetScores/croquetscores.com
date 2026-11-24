// Whether the website offers Advantage Golf Croquet, and whether a request
// would make a competition Advantage where it does not, which is refused. Held
// once for /api/site and /api/v1, so that a route moved from the one to the
// other is refused as it was. How the refusal is said is each API's own.
import type { FastifyRequest } from "fastify";

import { CompetitionsOfTournament } from "../../application/operations/tournaments/CompetitionsOfTournament.js";
import type { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import { advantageGolfCroquetIsOffered } from "./advantageGolfCroquet.js";
import { servedAsOf } from "./site.js";
import { yesOrNoOf } from "./requestBody.js";

export const advantageOffered = (
  advantageGolfCroquet: boolean,
): {
  readonly offeredTo: (request: FastifyRequest) => boolean;
  readonly makesAdvantageNotOffered: (
    request: FastifyRequest,
    reader: AccountId,
    tournament: string,
    competition: string | undefined,
  ) => Promise<boolean>;
} => {
  // By the address it was served as and not the website it is for, since
  // development is for croquetscores.com and is told apart from it here: it
  // offers what is being worked on (advantageGolfCroquet.feature).
  const offeredTo = (request: FastifyRequest): boolean =>
    advantageGolfCroquetIsOffered(servedAsOf(request), advantageGolfCroquet);

  // Leaving a competition as it is, or switching Advantage off, is not
  // refused: a site that offered Advantage and no longer does still has its
  // Advantage competitions, and the dialog that changes one says what it is as
  // it says its other rules, so refusing that would leave a manager unable to
  // rename a competition they had already made. A competition not being
  // changed, as one being added is not, is not Advantage yet
  // (advantage.feature).
  const makesAdvantageNotOffered = async (
    request: FastifyRequest,
    reader: AccountId,
    tournament: string,
    competition: string | undefined,
  ): Promise<boolean> => {
    if (yesOrNoOf(request.body, "advantage") !== true) return false;
    if (offeredTo(request)) return false;
    if (competition === undefined) return true;
    const listed = await request.server.mediator.query(
      new CompetitionsOfTournament(reader.value, tournament),
    );
    return listed.find(({ id }) => id === competition)?.advantage !== true;
  };

  return { offeredTo, makesAdvantageNotOffered };
};
