import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { siteTold } from "../../support/site.js";
import { closes, opens } from "../../support/languages.js";
import { changeTournament } from "../../support/tournaments.js";
import type { WebWorld } from "../../support/world.js";

const banner = ".try-banner";

Then(
  "the try website's banner is above the site bar",
  async function (this: WebWorld) {
    const above = await this.browserPage.locator(banner).boundingBox();
    const bar = await this.browserPage.locator("header.site-bar").boundingBox();
    assert.ok(
      above !== null && bar !== null,
      "The banner or the bar is not shown.",
    );
    assert.ok(above.y + above.height <= bar.y);
  },
);

// Read as the browser draws them, so that a rule which no longer reaches the
// banner is seen, and not only one that was never written.
Then(
  "the try website's banner is black on yellow",
  async function (this: WebWorld) {
    const drawn = await this.browserPage
      .locator(banner)
      .evaluate((element: unknown) => {
        const style = (globalThis as unknown as InThePage).getComputedStyle(
          element,
        );
        return [style.backgroundColor, style.color];
      });
    assert.deepEqual(drawn, ["rgb(255, 235, 59)", "rgb(0, 0, 0)"]);
  },
);

// Cloudflare's web analytics ------------------------------------------------------

// Looked for in the page's markup and not in what the browser fetched, so that
// the scenarios do not depend on Cloudflare being reachable from wherever they
// are run.
const analyticsScript =
  'script[src="https://static.cloudflareinsights.com/beacon.min.js"]';

Then(
  "the page carries Cloudflare's web analytics",
  async function (this: WebWorld) {
    assert.equal(await this.browserPage.locator(analyticsScript).count(), 1);
  },
);

Then(
  "the page carries no Cloudflare web analytics",
  async function (this: WebWorld) {
    assert.equal(await this.browserPage.locator(analyticsScript).count(), 0);
  },
);

// The tournament named in the header -------------------------------------------------

