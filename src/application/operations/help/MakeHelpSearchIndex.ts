import { createHash } from "node:crypto";

import { Refused } from "../../../domain/common/Refused.js";
import type {
  HelpPagesToSearch,
  HelpSearchIndex,
} from "../../services/HelpSearchIndex.js";

export type HelpSearchIndexErrorCode = "HelpSearchIndex.Unreadable";

export class HelpSearchIndexRefused extends Refused<HelpSearchIndexErrorCode> {}

/**
 * Makes the index from the built help, if the help has changed since it was
 * last made (PostgresHelpSearchIndex.feature). Answers whether it was made.
 *
 * What is kept is not touched when the help cannot be read: an index of the
 * last help that could be is a better answer to a reader than an empty one.
 */
export const makeHelpSearchIndex = async (
  source: HelpPagesToSearch,
  index: HelpSearchIndex,
): Promise<boolean> => {
  let pages;
  try {
    pages = await source.all();
  } catch (cause) {
    throw new HelpSearchIndexRefused(
      "HelpSearchIndex.Unreadable",
      "The built help could not be read, so the index was left as it was.",
      cause,
    );
  }

  // In a fixed order, so that the same help is the same fingerprint however it
  // was listed.
  const ordered = [...pages].sort((a, b) =>
    `${a.tag}/${a.name}`.localeCompare(`${b.tag}/${b.name}`),
  );
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(ordered))
    .digest("hex");
  if ((await index.fingerprint()) === fingerprint) return false;

  await index.replace(ordered, fingerprint);
  return true;
};
