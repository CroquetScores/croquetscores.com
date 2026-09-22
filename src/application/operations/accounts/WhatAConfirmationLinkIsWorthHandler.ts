import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Links } from "../../services/Links.js";
import {
  worthOfConfirmationLink,
  type ConfirmationLinkWorth,
} from "./confirmationLinks.js";
import { WhatAConfirmationLinkIsWorth } from "./WhatAConfirmationLinkIsWorth.js";

/**
 * What a confirmation link is worth, answered from the link and the account it
 * names.
 *
 * All of it is `confirmationLinks.ts`, which confirming asks the same question
 * of, so that the page a link opens and the confirmation it sends cannot come
 * to disagree about what the link was worth. Nothing is recorded: the account
 * is loaded and put down again.
 */
export class WhatAConfirmationLinkIsWorthHandler extends QueryHandler<
  WhatAConfirmationLinkIsWorth,
  ConfirmationLinkWorth
> {
  readonly handles: RequestType<WhatAConfirmationLinkIsWorth> =
    WhatAConfirmationLinkIsWorth;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(
    query: WhatAConfirmationLinkIsWorth,
  ): Promise<ConfirmationLinkWorth> {
    const judged = await worthOfConfirmationLink(
      this.links,
      this.accounts,
      query.link,
      query.followedAt,
    );
    return judged.worth;
  }
}
