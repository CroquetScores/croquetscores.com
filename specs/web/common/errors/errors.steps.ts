import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { LightMyRequestResponse } from "fastify";

import type { Range } from "../../../support/exampleRange.js";
import { ExampleCommand, ExampleQuery } from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";
import { builtFor } from "../../support/application.js";
import { englishForScenarios } from "../../support/languages.js";

// The API answers anything under /api/ as JSON, and anything else as a page,
// so which of the two a route is decides only where it is mounted.
const apiRoute = "/api/example";
const pageRoute = "/example";

// A range as a caller sends it: whatever the scenario gave, and nothing for
// what it did not.
const rangeFrom = (body: unknown): Range => {
  const sent = (body ?? {}) as Partial<Range>;
  return { start: sent.start, end: sent.end, step: sent.step };
};

Given(
  "an example API route that sends the example command for the range it is given",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.post(apiRoute, (request) =>
      request.server.mediator.send(
        new ExampleCommand(request.requestedAt, rangeFrom(request.body)),
      ),
    );
    scenario.route = { method: "POST", url: apiRoute };
  },
);

Given(
  "an example API route that asks the example query for the range it is given",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.post(apiRoute, (request) =>
      request.server.mediator.query(new ExampleQuery(rangeFrom(request.body))),
    );
    scenario.route = { method: "POST", url: apiRoute };
  },
);

Given(
  "an example page that sends the example command for the range it is given",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.post(pageRoute, (request) =>
      request.server.mediator.send(
        new ExampleCommand(request.requestedAt, rangeFrom(request.body)),
      ),
    );
    scenario.route = { method: "POST", url: pageRoute };
  },
);

When(
  "the example range is sent to the example route",
  async function (this: SpecWorld) {
    const scenario = builtFor(this);
    assert.ok(scenario.route !== undefined, "There is no example route.");
    assert.ok(this.range !== undefined, "There is no example range.");
    scenario.response = await scenario.application.server.inject({
      ...scenario.route,
      payload: this.range,
    });
  },
);

const answered = (world: SpecWorld): LightMyRequestResponse => {
  const response = builtFor(world).response;
  assert.ok(response !== undefined, "The example route was not requested.");
  return response;
};

// The API's answer, read as the JSON it is sent as.
const refusalOf = (
  world: SpecWorld,
): { error?: unknown; broken?: unknown; correlationId?: unknown } =>
  answered(world).json();

// 422: understood, and refused for what it said. Not 400, which says it could
// not be understood, and not 500, which says the server failed.
Then(
  "the route refuses it as the caller's mistake",
  function (this: SpecWorld) {
    const response = answered(this);
    assert.equal(
      response.statusCode,
      422,
      `The route answered ${response.statusCode}: ${response.body}`,
    );
  },
);

Then("the refusal is {string}", function (this: SpecWorld, code: string) {
  assert.equal(refusalOf(this).error, code);
});

// The rules the refusal names, as the API sends them: each rule's code and
// the fields it reads.
interface Named {
  readonly code: string;
  readonly fields: readonly string[];
}

// How many rules the scenario has named so far, so that "no other rule" knows
// how many there should be; and the fields it has said the last of them reads.
const named = new WeakMap<SpecWorld, { rules: number; fields: string[] }>();

const brokenOf = (world: SpecWorld): Named[] => {
  const broken = refusalOf(world).broken;
  assert.ok(Array.isArray(broken), "The refusal names no rules.");
  return broken as Named[];
};

Then(
  /^the (first|second|third) rule the refusal names is "([^"]*)"$/,
  function (this: SpecWorld, which: string, code: string) {
    const index = ["first", "second", "third"].indexOf(which);
    assert.equal(brokenOf(this)[index]?.code, code);
    named.set(this, { rules: index + 1, fields: [] });
  },
);

Then("the refusal names no other rule", function (this: SpecWorld) {
  const broken = brokenOf(this);
  assert.equal(
    broken.length,
    named.get(this)?.rules ?? 0,
    `The refusal names ${JSON.stringify(broken)}.`,
  );
});

// "That rule" is the one the scenario named last.
const thatRule = (world: SpecWorld): { rule: Named; fields: string[] } => {
  const sofar = named.get(world);
  const rule = sofar && brokenOf(world)[sofar.rules - 1];
  assert.ok(sofar && rule, "No rule the refusal names has been named yet.");
  return { rule, fields: sofar.fields };
};

Then(
  "the refusal says that rule reads the field {string}",
  function (this: SpecWorld, field: string) {
    const { rule, fields } = thatRule(this);
    assert.ok(
      rule.fields.includes(field),
      `${rule.code} is said to read ${JSON.stringify(rule.fields)}.`,
    );
    fields.push(field);
  },
);

Then(
  "the refusal says that rule reads no other field",
  function (this: SpecWorld) {
    const { rule, fields } = thatRule(this);
    assert.deepEqual(
      rule.fields.filter((field) => !fields.includes(field)),
      [],
      `${rule.code} is said to read ${JSON.stringify(rule.fields)}.`,
    );
  },
);

