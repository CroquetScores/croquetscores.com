import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";

// What the maintenance scripts that tell the administrator, and write to a
// folder, share, so that the words a scenario says them in are defined once:
// two definitions of the same words leave Cucumber unable to choose between
// them.

export interface EmailSent {
  to: string;
  subject: string;
  body: string;
}

export interface Script {
  /** Who is told how it went. */
  administrator: string;
  /** Whether the mail sender is down. */
  emailFails: boolean;
  readonly emails: EmailSent[];
  /** The folder the scenario made for the script, where it made one. */
  folder: string | undefined;
}

const scripts = new WeakMap<SpecWorld, Script>();

export const scriptOf = (world: SpecWorld): Script => {
  let found = scripts.get(world);
  if (found === undefined) {
    found = {
      administrator: "",
      emailFails: false,
      emails: [],
      folder: undefined,
    };
    scripts.set(world, found);
  }
  return found;
};

export const scriptsFolder = (world: SpecWorld): string => {
  const { folder } = scriptOf(world);
  assert.ok(folder !== undefined, "No folder was made for the script.");
  return folder;
};

/** The mail sender the script is given: it keeps the email, or is down. */
export const sendTo =
  (world: SpecWorld) =>
  (email: EmailSent): Promise<void> => {
    const script = scriptOf(world);
    if (script.emailFails) {
      return Promise.reject(new Error("The mail sender is down."));
    }
    script.emails.push(email);
    return Promise.resolve();
  };

export const lastEmail = (world: SpecWorld): EmailSent => {
  const email = scriptOf(world).emails.at(-1);
  assert.ok(email !== undefined, "No email was sent.");
  return email;
};

export const emailText = (world: SpecWorld): string => {
  const email = lastEmail(world);
  return `${email.subject}\n${email.body}`;
};
