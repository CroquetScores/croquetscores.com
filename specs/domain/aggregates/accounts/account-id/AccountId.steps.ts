import { Given } from "@cucumber/cucumber";

import { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What an account id is, said once. Every other step — minted, read, written
// down, begins with, refused for breaking — is the one every kind of id shares.
Given("the account kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => AccountId.create(),
    read: (written) => AccountId.from(written),
  };
});
