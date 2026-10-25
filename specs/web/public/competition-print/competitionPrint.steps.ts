import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

// What the printer is shown is the page under the browser's print rules, which
// a browser can be asked to apply to the page on the screen, so that what is
// checked is what the stylesheet says rather than a print preview nobody can
// read back. The paper's shape is the page's named page, which the browser
// reports as the `page` of the body it is set on.
const printButton = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .print-button");

const results = (world: SpecWorld): Locator =>
  world.browserPage.locator(
    "main :is(.block-grid, .knockout, .swiss, .test-matches)",
  );

interface InThePage {
  getComputedStyle(element: unknown): {
    readonly page: string;
    readonly fontSize: string;
  };
  readonly document: { readonly body: unknown };
}

interface Eventing {
  dispatchEvent(event: unknown): boolean;
}

interface InTheDocument {
  readonly document: {
    readonly documentElement: {
      readonly style: { setProperty(name: string, value: string): void };
    };
  };
}

// What the paper is wide enough for is the page's own, kept as a setting of
// the stylesheet's, which a scenario narrows so that a few players are already
// too many.
When(
  "the paper is {int} pixels wide",
  async function (this: SpecWorld, width: number) {
    await this.browserPage.evaluate((pixels) => {
      const inThePage = globalThis as unknown as InTheDocument;
      inThePage.document.documentElement.style.setProperty(
        "--print-width",
        `${String(pixels)}px`,
      );
    }, width);
  },
);

// The events a browser sends the page just before it lays it out for the
// printer and just after it is printed, which the page cuts a wide grid up
// between.
When("the page is laid out for the printer", async function (this: SpecWorld) {
  await this.browserPage.emulateMedia({ media: "print" });
  await this.browserPage.evaluate(() => {
    (globalThis as unknown as Eventing).dispatchEvent(new Event("beforeprint"));
  });
});

When("the printing is done", async function (this: SpecWorld) {
  await this.browserPage.evaluate(() => {
    (globalThis as unknown as Eventing).dispatchEvent(new Event("afterprint"));
  });
  await this.browserPage.emulateMedia({ media: "screen" });
});

Then("the print button is offered", async function (this: SpecWorld) {
  assert.equal(await printButton(this).isVisible(), true);
});

Then("the print button is in the page", async function (this: SpecWorld) {
  assert.equal(await printButton(this).count(), 1);
});

Then("the print button is not offered", async function (this: SpecWorld) {
  assert.equal(await printButton(this).isVisible(), false);
});

Then("the print button is not printed", async function (this: SpecWorld) {
  assert.equal(await printButton(this).isVisible(), false);
});

Then(
  "the printed tournament name is {string}",
  async function (this: SpecWorld, name: string) {
    const printed = this.browserPage.locator("main .print-tournament");
    assert.equal(await printed.isVisible(), true);
    assert.equal((await printed.innerText()).trim(), name);
  },
);

// Said to what reads the page aloud and drawn as nothing, a box of one pixel,
// which the browser still calls visible.
Then("the tournament name is not seen", async function (this: SpecWorld) {
  const box = await this.browserPage
    .locator("main .print-tournament")
    .boundingBox();
  assert.ok(box !== null && box.width <= 1 && box.height <= 1);
});

Then(
  "the first-level heading is {string}",
  async function (this: SpecWorld, name: string) {
    // The whole page, not only its main part, since the layout has a first-level
    // heading of its own on some pages, and a page has but one.
    const headings = this.browserPage.locator("h1");
    assert.equal(await headings.count(), 1);
    assert.equal(((await headings.textContent()) ?? "").trim(), name);
  },
);

// A heading is as large as it is drawn, which is the size the browser reports
// for it once the page is laid out for the printer.
const sizeOf = (world: SpecWorld, selector: string): Promise<number> =>
  world.browserPage
    .locator(selector)
    .first()
    .evaluate((element) =>
      parseFloat(
        (globalThis as unknown as InThePage).getComputedStyle(element).fontSize,
      ),
    );

Then(
  "the printed tournament name is larger than the printed competition name",
  async function (this: SpecWorld) {
    const tournament = await sizeOf(this, "main .print-tournament");
    const competition = await sizeOf(this, "main h2");
    assert.ok(tournament > competition, `${tournament} and ${competition}`);
  },
);

Then(
  "the printed competition name is {string}",
  async function (this: SpecWorld, name: string) {
    const heading = this.browserPage.locator("main h2").first();
    assert.equal(await heading.isVisible(), true);
    assert.equal((await heading.innerText()).trim(), name);
  },
);

Then(
  "the printed tournament name is above the printed competition name",
  async function (this: SpecWorld) {
    const tournament = await this.browserPage
      .locator("main .print-tournament")
      .boundingBox();
    const competition = await this.browserPage
      .locator("main h2")
      .first()
      .boundingBox();
    assert.ok(tournament !== null && competition !== null);
    assert.ok(tournament.y + tournament.height <= competition.y);
  },
);

