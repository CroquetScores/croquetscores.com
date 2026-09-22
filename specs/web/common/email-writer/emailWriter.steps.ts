import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type {
  EmailWriter,
  WrittenEmail,
} from "../../../../src/application/services/EmailWriter.js";
import {
  emailWriter,
  siteAddress,
} from "../../../../src/web/common/emailWriter.js";
import { english } from "../../../../src/web/languages/english.js";
import type { SpecWorld } from "../../../support/world.js";
import { closes, opens, scenarioLanguages } from "../../support/languages.js";

// What a scenario has: the writer, the email it last wrote, and the site's
// address it last made. Kept here rather than on the world, which may name
// nothing from the web layer.
interface Writing {
  writer?: EmailWriter;
  written?: WrittenEmail;
  address?: string;
}

const writings = new WeakMap<SpecWorld, Writing>();

const writingOf = (world: SpecWorld): Writing => {
  let writing = writings.get(world);
  if (writing === undefined) {
    writing = {};
    writings.set(world, writing);
  }
  return writing;
};

const writtenOf = (world: SpecWorld): WrittenEmail => {
  const written = writingOf(world).written;
  assert.ok(
    written !== undefined,
    `No email has been written: ${inspect(world.failure)}`,
  );
  return written;
};

// Whatever each kind of email is filled in with, so that any of them can be
// written. A scenario that cares about one of them says so.
const everyFill = {
  link: "https://croquetscores.com/account/confirm-email-address?link=abc123",
  service: "Have I Been Pwned",
  when: "2026-09-19T10:00:00Z",
};

const write = (
  world: SpecWorld,
  kind: string,
  language: string,
  fill: Readonly<Record<string, string>> = {},
  // A scenario about an email given nothing says so, and gets nothing: every
  // other one is given whatever its kind is filled in with.
  only = false,
): void => {
  const writer = writingOf(world).writer;
  assert.ok(writer !== undefined, "There is no email writer.");
  try {
    writingOf(world).written = writer.write({
      kind,
      language,
      fill: only ? fill : { ...everyFill, ...fill },
    });
  } catch (failure) {
    world.failure = failure;
  }
};

// The writer's HTML read the simple way: it is markup this writer made, of
// paragraphs and links, and nothing else. Its text is what lies between tags;
// the text of a head's title counts as the body's, since a mail program shows
// it.
const textsOf = (html: string): string[] =>
  html
    .replace(/<!doctype[^>]*>/i, "")
    .split(/<[^>]*>/)
    .map((text) => text.trim())
    .filter((text) => text !== "");

// A button's words, by where it goes. The anchor carries what it is painted
// with as well as where it points, so anything else on it is stepped over, and
// the words are taken without the markup's own spacing around them, which is
// how a reader sees them.
const buttonTo = (html: string, link: string): string | undefined => {
  const escaped = link.replace(/&/g, "&amp;");
  const found = new RegExp(
    `<a href="${escaped.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([^<]*)</a>`,
  ).exec(html);
  return found?.[1]?.trim();
};

const wordsFor = (key: string): string => {
  const words = english.words[key];
  assert.ok(words !== undefined, `English has no words for ${key}.`);
  return words;
};

// The writer -----------------------------------------------------------------

// The name the scenarios' emails are sent from, and what they call the site
// they come from, unless a scenario says otherwise.
const sendingAs = "Croquet Scores";
const sendingFromSite = "Croquet Scores";

// What the site fills into an email about itself, as the writer fills it in:
// the words are the catalogue's, whoever puts the values in them.
const aboutTheSite: Readonly<Record<string, string>> = {
  buttonBackgroundColour: "#066b00",
  buttonTextColour: "#ffffff",
  emailFromName: sendingAs,
  emailFromSite: sendingFromSite,
};

const filledIn = (words: string): string =>
  Object.entries(aboutTheSite).reduce(
    (said, [name, value]) => said.split(`{${name}}`).join(value),
    words,
  );

Given(
  "an email writer for {string}",
  function (this: SpecWorld, address: string) {
    writingOf(this).writer = emailWriter(scenarioLanguages, {
      address,
      fromName: sendingAs,
      fromSite: sendingFromSite,
    });
  },
);

Given(
  "an email writer sending as {string}",
  function (this: SpecWorld, name: string) {
    writingOf(this).writer = emailWriter(scenarioLanguages, {
      address: "https://croquetscores.com",
      fromName: name,
      fromSite: sendingFromSite,
    });
  },
);

Given(
  "an email writer sending from the site {string}",
  function (this: SpecWorld, site: string) {
    writingOf(this).writer = emailWriter(scenarioLanguages, {
      address: "https://croquetscores.com",
      fromName: sendingAs,
      fromSite: site,
    });
  },
);

When(
  "the email {string} is written in {string}",
  function (this: SpecWorld, kind: string, language: string) {
    write(this, kind, language);
  },
);

Given(
  "an email writer whose catalogues have no words for {string}",
  function (this: SpecWorld, key: string) {
    const without = scenarioLanguages.map((language) => ({
      ...language,
      words: Object.fromEntries(
        Object.entries(language.words).filter(([each]) => each !== key),
      ),
    }));
    writingOf(this).writer = emailWriter(without, {
      address: "https://croquetscores.com",
      fromName: sendingAs,
      fromSite: sendingFromSite,
    });
  },
);

When(
  "the email {string} is written in {string} with nothing filling it in",
  function (this: SpecWorld, kind: string, language: string) {
    write(this, kind, language, {}, true);
  },
);

When(
  "the email {string} is written in {string} with the link {string}",
  function (this: SpecWorld, kind: string, language: string, link: string) {
    write(this, kind, language, { link });
  },
);

