import { Given } from "@cucumber/cucumber";

import { CommentaryId } from "../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { SpecWorld } from "../../../../support/world.js";

// What a commentary id is, said once. Every other step is the one every kind
// of id shares.
Given("the commentary kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => CommentaryId.create(),
    read: (written) => CommentaryId.from(written),
  };
});
