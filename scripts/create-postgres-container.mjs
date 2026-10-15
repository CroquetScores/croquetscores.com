// "npm run db:create-container -- --name my-postgres --username sam
// --password ... --port 5433". Makes a Postgres container, kept for the long run
// (postgresContainerCli.feature). Run under tsx, as the package script does.
import { spawn } from "node:child_process";
import { setTimeout as waiting } from "node:timers/promises";

import {
  DockerUnavailable,
  runCreateContainer,
} from "../src/infrastructure/maintenance/postgresContainerCli.js";

// Runs docker and answers how it ended and what it said. A docker that is not
// installed or not running is a Docker that cannot be reached, which is said as
// that and not as a failure of what was asked of it.
const docker = (args, environment = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn("docker", args, {
      env: { ...process.env, ...environment },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("error", (cause) => reject(new DockerUnavailable(cause)));
    child.on("close", (exitCode) =>
      resolve({ exitCode: exitCode ?? 1, output }),
    );
  });

const outcome = await runCreateContainer(
  process.argv.slice(2),
  {
    containers: async () => {
      const answer = await docker(["ps", "--all", "--format", "{{.Names}}"]);
      // A daemon that is not running answers with failure.
      if (answer.exitCode !== 0) throw new DockerUnavailable(answer.output);
      return answer.output.split("\n").filter((line) => line.trim() !== "");
    },
    run: docker,
    ready: async (name, username) =>
      (await docker(["exec", name, "pg_isready", "--username", username]))
        .exitCode === 0,
  },
  {
    wait: (milliseconds) => waiting(milliseconds),
    say: (line) => console.log(line),
  },
);
process.exitCode = outcome.exitCode;
