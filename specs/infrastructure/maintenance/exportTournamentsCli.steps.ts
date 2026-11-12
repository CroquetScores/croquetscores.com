import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { spawn } from "node:child_process";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  type ExportOutcome,
  type GitEnded,
  runExportTournaments,
} from "../../../src/infrastructure/maintenance/exportTournamentsCli.js";
import { AddComment } from "../../../src/application/operations/commentaries/AddComment.js";
import { ChangeName } from "../../../src/application/operations/accounts/ChangeName.js";
import { AddManagerNote } from "../../../src/application/operations/tournaments/AddManagerNote.js";
import { AddTest } from "../../../src/application/operations/tournaments/AddTest.js";
import { ArchiveCompetition } from "../../../src/application/operations/tournaments/ArchiveCompetition.js";
import { StartCommentary } from "../../../src/application/operations/tournaments/StartCommentary.js";
import { UpdatePlayer } from "../../../src/application/operations/tournaments/UpdatePlayer.js";
import { UpdateTeam } from "../../../src/application/operations/tournaments/UpdateTeam.js";
import { PublicPlayersOfTournament } from "../../../src/application/operations/tournaments/PublicPlayersOfTournament.js";
import { changeTournament } from "../../web/support/tournaments.js";
import { WithdrawGame } from "../../../src/application/operations/competitions/WithdrawGame.js";
import type { CommentaryId } from "../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import {
  accountFor,
  everyCreated,
  inHandOf,
  load,
  momentOf,
  scenarioOf as requestOf,
  tournamentNamed,
} from "../../application/operations/tournaments/aRequest.js";
import { competitionIn } from "../../application/operations/tournaments/requests.js";
import { testRequestFor } from "../../application/operations/tournaments/teamRequests.js";
import { playerNamed } from "../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  teamNamed as teamOfTournament,
  teamScenarioOf,
} from "../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import { scenarioOf as domainScenarioOf } from "../../domain/aggregates/tournaments/tournament/aTournament.js";
import type { SpecWorld } from "../../support/world.js";
import {
  emailText,
  scriptOf,
  scriptsFolder,
  sendTo,
} from "./maintenanceScript.js";

// The export script, run as its own function (`exportTournamentsCli.feature`)
// over a folder of the scenario's own, with a remote of the scenario's own that
// is a bare repository on this computer, the application the scenario's
// tournaments were made through, and a mail sender the scenario can read and
// take down. Git is the real Git: what the folder and the remote hold is read
// back from them, and not from what the script said it did.

const PASSWORD_ADDRESS = "https://deploy:{password}@git.example.com/data.git";

type Happened =
  | { readonly kind: "git"; readonly args: readonly string[] }
  | { readonly kind: "write"; readonly path: string };

interface Export {
  root: string | undefined;
  remote: string | undefined;
  /** A change to make once, as the tournaments begin to be read. */
  changeWhileReading: { from: string; to: string } | undefined;
  writeFails: boolean;
  writeFailsPartway: boolean;
  pushFails: boolean;
  pushFailsBecause: string;
  remotesAddressHolds: string | undefined;
  readonly happened: Happened[];
  /** What the folder held, by name, just before the last run. */
  before: Map<string, string>;
  read: Record<string, unknown> | undefined;
  readonly said: string[];
  exitCode: 0 | 1 | undefined;
}

const exports_ = new WeakMap<SpecWorld, Export>();

const exportOf = (world: SpecWorld): Export => {
  let found = exports_.get(world);
  if (found === undefined) {
    found = {
      root: undefined,
      remote: undefined,
      changeWhileReading: undefined,
      writeFails: false,
      writeFailsPartway: false,
      pushFails: false,
      pushFailsBecause: "the remote rejected it",
      remotesAddressHolds: undefined,
      happened: [],
      before: new Map(),
      read: undefined,
      said: [],
      exitCode: undefined,
    };
    exports_.set(world, found);
  }
  return found;
};

const rootOf = (world: SpecWorld): string => {
  const { root } = exportOf(world);
  assert.ok(root !== undefined, "No folder was made for the export.");
  return root;
};

const remoteOf = (world: SpecWorld): string => {
  const { remote } = exportOf(world);
  assert.ok(remote !== undefined, "No remote was made for the export.");
  return remote;
};

// The folder, the remote and everything made in them go with the scenario.
After(async function (this: SpecWorld) {
  const { root } = exportOf(this);
  if (root !== undefined) await rm(root, { recursive: true, force: true });
});

const runGit = (
  folder: string,
  args: readonly string[],
  input?: string,
): Promise<GitEnded> =>
  new Promise((resolve, reject) => {
    const child = spawn("git", [...args], { cwd: folder });
    let said = "";
    let complaint = "";
    child.stdout.on("data", (chunk: Buffer) => (said += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (complaint += chunk.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code: code ?? 1, said, complaint });
    });
    // Git may end before it has read what it was given, which is not a failure
    // of ours: its own exit says how it went.
    child.stdin.on("error", () => undefined);
    child.stdin.end(input);
  });

