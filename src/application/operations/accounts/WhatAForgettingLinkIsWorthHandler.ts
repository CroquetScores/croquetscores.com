import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Links } from "../../services/Links.js";
import {
  worthOfForgettingLink,
  type ForgettingLinkWorth,
} from "./forgettingLinks.js";
import type { AccountsByRole } from "./roleOperations.js";
import { WhatAForgettingLinkIsWorth } from "./WhatAForgettingLinkIsWorth.js";

/**
 * What a link to confirm forgetting is worth, answered from the link, the
 * account it names and the reader following it. All of it is
 * `forgettingLinks.ts`, which forgetting asks the same question of, and which
 * `ForgetAccount.feature` specifies; nothing is recorded. The administrators
 * are read without holding them, since nothing is decided here that another
 * request could undo: forgetting asks again, holding them.
 */
export class WhatAForgettingLinkIsWorthHandler extends QueryHandler<
  WhatAForgettingLinkIsWorth,
  ForgettingLinkWorth
> {
  readonly handles: RequestType<WhatAForgettingLinkIsWorth> =
    WhatAForgettingLinkIsWorth;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
    private readonly byRole: AccountsByRole,
  ) {
    super();
  }

  async handle(
    query: WhatAForgettingLinkIsWorth,
  ): Promise<ForgettingLinkWorth> {
    const judged = await worthOfForgettingLink(
      this.links,
      this.accounts,
      query.link,
      AccountId.from(query.reader),
      query.followedAt,
      await this.byRole.holding("administrator"),
    );
    return judged.worth;
  }
}
