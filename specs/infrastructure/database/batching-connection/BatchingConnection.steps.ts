import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { UnitOfWork } from "../../../../src/infrastructure/database/UnitOfWork.js";
import { unitOfWorkOf, useUnitOfWork } from "../../support/transactions.js";

// Each scenario says what its work does, one step at a time, and the work is
// done once, inside one transaction, the first time a step asks what came of
// it. Whether it batches is said by the steps that write, and a scenario that
// says both is a mistake.

interface Scene {
  readonly doing: (() => Promise<void>)[];
  batching: boolean | undefined;
  /** What was sent on the connection of the work, but for its transaction. */
  sent: string[];
  done: boolean;
  failure: unknown;
  read: string[];
  place: number | undefined;
}

const scenes = new WeakMap<SpecWorld, Scene>();

const sceneOf = (world: SpecWorld): Scene => {
  const found = scenes.get(world);
  assert.ok(found !== undefined, "This scenario has nothing to write to.");
  return found;
};

Given("a place to keep values", async function (this: SpecWorld) {
  await this.database.query(
    `create table batched_values (
       place        serial primary key,
       name         text unique,
       text_value   text,
       number_value integer,
       moment       timestamptz,
       list         integer[],
       words        text[],
       parts        jsonb
     )`,
  );
});

// What is sent is counted by wrapping the connection of the pool the work is
// given, so that what the batching sends is what is counted, and not what the
// work asked of it.
Given("a unit of work that counts what it sends", function (this: SpecWorld) {
  const scene: Scene = {
    doing: [],
    batching: undefined,
    sent: [],
    done: false,
    failure: undefined,
    read: [],
    place: undefined,
  };
  scenes.set(this, scene);
  // A pool of its own for the unit of work, over the scenario's, so that the
  // scenario's own reads of what was kept are not counted among what the work
  // sent.
  const pool = this.database;
  const counting = Object.create(pool) as typeof pool;
  const connect = pool.connect.bind(pool) as () => Promise<{
    query: (...parameters: unknown[]) => unknown;
  }>;
  (counting as unknown as { connect: () => Promise<unknown> }).connect =
    async () => {
      const connection = await connect();
      const query = connection.query.bind(connection);
      connection.query = (...parameters: unknown[]) => {
        const first = parameters[0];
        const text =
          typeof first === "string"
            ? first
            : ((first as { text?: string }).text ?? "");
        if (!/^\s*(begin|commit|rollback)/i.test(text)) scene.sent.push(text);
        return query(...parameters);
      };
      return connection;
    };
  useUnitOfWork(this, new UnitOfWork(counting));
});

const batches = (world: SpecWorld, batching: boolean): Scene => {
  const scene = sceneOf(world);
  assert.ok(
    scene.batching === undefined || scene.batching === batching,
    "A scenario says whether the work batches once.",
  );
  scene.batching = batching;
  return scene;
};

const doing = (
  world: SpecWorld,
  batching: boolean,
  work: () => Promise<void>,
): void => {
  batches(world, batching).doing.push(work);
};

const connection = (world: SpecWorld) => unitOfWorkOf(world).connection();

// The work is done the first time anything asks what came of it.
const done = async (world: SpecWorld): Promise<Scene> => {
  const scene = sceneOf(world);
  if (scene.done) return scene;
  scene.done = true;
  const unitOfWork = unitOfWorkOf(world);
  const all = async (): Promise<void> => {
    for (const each of scene.doing) await each();
  };
  try {
    await unitOfWork.inTransaction(() =>
      scene.batching === true ? unitOfWork.batchingWrites(all) : all(),
    );
  } catch (failure) {
    scene.failure = failure;
  }
  return scene;
};

const write = async (
  world: SpecWorld,
  sql: string,
  values: unknown[],
): Promise<void> => {
  await connection(world).query(sql, values);
};

// Writing --------------------------------------------------------------------

