import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type Docker,
  DockerUnavailable,
  runCreateContainer,
} from "../../../src/infrastructure/maintenance/postgresContainerCli.js";
import type { SpecWorld } from "../../support/world.js";

// The script that makes the Postgres container, run as its own function
// (`postgresContainerCli.feature`) against a Docker the scenario can read, take
// the container's name from, and make unavailable or slow to be ready.

interface Made {
  args: readonly string[];
  environment: Readonly<Record<string, string>>;
}

interface Scenario {
  existing: string[];
  unavailable: boolean;
  refusal: string | undefined;
  // How many tries Postgres takes to be ready, or never.
  readyOnTry: number | "never";
  made: Made | undefined;
  said: string[];
  exitCode: 0 | 1 | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = {
      existing: [],
      unavailable: false,
      refusal: undefined,
      readyOnTry: 1,
      made: undefined,
      said: [],
      exitCode: undefined,
    };
    scenarios.set(world, found);
  }
  return found;
};

Given("a container called {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).existing.push(name);
});

Given("Docker cannot be reached", function (this: SpecWorld) {
  scenarioOf(this).unavailable = true;
});

Given(
  "Docker refuses to make the container, saying {string}",
  function (this: SpecWorld, said: string) {
    scenarioOf(this).refusal = said;
  },
);

Given(
  "Postgres takes {int} tries to be ready",
  function (this: SpecWorld, tries: number) {
    scenarioOf(this).readyOnTry = tries;
  },
);

Given("Postgres is never ready", function (this: SpecWorld) {
  scenarioOf(this).readyOnTry = "never";
});

const run = async (world: SpecWorld, argumentsText: string): Promise<void> => {
  const scenario = scenarioOf(world);
  let tries = 0;
  const docker: Docker = {
    containers: () => {
      if (scenario.unavailable) return Promise.reject(new DockerUnavailable());
      return Promise.resolve(scenario.existing);
    },
    run: (args, environment) => {
      if (scenario.refusal !== undefined) {
        return Promise.resolve({ exitCode: 125, output: scenario.refusal });
      }
      scenario.made = { args, environment };
      return Promise.resolve({ exitCode: 0, output: "" });
    },
    ready: () => {
      tries += 1;
      return Promise.resolve(
        scenario.readyOnTry !== "never" && tries >= scenario.readyOnTry,
      );
    },
  };
  // Split as a shell would a line with quoted words, so that a scenario writes
  // what it would type.
  const args = [...argumentsText.matchAll(/"([^"]*)"|(\S+)/g)].map(
    (match) => match[1] ?? match[2] ?? "",
  );
  const outcome = await runCreateContainer(args, docker, {
    wait: () => Promise.resolve(),
    say: (line) => scenario.said.push(line),
  });
  scenario.exitCode = outcome.exitCode;
};

// A step is a step whatever keyword it is under, so this is the one, for the
// scenarios that run it and for the Background that does.
When(
  "the container script is run with {string}",
  async function (this: SpecWorld, argumentsText: string) {
    await run(this, argumentsText);
  },
);

// What came of it --------------------------------------------------------

const said = (world: SpecWorld): string => scenarioOf(world).said.join("\n");

const madeOf = (world: SpecWorld): Made => {
  const { made } = scenarioOf(world);
  assert.ok(
    made !== undefined,
    `No container was made. It said: ${said(world)}`,
  );
  return made;
};

// The value of an option Docker was given, as "--name", twice for "--env".
const valuesOf = (made: Made, flag: string): string[] =>
  made.args.flatMap((arg, at) =>
    arg === flag ? [made.args[at + 1] ?? ""] : [],
  );

Then("the container script exits with failure", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).exitCode, 1, said(this));
});

Then("the container script exits with success", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).exitCode, 0, said(this));
});

Then("no container was made", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).made, undefined);
});

Then(
  "the container script says the name is needed",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("The name is needed"), said(this));
  },
);