// Git as the scenario sets it up, which has to work.
const git = async (folder: string, ...args: string[]): Promise<string> => {
  const ended = await runGit(folder, args);
  assert.equal(
    ended.code,
    0,
    `git ${args.join(" ")} said: ${ended.said}${ended.complaint ?? ""}`,
  );
  return ended.said;
};

const relative = (world: SpecWorld, path: string): string =>
  path
    .slice(join(rootOf(world), "export").length + 1)
    .split("\\")
    .join("/");

const folderOf = (world: SpecWorld): string => join(rootOf(world), "export");

// What the folder holds, by name and what is in each, apart from Git's own.
const snapshotOf = async (
  folder: string,
  within = "",
): Promise<Map<string, string>> => {
  const found = new Map<string, string>();
  let entries;
  try {
    entries = await readdir(join(folder, within), { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const name = within === "" ? entry.name : `${within}/${entry.name}`;
    if (entry.isDirectory()) {
      for (const [path, text] of await snapshotOf(folder, name)) {
        found.set(path, text);
      }
    } else {
      found.set(name, await readFile(join(folder, name), "utf8"));
    }
  }
  return found;
};

// The folder, the remote and the people -------------------------------------

Given(
  "a folder for the export that is a Git repository, there and empty",
  async function (this: SpecWorld) {
    const root = await mkdtemp(join(tmpdir(), "export-"));
    const state = exportOf(this);
    state.root = root;
    state.remote = join(root, "remote.git");
    scriptOf(this).folder = join(root, "export");
    await mkdir(state.remote);
    await mkdir(join(root, "export"));
    await git(state.remote, "init", "--bare", "-q", "-b", "main");
    const folder = join(root, "export");
    await git(folder, "init", "-q", "-b", "main");
    // Its own, so that what the computer's settings say does not decide a
    // scenario: who made a commit, how lines end, and whether it is signed.
    await git(folder, "config", "user.name", "Exporter");
    await git(folder, "config", "user.email", "exporter@example.com");
    await git(folder, "config", "core.autocrlf", "false");
    await git(folder, "config", "commit.gpgsign", "false");
  },
);

Given("the folder has a remote of its own", async function (this: SpecWorld) {
  await git(folderOf(this), "remote", "add", "origin", remoteOf(this));
});

Given(
  "the folder for the export is not there",
  async function (this: SpecWorld) {
    await rm(folderOf(this), { recursive: true, force: true });
  },
);

Given(
  "the folder for the export is not a Git repository",
  async function (this: SpecWorld) {
    await rm(join(folderOf(this), ".git"), { recursive: true, force: true });
  },
);

Given("the folder has no remote", async function (this: SpecWorld) {
  await git(folderOf(this), "remote", "remove", "origin");
});

Given(
  "the tournament is played in the region {string} of the country {string}",
  function (this: SpecWorld, region: string, country: string) {
    // The same words the other tournament features say each in.
    const creating = domainScenarioOf(this).creating;
    creating.country = country;
    creating.region = region;
  },
);

Given(
  "the folder has the file {string} containing {string}",
  async function (this: SpecWorld, name: string, content: string) {
    await writeFile(join(folderOf(this), name), content);
  },
);

Given(
  "the file {string} is staged",
  async function (this: SpecWorld, name: string) {
    await git(folderOf(this), "add", "--", name);
  },
);

// What went wrong, as the scenario sets it up -------------------------------

Given("writing a file fails", function (this: SpecWorld) {
  exportOf(this).writeFails = true;
});

Given("writing a file works", function (this: SpecWorld) {
  const state = exportOf(this);
  state.writeFails = false;
  state.writeFailsPartway = false;
});

Given(
  "the tournament {string} is renamed to {string} while it is being read",
  function (this: SpecWorld, from: string, to: string) {
    exportOf(this).changeWhileReading = { from, to };
  },
);

Given(
  "the file {string} is deleted",
  async function (this: SpecWorld, name: string) {
    await rm(join(folderOf(this), name));
  },
);

Given(
  "the folder's record of what was exported is deleted",
  async function (this: SpecWorld) {
    await rm(join(folderOf(this), ".git", "export-record.json"));
  },
);

Given("writing a file fails partway", function (this: SpecWorld) {
  const state = exportOf(this);
  state.writeFails = true;
  state.writeFailsPartway = true;
});

Given("the remote cannot be pulled from", async function (this: SpecWorld) {
  await git(
    folderOf(this),
    "remote",
    "set-url",
    "origin",
    join(rootOf(this), "nowhere.git"),
  );
});

Given("pushing to the remote fails", function (this: SpecWorld) {
  exportOf(this).pushFails = true;
});

Given(
  "pushing to the remote fails because {string}",
  function (this: SpecWorld, words: string) {
    const state = exportOf(this);
    state.pushFails = true;
    state.pushFailsBecause = words;
  },
);

Given("pushing to the remote works", function (this: SpecWorld) {
  exportOf(this).pushFails = false;
});

Given(
  "the remote's address holds the password {string}",
  function (this: SpecWorld, password: string) {
    exportOf(this).remotesAddressHolds = PASSWORD_ADDRESS.replace(
      "{password}",
      password,
    );
  },
);

// A commit made as somebody other than the script would, in a place of the
// scenario's own, and given to the remote.
const committedToTheRemote = async (
  world: SpecWorld,
  name: string,
  content: string,
): Promise<void> => {
  const elsewhere = join(rootOf(world), "elsewhere");
  await rm(elsewhere, { recursive: true, force: true });
  await mkdir(elsewhere);
  await git(elsewhere, "init", "-q", "-b", "main");
  await git(elsewhere, "config", "user.name", "Somebody Else");
  await git(elsewhere, "config", "user.email", "somebody@example.com");
  await git(elsewhere, "config", "core.autocrlf", "false");
  await git(elsewhere, "remote", "add", "origin", remoteOf(world));
  await git(elsewhere, "fetch", "-q", "origin").catch(() => undefined);
  const has =
    (await runGit(elsewhere, ["rev-parse", "origin/main"])).code === 0;
  if (has) await git(elsewhere, "reset", "-q", "--hard", "origin/main");
  await writeFile(join(elsewhere, name), content);
  await git(elsewhere, "add", "--", name);
  await git(elsewhere, "commit", "-q", "-m", `Add ${name}`);
  await git(elsewhere, "push", "-q", "origin", "main");
};

Given(
  "the remote has the file {string} that the folder does not",
  async function (this: SpecWorld, name: string) {
    await committedToTheRemote(this, name, "Notes somebody else wrote");
  },
);

Given(
  "the remote has a commit that the folder does not",
  async function (this: SpecWorld) {
    await committedToTheRemote(this, "THEIRS.md", "The remote's own");
  },
);

Given(
  "the folder has a commit that the remote does not",
  async function (this: SpecWorld) {
    const folder = folderOf(this);
    await writeFile(join(folder, "OURS.md"), "The folder's own");
    await git(folder, "add", "--", "OURS.md");
    await git(folder, "commit", "-q", "-m", "Add OURS.md");
  },
);

// Running it ---------------------------------------------------------------

const run = async (world: SpecWorld, argument: string): Promise<void> => {
  const state = exportOf(world);
  const script = scriptOf(world);
  const root = rootOf(world);
  state.before = await snapshotOf(folderOf(world));
  state.said.length = 0;
  const outcome: ExportOutcome = await runExportTournaments(
    argument.split(/\s+/).filter((word) => word !== ""),
    {
      administrator: script.administrator,
      workingFolder: root,
      ask: async (query) => {
        const change = state.changeWhileReading;
        if (
          change !== undefined &&
          query instanceof PublicPlayersOfTournament
        ) {
          // Once, and as the first tournament begins to be read: after what
          // marks the tournaments was asked, and before anything of one was.
          state.changeWhileReading = undefined;
          await changeTournament(world, change.from, { name: change.to });
        }
        return inHandOf(world).ask(query);
      },
      git: async (folder, args, input) => {
        state.happened.push({ kind: "git", args });
        // Said as a remote with a password in its address would say it, which
        // the scenario's remote, a folder, cannot.
        if (
          state.remotesAddressHolds !== undefined &&
          args[0] === "remote" &&
          args[1] === "get-url"
        ) {
          return { code: 0, said: `${state.remotesAddressHolds}\n` };
        }
        if (state.pushFails && args[0] === "push") {
          return {
            code: 1,
            said:
              state.remotesAddressHolds === undefined
                ? state.pushFailsBecause
                : `fatal: unable to access '${state.remotesAddressHolds}': ${state.pushFailsBecause}`,
          };
        }
        return runGit(folder, args, input);
      },
      write: async (path, text) => {
        state.happened.push({ kind: "write", path: relative(world, path) });
        if (state.writeFails) {
          if (state.writeFailsPartway) {
            await writeFile(path, text.slice(0, Math.floor(text.length / 2)));
          }
          throw new Error("The disk is full.");
        }
        await writeFile(path, text);
      },
      send: sendTo(world),
      say: (line) => {
        state.said.push(line);
      },
    },
  );
  state.exitCode = outcome.exitCode;
};

const RUN_TAKES = 60_000;

When(
  "the export script is run with {string}",
  { timeout: RUN_TAKES },
  async function (this: SpecWorld, argument: string) {
    await run(this, argument);
  },
);

When(
  "the export script is run again with {string}",
  { timeout: RUN_TAKES },
  async function (this: SpecWorld, argument: string) {
    await run(this, argument);
  },
);

Given(
  "the export script has been run with {string}",
  { timeout: RUN_TAKES },
  async function (this: SpecWorld, argument: string) {
    await run(this, argument);
  },
);

// What the folder holds ----------------------------------------------------

const existsIn = async (world: SpecWorld, name: string): Promise<boolean> => {
  try {
    await stat(join(scriptsFolder(world), name));
    return true;
  } catch {
    return false;
  }
};

Then(
  "the folder does not have the file {string}",
  async function (this: SpecWorld, name: string) {
    assert.ok(!(await existsIn(this, name)), `The folder has ${name}.`);
  },
);

Then(
  "the folder does not have the folder {string}",
  async function (this: SpecWorld, name: string) {
    assert.ok(!(await existsIn(this, name)), `The folder has ${name}.`);
  },
);

Then("the folder has no files in it", async function (this: SpecWorld) {
  const held = [...(await snapshotOf(folderOf(this))).keys()];
  assert.deepEqual(held, []);
});

Then(
  "the file {string} is as it was",
  async function (this: SpecWorld, name: string) {
    const was = exportOf(this).before.get(name);
    assert.ok(was !== undefined, `The folder did not have ${name} before.`);
    assert.equal(await readFile(join(folderOf(this), name), "utf8"), was);
  },
);

Then(
  "the file {string} does not contain {string}",
  async function (this: SpecWorld, name: string, text: string) {
    const held = await readFile(join(folderOf(this), name), "utf8");
    assert.ok(!held.includes(text), `${name} contains ${text}.`);
  },
);

Then(
  "the file {string} is JSON",
  async function (this: SpecWorld, name: string) {
    JSON.parse(await readFile(join(folderOf(this), name), "utf8"));
  },
);

Then(
  "the file {string} was written once",
  function (this: SpecWorld, name: string) {
    assert.equal(writesOf(this, name), 1);
  },
);

Then(
  "the file {string} was written twice",
  function (this: SpecWorld, name: string) {
    assert.equal(writesOf(this, name), 2);
  },
);

const writesOf = (world: SpecWorld, name: string): number =>
  exportOf(world).happened.filter(
    (each) =>
      each.kind === "write" &&
      (each.path === name || each.path === `${name}.partial`),
  ).length;

Then(
  "{string} was written to another name and then renamed",
  async function (this: SpecWorld, name: string) {
    const wrote = exportOf(this).happened.filter(
      (each) => each.kind === "write",
    );
    assert.ok(
      wrote.some((each) => each.path !== name && each.path.startsWith(name)),
      `It wrote ${wrote.map((each) => each.path).join(", ")}.`,
    );
    assert.ok(await existsIn(this, name));
    assert.ok(!(await existsIn(this, `${name}.partial`)));
  },
);

Then(
  "the folder was pulled before {string} was written",
  function (this: SpecWorld, name: string) {
    const { happened } = exportOf(this);
    const pulled = happened.findIndex(
      (each) => each.kind === "git" && each.args.includes("pull"),
    );
    const written = happened.findIndex(
      (each) => each.kind === "write" && each.path.startsWith(name),
    );
    assert.ok(pulled >= 0, "The folder was not pulled.");
    assert.ok(written >= 0, `${name} was not written.`);
    assert.ok(pulled < written, "It was written before the pull.");
  },
);

// What Git holds ------------------------------------------------------------

const commitsIn = async (folder: string): Promise<number> => {
  const counted = await runGit(folder, ["rev-list", "--all", "--count"]);
  return counted.code === 0 ? Number(counted.said.trim()) : 0;
};

Then("no Git command was run", function (this: SpecWorld) {
  const ran = exportOf(this).happened.filter((each) => each.kind === "git");
  assert.equal(ran.length, 0, `${String(ran.length)} Git commands were run.`);
});

Then("the folder has no commits", async function (this: SpecWorld) {
  assert.equal(await commitsIn(folderOf(this)), 0);
});

Then("the remote has no commits", async function (this: SpecWorld) {
  assert.equal(await commitsIn(remoteOf(this)), 0);
});

Then("the folder has 1 commit", async function (this: SpecWorld) {
  assert.equal(await commitsIn(folderOf(this)), 1);
});

Then("the folder has no merge", async function (this: SpecWorld) {
  const merges = await git(
    folderOf(this),
    "rev-list",
    "--merges",
    "--count",
    "HEAD",
  );
  assert.equal(Number(merges.trim()), 0);
});

const namesIn = async (folder: string, ...args: string[]): Promise<string[]> =>
  (await git(folder, ...args)).split(/\r?\n/).filter((line) => line !== "");

Then(
  "the remote has the file {string}",
  async function (this: SpecWorld, name: string) {
    const held = await namesIn(
      remoteOf(this),
      "ls-tree",
      "-r",
      "--name-only",
      "main",
    );
    assert.ok(held.includes(name), `The remote has ${held.join(", ")}.`);
  },
);

Then(
  "the remote does not have the file {string}",
  async function (this: SpecWorld, name: string) {
    const held = await namesIn(
      remoteOf(this),
      "ls-tree",
      "-r",
      "--name-only",
      "main",
    );
    assert.ok(!held.includes(name), `The remote has ${name}.`);
  },
);

Then(
  "the folder's last commit has the file {string}",
  async function (this: SpecWorld, name: string) {
    const held = await namesIn(
      folderOf(this),
      "show",
      "--name-only",
      "--format=",
      "HEAD",
    );
    assert.ok(held.includes(name), `The commit has ${held.join(", ")}.`);
  },
);

Then(
  "the folder's last commit does not have the file {string}",
  async function (this: SpecWorld, name: string) {
    const held = await namesIn(
      folderOf(this),
      "show",
      "--name-only",
      "--format=",
      "HEAD",
    );
    assert.ok(!held.includes(name), `The commit has ${name}.`);
  },
);

Then(
  "the folder's last commit has removed the file {string}",
  async function (this: SpecWorld, name: string) {
    const held = await namesIn(
      folderOf(this),
      "show",
      "--name-status",
      "--format=",
      "HEAD",
    );
    assert.ok(
      held.some((line) => /^D\s/.test(line) && line.endsWith(name)),
      `The commit has ${held.join(", ")}.`,
    );
  },
);

Then(
  "the folder's last commit message says {int} tournament was written",
  async function (this: SpecWorld, count: number) {
    const message = await git(folderOf(this), "log", "-1", "--format=%B");
    assert.ok(message.includes(`${String(count)} tournament was written`));
  },
);

Then(
  "the file {string} is not staged",
  async function (this: SpecWorld, name: string) {
    const staged = await namesIn(
      folderOf(this),
      "diff",
      "--cached",
      "--name-only",
    );
    assert.ok(!staged.includes(name), `${name} is staged.`);
  },
);

// How it went --------------------------------------------------------------

Then("the export script exits with success", function (this: SpecWorld) {
  assert.equal(exportOf(this).exitCode, 0, saidOnTheScreen(this));
});

Then("the export script exits with failure", function (this: SpecWorld) {
  assert.equal(exportOf(this).exitCode, 1, saidOnTheScreen(this));
});

const saidOnTheScreen = (world: SpecWorld): string =>
  exportOf(world).said.join("\n");

const saysOnTheScreen = (world: SpecWorld, words: string): void => {
  assert.ok(
    saidOnTheScreen(world).includes(words),
    `It said: ${saidOnTheScreen(world)}`,
  );
};

Then("the export script says the folder is needed", function (this: SpecWorld) {
  saysOnTheScreen(this, "The folder is needed");
});

Then(
  "the export script says the folder is not a Git repository",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "the folder is not a Git repository");
  },
);

