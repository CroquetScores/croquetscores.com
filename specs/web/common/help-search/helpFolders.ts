// What the scenarios about searching the help share: the folders of the help,
// read once by one step, and the language each is written in.
import { strict as assert } from "node:assert";
import { resolve } from "node:path";

import type { Language } from "../../../../src/web/common/language.js";
import type { SpecWorld } from "../../../support/world.js";

export const helpFolder = resolve(import.meta.dirname, "../../../../docs/help");

// A language is named for its folder, and its file under src/web/languages
// exports it by the same name, as scripts/build-help.mjs reads it.
export const languageOf = async (folder: string): Promise<Language> => {
  const module = (await import(
    `../../../../src/web/languages/${folder}.js`
  )) as Record<string, Language>;
  const language = module[folder];
  assert.ok(language !== undefined, `There is no language called ${folder}.`);
  return language;
};

export const folders = new WeakMap<SpecWorld, readonly string[]>();
