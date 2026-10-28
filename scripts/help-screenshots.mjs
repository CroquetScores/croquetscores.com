// "npm run help:screenshots -- <language folder>...". Photographs the screens
// the help shows, in each language asked for, into that language's own images
// folders under docs/help.
//
// It works the way a manager does. A database of its own is made and migrated,
// an account is given to it, and the site is run over it in this process, so
// that nothing of the development database is touched and no development
// server need be running. A browser then signs in and walks the guide in
// order, creating the example tournaments through the admin's own forms and
// dialogs, and takes each picture at the moment the guide describes it.
//
// Labels are found by the words the language gives them (the catalogue's own
// keys, English standing in where a language has none), and fields by the
// ids the forms give them, which are the same in every language. The example
// names and scores are the same in every language, as they are in the English
// pictures, so that a picture in one language can be held beside another's.
//
// Options: --out <directory> writes beneath that directory instead of
// docs/help, and --only <name,name> takes only the pictures so named.
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { URL } from "node:url";
import { chromium } from "playwright";

import {
  loadConfig,
  loadEnvFile,
} from "../src/infrastructure/config/Config.js";
import { migrate } from "../src/infrastructure/database/migrate.js";
import { createPool } from "../src/infrastructure/database/pool.js";
import { buildApplication } from "../src/web/server.js";
import { accountsThrough } from "../specs/web/support/accounts.js";
import { ReadOnlyDate } from "../src/domain/common/ReadOnlyDate.js";
import { english } from "../src/web/languages/english.js";

const root = join(import.meta.dirname, "..");
const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(`--${name}`);
  if (at === -1) return undefined;
  const [value] = args.splice(at, 2).slice(1);
  return value;
};
const out = option("out") ?? join(root, "docs", "help");
const only = option("only")?.split(",");
const folders = args;
if (folders.length === 0) {
  console.error("Say which language folders, such as: welsh french");
  process.exit(1);
}
// Checked before anything is made, so that a mistyped flag or a folder that is
// not a language is told at once and not after a database and a browser have
// been made for it. A folder is a language's name and nothing that could climb
// out of docs/help.
for (const folder of folders) {
  if (
    !/^[a-z]+$/.test(folder) ||
    !existsSync(join(root, "docs", "help", folder))
  ) {
    console.error(`"${folder}" is not a language folder of docs/help.`);
    process.exit(1);
  }
}

const address = "manager@example.com";
const password = "correct horse battery staple";

loadEnvFile();
const config = loadConfig();
const databaseName = `zzz_delete_me_help_${randomBytes(4).toString("hex")}`;
const serverPool = createPool(config.databaseUrl);

// Made inside the try below, so that whatever fails after the database exists
// drops it again.
let application;
let browser;
let site;

const finish = async () => {
  await browser?.close().catch(() => undefined);
  await application?.server.close().catch(() => undefined);
  await application?.pool.end().catch(() => undefined);
  await serverPool
    .query(`drop database if exists "${databaseName}" with (force)`)
    .catch(() => undefined);
  await serverPool.end().catch(() => undefined);
};

try {
  await serverPool.query(`create database "${databaseName}"`);
  const databaseUrl = (() => {
    const url = new URL(config.databaseUrl);
    url.pathname = `/${databaseName}`;
    return url.toString();
  })();
  const migrating = createPool(databaseUrl);
  await migrate(migrating);
  await migrating.end();

  application = await buildApplication(
    { ...config, databaseUrl },
    {
      logger: false,
      sendsTheEmailQueue: false,
      // Nothing is asked of Have I Been Pwned about the example password.
      breachedPasswords: { isBreached: () => Promise.resolve(false) },
    },
  );
  await application.server.listen({ port: 0, host: "127.0.0.1" });
  site = `http://127.0.0.1:${application.server.addresses()[0].port}`;
  browser = await chromium.launch();

  const now = () => ReadOnlyDate.from(new Date());
  for (const [other, name] of [
    [address, "Sam Someone"],
    ["alex@example.com", "Alex Another"],
    ["chris@example.com", "Chris Third"],
    ["teams@example.com", "Terry Teams"],
  ]) {
    await accountsThrough(application, now).give(other, {
      confirmed: true,
      name,
      password,
    });
  }

  for (const folder of folders) {
    const module = await import(`../src/web/languages/${folder}.js`);
    const language = module[folder];
    if (language === undefined) throw new Error(`No language ${folder}.`);
    await photographIn(folder, language);
  }
} finally {
  await finish();
}

