export interface SshOutcome {
  /** The session's own status, so that a caller can tell how it ended. */
  readonly exitCode: number;
}

/** What the script is given of the world it runs in. */
export interface SshWorld {
  /** The server's address (DEPLOY_SSH_HOST), as the setting gives it. */
  readonly host: string | undefined;
  /** Signs in and stays until the session ends, giving the status it ended with. */
  readonly signIn: (account: string, host: string) => Promise<number>;
  readonly say: (line: string) => void;
}

// The account the deploy script signs in as, and the one the release notes
// have the administrator use on the server (server-setup.md).
const account = "deploy";

/** The script's work (sshCli.feature). */
export const runSsh = async (world: SshWorld): Promise<SshOutcome> => {
  if (world.host === undefined || world.host.trim() === "") {
    world.say(
      "The server's address is needed: set DEPLOY_SSH_HOST (see .env.example).",
    );
    return { exitCode: 1 };
  }
  return { exitCode: await world.signIn(account, world.host.trim()) };
};
