import { When } from "@cucumber/cucumber";

import { RemoveRole } from "../../../../../src/application/operations/accounts/RemoveRole.js";
import { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountAt,
  keepingWhatCameOf,
  momentOf,
  registeringOf,
  roleWritten,
} from "../roleRequests.js";

const takeAs = async (
  world: SpecWorld,
  reader: string,
  role: string,
  holder: AccountId,
): Promise<void> => {
  const asking = await accountAt(world, reader);
  await keepingWhatCameOf(world, () =>
    registeringOf(world).removeRole(
      new RemoveRole(
        asking.id.value,
        roleWritten(role),
        holder.value,
        momentOf(world),
      ),
    ),
  );
};

When(
  "the reader signed in to the account for {string} takes the role {string} from {string}",
  async function (
    this: SpecWorld,
    reader: string,
    role: string,
    address: string,
  ) {
    await takeAs(this, reader, role, (await accountAt(this, address)).id);
  },
);

When(
  "the reader signed in to the account for {string} takes the role {string} from an account there is not",
  async function (this: SpecWorld, reader: string, role: string) {
    await takeAs(this, reader, role, AccountId.create());
  },
);