// What a language says for `key`, as the site would: English where it has none.
function wordsOf(language) {
  return (key) => language.words[key] ?? english.words[key] ?? key;
}

async function photographIn(folder, language) {
  const say = wordsOf(language);
  // A browser of its own, asking for the language, with the one typeface
  // every picture is drawn in. The site's own stack asks the machine for its
  // system font, which is different on each machine and wide on this one, so
  // text wraps where the English pictures' did not.
  // The face for the scripts Ubuntu Sans has no letters for. Named, since the
  // machine's own choice among the CJK faces is the first it finds, which can be
  // the serif or another country's.
  const scriptFont =
    {
      zh: '"Noto Sans CJK SC"',
      ja: '"Noto Sans CJK JP"',
      ko: '"Noto Sans CJK KR"',
      "ar-EG": '"Noto Sans Arabic"',
    }[language.tag] ?? '"Noto Sans"';
  const makeContext = async () => {
    const made = await browser.newContext({
      baseURL: site,
      viewport: { width: 1000, height: 1400 },
      locale: language.tag,
      colorScheme: "light",
      deviceScaleFactor: 1,
    });
    await made.addCookies([
      { name: "language", value: language.tag, domain: "127.0.0.1", path: "/" },
    ]);
    await made.addInitScript({
      content: `document.addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = ':root { --font-body: "Ubuntu Sans", ${scriptFont}, system-ui, sans-serif; }';
        document.head.append(style);
      });`,
    });
    return made;
  };
  const context = await makeContext();
  let page = await context.newPage();

  const wanted = (name) => only === undefined || only.includes(name);
  const shoot = async (kind, name, target, options = {}) => {
    if (!wanted(name)) return;
    const directory = join(out, folder, "tournament-managers", kind, "images");
    mkdirSync(directory, { recursive: true });
    const path = join(directory, `${name}.png`);
    if (typeof target === "string") {
      await page
        .locator(target)
        .first()
        .screenshot({ path, ...options });
    } else {
      await page.screenshot({ path, ...options });
    }
    console.log(`${folder}: ${kind}/${name}`);
  };
  // The whole page, laid out in a window of the height the pictures were made
  // in, since a page shorter than the window is drawn as tall as the window.
  const wholePage = async (kind, name) => {
    const before = page.viewportSize();
    await page.setViewportSize({ width: 1000, height: 800 });
    await shoot(kind, name, undefined, { fullPage: true });
    await page.setViewportSize(before);
  };
  const button = (key) =>
    page.getByRole("button", { name: say(key), exact: true });

  // Signed in the way a reader signs in.
  await page.goto("/account/sign-in");
  await page.fill("input[name=emailAddress]", address);
  await page.fill("input[name=password]", password);
  // The form's own button, since where Google sign-in is set up the page has
  // another submit button ahead of it.
  await page.click("form:has(input[name=password]) button[type=submit]");
  await page.waitForLoadState("networkidle");

  // The new tournament form, filled in, and then created.
  await page.goto("/admin/tournaments/new");
  await page.waitForSelector("#field-name");
  await page.fill("#field-name", "Spring Open");
  await page.fill("#field-starts", "2026-10-17");
  await page.fill("#field-finishes", "2026-10-18");
  await page.selectOption("#field-country", "au");
  await page.selectOption("#field-region", "vic");
  await page.fill(
    "#field-subtitle",
    "Lawns open from 8:30. Lunch is at 12:30 each day.",
  );
  await wholePage("standard-tournament", "new-tournament");

  await button("admin.newTournament.submit").click();
  await page.waitForURL(/\/admin\/2026\/ac\/spring-open/);

  const standard = "standard-tournament";
  const tab = (key) => page.getByRole("tab", { name: say(key), exact: true });
  const dialog = "dialog[open]";
  const settle = () => page.waitForTimeout(300);

  // Players.
  await tab("admin.view.players").click();
  await button("admin.players.add").click();
  await page.waitForSelector(dialog);
  const players = [
    ["Sam Someone", "Canterbury Croquet Club", "nz"],
    ["Alex Another", "Melbourne", "au"],
    ["Chris Third", "Sydney", "au"],
    ["Pat Fourth", "Wellington", "nz"],
    ["Jo Fifth", "Cheltenham", "england"],
    ["Kim Sixth", "Dunedin", ""],
    ["Lee Mistake", "", ""],
  ];
  let first = true;
  for (const [name, representing, flag] of players) {
    await page.fill(`${dialog} #field-name`, name);
    await page.fill(`${dialog} #field-representing`, representing);
    if (flag !== "") {
      await page.selectOption(`${dialog} #field-flag`, flag);
    }
    if (first) await shoot(standard, "add-player-dialog", dialog);
    await page
      .locator(dialog)
      .getByRole("button", { name: say("admin.player.add"), exact: true })
      .click();
    await settle();
    if (first) await shoot(standard, "add-player-dialog-added", dialog);
    first = false;
  }
  // Cancel where the dialog has one, and OK where it only tells.
  const closeDialog = async () => {
    const way = page.locator(dialog).getByRole("button", {
      name: new RegExp(
        `^(${[say("admin.modal.cancel"), say("admin.modal.ok")]
          .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|")})$`,
      ),
    });
    await way.first().click();
    await settle();
  };
  await closeDialog();

  // A step that fails is said and walked past, so that one picture's trouble
  // does not hide what is wrong with the ones after it.
  const attempt = async (label, work) => {
    try {
      await work();
    } catch (error) {
      console.log(
        `${folder}: ${label} FAILED: ${String(error).split("\n")[0]}`,
      );
    }
  };
  const panel = ".panel";
  const row = (name) => page.locator("li, tr, .row").filter({ hasText: name });
  const inDialog = (key) =>
    page.locator(dialog).getByRole("button", { name: say(key), exact: true });

  // The Players tab with one archived.
  await attempt("archive Lee", async () => {
    await row("Lee Mistake")
      .first()
      .getByRole("button", { name: say("admin.players.archive"), exact: true })
      .click();
    await settle();
    await shoot(standard, "players-tab", panel);
  });

  // The Edit Player dialog.
  await attempt("edit player", async () => {
    await row("Sam Someone")
      .first()
      .getByRole("button", { name: say("admin.players.edit"), exact: true })
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "edit-player-dialog", dialog);
    await closeDialog();
  });

  // Competitions.
  await tab("admin.view.competitions").click();
  await button("admin.competitions.add").click();
  await page.waitForSelector(dialog);
  const competitions = [
    ["Block A", "block", undefined],
    ["Block B", "block", undefined],
    ["Final Stage", "knockout", "4"],
    ["Plate", "swiss", undefined],
    ["Consolation", "block", undefined],
  ];
  let firstOfKind = new Set();
  for (const [name, kind, places] of competitions) {
    await attempt(`add ${name}`, async () => {
      await page.fill(`${dialog} #field-name`, name);
      await page.check(`${dialog} #field-kind-${kind}`);
      // A block's picture keeps the 1 the dialog begins on, as the guide
      // describes it, rather than a changed value.
      if (kind !== "knockout") {
        await page.fill(
          `${dialog} #field-best-of`,
          kind === "block" ? "1" : "3",
        );
      }
      if (places !== undefined) {
        await page.selectOption(`${dialog} #field-places`, places);
      }
      if (!firstOfKind.has(kind)) {
        firstOfKind.add(kind);
        await shoot(standard, `add-competition-${kind}`, dialog);
      }
      await inDialog("admin.competition.add").click();
      await settle();
    });
  }
  await closeDialog();
  await attempt("archive Consolation", async () => {
    await row("Consolation")
      .first()
      .getByRole("button", {
        name: say("admin.competitions.archive"),
        exact: true,
      })
      .click();
    await settle();
    await shoot(standard, "competitions-tab", panel);
  });
  await attempt("tournament page", async () => {
    await wholePage(standard, "tournament-page");
  });

  // A competition's page, reached by its name on the Competitions tab.
  const open = async (name) => {
    await page.goto("/admin/2026/ac/spring-open");
    await tab("admin.view.competitions").click();
    await page.getByRole("link", { name, exact: true }).first().click();
    await page.waitForURL(/competitions\//);
    await settle();
  };
  const competitionTab = (key) =>
    page.getByRole("tab", { name: say(key), exact: true });
  const enter = async (...names) => {
    for (const name of names) {
      await page
        .locator(`${panel} select`)
        .first()
        .selectOption(
          name === "Bye"
            ? { label: say("admin.competitionPlayers.bye") }
            : { label: name },
        );
      await button("admin.competitionPlayers.add").click();
      await settle();
    }
  };
  const rowOf = (name) =>
    page.locator("li, tr, .row").filter({ hasText: name }).first();
  const addGame = async (
    winner,
    winnerScore,
    loser,
    loserScore,
    { first } = {},
  ) => {
    await button("admin.scores.add").click();
    await page.waitForSelector(dialog);
    await page.selectOption(`${dialog} #field-winner`, { label: winner });
    await page.fill(`${dialog} #field-winnerScore`, winnerScore);
    await page.selectOption(`${dialog} #field-loser`, { label: loser });
    await page.fill(`${dialog} #field-loserScore`, loserScore);
    if (first) await shoot(standard, "add-score-dialog", dialog);
    await inDialog("admin.score.add").click();
    await settle();
    if (first) await shoot(standard, "add-score-dialog-added", dialog);
    await closeDialog();
  };

  // Notes.
  await attempt("notes", async () => {
    await page.goto("/admin/2026/ac/spring-open");
    await tab("admin.view.notes").click();
    const notes = [
      [
        "Saturday's order of play",
        "Play starts at **9:00** on all lawns.\n\n- Block A on lawns 1 and 2\n- Block B on lawns 3 and 4\n\nLunch is at 12:30.",
      ],
      [
        "Format",
        "Two blocks of four play a round each. The top two go through to the Final Stage; the rest play the Plate.",
      ],
    ];
    let firstNote = true;
    for (const [title, description] of notes) {
      await button("admin.notes.add").click();
      await page.fill("#field-title", title);
      await page.locator(`${panel} textarea`).first().fill(description);
      if (firstNote) {
        await shoot(standard, "note-panel", panel);
        await page
          .getByRole("tab", { name: say("admin.note.preview"), exact: true })
          .or(
            page.getByRole("button", {
              name: say("admin.note.preview"),
              exact: true,
            }),
          )
          .first()
          .click();
        await settle();
        await shoot(standard, "note-preview", panel);
        await page
          .getByRole("tab", { name: say("admin.note.write"), exact: true })
          .or(
            page.getByRole("button", {
              name: say("admin.note.write"),
              exact: true,
            }),
          )
          .first()
          .click();
      }
      await button("admin.note.add").click();
      await settle();
      firstNote = false;
    }
    await shoot(standard, "notes-tab", panel);
    await button("admin.notes.delete").first().click();
    await page.waitForSelector(dialog);
    await shoot(standard, "delete-note-asks", dialog);
    await closeDialog();
  });

  // Block A.
  await attempt("block A players", async () => {
    await open("Block A");
    await competitionTab("admin.competitionView.players").click();
    await enter("Sam Someone", "Alex Another", "Chris Third", "Pat Fourth");
    await shoot(standard, "competition-players-tab", panel);
  });
  await attempt("carry forward", async () => {
    await rowOf("Alex Another")
      .getByRole("button", {
        name: say("admin.competitionPlayers.carryForward"),
        exact: true,
      })
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "carry-forward-dialog", dialog);
    await closeDialog();
  });
  await attempt("remove asks", async () => {
    await rowOf("Pat Fourth")
      .getByRole("button", {
        name: say("admin.competitionPlayers.remove"),
        exact: true,
      })
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "remove-player-asks", dialog);
    await closeDialog();
  });
  await attempt("withdraw asks", async () => {
    await rowOf("Pat Fourth")
      .getByRole("button", {
        name: say("admin.competitionPlayers.withdraw"),
        exact: true,
      })
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "withdraw-player-asks", dialog);
    await closeDialog();
  });
  await attempt("block A scores", async () => {
    await competitionTab("admin.competitionView.scores").click();
    await addGame("Sam Someone", "26tp", "Alex Another", "17", { first: true });
    await addGame("Alex Another", "26", "Sam Someone", "12");
    await addGame("Chris Third", "26", "Pat Fourth", "23");
    await addGame("Pat Fourth", "26", "Sam Someone", "20");
    await addGame("Chris Third", "26", "Alex Another", "25");
  });
  await attempt("edit score", async () => {
    await page
      .getByRole("button", { name: say("admin.scores.edit"), exact: true })
      .first()
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "edit-score-dialog", dialog);
    await closeDialog();
  });
  // The knockout.
  await attempt("knockout", async () => {
    await open("Final Stage");
    await competitionTab("admin.competitionView.players").click();
    await enter("Sam Someone", "Chris Third", "Pat Fourth");
    await competitionTab("admin.competitionView.scores").click();
    await button("admin.scores.add").click();
    await page.waitForSelector(dialog);
    await shoot(standard, "draw-not-filled", dialog);
    await closeDialog();
    await competitionTab("admin.competitionView.players").click();
    await enter("Bye");
    await shoot(standard, "knockout-players", panel);
    await competitionTab("admin.competitionView.scores").click();
    await addGame("Sam Someone", "26", "Chris Third", "9");
    await competitionTab("admin.competitionView.players").click();
    await page.waitForSelector(`${panel} li, ${panel} tr`);
    await settle();
    await shoot(standard, "knockout-players-fixed", panel);
  });

  // What the public sees.
  await attempt("public", async () => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/2026/ac/spring-open");
    await wholePage(standard, "public-tournament");
    await page
      .getByRole("link", { name: "Block A", exact: true })
      .first()
      .click();
    await settle();
    await shoot(standard, "public-block-grid", undefined);
    await page
      .getByRole("link", { name: say("competition.view.summary"), exact: true })
      .first()
      .click();
    await settle();
    await shoot(standard, "public-block-summary", undefined);
    await page.goto("/2026/ac/spring-open");
    await page
      .getByRole("link", { name: "Final Stage", exact: true })
      .first()
      .click();
    await settle();
    await shoot(standard, "public-knockout", undefined);
    await page.goto("/2026/ac/spring-open/notes");
    await shoot(standard, "public-notes", undefined);
  });

  await attempt("withdraw and archive a score", async () => {
    await open("Block A");
    await competitionTab("admin.competitionView.scores").click();
    await settle();
    const scoreRow = (...parts) =>
      parts
        .reduce(
          (rows, part) => rows.filter({ hasText: part }),
          page.locator("li, tr, .row"),
        )
        .last();
    await scoreRow("Pat Fourth", "Sam Someone")
      .getByRole("button", { name: say("admin.scores.withdraw"), exact: true })
      .click();
    await settle();
    await scoreRow("Alex Another", "25")
      .getByRole("button", { name: say("admin.scores.archive"), exact: true })
      .click();
    await settle();
    await shoot(standard, "scores-tab", panel);
  });
  await attempt("withdrawn player", async () => {
    await competitionTab("admin.competitionView.players").click();
    await rowOf("Pat Fourth")
      .getByRole("button", {
        name: say("admin.competitionPlayers.withdraw"),
        exact: true,
      })
      .click();
    await page.waitForSelector(dialog);
    await page.locator(`${dialog} button.button-submit`).click();
    await settle();
    await shoot(standard, "competition-players-withdrawn", panel);
  });

  await attempt("archive asks", async () => {
    // A player in a competition with no game yet, who is asked about.
    await open("Block B");
    await competitionTab("admin.competitionView.players").click();
    await enter("Jo Fifth");
    await page.goto("/admin/2026/ac/spring-open");
    await tab("admin.view.players").click();
    await rowOf("Jo Fifth")
      .getByRole("button", { name: say("admin.players.archive"), exact: true })
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "archive-player-asks", dialog);
    await closeDialog();
  });

  // Managers and scorers.
  const people = async (tabKey, addKey, address) => {
    await tab(tabKey).click();
    await page.locator(`${panel} input`).first().fill(address);
    await button(addKey).click();
    await settle();
  };
  await attempt("managers", async () => {
    await page.goto("/admin/2026/ac/spring-open");
    await people(
      "admin.view.managers",
      "admin.managers.add",
      "alex@example.com",
    );
    await shoot(standard, "managers-tab", panel);
    await page.locator(`${panel} input`).first().fill("nobody@example.com");
    await button("admin.managers.add").click();
    await settle();
    await shoot(standard, "managers-tab-refused", panel);
    await page.locator(`${panel} input`).first().fill("");
    await rowOf("Alex Another")
      .getByRole("button", { name: say("admin.people.remove"), exact: true })
      .click();
    await page.waitForSelector(dialog);
    await shoot(standard, "remove-manager-asks", dialog);
    await closeDialog();
  });
  await attempt("scorers", async () => {
    await people(
      "admin.view.scorers",
      "admin.scorers.add",
      "chris@example.com",
    );
    await shoot(standard, "scorers-tab", panel);
  });
  await attempt("scorer's view", async () => {
    const scorer = await makeContext();
    const other = await scorer.newPage();
    await other.goto("/account/sign-in");
    await other.fill("input[name=emailAddress]", "chris@example.com");
    await other.fill("input[name=password]", password);
    await other.click("button[type=submit]");
    await other.waitForLoadState("networkidle");
    await other.goto("/admin/2026/ac/spring-open");
    await other.waitForSelector(panel);
    if (wanted("scorer-tournament-page")) {
      const directory = join(
        out,
        folder,
        "tournament-managers",
        standard,
        "images",
      );
      mkdirSync(directory, { recursive: true });
      await other
        .locator(panel)
        .first()
        .screenshot({
          path: join(directory, "scorer-tournament-page.png"),
        });
      console.log(`${folder}: ${standard}/scorer-tournament-page`);
    }
    await scorer.close();
  });

  // The list, and changing and archiving.
  await attempt("list", async () => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/admin");
    await page.waitForSelector(panel);
    await shoot(standard, "admin-list", undefined);
    await page
      .getByRole("button", {
        name: say("admin.tournaments.archive"),
        exact: true,
      })
      .first()
      .click();
    await settle();
    await shoot(standard, "admin-list-archived", panel);
    await page
      .getByRole("button", {
        name: say("admin.tournaments.restore"),
        exact: true,
      })
      .first()
      .click();
    await settle();
  });
  await attempt("edit tournament", async () => {
    await page.setViewportSize({ width: 1000, height: 1400 });
    await page
      .getByRole("link", { name: say("admin.tournaments.edit"), exact: true })
      .or(
        page.getByRole("button", {
          name: say("admin.tournaments.edit"),
          exact: true,
        }),
      )
      .first()
      .click();
    await page.waitForSelector("#field-name");
    await settle();
    await wholePage(standard, "edit-tournament");
  });

  // The tournament played by teams, run by an account of its own so that the
  // admin's list holds only it, as the guide's picture of the list does.
  const teamsKind = "teams-tournament";
  const teamsContext = await makeContext();
  page = await teamsContext.newPage();
  await page.goto("/account/sign-in");
  await page.fill("input[name=emailAddress]", "teams@example.com");
  await page.fill("input[name=password]", password);
  await page.click("button[type=submit]");
  await page.waitForLoadState("networkidle");

  await attempt("teams tournament", async () => {
    await page.goto("/admin/tournaments/new");
    await page.waitForSelector("#field-name");
    await page.fill("#field-name", "Trans-Tasman Tests");
    await page.fill("#field-starts", "2026-10-24");
    await page.fill("#field-finishes", "2026-10-25");
    await page.selectOption("#field-format", "Teams");
    await page.selectOption("#field-country", "au");
    await wholePage(teamsKind, "new-tournament");
    await button("admin.newTournament.submit").click();
    await page.waitForURL(/\/admin\/2026\/ac\/trans-tasman-tests/);
    await settle();
    await page.setViewportSize({ width: 1000, height: 800 });
    await shoot(teamsKind, "tournament-page-empty", undefined);
    await page.setViewportSize({ width: 1000, height: 1400 });
  });
  await attempt("two teams needed", async () => {
    await tab("admin.view.tests").click();
    await settle();
    await shoot(teamsKind, "tests-tab-two-teams-needed", panel);
    await tab("admin.view.teams").click();
  });
  await attempt("teams", async () => {
    await button("admin.teams.add").click();
    await page.waitForSelector(dialog);
    const teams = [
      ["Australia", "AUS", "au"],
      ["New Zealand", "NZ", "nz"],
      ["England", "ENG", "england"],
      ["Wales", "WAL", "wales"],
    ];
    let firstTeam = true;
    for (const [name, short, flag] of teams) {
      await page.fill(`${dialog} #field-name`, name);
      await page.fill(`${dialog} #field-short-name`, short);
      await page.selectOption(`${dialog} #field-flag`, flag);
      if (firstTeam) await shoot(teamsKind, "add-team-dialog", dialog);
      await inDialog("admin.team.add").click();
      await settle();
      if (firstTeam) await shoot(teamsKind, "add-team-dialog-added", dialog);
      firstTeam = false;
    }
    await closeDialog();
    await rowOf("Australia")
      .getByRole("button", { name: say("admin.teams.edit"), exact: true })
      .click();
    await page.waitForSelector(dialog);
    await shoot(teamsKind, "edit-team-dialog", dialog);
    await closeDialog();
    await rowOf("Wales")
      .getByRole("button", { name: say("admin.teams.archive"), exact: true })
      .click();
    await settle();
    await shoot(teamsKind, "teams-tab", panel);
  });
  await attempt("team players", async () => {
    const teamsPlayers = [
      [
        "Australia",
        ["Pat Player", "Pam Partner", "Perry Plumb", "Spare Person"],
      ],
      ["New Zealand", ["Kim Keeper", "Ken Kicker", "Kerry Kiwi"]],
    ];
    let firstTeamPlayer = true;
    for (const [team, names] of teamsPlayers) {
      await page.goto("/admin/2026/ac/trans-tasman-tests");
      await tab("admin.view.teams").click();
      await page.getByRole("link", { name: team, exact: true }).first().click();
      await page.waitForURL(/teams\//);
      await settle();
      await button("admin.players.add").click();
      await page.waitForSelector(dialog);
      for (const name of names) {
        await page.fill(`${dialog} #field-name`, name);
        if (firstTeamPlayer) {
          await shoot(teamsKind, "add-team-player-dialog", dialog);
          firstTeamPlayer = false;
        }
        await page
          .locator(dialog)
          .getByRole("button", { name: say("admin.player.add"), exact: true })
          .click();
        await settle();
      }
      await closeDialog();
      if (team === "Australia") {
        await rowOf("Spare Person")
          .getByRole("button", {
            name: say("admin.players.archive"),
            exact: true,
          })
          .click();
        await settle();
        await wholePage(teamsKind, "team-page");
      }
    }
  });
  await attempt("tests", async () => {
    await page.goto("/admin/2026/ac/trans-tasman-tests");
    await tab("admin.view.tests").click();
    await button("admin.tests.add").click();
    await page.waitForSelector(dialog);
    const tests = [
      ["Australia", "New Zealand"],
      ["New Zealand", "England"],
      ["Australia", "England"],
    ];
    let firstTest = true;
    for (const [a, b] of tests) {
      await page.selectOption(`${dialog} #field-firstTeam`, { label: a });
      await page.selectOption(`${dialog} #field-secondTeam`, { label: b });
      await page.fill(`${dialog} #field-starts`, "2026-10-24");
      await page.fill(`${dialog} #field-finishes`, "2026-10-25");
      await page.fill(`${dialog} #field-expectedMatches`, "6");
      await page.fill(`${dialog} #field-bestOf`, "3");
      await page.fill(`${dialog} #field-group`, "Block A");
      if (firstTest) await shoot(teamsKind, "add-test-dialog", dialog);
      await inDialog("admin.test.add").click();
      await settle();
      if (firstTest) await shoot(teamsKind, "add-test-dialog-added", dialog);
      firstTest = false;
    }
    await closeDialog();
    await rowOf("AUS")
      .getByRole("button", { name: say("admin.tests.edit"), exact: true })
      .first()
      .click();
    await page.waitForSelector(dialog);
    await shoot(teamsKind, "edit-test-dialog", dialog);
    await closeDialog();
    await shoot(teamsKind, "tests-tab", panel);
    await wholePage(teamsKind, "tournament-page");
  });
  await attempt("test scores", async () => {
    await page
      .getByRole("link", { name: /AUS\s*v\s*NZ/ })
      .first()
      .click();
    await page.waitForURL(/tests\//);
    await settle();
    const games = [
      ["Pat Player", "26tp", "Kim Keeper", "14"],
      ["Kim Keeper", "26", "Pat Player", "3"],
      ["Pat Player", "17", "Kim Keeper", "16"],
      ["Ken Kicker", "26", "Pam Partner", "11"],
      ["Perry Plumb", "26", "Kerry Kiwi", "25"],
      ["Perry Plumb", "26", "Kerry Kiwi", "0"],
    ];
    let firstGame = true;
    for (const [winner, ws, loser, ls] of games) {
      await button("admin.scores.add").click();
      await page.waitForSelector(dialog);
      await page.selectOption(`${dialog} #field-winner`, { label: winner });
      await page.fill(`${dialog} #field-winnerScore`, ws);
      await page.selectOption(`${dialog} #field-loser`, { label: loser });
      await page.fill(`${dialog} #field-loserScore`, ls);
      if (firstGame) await shoot(teamsKind, "add-test-score-dialog", dialog);
      await inDialog("admin.score.add").click();
      await settle();
      firstGame = false;
      await closeDialog();
    }
    await shoot(teamsKind, "test-page-panel", panel);
  });
  await attempt("teams notes", async () => {
    await page.goto("/admin/2026/ac/trans-tasman-tests");
    await tab("admin.view.notes").click();
    const notes = [
      [
        "Order of play, day one",
        "**AUS v NZ** on lawns 1 to 3 from 9:00.\n\n**NZ v ENG** on lawns 4 to 6 from 9:00.\n\nLunch is at 12:30.",
      ],
    ];
    let firstNote = true;
    for (const [title, description] of notes) {
      await button("admin.notes.add").click();
      await page.fill("#field-title", title);
      await page.locator(`${panel} textarea`).first().fill(description);
      if (firstNote) {
        await shoot(teamsKind, "note-panel", panel);
        await page
          .getByRole("tab", { name: say("admin.note.preview"), exact: true })
          .or(
            page.getByRole("button", {
              name: say("admin.note.preview"),
              exact: true,
            }),
          )
          .first()
          .click();
        await settle();
        await shoot(teamsKind, "note-preview", panel);
        await page
          .getByRole("tab", { name: say("admin.note.write"), exact: true })
          .or(
            page.getByRole("button", {
              name: say("admin.note.write"),
              exact: true,
            }),
          )
          .first()
          .click();
      }
      await button("admin.note.add").click();
      await settle();
      firstNote = false;
    }
    await shoot(teamsKind, "notes-tab", panel);
    await button("admin.notes.delete").first().click();
    await page.waitForSelector(dialog);
    await shoot(teamsKind, "delete-note-asks", dialog);
    await closeDialog();
  });
  await attempt("teams managers", async () => {
    await page.goto("/admin/2026/ac/trans-tasman-tests");
    await tab("admin.view.managers").click();
    await page.locator(`${panel} input`).first().fill("alex@example.com");
    await button("admin.managers.add").click();
    await settle();
    await shoot(teamsKind, "managers-tab", panel);
    await rowOf("Alex Another")
      .getByRole("button", { name: say("admin.people.remove"), exact: true })
      .click();
    await page.waitForSelector(dialog);
    await shoot(teamsKind, "remove-manager-asks", dialog);
    await closeDialog();
    await tab("admin.view.scorers").click();
    await page.locator(`${panel} input`).first().fill("chris@example.com");
    await button("admin.scorers.add").click();
    await settle();
    await shoot(teamsKind, "scorers-tab", panel);
  });
  await attempt("teams scorer's view", async () => {
    const scorer = await makeContext();
    const other = await scorer.newPage();
    await other.goto("/account/sign-in");
    await other.fill("input[name=emailAddress]", "chris@example.com");
    await other.fill("input[name=password]", password);
    await other.click("button[type=submit]");
    await other.waitForLoadState("networkidle");
    await other.goto("/admin/2026/ac/trans-tasman-tests");
    await other.waitForSelector(panel);
    if (wanted("scorer-tournament-page")) {
      const directory = join(
        out,
        folder,
        "tournament-managers",
        teamsKind,
        "images",
      );
      mkdirSync(directory, { recursive: true });
      await other
        .locator(panel)
        .first()
        .screenshot({
          path: join(directory, "scorer-tournament-page.png"),
        });
      console.log(`${folder}: ${teamsKind}/scorer-tournament-page`);
    }
    await scorer.close();
  });
  await attempt("teams list", async () => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/admin");
    await page.waitForSelector(panel);
    await shoot(teamsKind, "admin-list", undefined);
  });
  await attempt("teams edit", async () => {
    await page.setViewportSize({ width: 1000, height: 1400 });
    await page
      .getByRole("link", { name: say("admin.tournaments.edit"), exact: true })
      .or(
        page.getByRole("button", {
          name: say("admin.tournaments.edit"),
          exact: true,
        }),
      )
      .first()
      .click();
    await page.waitForSelector("#field-name");
    await settle();
    await wholePage(teamsKind, "edit-tournament");
  });
  await attempt("teams public", async () => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.goto("/2026/ac/trans-tasman-tests");
    await shoot(teamsKind, "public-tournament", undefined, { fullPage: true });
    await page.goto("/2026/ac/trans-tasman-tests/players");
    await shoot(teamsKind, "public-players", undefined, { fullPage: true });
    await page.goto("/2026/ac/trans-tasman-tests");
    await page
      .getByRole("link", { name: "Block A", exact: true })
      .first()
      .click();
    await settle();
    await shoot(teamsKind, "public-group", undefined, { fullPage: true });
    // By where it leads, since what "vs" is called is the language's.
    await page.locator('a[href*="/tests/"]').first().click();
    await settle();
    await shoot(teamsKind, "public-test", undefined, { fullPage: true });
  });
  await teamsContext.close();

  await context.close();
}
