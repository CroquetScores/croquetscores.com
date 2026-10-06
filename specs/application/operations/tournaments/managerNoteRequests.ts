// What the application's features of a tournament's notes say of the next
// note a request sends, and how a note is found by its title, shared by the
// steps beside each of those features and by the browser's.
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { ManagerNote } from "../../../../src/domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../support/world.js";
import { inHandOf } from "./aRequest.js";

// What the scenario said the next note is to say, kept here rather than on the
// world, which has no business knowing what a note says.
const said = new WeakMap<SpecWorld, string>();

/** That the next note sent says `description`. */
export const toSay = (world: SpecWorld, description: string): void => {
  said.set(world, description);
};

/** What the next note sent says: what the scenario said, or nothing more. */
export const descriptionOf = (world: SpecWorld): string =>
  said.get(world) ?? "";

/** What the scenario said the next note says, or nothing where it said nothing. */
export const saidDescription = (world: SpecWorld): string | undefined =>
  said.get(world);

// The notes deleted in the scenario, by their titles, so that one deleted
// already can be named again by the title it had: the read model a note is
// found by no longer has it.
const deleted = new WeakMap<SpecWorld, Map<string, ManagerNote>>();

/** That `note` is being deleted, so that its title still names it after. */
export const rememberDeleted = (world: SpecWorld, note: ManagerNote): void => {
  const gone = deleted.get(world) ?? new Map<string, ManagerNote>();
  gone.set(note.title.toString(), note);
  deleted.set(world, gone);
};

/**
 * The note of the tournament `id` called `title` now, as its own stream reads,
 * found by its title among the tournament's notes as the read model of them
 * has them; nothing where it has none.
 */
export const managerNoteNow = async (
  world: SpecWorld,
  id: TournamentId,
  title: string,
): Promise<ManagerNote | undefined> => {
  const inHand = inHandOf(world);
  const heading = (await inHand.managerNotesOf(id)).find(
    (each) => each.title === title,
  );
  return heading === undefined
    ? undefined
    : inHand.loadManagerNote(ManagerNoteId.from(heading.id));
};

/** The note of the tournament `id` called `title`, as it reads now. */
export const managerNoteCalled = async (
  world: SpecWorld,
  id: TournamentId,
  title: string,
): Promise<ManagerNote> => {
  const found = await managerNoteNow(world, id, title);
  assert.ok(
    found !== undefined,
    `It has no note ${title}, only ${inspect((await inHandOf(world).managerNotesOf(id)).map((note) => note.title))}.`,
  );
  return found;
};

/** The note of the tournament `id` called `title`, deleted or not. */
export const managerNoteCalledOnceOrNow = async (
  world: SpecWorld,
  id: TournamentId,
  title: string,
): Promise<ManagerNote> =>
  deleted.get(world)?.get(title) ?? (await managerNoteCalled(world, id, title));