When(
  "the email {string} is written in {string} with the service {string}",
  function (this: SpecWorld, kind: string, language: string, service: string) {
    write(this, kind, language, { service });
  },
);

// Its words ------------------------------------------------------------------

Then(
  "every word of its subject is in the test locale",
  function (this: SpecWorld) {
    const { subject } = writtenOf(this);
    assert.ok(
      subject.startsWith(opens) && subject.endsWith(closes),
      `The subject came from elsewhere: ${subject}`,
    );
  },
);

Then(
  "every word of its body is in the test locale",
  function (this: SpecWorld) {
    const texts = textsOf(writtenOf(this).body);
    assert.ok(texts.length > 0, "There are no words in the body.");
    const stray = texts.filter(
      (text) => !(text.startsWith(opens) && text.endsWith(closes)),
    );
    assert.deepEqual(stray, [], "Words in the body came from elsewhere.");
  },
);

Then(
  "its subject is the words for {string} in English",
  function (this: SpecWorld, key: string) {
    assert.equal(writtenOf(this).subject, filledIn(wordsFor(key)));
  },
);

// The email's paragraphs, rather than anywhere in what was written: the head's
// title says the subject, so a document asked whether it holds something says
// yes to whatever the subject says, whatever the email's own words are.
const paragraphsOf = (html: string): string[] =>
  [...html.matchAll(/<p>([^]*?)<\/p>/g)].map((found) => found[1] ?? "");

Then("its words contain {string}", function (this: SpecWorld, words: string) {
  const paragraphs = paragraphsOf(writtenOf(this).body);
  assert.ok(paragraphs.length > 0, "The body has no paragraph.");
  assert.ok(
    paragraphs.some((paragraph) => paragraph.includes(words)),
    `Its words are ${paragraphs.join(" ")}.`,
  );
});

Then(
  "its subject contains {string}",
  function (this: SpecWorld, words: string) {
    const { subject } = writtenOf(this);
    assert.ok(subject.includes(words), `The subject is ${subject}.`);
  },
);

// Its links ------------------------------------------------------------------

Then(
  "its body has a button to {string}",
  function (this: SpecWorld, link: string) {
    const { body } = writtenOf(this);
    assert.ok(buttonTo(body, link) !== undefined, `No button to ${link}.`);
    writingOf(this).address = link;
  },
);

Then(
  "its body shows the address {string} as text",
  function (this: SpecWorld, link: string) {
    const escaped = link.replace(/&/g, "&amp;");
    const shown = textsOf(writtenOf(this).body).some((text) =>
      text.includes(escaped),
    );
    assert.ok(shown, `The address ${link} is not in the body's text.`);
  },
);

Then(
  "its body holds the markup for {string}",
  function (this: SpecWorld, key: string) {
    // The markup as the catalogue holds it, with what filled it in put where
    // it says: the same email the catalogue was written to say, not one the
    // writer made out of pieces of it.
    const markup = filledIn(
      wordsFor(key).replace(/\{link\}/g, everyFill.link.replace(/&/g, "&amp;")),
    );
    assert.ok(
      writtenOf(this).body.includes(markup.trim()),
      `The body is not the markup for ${key}: ${writtenOf(this).body}`,
    );
  },
);

// What a button is painted with, from the style on the anchor the scenarios'
// emails carry: the value of one property, by its name.
const paintedWith = (html: string, property: string): string | undefined => {
  const style = /<a [^>]*style="([^"]*)"/.exec(html)?.[1];
  return style
    ?.split(";")
    .map((declaration) => declaration.split(":").map((part) => part.trim()))
    .find(([name]) => name === property)?.[1];
};

Then("its button is on {string}", function (this: SpecWorld, colour: string) {
  assert.equal(paintedWith(writtenOf(this).body, "background-color"), colour);
});

Then(
  "its button's words are {string}",
  function (this: SpecWorld, colour: string) {
    assert.equal(paintedWith(writtenOf(this).body, "color"), colour);
  },
);

Then("its body has a paragraph", function (this: SpecWorld) {
  assert.match(writtenOf(this).body, /<p>/);
});

// An email signs off in its last paragraph, and signs off with two things: the
// name it is sent from and what it calls the site. So the step asks what that
// paragraph says rather than what the very last word of the body is, which is
// only ever the second of the two.
Then("its sign off says {string}", function (this: SpecWorld, words: string) {
  const signOff = paragraphsOf(writtenOf(this).body).at(-1);
  assert.ok(signOff !== undefined, "The body has no paragraph.");
  assert.ok(textsOf(signOff).includes(words), `It signs off ${signOff}.`);
});

Then("the button says {string}", function (this: SpecWorld, words: string) {
  const link = writingOf(this).address;
  assert.ok(link !== undefined, "No button has been named.");
  assert.equal(buttonTo(writtenOf(this).body, link), words);
});

Then(
  "its body contains no element named {string}",
  function (this: SpecWorld, name: string) {
    const { body } = writtenOf(this);
    assert.ok(
      !new RegExp(`<\\s*${name}\\b`, "i").test(body),
      `The body has a ${name} element.`,
    );
  },
);

// The site's address ---------------------------------------------------------

When(
  "the site's address is made for the host {string}",
  function (this: SpecWorld, host: string) {
    writingOf(this).address = siteAddress(host, 3000);
  },
);

When(
  "the site's address is made for no host and the port {int}",
  function (this: SpecWorld, port: number) {
    writingOf(this).address = siteAddress(undefined, port);
  },
);

Then(
  "the site's address is {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(writingOf(this).address, address);
  },
);