const tournamentInHeader = (world: WebWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-tournament");

const siteNameInHeader = (world: WebWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-name");

Then(
  "the tournament named in the header is beneath the site's name",
  async function (this: WebWorld) {
    const site = await siteNameInHeader(this).boundingBox();
    const tournament = await tournamentInHeader(this).boundingBox();
    assert.ok(
      site !== null && tournament !== null,
      "One of them is not shown.",
    );
    assert.ok(
      tournament.y >= site.y + site.height,
      `It starts ${String(tournament.y)} pixels down.`,
    );
  },
);

// What a page's own scripting would see of an element, which the specs are
// not compiled to know.
interface InThePage {
  getComputedStyle(element: unknown): {
    readonly fontFamily: string;
    readonly fontSize: string;
    readonly fontWeight: string;
    readonly backgroundColor: string;
    readonly color: string;
    readonly borderLeftWidth: string;
    readonly paddingLeft: string;
  };
}

const setIn = (found: Locator): Promise<string> =>
  found.evaluate((element: unknown) => {
    const { fontFamily, fontSize, fontWeight } = (
      globalThis as unknown as InThePage
    ).getComputedStyle(element);
    return `${fontFamily} ${fontSize} ${fontWeight}`;
  });

Then(
  "the tournament named in the header is set as the site's name is",
  async function (this: WebWorld) {
    assert.equal(
      await setIn(tournamentInHeader(this)),
      await setIn(siteNameInHeader(this)),
    );
  },
);

When(
  "the tournament named in the header is pressed",
  async function (this: WebWorld) {
    await tournamentInHeader(this).click();
    await this.browserPage.waitForLoadState();
  },
);

// The tournament's subtitle -------------------------------------------------------

Given(
  "the tournament {string} has the subtitle:",
  async function (this: WebWorld, name: string, subtitle: string) {
    await changeTournament(this, name, { subtitle });
  },
);

When("the page is scrolled to its bottom", async function (this: WebWorld) {
  await this.browserPage.evaluate(
    "globalThis.scrollTo(0, globalThis.document.body.scrollHeight)",
  );
});

const subtitleInHeader = (world: WebWorld): Locator =>
  world.browserPage.locator(".tournament-subtitle");

Then(
  "the header shows the subtitle {string}",
  async function (this: WebWorld, subtitle: string) {
    assert.equal((await subtitleInHeader(this).innerText()).trim(), subtitle);
  },
);

Then("the header shows no subtitle", async function (this: WebWorld) {
  assert.equal(await subtitleInHeader(this).count(), 0);
});

Then(
  "the subtitle in the header is beneath the tournament named there",
  async function (this: WebWorld) {
    const tournament = await tournamentInHeader(this).boundingBox();
    const subtitle = await subtitleInHeader(this).boundingBox();
    assert.ok(
      tournament !== null && subtitle !== null,
      "One of them is not shown.",
    );
    assert.ok(
      subtitle.y >= tournament.y + tournament.height,
      `It starts ${String(subtitle.y)} pixels down.`,
    );
  },
);

// Out of sight behind the pinned bar, which stays at the top of the window
// while what is beneath it scrolls under it.
Then(
  "the subtitle in the header is out of sight",
  async function (this: WebWorld) {
    const bar = await this.browserPage.locator("header.site-bar").boundingBox();
    const subtitle = await subtitleInHeader(this).boundingBox();
    assert.ok(bar !== null && subtitle !== null, "One of them is not drawn.");
    assert.ok(
      subtitle.y + subtitle.height <= bar.y + bar.height,
      `It ends ${String(subtitle.y + subtitle.height)} pixels down.`,
    );
  },
);

Then(
  "the subtitle in the header draws {string} bold",
  async function (this: WebWorld, words: string) {
    const bold = await subtitleInHeader(this).locator("strong").allInnerTexts();
    assert.deepEqual(bold, [words]);
  },
);

const linkInSubtitle = (world: WebWorld, words: string): Locator =>
  subtitleInHeader(world).locator("a", { hasText: words });

Then(
  "the subtitle's link {string} leads to {string}",
  async function (this: WebWorld, words: string, href: string) {
    assert.equal(await linkInSubtitle(this, words).getAttribute("href"), href);
  },
);

Then(
  "the subtitle's link {string} is marked as not vouched for",
  async function (this: WebWorld, words: string) {
    const rel = (
      (await linkInSubtitle(this, words).getAttribute("rel")) ?? ""
    ).split(/\s+/);
    assert.ok(rel.includes("nofollow"), `It is marked ${rel.join(" ")}.`);
    assert.ok(rel.includes("ugc"), `It is marked ${rel.join(" ")}.`);
  },
);

Then(
  "the subtitle in the header is a numbered list of {int} items",
  async function (this: WebWorld, items: number) {
    assert.equal(
      await subtitleInHeader(this).locator("ol > li").count(),
      items,
    );
  },
);

// The version in the footer ----------------------------------------------------

const versionInFooter = (world: WebWorld): Locator =>
  world.browserPage.locator("footer.site-footer .site-version");

Given(
  "a site running version {int}",
  async function (this: WebWorld, version: number) {
    this.baseUrl = (
      await siteTold({ TEST_SITE_VERSION: String(version) })
    ).baseUrl;
  },
);

Given("a site running no version", async function (this: WebWorld) {
  this.baseUrl = (await siteTold({ TEST_SITE_VERSION: "none" })).baseUrl;
});

Then(
  "the footer carries the version {string}",
  async function (this: WebWorld, version: string) {
    assert.equal((await versionInFooter(this).innerText()).trim(), version);
  },
);

Then("the footer carries no version", async function (this: WebWorld) {
  assert.equal(await versionInFooter(this).count(), 0);
});

// The link to report a bug in the footer ---------------------------------------

const bugReport = (world: WebWorld): Locator =>
  world.browserPage.locator("footer.site-footer a.report-bug");

// The link as an address, which is a mailto: whose path is who it writes to and
// whose subject is a parameter of it.
const bugReportAddress = async (world: WebWorld): Promise<URL> => {
  const href = await bugReport(world).getAttribute("href");
  assert.ok(href !== null, "The link has no address.");
  return new URL(href);
};

Given(
  "a site whose administrator is {string}",
  async function (this: WebWorld, emailAddress: string) {
    this.baseUrl = (
      await siteTold({ ADMINISTRATOR_EMAIL_ADDRESS: emailAddress })
    ).baseUrl;
  },
);

// Among the footer's links, which are for finding: the one that writes about a
// bug is asked for by its own steps below, and any other by its words.
const linksOffered = async (world: WebWorld): Promise<string[]> => {
  const offered: string[] = [];
  for (const link of await world.browserPage
    .locator("footer.site-footer .site-footer-links a")
    .all()) {
    // One that is kept from sight is not offered, whatever words it holds.
    if (await link.isVisible()) offered.push((await link.innerText()).trim());
  }
  return offered;
};

Then(
  "the footer offers the link {string}",
  async function (this: WebWorld, words: string) {
    assert.ok(
      (await linksOffered(this)).includes(words),
      `The footer does not offer ${words}.`,
    );
  },
);

Then(
  "the footer does not offer the link {string}",
  async function (this: WebWorld, words: string) {
    assert.ok(
      !(await linksOffered(this)).includes(words),
      `The footer offers ${words}.`,
    );
  },
);

Then(
  "the bug report is addressed to {string}",
  async function (this: WebWorld, emailAddress: string) {
    const address = await bugReportAddress(this);
    assert.equal(address.protocol, "mailto:");
    assert.equal(decodeURIComponent(address.pathname), emailAddress);
  },
);

Then(
  "the bug report has the subject {string}",
  async function (this: WebWorld, subject: string) {
    assert.equal(
      (await bugReportAddress(this)).searchParams.get("subject"),
      subject,
    );
  },
);

Then(
  "the bug report link is in the test locale",
  async function (this: WebWorld) {
    const shown = (await bugReport(this).innerText()).trim();
    assert.ok(shown.startsWith(opens) && shown.endsWith(closes), shown);
  },
);

// Where the footer's links are ---------------------------------------------------

const footerLinks = (world: WebWorld): Locator =>
  world.browserPage.locator("footer.site-footer .site-footer-links a");

const boxOf = async (locator: Locator, what: string) => {
  const box = await locator.boundingBox();
  assert.ok(box !== null, `${what} is not on the page.`);
  return box;
};

// A pixel or two either way is a rounding of where a box starts, not a place.
const near = (one: number, other: number): boolean =>
  Math.abs(one - other) <= 2;

Then(
  "the footer's links are beneath the donation and the copyright",
  async function (this: WebWorld) {
    const bar = await boxOf(
      this.browserPage.locator("footer.site-footer .site-footer-bar"),
      "The footer's first row",
    );
    assert.equal(await footerLinks(this).count(), 4);
    for (const link of await footerLinks(this).all()) {
      const box = await boxOf(link, "A link");
      assert.ok(
        box.y >= bar.y + bar.height - 2,
        `A link starts ${String(box.y)} down, above the end of the first row at ${String(bar.y + bar.height)}.`,
      );
    }
  },
);

Then("the footer's links are side by side", async function (this: WebWorld) {
  // By the middle of each and not the top, since a link that is as tall as a
  // thumb needs (homeScreenLink.feature) is centred in the row with the shorter
  // ones, and starts above them without being on a row of its own.
  const tops: number[] = [];
  for (const link of await footerLinks(this).all()) {
    const box = await boxOf(link, "A link");
    tops.push(box.y + box.height / 2);
  }
  assert.equal(tops.length, 4);
  assert.ok(
    tops.every((top) => near(top, tops[0]!)),
    `The links start ${tops.join(", ")} down.`,
  );
});

Then(
  /^the (first|second|third|fourth) footer link is "([^"]*)"$/,
  async function (this: WebWorld, place: string, words: string) {
    const at = ["first", "second", "third", "fourth"].indexOf(place);
    assert.equal((await footerLinks(this).nth(at).innerText()).trim(), words);
  },
);