Then("the results are printed", async function (this: SpecWorld) {
  assert.equal(await results(this).first().isVisible(), true);
});

Then("the site's bar is not printed", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator(".site-bar").isVisible(), false);
});

Then("the section bar is not printed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator(".site-sections").isVisible(),
    false,
  );
});

Then("the footer is not printed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator(".site-footer").isVisible(),
    false,
  );
});

Then("the views are not printed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator("main .competition-views").isVisible(),
    false,
  );
});

Then(
  /^the paper is (landscape|portrait)$/,
  async function (this: SpecWorld, shape: string) {
    const named = await this.browserPage.evaluate(() => {
      const inThePage = globalThis as unknown as InThePage;
      return inThePage.getComputedStyle(inThePage.document.body).page;
    });
    assert.equal(named, shape);
  },
);

// A grid or a draw is printed in as many pieces as are drawn, the whole of it
// that the printer is not shown being hidden for it.
const drawn = (world: SpecWorld, selector: string): Locator =>
  world.browserPage.locator(`main ${selector}`).locator("visible=true");

interface InThePageStyle {
  readonly document: {
    readonly body: { appendChild(element: unknown): void };
    createElement(tag: string): {
      readonly style: { cssText: string };
      getBoundingClientRect(): { readonly width: number };
      remove(): void;
    };
  };
}

const widthOfPaper = (world: SpecWorld): Promise<number> =>
  world.browserPage.evaluate(() => {
    const inThePage = globalThis as unknown as InThePageStyle;
    const ruler = inThePage.document.createElement("div");
    ruler.style.cssText = "position:absolute;width:var(--print-width)";
    inThePage.document.body.appendChild(ruler);
    const width = ruler.getBoundingClientRect().width;
    ruler.remove();
    return width;
  });

Then(
  "the block's grid is printed in one piece",
  async function (this: SpecWorld) {
    assert.equal(await drawn(this, "table.block-grid").count(), 1);
  },
);

Then(
  "the block's grid is printed in more than one piece",
  async function (this: SpecWorld) {
    assert.ok((await drawn(this, "table.block-grid").count()) > 1);
  },
);

Then("the block's grid is in one piece", async function (this: SpecWorld) {
  const grids = this.browserPage.locator("main table.block-grid");
  assert.equal(await grids.count(), 1);
  assert.equal(await grids.isVisible(), true);
});

Then(
  "no piece of the block's grid is wider than the paper",
  async function (this: SpecWorld) {
    const paper = await widthOfPaper(this);
    for (const piece of await drawn(this, "table.block-grid").all()) {
      const box = await piece.boundingBox();
      assert.ok(box !== null && box.width <= paper, String(box?.width));
    }
  },
);

Then(
  "each piece of the block's grid names the player {string}",
  async function (this: SpecWorld, name: string) {
    const pieces = await drawn(this, "table.block-grid").all();
    assert.ok(pieces.length > 0);
    for (const piece of pieces) {
      const named = piece.locator("th.block-grid-player").getByText(name);
      assert.equal(await named.count(), 1);
    }
  },
);

Then(
  "the pieces of the block's grid have every column once",
  async function (this: SpecWorld) {
    const headings = async (selector: string): Promise<string[]> =>
      (
        await this.browserPage
          .locator(`main ${selector} thead th`)
          .allTextContents()
      ).map((text) => text.trim());
    const whole = await headings(".block-grid-scroll[data-print-split]");
    const pieces = await headings(".block-grid-scroll:not([data-print-split])");
    assert.ok(whole.length > 0);
    // Each piece has the column of names again, which heads no column of the
    // grid's and is read as nothing.
    assert.deepEqual(
      pieces.filter((heading) => heading !== ""),
      whole.filter((heading) => heading !== ""),
    );
  },
);

Then(
  "the knockout's draw is printed in one piece",
  async function (this: SpecWorld) {
    assert.equal(await drawn(this, ".knockout").count(), 1);
  },
);

Then(
  "the knockout's draw is printed in more than one piece",
  async function (this: SpecWorld) {
    assert.ok((await drawn(this, ".knockout").count()) > 1);
  },
);

Then(
  "no piece of the knockout's draw is wider than the paper",
  async function (this: SpecWorld) {
    const paper = await widthOfPaper(this);
    for (const piece of await drawn(this, ".knockout").all()) {
      const box = await piece.boundingBox();
      assert.ok(box !== null && box.width <= paper, String(box?.width));
    }
  },
);

Then(
  "the pieces of the knockout's draw have every round once",
  async function (this: SpecWorld) {
    const rounds = async (selector: string): Promise<string[]> =>
      (
        await this.browserPage
          .locator(`main ${selector} .knockout-round-name`)
          .allTextContents()
      ).map((text) => text.trim());
    const whole = await rounds(".knockout[data-print-split]");
    const pieces = await rounds(".knockout:not([data-print-split])");
    assert.ok(whole.length > 1);
    assert.deepEqual(pieces, whole);
  },
);
