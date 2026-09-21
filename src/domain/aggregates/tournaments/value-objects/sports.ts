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
