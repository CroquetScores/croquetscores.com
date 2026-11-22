import { Given, When } from "@cucumber/cucumber";

import { TournamentsAtAddresses } from "../../../../../src/application/operations/tournaments/TournamentsAtAddresses.js";
import type { SpecWorld } from "../../../../support/world.js";
import { inHandOf } from "../aRequest.js";

// What each scenario has said it will ask about, kept beside the world and not
// in it, since nothing else asks about addresses. What was answered is said in
// the words every list's feature shares (tournamentsOfWebsite.steps.ts).
const asked = new WeakMap<SpecWorld, unknown[]>();

const addressesOf = (world: SpecWorld): unknown[] => {
  const held = asked.get(world) ?? [];
  asked.set(world, held);
  return held;
};

Given(
  "the address {string} is asked about",
  function (this: SpecWorld, address: string) {
    addressesOf(this).push(address);
  },
);

Given("the address is not text", function (this: SpecWorld) {
  addressesOf(this).push(42);
});

// Asked with nobody signed in.
const ask = async (world: SpecWorld, website: string): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new TournamentsAtAddresses(website, addressesOf(world) as string[]),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

When(
  "the tournaments at the addresses are asked for",
  async function (this: SpecWorld) {
    await ask(this, "croquetscores.com");
  },
);

When(
  "the tournaments at the addresses on {string} are asked for",
  async function (this: SpecWorld, website: string) {
    await ask(this, website);
  },
);
