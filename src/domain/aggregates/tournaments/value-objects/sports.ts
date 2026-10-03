import type { Site } from "../../../common/Website.js";
import { Sport } from "./Sport.js";

// Each in the order a reader is offered them: Association Croquet and Golf
// Croquet first, then American 6 Wicket and Ricochet.

/** The sports Croquet Scores offers: the four croquet sports. */
export const croquetScoresSports: readonly Sport[] = [
  Sport.associationCroquet,
  Sport.golfCroquet,
  Sport.american6Wicket,
  Sport.ricochet,
];

/** The sports Gateball Scores offers: Gateball alone. */
export const gateballScoresSports: readonly Sport[] = [Sport.gateball];

/** The sports each site offers, for whatever asks it of a website's site. */
export const sportsOffered: Readonly<Record<Site, readonly Sport[]>> = {
  croquetScores: croquetScoresSports,
  gateballScores: gateballScoresSports,
};