Then(
  "the export script says the folder has no remote",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "the folder has no remote");
  },
);

Then(
  "the export script says the folder could not be pulled",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "The failure was pulling the folder.");
  },
);

Then(
  "the export script says writing a file failed",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "The failure was writing a file.");
  },
);

Then("the export script says pushing failed", function (this: SpecWorld) {
  saysOnTheScreen(this, "The failure was pushing the folder.");
});

Then(
  "the export script says the administrator could not be told",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "The administrator could not be told");
  },
);

Then(
  "the export script says {int} tournament was written",
  function (this: SpecWorld, count: number) {
    saysOnTheScreen(this, `${String(count)} tournament was written.`);
  },
);

Then(
  "the export script says {int} tournaments were written",
  function (this: SpecWorld, count: number) {
    saysOnTheScreen(this, `${String(count)} tournaments were written.`);
  },
);

Then(
  "the export script says {int} tournament was already as it should be",
  function (this: SpecWorld, count: number) {
    saysOnTheScreen(
      this,
      `${String(count)} tournament was already as it should be.`,
    );
  },
);

Then(
  "the export script says {int} file was removed",
  function (this: SpecWorld, count: number) {
    saysOnTheScreen(this, `${String(count)} file was removed.`);
  },
);

Then("the export script says it was a test run", function (this: SpecWorld) {
  saysOnTheScreen(this, "This was a test run");
});

