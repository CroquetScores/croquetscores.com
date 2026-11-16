// What a tournament holds, said in plain data, for the test control: names and
// ids and the few facts about each that a scenario says were kept. No domain
// type leaves the site, so the specs that ask need to know none.
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";

const text = (value: { toString(): string } | undefined): string | undefined =>
  value === undefined ? undefined : value.toString();

export const plainTournament = (tournament: Tournament): object => ({
  address: tournament.address.toString(),
  name: tournament.name.toString(),
  archived: tournament.archived,
  format: tournament.format.name,
  sport: tournament.sport.code,
  country: tournament.country.code,
  region: tournament.region?.code,
  subtitle: tournament.subtitle?.markdown,
  starts: tournament.starts.toISOString(),
  finishes: tournament.finishes.toISOString(),
  national: tournament.national,
  international: tournament.international,
  levelTestsDrawn: tournament.levelTestsDrawn,
  managers: tournament.managers.map((each) => each.value),
  scorers: tournament.scorers.map((each) => each.value),
  players: tournament.players.map((player) => ({
    id: player.id.value,
    name: player.name.toString(),
    representing: player.representing,
    handicap: player.handicap,
    flag: text(player.flag),
    worldRankingName: text(player.worldRankingName),
    slug: player.slug.toString(),
    order: player.order,
    archived: player.archived,
  })),
  teams: tournament.teams.map((team) => ({
    id: team.id.value,
    name: team.name.toString(),
    shortName: team.shortName.toString(),
    flag: text(team.flag),
    slug: team.slug.toString(),
    order: team.order,
    archived: team.archived,
    players: team.players.map((player) => ({
      id: player.id.value,
      name: player.name.toString(),
    })),
  })),
  competitions: tournament.competitions.map(({ reference, shape, rules }) => ({
    id: reference.id.value,
    name: reference.name.toString(),
    slug: reference.slug.toString(),
    order: reference.order,
    archived: reference.archived === true,
    kind: shape.kind,
    rules: {
      handicap: rules.handicap,
      drawsAllowed: rules.drawsAllowed,
      worldRankings: rules.worldRankings,
      maximumHoops: rules.maximumHoops,
    },
    places: shape.kind === "knockout" ? shape.draw.places : undefined,
    firstTeam: shape.kind === "test" ? shape.firstTeam.value : undefined,
    secondTeam: shape.kind === "test" ? shape.secondTeam.value : undefined,
    expectedMatches:
      shape.kind === "test" ? shape.expectedMatches.count : undefined,
    bestOf:
      shape.kind === "test" || shape.kind === "swiss" || shape.kind === "block"
        ? shape.bestOf.games
        : undefined,
    group: shape.kind === "test" ? text(shape.group) : undefined,
  })),
});
