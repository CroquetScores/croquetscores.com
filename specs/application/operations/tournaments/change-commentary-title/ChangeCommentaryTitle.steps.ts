import { When } from "@cucumber/cucumber";

import { ChangeCommentaryTitle } from "../../../../../src/application/operations/tournaments/ChangeCommentaryTitle.js";
import { CommentaryId } from "../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import { commentaryIn } from "../../commentaries/commentaryRequests.js";
import { momentOf, noTournament, send, tournamentNamed } from "../aRequest.js";
import { readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

const change = async (
  world: SpecWorld,
  address: string | undefined,
  tournament: TournamentId,
  commentary: CommentaryId,
  title: string,
): Promise<void> => {
  const account = await readerOf(world, address ?? undefined);
  await send(
    world,
    new ChangeCommentaryTitle(
      account,
      tournament.value,
      commentary.value,
      title,
      momentOf(world),
    ),
    tournament,
  );
};

When(
  new RegExp(
    `${READER} changes the title of "([^"]*)" of "([^"]*)" to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    title: string,
    name: string,
    changed: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await change(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      changed,
    );
  },
);

// Another tournament's commentary, by its id, asked to be changed as one of
// the tournament named.
When(
  new RegExp(
    `${READER} changes the title of "([^"]*)" of "([^"]*)" as a commentary of "([^"]*)" to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    title: string,
    of: string,
    as: string,
    changed: string,
  ) {
    await change(
      this,
      address,
      tournamentNamed(this, as),
      await commentaryIn(this, tournamentNamed(this, of), title),
      changed,
    );
  },
);

When(
  new RegExp(
    `${READER} changes the title of a commentary of "([^"]*)" there is not to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    name: string,
    changed: string,
  ) {
    await change(
      this,
      address,
      tournamentNamed(this, name),
      CommentaryId.create(),
      changed,
    );
  },
);

When(
  new RegExp(
    `${READER} changes the title of a commentary of a tournament there is not to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    changed: string,
  ) {
    await change(this, address, noTournament(), CommentaryId.create(), changed);
  },
);
