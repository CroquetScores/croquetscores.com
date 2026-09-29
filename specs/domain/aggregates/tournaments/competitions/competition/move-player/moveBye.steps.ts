import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../../../support/world.js";
import { ask, byOf, now, toldOf } from "../aCompetition.js";

// Moving a knockout's bye, which is named by its order, since every bye has
// the same id (movePlayer.feature).
When(
  /^the bye with the order (\d+) is moved (up|down)$/,
  function (this: SpecWorld, order: string, direction: "up" | "down") {
    ask(this, (competition) => {
      competition.moveBye(
        Number(order),
        direction,
        toldOf(this),
        byOf(this),
        now(this),
      );
    });
  },
);
