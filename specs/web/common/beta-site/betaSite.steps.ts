import { Then, When } from "@cucumber/cucumber";
import cookie from "@fastify/cookie";
import { strict as assert } from "node:assert";
import Fastify from "fastify";

import { registerBetaBanner } from "../../../../src/web/common/betaSite.js";
import { speakToRequests } from "../../../../src/web/common/language.js";
import { english } from "../../../../src/web/languages/english.js";
import { welsh } from "../../../../src/web/languages/welsh.js";
import type { SpecWorld } from "../../../support/world.js";

const page = "<!doctype html><html><body><main>the page</main></body></html>";
const data = '{"body":"<body>"}';

// A server with the one thing under test and a page and some data to ask for,
// rather than the whole application: what decides the answer is the address
// asked at, and an application with a database would answer the same, slower.
const asked = async (
  world: SpecWorld,
  address: string,
  path: string,
): Promise<void> => {
  const server = Fastify({ logger: false });
  await server.register(cookie);
  speakToRequests(server, [english, welsh]);
  registerBetaBanner(server);
  server.get("/a-page", (_request, reply) =>
    reply.type("text/html; charset=utf-8").send(page),
  );
  server.get("/data", (_request, reply) =>
    reply.type("application/json").send(data),
  );

  try {
    const answer = await server.inject({
      method: "GET",
      url: path,
      headers: {
        host: address,
        ...(world.acceptLanguage === undefined
          ? {}
          : { "accept-language": world.acceptLanguage }),
      },
    });
    world.answeredWith = { headers: answer.headers, body: answer.body };
  } finally {
    await server.close();
  }
};

const body = (world: SpecWorld): string => {
  assert.ok(world.answeredWith !== undefined, "Nothing has been asked for.");
  return world.answeredWith.body;
};

When(
  "a page is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    await asked(this, address, "/a-page");
  },
);

When(
  "data is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    await asked(this, address, "/data");
  },
);

Then("it says it is a beta site", function (this: SpecWorld) {
  assert.ok(body(this).includes(english.words["beta.banner"]!));
});

Then("it does not say it is a beta site", function (this: SpecWorld) {
  assert.ok(!body(this).includes(english.words["beta.banner"]!));
});

Then("it says it is a beta site in Welsh", function (this: SpecWorld) {
  assert.ok(body(this).includes(welsh.words["beta.banner"]!));
});

Then(
  "the notice comes before the page's own content",
  function (this: SpecWorld) {
    const html = body(this);
    assert.ok(
      html.indexOf(english.words["beta.banner"]!) < html.indexOf("<main>"),
      "The notice is not above the page.",
    );
  },
);

Then("the answer is as it was written", function (this: SpecWorld) {
  assert.equal(body(this), data);
});
