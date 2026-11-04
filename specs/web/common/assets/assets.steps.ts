import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { join } from "node:path";
import Fastify, { type FastifyInstance } from "fastify";

import {
  registerAssets,
  type Assets,
} from "../../../../src/web/common/assets.js";
import { sendersBelieved } from "../../../../src/web/common/trustedProxy.js";
import type { SpecWorld } from "../../../support/world.js";

// The file asked for is a real one, since what the route does is read one, and
// the repository's own package file is the one every run is sure to have.
const file = join(import.meta.dirname, "..", "..", "..", "..", "package.json");

const assets: Assets = {
  version: undefined,
  administratorEmailAddress: "administrator@example.com",
  url: (name) => `/assets/${name}`,
  resolve: (name) =>
    name === "a-file.txt"
      ? {
          path: file,
          contentType: "text/plain; charset=utf-8",
          publicName: "a-file.txt",
          current: true,
        }
      : undefined,
};

// What a scenario has: the server it built, the address a reader is asking
// from, and what the last request was answered with. Held here and not on the
// world, which every spec in the repository shares, for something only these
// scenarios have.
interface Scene {
  limit: number;
  proxy: string | undefined;
  page: boolean;
  server: FastifyInstance | undefined;
  reader: string;
  answer: { status: number; headers: Record<string, unknown>; body: string };
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  const scene = scenes.get(world);
  assert.ok(scene !== undefined, "No server has been built.");
  return scene;
};

// Built when the first request is made, so that what the scenario has said of
// the site, its proxy and its page, is all said before it is.
const serverOf = async (scene: Scene): Promise<FastifyInstance> => {
  if (scene.server !== undefined) return scene.server;
  const server = Fastify({
    logger: false,
    trustProxy: sendersBelieved(scene.proxy === undefined ? [] : [scene.proxy]),
  });
  await registerAssets(server, assets, scene.limit);
  if (scene.page) {
    server.get("/a-page", (_request, reply) =>
      reply.type("text/html; charset=utf-8").send("<p>a page</p>"),
    );
  }
  scene.server = server;
  return server;
};

// One request, from `connection`, with what it forwarded where it did.
const ask = async (
  world: SpecWorld,
  url: string,
  times = 1,
  from: { connection?: string; forwarded?: (nth: number) => string } = {},
): Promise<void> => {
  const scene = sceneOf(world);
  const server = await serverOf(scene);
  for (let asked = 0; asked < times; asked++) {
    const answer = await server.inject({
      method: "GET",
      url,
      remoteAddress: from.connection ?? scene.reader,
      headers:
        from.forwarded === undefined
          ? {}
          : { "x-forwarded-for": from.forwarded(asked) },
    });
    scene.answer = {
      status: answer.statusCode,
      headers: answer.headers,
      body: answer.body,
    };
  }
};

After(async function (this: SpecWorld) {
  await scenes.get(this)?.server?.close();
  scenes.delete(this);
});

Given(
  "the site's files are limited to {int} requests a minute from one address",
  function (this: SpecWorld, limit: number) {
    scenes.set(this, {
      limit,
      proxy: undefined,
      page: false,
      server: undefined,
      reader: "192.0.2.1",
      answer: { status: 0, headers: {}, body: "" },
    });
  },
);

Given("a page beside the files", function (this: SpecWorld) {
  sceneOf(this).page = true;
});

Given(
  "the site is told its proxy is at {string}",
  function (this: SpecWorld, address: string) {
    sceneOf(this).proxy = address;
  },
);

// Through the proxy: the connection is the proxy's, and the reader's address is
// what the proxy wrote.
const throughTheProxy = (world: SpecWorld, reader: string, times: number) => {
  const proxy = sceneOf(world).proxy;
  assert.ok(proxy !== undefined, "The site has not been told of a proxy.");
  return ask(world, "/assets/a-file.txt", times, {
    connection: proxy,
    forwarded: () => reader,
  });
};

When(
  "a reader at {string} asks for a file {int} times through the proxy",
  async function (this: SpecWorld, reader: string, times: number) {
    await throughTheProxy(this, reader, times);
  },
);

Given(
  "a reader at {string} has asked for a file {int} times through the proxy",
  async function (this: SpecWorld, reader: string, times: number) {
    await throughTheProxy(this, reader, times);
  },
);

When(
  "a reader at {string} asks for a file through the proxy",
  async function (this: SpecWorld, reader: string) {
    await throughTheProxy(this, reader, 1);
  },
);

When(
  "something that is not the proxy asks for a file {int} times, naming another address each time",
  async function (this: SpecWorld, times: number) {
    await ask(this, "/assets/a-file.txt", times, {
      connection: "198.51.100.7",
      forwarded: (nth) => `192.0.2.${100 + nth}`,
    });
  },
);

When(
  "a reader asks for a file {int} times",
  async function (this: SpecWorld, times: number) {
    await ask(this, "/assets/a-file.txt", times);
  },
);

Given(
  "a reader has asked for a file {int} times",
  async function (this: SpecWorld, times: number) {
    await ask(this, "/assets/a-file.txt", times);
  },
);

When(
  "a reader asks for a file that is not there {int} times",
  async function (this: SpecWorld, times: number) {
    await ask(this, "/assets/no-such-file.txt", times);
  },
);

When("another reader asks for a file", async function (this: SpecWorld) {
  sceneOf(this).reader = "192.0.2.2";
  await ask(this, "/assets/a-file.txt");
});

When(
  "a reader asks for the page {int} times",
  async function (this: SpecWorld, times: number) {
    await ask(this, "/a-page", times);
  },
);

When("the same reader asks for the page", async function (this: SpecWorld) {
  await ask(this, "/a-page");
});

Then("the last answer is the file", function (this: SpecWorld) {
  assert.equal(sceneOf(this).answer.status, 200);
});

Then("the last answer is the page", function (this: SpecWorld) {
  assert.equal(sceneOf(this).answer.status, 200);
  assert.equal(sceneOf(this).answer.body, "<p>a page</p>");
});

Then("the last answer is to wait", function (this: SpecWorld) {
  assert.equal(sceneOf(this).answer.status, 429);
});

Then("the answer is not to be kept by a cache", function (this: SpecWorld) {
  assert.match(
    String(sceneOf(this).answer.headers["cache-control"]),
    /no-store/,
  );
});

Then("the answer says how long to wait", function (this: SpecWorld) {
  const wait = Number(sceneOf(this).answer.headers["retry-after"]);
  assert.ok(wait > 0 && wait <= 60, `Told to wait ${wait} seconds.`);
});
