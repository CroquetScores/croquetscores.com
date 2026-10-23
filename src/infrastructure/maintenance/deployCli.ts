export interface DeployOutcome {
  readonly exitCode: 0 | 1;
}

/** What the script is given of the world it runs in. */
export interface DeployWorld {
  /** The server's address (DEPLOY_SSH_HOST), as the setting gives it. */
  readonly host: string | undefined;
  /** Asks GitHub for what is new. Throws, with the reason, where it cannot. */
  readonly fetch: () => Promise<void>;
  /**
   * The commit a reference such as `refs/heads/trial` or
   * `refs/remotes/origin/main` names, or undefined where there is none.
   */
  readonly resolve: (reference: string) => Promise<string | undefined>;
  /** Whether some branch on GitHub has the commit in its history. */
  readonly onGitHub: (commit: string) => Promise<boolean>;
  /** Has the server deploy the commit, and gives the status it ended with. */
  readonly deploy: (host: string, commit: string) => Promise<number>;
  readonly say: (line: string) => void;
}

const usage = `Usage:
  npm run deploy                     deploy origin/main
  npm run deploy -- <branch>         deploy a branch of this computer
  npm run deploy -- origin/<branch>  deploy GitHub's copy of a branch`;

const failed = (world: DeployWorld, said: string): DeployOutcome => {
  world.say(said);
  return { exitCode: 1 };
};

/**
 * The script's work, with the arguments as the command line gives them
 * (deployCli.feature).
 */
export const runDeploy = async (
  args: readonly string[],
  world: DeployWorld,
): Promise<DeployOutcome> => {
  if (args.length > 1) return failed(world, usage);
  const named = args[0] ?? "origin/main";

  if (world.host === undefined || world.host.trim() === "") {
    return failed(
      world,
      "The server's address is needed: set DEPLOY_SSH_HOST (see .env.example).",
    );
  }

  // Before the branch is looked up, so that origin/main is main as it is now.
  try {
    await world.fetch();
  } catch (failure) {
    return failed(
      world,
      `GitHub could not be reached, so what to deploy is not known: ${
        failure instanceof Error ? failure.message : String(failure)
      }`,
    );
  }

  const onGitHub = named.startsWith("origin/");
  const commit = await world.resolve(
    onGitHub ? `refs/remotes/${named}` : `refs/heads/${named}`,
  );
  if (commit === undefined) {
    return failed(
      world,
      onGitHub
        ? `GitHub has no branch ${named}.`
        : `This computer has no branch ${named}. Name GitHub's copy as origin/${named}.`,
    );
  }

  // The server fetches from GitHub, so it would only say it has not got the
  // commit, after the connection and a wait. Said here, with the way out.
  if (!(await world.onGitHub(commit))) {
    return failed(
      world,
      `The commit of ${named} is only on this computer, and the server gets its commits from GitHub. Push ${named} first.`,
    );
  }

  world.say(`Deploying ${named}, the commit ${commit}.`);
  const status = await world.deploy(world.host.trim(), commit);
  // The server's own script says why, so this is only the verdict.
  if (status !== 0) {
    return failed(
      world,
      `The server's deploy ended with status ${String(status)}.`,
    );
  }
  return { exitCode: 0 };
};