Then(
  "the export script says {int} tournament was read",
  function (this: SpecWorld, count: number) {
    saysOnTheScreen(this, `${String(count)} tournament was read.`);
  },
);

Then(
  "the export script says {int} tournaments were read",
  function (this: SpecWorld, count: number) {
    saysOnTheScreen(this, `${String(count)} tournaments were read.`);
  },
);

Then(
  "the export script says there was nothing to commit",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "There was nothing to commit.");
  },
);

Then(
  "the export script says the files were pushed",
  function (this: SpecWorld) {
    saysOnTheScreen(this, "The files were pushed.");
  },
);

// The email -----------------------------------------------------------------

const emailSays = (world: SpecWorld, words: string): void => {
  assert.ok(
    emailText(world).includes(words),
    `The email says ${emailText(world)}`,
  );
};

Then("the email says the folder is not there", function (this: SpecWorld) {
  emailSays(this, "the folder is not there");
});

Then(
  "the email says the failure was pulling the folder",
  function (this: SpecWorld) {
    emailSays(this, "The failure was pulling the folder.");
  },
);

Then(
  "the email says the failure was writing a file",
  function (this: SpecWorld) {
    emailSays(this, "The failure was writing a file.");
  },
);

Then(
  "the email says the failure was pushing the folder",
  function (this: SpecWorld) {
    emailSays(this, "The failure was pushing the folder.");
  },
);

