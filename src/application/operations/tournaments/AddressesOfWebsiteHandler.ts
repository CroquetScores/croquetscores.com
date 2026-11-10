import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { AddressesOfWebsite } from "./AddressesOfWebsite.js";
import type { TournamentsByWebsite } from "./tournamentsOfWebsite.js";

/** The addresses of a website's tournaments (sitemap.feature). */
export class AddressesOfWebsiteHandler extends QueryHandler<
  AddressesOfWebsite,
  readonly string[]
> {
  readonly handles: RequestType<AddressesOfWebsite> = AddressesOfWebsite;

  constructor(
    private readonly tournaments: Pick<TournamentsByWebsite, "addressesOf">,
  ) {
    super();
  }

  handle(query: AddressesOfWebsite): Promise<readonly string[]> {
    return this.tournaments.addressesOf(Website.from(query.website));
  }
}
