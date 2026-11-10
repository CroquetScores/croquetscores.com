import { Query } from "../../common/Query.js";

/**
 * Where each tournament of a website is found, as "2026/ac/spring-open": the
 * address it has now, once each, for the sitemap to list. None that is
 * archived, since a reader is not sent to one (sitemap.feature).
 */
export class AddressesOfWebsite extends Query<readonly string[]> {
  constructor(
    /** The host of the website, which is how a website is known. */
    readonly website: string,
  ) {
    super();
  }
}