When(
  /^(\d+) values are written (while batching|without batching)$/,
  function (this: SpecWorld, count: string, how: string) {
    for (let each = 1; each <= Number(count); each++) {
      doing(this, how === "while batching", () =>
        write(this, "insert into batched_values (name) values ($1)", [
          `value ${String(each)}`,
        ]),
      );
    }
  },
);

When(
  "the value {string} is written while batching",
  function (this: SpecWorld, name: string) {
    doing(this, true, () =>
      write(this, "insert into batched_values (name) values ($1)", [name]),
    );
  },
);

When(
  "the value {string} is written again while batching",
  function (this: SpecWorld, name: string) {
    doing(this, true, () =>
      write(this, "insert into batched_values (name) values ($1)", [name]),
    );
  },
);

When(
  "the value {string} is written, answering with its place, while batching",
  function (this: SpecWorld, name: string) {
    doing(this, true, async () => {
      const { rows } = await connection(this).query<{ place: number }>(
        "insert into batched_values (name) values ($1) returning place",
        [name],
      );
      sceneOf(this).place = rows[0]?.place;
    });
  },
);

When(
  "the value {string} is changed to {string} while batching",
  function (this: SpecWorld, from: string, to: string) {
    doing(this, true, () =>
      write(this, "update batched_values set name = $2 where name = $1", [
        from,
        to,
      ]),
    );
  },
);

When(
  "the value {string} is deleted while batching",
  function (this: SpecWorld, name: string) {
    doing(this, true, () =>
      write(this, "delete from batched_values where name = $1", [name]),
    );
  },
);

When(
  "the value {string} is written as both its name and its text while batching",
  function (this: SpecWorld, name: string) {
    doing(this, true, () =>
      write(
        this,
        "insert into batched_values (name, text_value) values ($1, $1)",
        [name],
      ),
    );
  },
);

When("the values are read while batching", function (this: SpecWorld) {
  doing(this, true, async () => {
    const { rows } = await connection(this).query<{ name: string }>(
      "select name from batched_values order by place",
    );
    sceneOf(this).read = rows.map((row) => row.name);
  });
});

// Writing one row's worth of each kind of value -------------------------------

const insertIt = (
  world: SpecWorld,
  column: string,
  value: unknown,
  cast = "",
): void => {
  doing(world, true, () =>
    write(
      world,
      `insert into batched_values (name, ${column}) values ('v', $1${cast})`,
      [value],
    ),
  );
};

When(
  "the text {string} is written while batching",
  function (this: SpecWorld, text: string) {
    insertIt(this, "text_value", text);
  },
);

When(
  "the text with a line break is written while batching",
  function (this: SpecWorld) {
    insertIt(this, "text_value", "one\ntwo");
  },
);

When("no text is written while batching", function (this: SpecWorld) {
  insertIt(this, "text_value", null);
});

When(
  "the number {int} is written while batching",
  function (this: SpecWorld, number: number) {
    insertIt(this, "number_value", number);
  },
);

When(
  "the moment {string} is written while batching",
  function (this: SpecWorld, moment: string) {
    insertIt(this, "moment", new Date(moment));
  },
);

When(
  "the list {int}, {int}, {int} is written while batching",
  function (this: SpecWorld, one: number, two: number, three: number) {
    insertIt(this, "list", [one, two, three]);
  },
);

When(
  "the list of text {string} and {string} is written while batching",
  function (this: SpecWorld, one: string, two: string) {
    insertIt(this, "words", [one, two]);
  },
);

When(
  "the object with the part {string} being {int} is written while batching",
  function (this: SpecWorld, part: string, value: number) {
    insertIt(this, "parts", { [part]: value });
  },
);

// Writing a row that must be changed ------------------------------------------