// A page, and not the one that says the server failed.
Then("the page does not say the server failed", function (this: SpecWorld) {
  const response = answered(this);
  assert.match(
    String(response.headers["content-type"]),
    /^text\/html/,
    "The route did not answer with a page.",
  );
  assert.doesNotMatch(response.body, /Something went wrong/);
});

Then("the route answers that the server failed", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(
    response.statusCode,
    500,
    `The route answered ${response.statusCode}: ${response.body}`,
  );
});

Then("the answer gives a reference to find it by", function (this: SpecWorld) {
  assert.match(
    String(refusalOf(this).correlationId),
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
  );
});

Then(
  "the answer does not name {string}",
  function (this: SpecWorld, code: string) {
    assert.ok(
      !answered(this).body.includes(code),
      `The answer names ${code}: ${answered(this).body}`,
    );
  },
);

// What a page where the server failed offers the reader ------------------------

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const referencePattern =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

// The message the page offers, as a browser would open it: who it is to, and
// what its subject and body already say. Nothing where the page offers none.
const messageOf = (
  world: SpecWorld,
): { to: string; subject: string; body: string } | undefined => {
  const found = /href="mailto:([^"?]*)\?([^"]*)"/.exec(answered(world).body);
  if (found === null) return undefined;
  // The attribute is escaped as HTML, so its & is &amp; until it is read.
  const parts = new URLSearchParams(found[2]!.replaceAll("&amp;", "&"));
  return {
    to: decodeURIComponent(found[1]!),
    subject: parts.get("subject") ?? "",
    body: parts.get("body") ?? "",
  };
};

const offered = (world: SpecWorld) => {
  const message = messageOf(world);
  assert.ok(message !== undefined, "The page offers no message.");
  return message;
};

Then(
  "the page says the failure has been recorded for the administrator",
  function (this: SpecWorld) {
    assert.ok(answered(this).body.includes(words("errors.recorded")));
  },
);

Then(
  "the page offers a message to {string}",
  function (this: SpecWorld, emailAddress: string) {
    assert.equal(offered(this).to, emailAddress);
  },
);

Then(
  "the page offers no message to the administrator",
  function (this: SpecWorld) {
    assert.equal(messageOf(this), undefined);
  },
);

Then(
  "the page gives a reference to find the failure by",
  function (this: SpecWorld) {
    assert.match(answered(this).body, referencePattern);
  },
);

Then(
  "the subject of the message names that reference",
  function (this: SpecWorld) {
    const reference = referencePattern.exec(answered(this).body)?.[0];
    assert.ok(reference !== undefined, "The page gives no reference.");
    assert.ok(
      offered(this).subject.includes(reference),
      `The subject is "${offered(this).subject}".`,
    );
  },
);

Then("the message asks what the reader was doing", function (this: SpecWorld) {
  assert.equal(offered(this).body, words("errors.messageBody"));
});

// What a page's answer says about keeping it -----------------------------------

// Nothing is mounted here, so the request reaches the handler for a page that
// is not there rather than a route of the scenario's own.
When("a page that is not there is asked for", async function (this: SpecWorld) {
  const scenario = builtFor(this);
  scenario.response = await scenario.application.server.inject({
    method: "GET",
    url: "/nothing-is-mounted-here",
  });
});

Then("the answer is kept for the one reader only", function (this: SpecWorld) {
  assert.equal(answered(this).headers["cache-control"], "private, no-cache");
});

// Named among what it varies by, rather than the whole header, so that adding
// something else to vary by does not fail a scenario about cookies.
const variesBy = (world: SpecWorld, what: string): void => {
  const vary = String(answered(world).headers["vary"] ?? "");
  assert.ok(
    vary
      .split(",")
      .map((each) => each.trim().toLowerCase())
      .includes(what.toLowerCase()),
    `The answer varies by ${vary}.`,
  );
};

Then(
  "the answer says it varies by the reader's cookies",
  function (this: SpecWorld) {
    variesBy(this, "Cookie");
  },
);

Then(
  "the answer says it varies by the languages the browser asks for",
  function (this: SpecWorld) {
    variesBy(this, "Accept-Language");
  },
);

// What an API answer says about keeping it ------------------------------------

// Nothing is mounted here either, so the request reaches the same handler as
// the page above, and is told apart from it only by being under /api/.
When(
  "an API address that is not there is asked for",
  async function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.response = await scenario.application.server.inject({
      method: "GET",
      url: "/api/nothing-is-mounted-here",
    });
  },
);

// A body that says it is JSON and is not. Fastify refuses it itself, before any
// route runs, with a status of its own — which is the way out of the error
// mapping that neither a refusal nor the server failing takes.
When(
  "something that cannot be read is sent to the example route",
  async function (this: SpecWorld) {
    const scenario = builtFor(this);
    assert.ok(scenario.route !== undefined, "There is no example route.");
    scenario.response = await scenario.application.server.inject({
      ...scenario.route,
      headers: { "content-type": "application/json" },
      payload: "{",
    });
  },
);

Then("the answer is kept by nobody", function (this: SpecWorld) {
  assert.equal(answered(this).headers["cache-control"], "no-store");
});