Then(
  "the container script says the username is needed",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("The username is needed"), said(this));
  },
);

Then(
  "the container script says the port is needed",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("The port is needed"), said(this));
  },
);

Then(
  "the container script says the password is needed",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("The password is needed"), said(this));
  },
);

Then(
  "the container script says there is a container called {string} already",
  function (this: SpecWorld, name: string) {
    assert.ok(
      said(this).includes(`There is a container called ${name} already`),
      said(this),
    );
  },
);

Then(
  "a container called {string} was made",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(valuesOf(madeOf(this), "--name"), [name]);
  },
);

Then(
  "the container was made from {string}",
  function (this: SpecWorld, image: string) {
    assert.equal(madeOf(this).args.at(-1), image);
  },
);

Then(
  "the container was made to run in the background",
  function (this: SpecWorld) {
    assert.ok(madeOf(this).args.includes("--detach"));
  },
);

Then(
  "the container keeps its data in the volume {string}",
  function (this: SpecWorld, volume: string) {
    assert.deepEqual(valuesOf(madeOf(this), "--volume"), [
      `${volume}:/var/lib/postgresql/data`,
    ]);
  },
);

Then(
  "the container was made to start again unless it was stopped",
  function (this: SpecWorld) {
    assert.deepEqual(valuesOf(madeOf(this), "--restart"), ["unless-stopped"]);
  },
);

Then(
  /^the container is reached on port (\d+) of this computer only$/,
  function (this: SpecWorld, port: string) {
    assert.deepEqual(valuesOf(madeOf(this), "--publish"), [
      `127.0.0.1:${port}:5432`,
    ]);
  },
);

Then(
  "the container's Postgres user is {string}",
  function (this: SpecWorld, user: string) {
    assert.ok(
      valuesOf(madeOf(this), "--env").includes(`POSTGRES_USER=${user}`),
    );
  },
);

Then(
  "the container's database is {string}",
  function (this: SpecWorld, database: string) {
    assert.ok(
      valuesOf(madeOf(this), "--env").includes(`POSTGRES_DB=${database}`),
    );
  },
);

Then(
  "the container's Postgres password is {string}",
  function (this: SpecWorld, password: string) {
    assert.equal(madeOf(this).environment["POSTGRES_PASSWORD"], password);
  },
);

Then(
  "the password is not on Docker's command line",
  function (this: SpecWorld) {
    const made = madeOf(this);
    assert.ok(made.args.every((arg) => !arg.includes("secret")));
    // Named so that Docker reads it from the environment.
    assert.ok(valuesOf(made, "--env").includes("POSTGRES_PASSWORD"));
  },
);

Then("the container script says Postgres is ready", function (this: SpecWorld) {
  assert.ok(said(this).includes("Postgres is ready."), said(this));
});

Then(
  "the container script says Postgres was not ready",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("Postgres was not ready"), said(this));
  },
);

Then(
  "the container script says to look at the container's logs",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("docker logs my-postgres"), said(this));
  },
);

Then(
  "the container script says the address is {string}",
  function (this: SpecWorld, address: string) {
    assert.ok(said(this).includes(`The address is: ${address}`), said(this));
  },
);

Then(
  "the container script says the address is for BACKUP_DATABASE_URL",
  function (this: SpecWorld) {
    assert.ok(
      said(this).includes("Set BACKUP_DATABASE_URL to it."),
      said(this),
    );
  },
);

Then(
  "the container script says how to migrate the database",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("npm run db:migrate"), said(this));
  },
);

Then(
  "the container script says Docker could not be reached",
  function (this: SpecWorld) {
    assert.ok(said(this).includes("Docker could not be reached"), said(this));
  },
);

Then(
  "the container script says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(said(this).includes(words), said(this));
  },
);

Then(
  "the container script does not say the password",
  function (this: SpecWorld) {
    assert.ok(!said(this).includes("secret"), said(this));
  },
);
