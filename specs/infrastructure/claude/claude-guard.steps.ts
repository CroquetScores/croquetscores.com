import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { spawnSync } from "node:child_process";

import type { SpecWorld } from "../../support/world.js";

Given("the tool is {string}", function (this: SpecWorld, tool: string) {
  this.claudeGuardRequest.tool = tool;
});

Given("the file is {string}", function (this: SpecWorld, filePath: string) {
  this.claudeGuardRequest.filePath = filePath;
});

Given("the new text is {string}", function (this: SpecWorld, text: string) {
  this.claudeGuardRequest.newText = text;
});

Given("another new text is {string}", function (this: SpecWorld, text: string) {
  this.claudeGuardRequest.moreText = [
    ...(this.claudeGuardRequest.moreText ?? []),
    text,
  ];
});

Given("the guard is sent {string}", function (this: SpecWorld, raw: string) {
  this.claudeGuardRequest.raw = raw;
});

// The request as the hook is given it: the tool's name and what it was asked
// to do, on standard input. An edit says its new text as `new_string`, a
// whole file as `content`, and several edits at once as a list of edits each
// with a `new_string`, so the text is said as the tool would say it.
const asked = (world: SpecWorld): string => {
  const { tool, filePath, newText, moreText, raw } = world.claudeGuardRequest;
  if (raw !== undefined) return raw;
  const texts = newText === undefined ? [] : [newText, ...(moreText ?? [])];
  return JSON.stringify({
    tool_name: tool,
    tool_input: {
      ...(filePath === undefined ? {} : { file_path: filePath }),
      ...(texts.length === 0
        ? {}
        : tool === "Write"
          ? { content: texts[0] }
          : tool === "MultiEdit"
            ? {
                edits: texts.map((text) => ({
                  old_string: "",
                  new_string: text,
                })),
              }
            : { new_string: texts[0] }),
    },
  });
};

When("the guard is asked", function (this: SpecWorld) {
  const run = spawnSync(process.execPath, ["scripts/claude-guard.mjs"], {
    input: asked(this),
    encoding: "utf8",
  });
  this.claudeGuardAnswer = { status: run.status, said: run.stderr };
});

const answer = (world: SpecWorld): { status: number | null; said: string } => {
  assert.ok(world.claudeGuardAnswer !== undefined, "The guard was not asked.");
  return world.claudeGuardAnswer;
};

// Exit status 2 is how a hook refuses; any other status lets the edit go on.
Then("the guard refuses", function (this: SpecWorld) {
  assert.equal(answer(this).status, 2);
});

Then("the guard allows", function (this: SpecWorld) {
  assert.equal(answer(this).status, 0);
});

Then("the guard says {string}", function (this: SpecWorld, words: string) {
  assert.ok(answer(this).said.includes(words), answer(this).said);
});
