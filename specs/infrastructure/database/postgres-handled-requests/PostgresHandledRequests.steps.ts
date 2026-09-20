import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import { aRecordOfHandledRequests } from "../../support/handledRequests.js";

const recordOf = (world: SpecWorld) => {
  assert.ok(
    world.handledRequestsRecord !== undefined,
    "There is no record of handled requests.",
  );
  return world.handledRequestsRecord;
};

// Claimed as a request being served claims, with whatever moment the scenario
// says that request was asked for.
const claimAt = async (
  world: SpecWorld,
  requestId: string,
  moment: string,
): Promise<void> => {
  const claimed = await world.asARequest(() =>
    recordOf(world).claim(requestId, ReadOnlyDate.from(new Date(moment))),
  );
  world.claims.push(claimed);
};

Given(
  "a record of handled requests kept in Postgres",
  function (this: SpecWorld) {
    aRecordOfHandledRequests(this);
  },
);

// What has happened already --------------------------------------------------------

Given(
  "the request {string} was claimed at {string}",
  async function (this: SpecWorld, requestId: string, moment: string) {
    await claimAt(this, requestId, moment);
  },
);

// Claimed inside a request that then failed, so the transaction it was claimed
// in is rolled back and the claim goes with it. The failure is the scenario's
// doing, so it is swallowed here rather than failing the step.
Given(
  "the request {string} was claimed by a request that then failed",
  async function (this: SpecWorld, requestId: string) {
    assert.ok(this.moment !== undefined, "No moment has been named.");
    const at = ReadOnlyDate.from(this.moment);
    try {
      await this.asARequest(async () => {
        await recordOf(this).claim(requestId, at);
        throw new Error("The request failed after claiming.");
      });
    } catch {
      // Expected: what the scenario is about is what the rollback left.
    }
  },
);

// Claiming ---------------------------------------------------------------------------

When(
  "the request {string} is claimed as asked for at {string}",
  async function (this: SpecWorld, requestId: string, moment: string) {
    await claimAt(this, requestId, moment);
  },
);

// What is left behind -----------------------------------------------------------------

// Read from the table rather than by claiming again, which would put back
// whatever it found missing and answer a different question.
const isRemembered = async (
  world: SpecWorld,
  requestId: string,
): Promise<boolean> => {
  const { rows } = await world.database.query(
    `select request_id from handled_requests where request_id = $1`,
    [requestId],
  );
  return rows.length === 1;
};

Then(
  "{string} is still remembered",
  async function (this: SpecWorld, requestId: string) {
    assert.equal(
      await isRemembered(this, requestId),
      true,
      `${requestId} was forgotten.`,
    );
  },
);

Then(
  "{string} is no longer remembered",
  async function (this: SpecWorld, requestId: string) {
    assert.equal(
      await isRemembered(this, requestId),
      false,
      `${requestId} is still remembered.`,
    );
  },
);