When(
  /^the value "([^"]*)" is changed to "([^"]*)" expecting one row (while batching|without batching)$/,
  function (this: SpecWorld, from: string, to: string, how: string) {
    doing(this, how === "while batching", () =>
      unitOfWorkOf(this).writeToOneRow(
        "update batched_values set name = $2 where name = $1",
        [from, to],
        () => new Error("there was no row"),
      ),
    );
  },
);

// What came of it ------------------------------------------------------------

Then(
  /^(\d+) statements? (?:was|were) sent for them$/,
  async function (this: SpecWorld, count: string) {
    const scene = await done(this);
    assert.equal(scene.failure, undefined, String(scene.failure));
    assert.equal(scene.sent.length, Number(count));
  },
);

Then(
  /^(\d+) values? (?:is|are) kept$/,
  async function (this: SpecWorld, count: string) {
    await done(this);
    const { rows } = await this.database.query<{ kept: string }>(
      "select count(*) as kept from batched_values",
    );
    assert.equal(Number(rows[0]?.kept), Number(count));
  },
);

Then(
  "the values read are {string}",
  async function (this: SpecWorld, names: string) {
    const scene = await done(this);
    assert.equal(scene.failure, undefined, String(scene.failure));
    assert.deepEqual(scene.read, [names]);
  },
);

Then(
  "the place answered is {int}",
  async function (this: SpecWorld, n: number) {
    const scene = await done(this);
    assert.equal(scene.failure, undefined, String(scene.failure));
    assert.equal(scene.place, n);
  },
);

Then(
  "the values kept are {string}",
  async function (this: SpecWorld, names: string) {
    const scene = await done(this);
    assert.equal(scene.failure, undefined, String(scene.failure));
    const { rows } = await this.database.query<{ name: string }>(
      "select name from batched_values order by place",
    );
    assert.deepEqual(
      rows.map((row) => row.name),
      [names],
    );
  },
);

// One value of its own kind, read back as the database holds it.
const kept = async (
  world: SpecWorld,
  column: string,
  cast = "",
): Promise<unknown> => {
  const scene = await done(world);
  assert.equal(scene.failure, undefined, String(scene.failure));
  const { rows } = await world.database.query<Record<string, unknown>>(
    `select ${column}${cast} as it from batched_values where name = 'v'`,
  );
  return rows[0]?.["it"];
};

Then(
  "the text kept is {string}",
  async function (this: SpecWorld, text: string) {
    assert.equal(await kept(this, "text_value"), text);
  },
);

Then("the text kept has a line break", async function (this: SpecWorld) {
  assert.equal(await kept(this, "text_value"), "one\ntwo");
});

Then("no text is kept", async function (this: SpecWorld) {
  assert.equal(await kept(this, "text_value"), null);
});

Then(
  "the number kept is {int}",
  async function (this: SpecWorld, number: number) {
    assert.equal(await kept(this, "number_value"), number);
  },
);

Then(
  "the moment kept is {string}",
  async function (this: SpecWorld, moment: string) {
    const found = (await kept(this, "moment")) as Date;
    assert.equal(found.toISOString(), moment);
  },
);

Then(
  "the list kept is {int}, {int}, {int}",
  async function (this: SpecWorld, one: number, two: number, three: number) {
    assert.deepEqual(await kept(this, "list"), [one, two, three]);
  },
);

Then(
  "the list of text kept is {string} and {string}",
  async function (this: SpecWorld, one: string, two: string) {
    assert.deepEqual(await kept(this, "words"), [one, two]);
  },
);

Then(
  "the object kept has the part {string} being {int}",
  async function (this: SpecWorld, part: string, value: number) {
    assert.deepEqual(await kept(this, "parts"), { [part]: value });
  },
);

Then("the work failed", async function (this: SpecWorld) {
  const scene = await done(this);
  assert.notEqual(scene.failure, undefined, "The work did not fail.");
});

Then("the work did not fail", async function (this: SpecWorld) {
  const scene = await done(this);
  assert.equal(scene.failure, undefined, String(scene.failure));
});

Then(
  "the work failed with {string}",
  async function (this: SpecWorld, message: string) {
    const scene = await done(this);
    assert.ok(
      scene.failure instanceof Error && scene.failure.message === message,
      `It failed with ${String(scene.failure)}.`,
    );
  },
);

Then("no value is kept", async function (this: SpecWorld) {
  await done(this);
  const { rows } = await this.database.query<{ kept: string }>(
    "select count(*) as kept from batched_values",
  );
  assert.equal(rows[0]?.kept, "0");
});
