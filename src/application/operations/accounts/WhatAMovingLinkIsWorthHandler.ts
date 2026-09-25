import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Links } from "../../services/Links.js";
import { worthOfMovingLink } from "./movingLinks.js";
import {
  WhatAMovingLinkIsWorth,
  type MovingLinkWorth,
} from "./WhatAMovingLinkIsWorth.js";

/** What a link to confirm moving is worth, asked as moving asks it. */
export class WhatAMovingLinkIsWorthHandler extends QueryHandler<
  WhatAMovingLinkIsWorth,
  MovingLinkWorth
> {
  readonly handles: RequestType<WhatAMovingLinkIsWorth> =
    WhatAMovingLinkIsWorth;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(query: WhatAMovingLinkIsWorth): Promise<MovingLinkWorth> {
    const judged = await worthOfMovingLink(
      this.links,
      this.accounts,
      query.link,
      AccountId.from(query.reader),
      query.followedAt,
    );
    return judged.worth === "Link.Works"
      ? { worth: "Link.Works", emailAddress: judged.emailAddress.toString() }
      : { worth: "Link.NoLongerWorks" };
  }
}