Then(
  "the email does not contain {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(
      !emailText(this).includes(text),
      `The email says ${emailText(this)}`,
    );
  },
);

Then("no email was sent", function (this: SpecWorld) {
  assert.equal(scriptOf(this).emails.length, 0);
});

// What a file says ---------------------------------------------------------

When(
  "the file {string} is read",
  async function (this: SpecWorld, name: string) {
    exportOf(this).read = JSON.parse(
      await readFile(join(folderOf(this), name), "utf8"),
    ) as Record<string, unknown>;
  },
);

const readOf = (world: SpecWorld): Record<string, unknown> => {
  const { read } = exportOf(world);
  assert.ok(read !== undefined, "No file has been read.");
  return read;
};

type Thing = Record<string, unknown>;

const listIn = (thing: Thing, key: string): Thing[] => {
  const held = thing[key];
  assert.ok(Array.isArray(held), `The file has no ${key}.`);
  return held as Thing[];
};

const named = (things: readonly Thing[], name: string): Thing | undefined =>
  things.find((each) => each["name"] === name);

const competitionNamed = (world: SpecWorld, name: string): Thing => {
  const found = named(listIn(readOf(world), "competitions"), name);
  assert.ok(found !== undefined, `The file does not name ${name}.`);
  return found;
};

const teamNamed = (world: SpecWorld, name: string): Thing => {
  const found = named(listIn(readOf(world), "teams"), name);
  assert.ok(found !== undefined, `The file does not name the team ${name}.`);
  return found;
};