Then(
  "the footer's links end where the theme choice ends",
  async function (this: WebWorld) {
    const last = await boxOf(footerLinks(this).last(), "The last link");
    const choice = await boxOf(
      this.browserPage
        .locator("footer.site-footer .site-footer-theme > *")
        .last(),
      "The theme choice",
    );
    assert.ok(
      near(last.x + last.width, choice.x + choice.width),
      `The links end at ${String(last.x + last.width)} and the choice at ${String(choice.x + choice.width)}.`,
    );
  },
);

Then(
  "the theme choice is beneath the footer's links",
  async function (this: WebWorld) {
    const last = await boxOf(footerLinks(this).last(), "The last link");
    const choice = await boxOf(
      this.browserPage.locator("footer.site-footer .site-footer-theme"),
      "The theme choice",
    );
    assert.ok(choice.y >= last.y + last.height - 2);
  },
);

// Where the panel is, against the window -------------------------------------------

const panel = (world: WebWorld): Locator =>
  world.browserPage.locator("main .panel").first();

Then(
  "the panel starts at the left edge of the window",
  async function (this: WebWorld) {
    const box = await boxOf(panel(this), "The panel");
    assert.ok(near(box.x, 0), `The panel starts ${box.x} pixels in.`);
  },
);

Then(
  "the panel ends at the right edge of the window",
  async function (this: WebWorld) {
    const box = await boxOf(panel(this), "The panel");
    const width = await this.browserPage.evaluate<number>("window.innerWidth");
    assert.ok(
      near(box.x + box.width, width),
      `The panel ends ${width - box.x - box.width} pixels short.`,
    );
  },
);

Then(
  "the panel does not start at the left edge of the window",
  async function (this: WebWorld) {
    const box = await boxOf(panel(this), "The panel");
    assert.ok(box.x > 2, "The panel starts at the left edge.");
  },
);

// Its text is where its padding and border end, which is not the box's own edge.
Then(
  "the panel's text starts where the site name starts",
  async function (this: WebWorld) {
    const box = await boxOf(panel(this), "The panel");
    const held = await panel(this).evaluate((element: unknown) => {
      const style = (globalThis as unknown as InThePage).getComputedStyle(
        element,
      );
      return parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
    });
    const name = await boxOf(siteNameInHeader(this), "The site name");
    assert.ok(
      near(box.x + held, name.x),
      `The text starts at ${box.x + held}, the site name at ${name.x}.`,
    );
  },
);
