import { Given } from "@cucumber/cucumber";

import { ManagerNoteId } from "../../../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a manager note id is, said once. Every other step is the one every kind
// of id shares.
Given("the manager note kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => ManagerNoteId.create(),
    read: (written) => ManagerNoteId.from(written),
  };
});