Then(
  "the file says the tournament's name is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(readOf(this)["name"], name);
  },
);

Then(
  "the file says the sport is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(readOf(this)["sport"], code);
  },
);

Then(
  "the file says the first day is {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(readOf(this)["firstDay"], day);
  },
);

Then(
  "the file says the last day is {string}",
  function (this: SpecWorld, day: string) {
    assert.equal(readOf(this)["lastDay"], day);
  },
);

Then(
  "the file says the country is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(readOf(this)["country"], code);
  },
);

Then(
  "the file says the region is {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(readOf(this)["region"], code);
  },
);

Then(
  "the file says the layout is version {int}",
  function (this: SpecWorld, version: number) {
    assert.equal(readOf(this)["layout"], version);
  },
);

// Players

Then(
  "the file names the player {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(named(listIn(readOf(this), "players"), name) !== undefined);
  },
);

Then(
  "the file does not name the player {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(named(listIn(readOf(this), "players"), name) === undefined);
  },
);

Then(
  "the first player named is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(listIn(readOf(this), "players")[0]?.["name"], name);
  },
);

Then(
  "the file says {string} represents {string}",
  function (this: SpecWorld, name: string, representing: string) {
    assert.equal(
      named(listIn(readOf(this), "players"), name)?.["representing"],
      representing,
    );
  },
);

Then(
  "the file says {string} represents nothing",
  function (this: SpecWorld, name: string) {
    const player = named(listIn(readOf(this), "players"), name);
    assert.ok(player !== undefined, `The file does not name ${name}.`);
    assert.equal(player["representing"], null);
  },
);

// Competitions

Then(
  "the file names the competition {string}",
  function (this: SpecWorld, name: string) {
    competitionNamed(this, name);
  },
);

Then(
  "the file does not name the competition {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(named(listIn(readOf(this), "competitions"), name) === undefined);
  },
);

Then(
  "the file says {string} is a block",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionNamed(this, name)["kind"], "block");
  },
);

Then(
  "the file says {string} is a knockout",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionNamed(this, name)["kind"], "knockout");
  },
);

Then(
  "the file says {string} is a Swiss",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionNamed(this, name)["kind"], "swiss");
  },
);

// What a game, a match or a test says: each by its place, since a scenario
// names the one it is about by where it came.

const PLACES = ["first", "second", "third"];

const placed = (things: readonly Thing[], place: string): Thing => {
  const found = things[PLACES.indexOf(place)];
  assert.ok(found !== undefined, `There is no ${place}.`);
  return found;
};

const playersOfGame = (game: Thing): Thing[] => game["players"] as Thing[];

const gamesOf = (thing: Thing): Thing[] => listIn(thing, "games");

const assertBetween = (thing: Thing, first: string, second: string): void => {
  const players = thing["players"] as unknown[];
  const names = players.map((each) =>
    typeof each === "string" ? each : (each as Thing)["name"],
  );
  assert.deepEqual(names, [first, second]);
};

