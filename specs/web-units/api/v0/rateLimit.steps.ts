// The day's allowance of a caller with no key (rateLimit.feature), held to with
// the limit itself in a small server of its own and not with the whole site,
// whose minute's allowance would stop a caller before its day's.
import { Given, Then, When } from "@cucumber/cucumber";
import Fastify, { type FastifyInstance } from "fastify";
import { strict as assert } from "node:assert";

import { Website } from "../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../support/world.js";
import { apiV0 } from "../../../../src/web/api/v0/index.js";

interface Scene {
  server: FastifyInstance | undefined;
  address: string;
  answer: { status: number; body: Record<string, unknown> } | undefined;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  let scene = scenes.get(world);
  if (scene === undefined) {
    scene = { server: undefined, address: "203.0.113.1", answer: undefined };
    scenes.set(world, scene);
  }
  return scene;
};

// A site that is sent no key, so every caller is counted by its address, and
// that trusts the machine the scenario runs on to say where a request came
// from, as the site behind its proxy does.
Given(
  "the API allows a caller with no key {int} requests a day",
  async function (this: SpecWorld, allowed: number) {
    const server = Fastify({ trustProxy: "127.0.0.1" });
    // Nothing sent a key, so only the list is asked, and it has none.
    server.decorate("mediator", {
      query: () =>
        Promise.resolve({
          tournaments: [],
          total: 0,
          page: 1,
          pageSize: 100,
          next: undefined,
          changedAt: undefined,
        }),
    } as never);
    // The website a request is for, which the list reads and which the site
    // works out from the address it was sent to.
    server.decorateRequest("website", undefined);
    server.addHook("onRequest", (request, _reply, done) => {
      request.website = Website.from("croquetscores.com");
      done();
    });
    await server.register(apiV0, {
      prefix: "/api/v0",
      requestsADayWithNoKey: allowed,
    });
    await server.ready();
    sceneOf(this).server = server;
  },
);

const ask = async (world: SpecWorld): Promise<void> => {
  const scene = sceneOf(world);
  const answer = await scene.server!.inject({
    method: "GET",
    url: "/api/v0/tournaments?year=2026",
    headers: { "x-forwarded-for": scene.address },
  });
  scene.answer = {
    status: answer.statusCode,
    body: answer.body === "" ? {} : answer.json<Record<string, unknown>>(),
  };
  remaining.set(world, answer.headers["ratelimit-remaining"]);
};

const remaining = new WeakMap<SpecWorld, unknown>();

Given(
  "the caller has asked {int} times",
  async function (this: SpecWorld, times: number) {
    for (let each = 0; each < times; each++) await ask(this);
  },
);

Given(
  "the caller is at the address {string}",
  function (this: SpecWorld, address: string) {
    sceneOf(this).address = address;
  },
);

When("the caller asks", async function (this: SpecWorld) {
  await ask(this);
});

Then("the API answers {int}", function (this: SpecWorld, status: number) {
  assert.equal(sceneOf(this).answer?.status, status);
});

Then("the API's code is {string}", function (this: SpecWorld, code: string) {
  assert.equal(sceneOf(this).answer?.body["code"], code);
});

Then("the API says {int} are left", function (this: SpecWorld, left: number) {
  assert.equal(Number(remaining.get(this)), left);
});
