import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
import {
  worthOfSetNewPasswordLink,
  type SetNewPasswordLinkWorth,
} from "./setNewPasswordLinks.js";
import { WhatASetNewPasswordLinkIsWorth } from "./WhatASetNewPasswordLinkIsWorth.js";

/**
 * What a link to set a new password is worth, answered from the link, the
 * account it names, and whether a setting has already spent it.
 *
 * All of it is `setNewPasswordLinks.ts`, which setting a password asks the same
 * question of. Nothing is recorded, and nothing is claimed: asking must not be
 * what spends the link.
 */
export class WhatASetNewPasswordLinkIsWorthHandler extends QueryHandler<
  WhatASetNewPasswordLinkIsWorth,
  SetNewPasswordLinkWorth
> {
  readonly handles: RequestType<WhatASetNewPasswordLinkIsWorth> =
    WhatASetNewPasswordLinkIsWorth;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
    private readonly handled: HandledRequests,
  ) {
    super();
  }

  async handle(
    query: WhatASetNewPasswordLinkIsWorth,
  ): Promise<SetNewPasswordLinkWorth> {
    const judged = await worthOfSetNewPasswordLink(
      this.links,
      this.accounts,
      this.handled,
      query.link,
      query.followedAt,
    );
    return judged.worth;
  }
}