const assertScored = (game: Thing, name: string, score: number): void => {
  const player = named(playersOfGame(game), name);
  assert.ok(player !== undefined, `${name} did not play.`);
  assert.equal(player["score"], String(score));
};

Then(
  "the {word} game of {string} is between {string} and {string}",
  function (
    this: SpecWorld,
    place: string,
    name: string,
    first: string,
    second: string,
  ) {
    assertBetween(
      placed(gamesOf(competitionNamed(this, name)), place),
      first,
      second,
    );
  },
);

Then(
  "in the {word} game of {string} {string} scored {int}",
  function (
    this: SpecWorld,
    place: string,
    name: string,
    player: string,
    score: number,
  ) {
    assertScored(
      placed(gamesOf(competitionNamed(this, name)), place),
      player,
      score,
    );
  },
);

Then(
  "the {word} game of {string} is withdrawn",
  function (this: SpecWorld, place: string, name: string) {
    assert.equal(
      placed(gamesOf(competitionNamed(this, name)), place)["withdrawn"],
      true,
    );
  },
);

Then(
  "the {word} game of {string} is not withdrawn",
  function (this: SpecWorld, place: string, name: string) {
    assert.equal(
      placed(gamesOf(competitionNamed(this, name)), place)["withdrawn"],
      false,
    );
  },
);

Then(
  "{string} has {int} game",
  function (this: SpecWorld, name: string, count: number) {
    assert.equal(gamesOf(competitionNamed(this, name)).length, count);
  },
);

Then(
  "the {word} match of {string} is between {string} and {string}",
  function (
    this: SpecWorld,
    place: string,
    name: string,
    first: string,
    second: string,
  ) {
    assertBetween(
      placed(listIn(competitionNamed(this, name), "matches"), place),
      first,
      second,
    );
  },
);

Then(
  "the {word} match of {string} has {int} games",
  function (this: SpecWorld, place: string, name: string, count: number) {
    assert.equal(
      gamesOf(placed(listIn(competitionNamed(this, name), "matches"), place))
        .length,
      count,
    );
  },
);

// Teams and their tests

Then(
  "the file names the team {string}",
  function (this: SpecWorld, name: string) {
    teamNamed(this, name);
  },
);

Then(
  "the file does not name the team {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(named(listIn(readOf(this), "teams"), name) === undefined);
  },
);

Then(
  "the file says the team {string} is known for short as {string}",
  function (this: SpecWorld, name: string, shortName: string) {
    assert.equal(teamNamed(this, name)["shortName"], shortName);
  },
);

Then(
  "the file says the team {string} has the player {string}",
  function (this: SpecWorld, team: string, player: string) {
    assert.ok((teamNamed(this, team)["players"] as string[]).includes(player));
  },
);

Then(
  "the file says the team {string} does not have the player {string}",
  function (this: SpecWorld, team: string, player: string) {
    assert.ok(!(teamNamed(this, team)["players"] as string[]).includes(player));
  },
);

Then(
  "the file does not name a player outside a team",
  function (this: SpecWorld) {
    assert.equal(readOf(this)["players"], undefined);
  },
);

Then("the file does not say how the teams stand", function (this: SpecWorld) {
  const text = JSON.stringify(readOf(this));
  for (const word of ["standing", "ranked", "testsWon", "matchesWon"]) {
    assert.ok(!text.includes(word), `The file says ${word}.`);
  }
});

const testPlaced = (world: SpecWorld, place: string): Thing =>
  placed(listIn(readOf(world), "tests"), place);

Then(
  "the {word} test is between {string} and {string}",
  function (this: SpecWorld, place: string, first: string, second: string) {
    assert.deepEqual(testPlaced(this, place)["teams"], [first, second]);
  },
);

Then(
  "the first team of the first test is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal((testPlaced(this, "first")["teams"] as string[])[0], name);
  },
);

Then(
  "the first test says each match is the best of {int}",
  function (this: SpecWorld, bestOf: number) {
    assert.equal(testPlaced(this, "first")["bestOf"], bestOf);
  },
);

Then(
  "the {word} match of the first test is between {string} and {string}",
  function (this: SpecWorld, place: string, first: string, second: string) {
    assertBetween(
      placed(listIn(testPlaced(this, "first"), "matches"), place),
      first,
      second,
    );
  },
);

Then(
  "the first match of the first test has {int} game",
  function (this: SpecWorld, count: number) {
    assert.equal(
      gamesOf(placed(listIn(testPlaced(this, "first"), "matches"), "first"))
        .length,
      count,
    );
  },
);

const firstGameOfFirstMatch = (world: SpecWorld): Thing =>
  placed(
    gamesOf(placed(listIn(testPlaced(world, "first"), "matches"), "first")),
    "first",
  );

Then(
  "in the first game of the first match of the first test {string} scored {int}",
  function (this: SpecWorld, player: string, score: number) {
    assertScored(firstGameOfFirstMatch(this), player, score);
  },
);

