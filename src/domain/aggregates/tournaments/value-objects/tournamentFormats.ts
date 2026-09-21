import { TournamentFormat } from "./TournamentFormat.js";

// Each in the order a reader is offered them: Standard first, since most
// tournaments are played in it, then Teams as the general format for an event
// between teams, then the particular team events.

/** The formats Croquet Scores offers: every one there is. */
export const croquetScoresFormats: readonly TournamentFormat[] = [
  TournamentFormat.standard,
  TournamentFormat.teams,
  TournamentFormat.eireCup,
  TournamentFormat.interstateShield,
  TournamentFormat.gcWorldTeamChampionship,
];

/** The formats Gateball Scores offers: Standard alone, as no team format is a gateball event. */
export const gateballScoresFormats: readonly TournamentFormat[] = [
  TournamentFormat.standard,
];
