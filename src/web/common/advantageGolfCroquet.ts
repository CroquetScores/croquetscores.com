import { Website } from "../../domain/common/Website.js";

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
  // Development is where the site is worked on, and offers what is being
  // worked on. It is told apart from croquetscores.com, whose tournaments it
  // keeps and reads, by being the website it is and not by where it is served.
  return website.isTry || website.equals(Website.development) || setting;
};
