import { Given } from "@cucumber/cucumber";

import { CommentId } from "../../../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What a comment id is, said once. Every other step is the one every kind of
// id shares.
Given("the comment kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => CommentId.create(),
    read: (written) => CommentId.from(written),
  };
});
