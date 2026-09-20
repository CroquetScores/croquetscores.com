import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { LinkCarried } from "../../../../src/application/services/Links.js";
import { AccountId } from "../../../../src/domain/aggregates/accounts/value-objects/AccountId.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { SignedLinks } from "../../../../src/infrastructure/identity/SignedLinks.js";
import type { SpecWorld } from "../../../support/world.js";

// Where the site answers and what it signs with. Both are settings in the
// running site; here they are only something for a link to be made from, and
// the site address is a real one so that a scenario keeping "only the query"
// is keeping something that could have been followed.
const SITE = "https://croquetscores.com";
const KEY = "a signing key";

// What a scenario has made and is about to read: the links, the account and
// the moment it was made with, and the text of the link itself as the
// scenario has since spoiled it.
const links = new WeakMap<SpecWorld, SignedLinks>();
const accounts = new WeakMap<SpecWorld, AccountId>();
const made = new WeakMap<SpecWorld, string>();
// Kept apart from `made` because reading one answers nothing at all when it
// was not made here, and nothing is what several scenarios are about.
const read = new WeakMap<SpecWorld, LinkCarried | undefined>();

const linksOf = (world: SpecWorld): SignedLinks => {
  const theLinks = links.get(world);
  assert.ok(theLinks !== undefined, "The site's links are not stood up.");
  return theLinks;
};

const accountOf = (world: SpecWorld): AccountId => {
  const account = accounts.get(world);
  assert.ok(account !== undefined, "The scenario has no account.");
  return account;
};

// Named by the step ReadOnlyDate.feature already owns, which keeps it on the
// world: one set of words for naming a moment across the whole repository.
const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const theLink = (world: SpecWorld): string => {
  const link = made.get(world);
  assert.ok(link !== undefined, "The scenario has no link.");
  return link;
};

const wasRead = (world: SpecWorld): LinkCarried | undefined => {
  assert.ok(read.has(world), "The link has not been read.");
  return read.get(world);
};

// What was made ------------------------------------------------------------------

Given("the site's links", function (this: SpecWorld) {
  links.set(this, new SignedLinks(SITE, KEY));
});

Given("an account", function (this: SpecWorld) {
  accounts.set(this, AccountId.create());
});

Given("a link to confirm an email address", function (this: SpecWorld) {
  made.set(
    this,
    linksOf(this).make(
      "confirm-email-address",
      accountOf(this),
      momentOf(this),
    ),
  );
});

Given("a link to set a new password", function (this: SpecWorld) {
  made.set(
    this,
    linksOf(this).make("set-new-password", accountOf(this), momentOf(this)),
  );
});

// What became of it on the way back ------------------------------------------------

// Each of these spoils the link the way something between the site and the
// reader would: a mail client that kept only part of the address, a wrapper
// that added a parameter of its own, or somebody typing at the end of it.

const spoil = (world: SpecWorld, change: (link: string) => string): void => {
  made.set(world, change(theLink(world)));
};

Given("only the query of it is kept", function (this: SpecWorld) {
  spoil(this, (link) => link.slice(link.indexOf("?") + 1));
});

Given("only what the parameter carried is kept", function (this: SpecWorld) {
  spoil(this, (link) => link.slice(link.indexOf("?link=") + "?link=".length));
});

Given(
  "a {string} parameter is put in front of it",
  function (this: SpecWorld, name: string) {
    spoil(this, (link) => link.replace("?link=", `?${name}=1&link=`));
  },
);

Given("the link parameter is taken out of it", function (this: SpecWorld) {
  spoil(this, (link) => link.slice(0, link.indexOf("?")));
});

Given("the link parameter is given a second time", function (this: SpecWorld) {
  spoil(this, (link) => {
    const carried = link.slice(link.indexOf("?link=") + "?link=".length);
    return `${link}&link=${carried}`;
  });
});

Given("{string} is put on the end of it", function (this: SpecWorld, more) {
  spoil(this, (link) => `${link}${more}`);
});

// Reading it ---------------------------------------------------------------------

When("the link is read", function (this: SpecWorld) {
  read.set(this, linksOf(this).read(theLink(this)));
});

// What it read as ------------------------------------------------------------------

const carriedBy = (world: SpecWorld): LinkCarried => {
  const carried = wasRead(world);
  assert.ok(carried !== undefined, "The link did not read.");
  return carried;
};

Then("it is for confirming an email address", function (this: SpecWorld) {
  assert.equal(carriedBy(this).purpose, "confirm-email-address");
});

Then("it is for setting a new password", function (this: SpecWorld) {
  assert.equal(carriedBy(this).purpose, "set-new-password");
});

Then("it names that account", function (this: SpecWorld) {
  assert.equal(carriedBy(this).account.value, accountOf(this).value);
});

Then("it works until that moment", function (this: SpecWorld) {
  assert.equal(
    carriedBy(this).worksUntil.toDate().getTime(),
    momentOf(this).toDate().getTime(),
  );
});

Then("it does not read", function (this: SpecWorld) {
  assert.equal(wasRead(this), undefined);
});
