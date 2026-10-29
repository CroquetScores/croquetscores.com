import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { PlayersRepresenting } from "../../services/PlayersRepresenting.js";
import {
  type RepresentingFound,
  RepresentingMatching,
} from "./RepresentingMatching.js";

// One letter begins too many to choose from, so nothing is found for less
// than two, as the world ranking players are not.
const FEWEST_CHARACTERS = 2;

// As many as can be chosen from at a glance. A manager who has not found what
// they want types more.
const MOST_FOUND = 10;

export class RepresentingMatchingHandler extends QueryHandler<
  RepresentingMatching,
  RepresentingFound
> {
  readonly handles: RequestType<RepresentingMatching> = RepresentingMatching;

  constructor(private readonly players: PlayersRepresenting) {
    super();
  }

  async handle(query: RepresentingMatching): Promise<RepresentingFound> {
    const typed = query.typed.trim();
    if ([...typed].length < FEWEST_CHARACTERS) return { representing: [] };
    return { representing: await this.players.beginning(typed, MOST_FOUND) };
  }
}
