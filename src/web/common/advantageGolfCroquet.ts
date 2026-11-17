import type { Website } from "../../domain/common/Website.js";

/**
 * Whether `website` offers Advantage Golf Croquet: a manager is given the
 * choice of it, and a request that says a competition is Advantage is
 * answered.
 *
 * It is a major change to how a competition is scored and ranked, so it is
 * first offered where anything entered may be removed, on a try website, and
 * where somebody is working on the site, and is released to croquetscores.com
 * by `setting`. It is a rule of golf croquet, so Gateball Scores never offers
 * it, whatever the setting says (advantageGolfCroquet.feature).
 */
export const advantageGolfCroquetIsOffered = (
  website: Website,
  setting: boolean,
): boolean => {
  if (website.site !== "croquetScores") return false;
  // Development keeps and reads croquetscores.com's, so it is told apart from
  // it by its host: it is where the site is worked on, and offers whatever is
  // being worked on.
  const isDevelopment = website.host !== website.countsAs.host;
  return website.isTry || isDevelopment || setting;
};
