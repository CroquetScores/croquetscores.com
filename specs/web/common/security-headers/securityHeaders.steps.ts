import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import Fastify from "fastify";

import { registerSecurityHeaders } from "../../../../src/web/common/securityHeaders.js";
import type { SpecWorld } from "../../../support/world.js";

// A server with the one thing under test and the few routes the scenarios ask
// for, rather than the whole application: the headers do not depend on what a
// route holds, and an application with a database would answer the same slower.
const asked = async (world: SpecWorld, url: string): Promise<void> => {
  const server = Fastify({ logger: false });
  registerSecurityHeaders(server);
  server.get("/a-page", (_request, reply) =>
    reply.type("text/html; charset=utf-8").send("<p>a page</p>"),
  );
  server.get("/a-file", (_request, reply) =>
    reply.type("image/png").send(Buffer.from("not really a picture")),
  );

  try {
    const answer = await server.inject({ method: "GET", url });
    world.answeredWith = { headers: answer.headers, body: answer.body };
  } finally {
    await server.close();
  }
};

const header = (world: SpecWorld, name: string): string => {
  assert.ok(world.answeredWith !== undefined, "Nothing has been asked for.");
  const value = world.answeredWith.headers[name];
  assert.ok(typeof value === "string", `The answer has no ${name} header.`);
  return value;
};

// What the policy says about one kind of thing, as the places it names.
const policyFor = (world: SpecWorld, directive: string): string[] => {
  const found = header(world, "content-security-policy")
    .split(";")
    .map((part) => part.trim().split(/\s+/))
    .find(([name]) => name === directive);
  assert.ok(found !== undefined, `The policy says nothing of ${directive}.`);
  return found.slice(1);
};

When("a reader asks for a page", async function (this: SpecWorld) {
  await asked(this, "/a-page");
});

When(
  "a reader asks for a page that is not there",
  async function (this: SpecWorld) {
    await asked(this, "/nothing-here");
  },
);

When(
  "a reader asks for a file that is not a page",
  async function (this: SpecWorld) {
    await asked(this, "/a-file");
  },
);

Then(
  "it asks to be reached only over a secure connection",
  function (this: SpecWorld) {
    assert.match(header(this, "strict-transport-security"), /max-age=\d+/);
  },
);

Then("it asks for that for a year", function (this: SpecWorld) {
  assert.match(header(this, "strict-transport-security"), /max-age=31536000/);
});

Then(
  "it does not ask for that of the sites beneath this one",
  function (this: SpecWorld) {
    assert.doesNotMatch(
      header(this, "strict-transport-security"),
      /includeSubDomains/i,
    );
  },
);

Then("it asks that its kind is not guessed", function (this: SpecWorld) {
  assert.equal(header(this, "x-content-type-options"), "nosniff");
});

Then("it asks not to be framed", function (this: SpecWorld) {
  assert.equal(header(this, "x-frame-options"), "DENY");
});

Then("it has a policy", function (this: SpecWorld) {
  assert.notEqual(header(this, "content-security-policy"), "");
});

Then("its policy allows no site to frame it", function (this: SpecWorld) {
  assert.deepEqual(policyFor(this, "frame-ancestors"), ["'none'"]);
});

Then("its policy allows loading from the site", function (this: SpecWorld) {
  assert.ok(policyFor(this, "default-src").includes("'self'"));
});

Then("its policy allows nothing else by default", function (this: SpecWorld) {
  assert.deepEqual(policyFor(this, "default-src"), ["'self'"]);
});

Then("its policy allows no plug-ins", function (this: SpecWorld) {
  assert.deepEqual(policyFor(this, "object-src"), ["'none'"]);
});

Then("its policy allows no other base address", function (this: SpecWorld) {
  assert.deepEqual(policyFor(this, "base-uri"), ["'self'"]);
});

Then(
  "its policy allows scripts from {string}",
  function (this: SpecWorld, place: string) {
    assert.ok(policyFor(this, "script-src").includes(place));
  },
);

Then(
  "its policy allows forms to be sent to {string}",
  function (this: SpecWorld, place: string) {
    assert.ok(policyFor(this, "form-action").includes(place));
  },
);

Then(
  "its policy allows forms to be sent to nowhere else",
  function (this: SpecWorld) {
    const named = new Set([
      "'self'",
      "https://www.paypal.com",
      "https://accounts.google.com",
    ]);
    for (const place of policyFor(this, "form-action")) {
      assert.ok(named.has(place), `Forms may be sent to ${place}.`);
    }
  },
);

Then(
  "its policy allows frames from {string}",
  function (this: SpecWorld, place: string) {
    assert.ok(policyFor(this, "frame-src").includes(place));
  },
);

Then(
  "its policy allows requests to {string}",
  function (this: SpecWorld, place: string) {
    assert.ok(policyFor(this, "connect-src").includes(place));
  },
);
