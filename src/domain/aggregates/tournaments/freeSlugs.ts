// How a thing of a tournament is given a slug nothing else of its kind has:
// its players, its competitions, its teams, its commentaries and the notes its
// managers write, and the tournament its own address. Each is said in the
// feature of whatever is given one (addBlock.feature, startCommentary.feature,
// add.feature for a note).
import type { Id } from "../../common/Id.js";
import { Slug } from "../../common/Slug.js";

// A slug somebody else has is followed by a number from 1 to this, each
// written in two digits.
const MOST_NUMBERED = 99;

// The characters of an id after its kind, which no other id has, for the slug
// that nothing else can be found at.
const ownCharactersOf = (id: Id): string =>
  id.value.slice(id.value.indexOf("/") + 1);

// Every slug a thing named `slug` may be found at, in the order they are
// tried: the slug itself, then followed by "-01" to "-99", then by the id's own
// characters, which is never taken, since nothing else has them.
export function* slugsFor(slug: Slug, id: Id): Generator<Slug> {
  yield slug;
  for (let number = 1; number <= MOST_NUMBERED; number += 1) {
    yield Slug.from(`${slug.toString()}-${String(number).padStart(2, "0")}`);
  }
  yield Slug.from(`${slug.toString()}-${ownCharactersOf(id)}`);
}

// The last slug a thing may be found at, which slugsFor always ends with.
export const lastOf = (slugs: Generator<Slug>): Slug => {
  let last: Slug | undefined;
  for (const slug of slugs) last = slug;
  if (last === undefined) throw new Error("There was no slug to be found at.");
  return last;
};

// The first slug a thing named `slug` may be found at that none of `taken` is
// (`slugsFor`).
export const firstFree = (
  slug: Slug,
  id: Id,
  taken: readonly string[],
): Slug => {
  for (const candidate of slugsFor(slug, id)) {
    if (!taken.includes(candidate.toString())) return candidate;
  }
  return lastOf(slugsFor(slug, id));
};
