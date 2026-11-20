// The control that refuses the API a read of the events
// (testControlEventStore.feature), held to a store of its own that keeps its
// events in memory and a small server whose every address is a request the
// store is read or appended to for, so that what is asked is who is asking and
// nothing else of the site is in the way.
import { Given, Then, When } from "@cucumber/cucumber";
import Fastify, { type FastifyInstance } from "fastify";
import { strict as assert } from "node:assert";

import type { EventStore } from "../../../../src/application/services/EventStore.js";
import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import { EventStoreWithRefusableReads } from "../../../../src/infrastructure/event-store/EventStoreWithRefusableReads.js";
import {
  markRequestsToTheApi,
  registerTestControlEventStore,
} from "../../../../src/web/testControlEventStore.js";
import { causedBy, exampleEvent } from "../../../support/exampleEvents.js";
import type { SpecWorld } from "../../../support/world.js";

const token = "open sesame";

// A store that keeps what it is given and is never refused, so that a refusal
// seen is the guard's.
class MemoryEvents implements EventStore {
  readonly kept = new Map<string, DomainEvent[]>();

  appendEvents(
    streamId: Id,
    _expectedVersion: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    const stream = this.kept.get(streamId.value) ?? [];
    this.kept.set(streamId.value, [...stream, ...events]);
    return Promise.resolve();
  }

  getEvents(streamId: Id): Promise<readonly DomainEvent[]> {
    return Promise.resolve(this.kept.get(streamId.value) ?? []);
  }
}

interface Scene {
  readonly events: MemoryEvents;
  readonly server: FastifyInstance;
  answered: number | undefined;
  readBack: readonly DomainEvent[] | undefined;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  const found = scenes.get(world);
  assert.ok(found !== undefined, "No store of events was made.");
  return found;
};

Given(
  "a store of events that holds an event",
  async function (this: SpecWorld) {
    const events = new MemoryEvents();
    const store = new EventStoreWithRefusableReads(events);
    await events.appendEvents(causedBy, 0, [exampleEvent("kept")]);
    const server = Fastify();
    markRequestsToTheApi(server, store);
    registerTestControlEventStore(server, token, store);
    // Every address reads the stream, and `POST` appends to it, as whatever is
    // asked would.
    server.get("/*", async (_request, reply) => {
      try {
        scene.readBack = await store.getEvents(causedBy);
        return await reply.code(200).send();
      } catch {
        return await reply.code(500).send();
      }
    });
    server.post("/*", async (_request, reply) => {
      await store.appendEvents(causedBy, 1, [exampleEvent("appended")]);
      return reply.code(204).send();
    });
    await server.ready();
    this.closeBeforeDropping.push(() => server.close());
    const scene: Scene = {
      events,
      server,
      answered: undefined,
      readBack: undefined,
    };
    scenes.set(this, scene);
  },
);

const told = async (world: SpecWorld, refused: boolean): Promise<void> => {
  const answer = await sceneOf(world).server.inject({
    method: "POST",
    url: "/__test/event-store/api-reads",
    headers: { "x-test-control": token },
    payload: { refused },
  });
  assert.equal(answer.statusCode, 200);
};

Given("the API may not read the events", async function (this: SpecWorld) {
  await told(this, true);
});

Given("the API may read the events again", async function (this: SpecWorld) {
  await told(this, false);
});

When(
  "the stream is read for a request to {string}",
  async function (this: SpecWorld, url: string) {
    const scene = sceneOf(this);
    scene.answered = (
      await scene.server.inject({ method: "GET", url })
    ).statusCode;
  },
);

When(
  "an event is appended for a request to {string}",
  async function (this: SpecWorld, url: string) {
    const scene = sceneOf(this);
    scene.answered = (
      await scene.server.inject({ method: "POST", url })
    ).statusCode;
  },
);

Then("the read is refused", function (this: SpecWorld) {
  const scene = sceneOf(this);
  assert.equal(scene.answered, 500);
  assert.equal(scene.readBack, undefined);
});

Then("the request is answered with the events", function (this: SpecWorld) {
  const scene = sceneOf(this);
  assert.equal(scene.answered, 200);
  assert.equal(scene.readBack?.length, 1);
});

Then("the event is kept", function (this: SpecWorld) {
  const scene = sceneOf(this);
  assert.equal(scene.answered, 204);
  assert.equal(scene.events.kept.get(causedBy.value)?.length, 2);
});