Then(
  "the first game of the first match of the first test is not withdrawn",
  function (this: SpecWorld) {
    assert.equal(firstGameOfFirstMatch(this)["withdrawn"], false);
  },
);

Then(
  "the {word} test is in the group {string}",
  function (this: SpecWorld, place: string, group: string) {
    assert.equal(testPlaced(this, place)["group"], group);
  },
);

Then("the first test is in no group", function (this: SpecWorld) {
  assert.equal(testPlaced(this, "first")["group"], null);
});

Then("the file has {int} tests", function (this: SpecWorld, count: number) {
  assert.equal(listIn(readOf(this), "tests").length, count);
});

// What was done to the tournaments before the script ran -----------------------

Given(
  "{string} has set {string} to represent {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    representing: string,
  ) {
    const id = requestOf(this).looking;
    assert.ok(id !== undefined, "No tournament has been looked at.");
    const found = playerNamed(await load(this, id), player);
    await inHandOf(this).send(
      new UpdatePlayer(
        (await accountFor(this, address)).value,
        id.value,
        found.id.value,
        {
          name: found.name.toString(),
          representing,
          flag: found.flag === undefined ? undefined : String(found.flag),
        },
        momentOf(this),
      ),
    );
  },
);

Given(
  "{string} is named {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await inHandOf(this).send(
      new ChangeName(
        (await accountFor(this, address)).value,
        name,
        momentOf(this),
      ),
    );
  },
);

// The note's words are its title and what it says both, so that wherever the
// file might put either, they are found.
Given(
  "{string} has written the note {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    words: string,
    name: string,
  ) {
    await inHandOf(this).send(
      new AddManagerNote(
        (await accountFor(this, address)).value,
        tournamentNamed(this, name).value,
        words,
        words,
        momentOf(this),
      ),
    );
  },
);

const commentaries = new WeakMap<
  SpecWorld,
  { tournament: string; commentary: CommentaryId }
>();

Given(
  "{string} has started a commentary on {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const tournament = tournamentNamed(this, name);
    const commentary = await inHandOf(this).send(
      new StartCommentary(
        (await accountFor(this, address)).value,
        tournament.value,
        "Day one",
        momentOf(this),
      ),
    );
    commentaries.set(this, { tournament: tournament.value, commentary });
  },
);

Given(
  "{string} has commented {string} on it",
  async function (this: SpecWorld, address: string, text: string) {
    const started = commentaries.get(this);
    assert.ok(started !== undefined, "No commentary was started.");
    await inHandOf(this).send(
      new AddComment(
        (await accountFor(this, address)).value,
        started.tournament,
        started.commentary.value,
        text,
        momentOf(this),
      ),
    );
  },
);

// The last game added to any competition of any tournament the scenario made,
// since the scenario says only "that game".
Given(
  "{string} has withdrawn that game",
  async function (this: SpecWorld, address: string) {
    for (const id of [...everyCreated(this)].reverse()) {
      const tournament = await load(this, id);
      for (const { reference } of [...tournament.competitions].reverse()) {
        const competition = await inHandOf(this).loadCompetition(reference.id);
        const game = competition?.games.at(-1);
        if (game === undefined) continue;
        await inHandOf(this).send(
          new WithdrawGame(
            (await accountFor(this, address)).value,
            id.value,
            reference.id.value,
            game.id.value,
            momentOf(this),
          ),
        );
        return;
      }
    }
    assert.fail("No game has been added.");
  },
);

const archivedCompetition = async function (
  this: SpecWorld,
  address: string,
  competition: string,
  name: string,
): Promise<void> {
  const tournament = tournamentNamed(this, name);
  await inHandOf(this).send(
    new ArchiveCompetition(
      (await accountFor(this, address)).value,
      tournament.value,
      (await competitionIn(this, tournament, competition)).value,
      momentOf(this),
    ),
  );
};

Given(
  "{string} has archived the competition {string} of {string}",
  archivedCompetition,
);

Given(
  "{string} has archived the test {string} of {string}",
  archivedCompetition,
);

Given(
  "{string} has added the test between {string} and {string} to the group {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    first: string,
    second: string,
    group: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    teamScenarioOf(this).test.group = group;
    await inHandOf(this).send(
      new AddTest(
        (await accountFor(this, address)).value,
        tournament.value,
        await testRequestFor(this, tournament, first, second),
        momentOf(this),
      ),
    );
  },
);

Given(
  "{string} has given the team {string} of {string} the flag {string}",
  async function (
    this: SpecWorld,
    address: string,
    team: string,
    name: string,
    flag: string,
  ) {
    const tournament = tournamentNamed(this, name);
    const found = teamOfTournament(await load(this, tournament), team);
    await inHandOf(this).send(
      new UpdateTeam(
        (await accountFor(this, address)).value,
        tournament.value,
        found.id.value,
        { name: team, shortName: found.shortName.toString(), flag },
        momentOf(this),
      ),
    );
  },
);
