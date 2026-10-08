import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { tournamentNamed } from "../../application/operations/tournaments/aRequest.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { Website } from "../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "../support/browser.js";

// Every table a read model keeps, which is all of them and nothing else: the
// events, the keys and the sessions are not read models, and are left alone.
const READ_MODEL_TABLES = [
  "accounts_by_email_address",
  "accounts_by_google_account",
  "accounts_by_role",
  "tournaments_by_address",
  "tournaments_by_account",
  "tournaments_by_account_details",
  "tournaments_by_website",
  "tournaments_by_website_competitions",
  "tournaments_by_website_games",
  "manager_notes_by_tournament",
  "commentaries_by_tournament",
  "commentaries_by_tournament_forgotten",
];

// Counted before a rebuild, to be compared with after it.
const counted = new WeakMap<SpecWorld, number>();

const eventsKept = async (world: SpecWorld): Promise<number> => {
  const { rows } = await world.database.query<{ kept: string }>(
    `select count(*) as kept from events`,
  );
  return Number(rows[0]?.kept);
};

// The account the email address belongs to, as the read model finds it.
const accountFor = async (world: SpecWorld, address: string) => {
  const application = applicationFor(world);
  return application.unitOfWork.inReadOnlyTransaction(() =>
    application.accountsByEmailAddress.find(EmailAddress.from(address)),
  );
};

const accountFound = async (world: SpecWorld, address: string) => {
  const account = await accountFor(world, address);
  assert.ok(account !== undefined, `No account is found for ${address}.`);
  return account;
};

const rowsOf = async (
  world: SpecWorld,
  table: string,
  where: string,
  values: readonly string[],
): Promise<number> => {
  const { rows } = await world.database.query<{ held: string }>(
    `select count(*) as held from ${table} where ${where}`,
    [...values],
  );
  return Number(rows[0]?.held);
};

Given("every read model is emptied", async function (this: SpecWorld) {
  await this.database.query(
    `truncate ${READ_MODEL_TABLES.join(", ")} restart identity`,
  );
});

Given("the events kept are counted", async function (this: SpecWorld) {
  counted.set(this, await eventsKept(this));
});

Given(
  "the tournament {string} is held at the address {string}",
  async function (this: SpecWorld, name: string, address: string) {
    await this.database.query(
      `update tournaments_by_address set address = $1 where tournament_id = $2`,
      [address, tournamentNamed(this, name).value],
    );
  },
);

When(
  "the read models are rebuilt from the events",
  async function (this: SpecWorld) {
    await applicationFor(this).rebuildReadModels();
  },
);

Then(
  "the events kept are as many as were counted",
  async function (this: SpecWorld) {
    assert.equal(await eventsKept(this), counted.get(this));
  },
);

Then(
  "the tournament {string} is found for the account for {string}",
  async function (this: SpecWorld, name: string, address: string) {
    const application = applicationFor(this);
    const account = await accountFound(this, address);
    const found = await application.unitOfWork.inReadOnlyTransaction(() =>
      application.tournamentsByAccount.tournamentsOf(
        account,
        Website.croquetScores,
        2026,
      ),
    );
    const tournament = tournamentNamed(this, name);
    assert.ok(
      found.some((each) => each.name === name),
      `Tournament ${tournament.value} is not among ${JSON.stringify(found.map((each) => each.name))}.`,
    );
  },
);

Then(
  "the account for {string} is found by its email address",
  async function (this: SpecWorld, address: string) {
    await accountFound(this, address);
  },
);

// The roles are kept in the lower case, "administrator", which is how the
// table holds them and not how a feature says them.
const heldRole = async (
  world: SpecWorld,
  address: string,
  role: string,
): Promise<number> =>
  rowsOf(world, "accounts_by_role", "account_id = $1 and role = $2", [
    (await accountFound(world, address)).value,
    role.toLowerCase().replaceAll(" ", "-"),
  ]);

Then(
  "the account for {string} is found holding the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    assert.ok((await heldRole(this, address, role)) >= 1);
  },
);

Then(
  "the account for {string} is found holding the role {string} once",
  async function (this: SpecWorld, address: string, role: string) {
    assert.equal(await heldRole(this, address, role), 1);
  },
);

Then(
  "the account for {string} is found by its Google account",
  async function (this: SpecWorld, address: string) {
    assert.equal(
      await rowsOf(this, "accounts_by_google_account", "account_id = $1", [
        (await accountFound(this, address)).value,
      ]),
      1,
    );
  },
);
