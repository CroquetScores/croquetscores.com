import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

const register = "/accounts/register";

const dialog = "section.dialog";
const title = ".dialog-title";
const content = ".dialog-content";
const buttons = ".dialog-buttons :is(a, button)";
const submit = '.dialog-buttons button[type="submit"]';

// The expressions below run in the browser, where document exists. They are
// passed as strings so that the specs' TypeScript project does not have to take
// on DOM types for lines that are not TypeScript at all.
const styleOf = (world: SpecWorld, selector: string, property: string) =>
  world.browserPage.evaluate<string>(
    `getComputedStyle(document.querySelector(${JSON.stringify(selector)})).getPropertyValue(${JSON.stringify(property)})`,
  );

// What a token actually paints, in whichever theme is in force. "The colour of
// the section navigation" is what --accent-strong is for, and reading it from a
// probe rather than from the bar itself means a page need not have a section
// bar to be compared with one.
const paintedBy = (world: SpecWorld, token: string) =>
  world.browserPage.evaluate<string>(`(() => {
    const probe = document.createElement("div");
    probe.style.background = "var(${token})";
    document.body.append(probe);
    const colour = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return colour;
  })()`);

// WCAG 2.1 relative luminance and contrast ratio, from a computed colour.
const luminance = (colour: string): number => {
  const numbers = colour.match(/[\d.]+/g)?.map(Number) ?? [];
  assert.ok(numbers.length >= 3, `${colour} is not a colour this can read.`);
  const [red, green, blue] = numbers.slice(0, 3).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrast = (first: string, second: string): number => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
};

const box = async (world: SpecWorld, selector: string) => {
  const found = await world.browserPage.locator(selector).first().boundingBox();
  assert.ok(found !== null, `Nothing on the page matches ${selector}.`);
  return found;
};

const openRegister = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}${register}`);
};

Given("the register page is open", openRegister);
When("the register page is opened", openRegister);

Then("there is no panel on the page", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator(".panel").count(), 0);
});

Then(
  "the dialog's title bar is above its content",
  async function (this: SpecWorld) {
    const bar = await box(this, title);
    const body = await box(this, content);
    assert.ok(
      bar.y + bar.height <= body.y + 0.5,
      "The title bar does not end above the content.",
    );
  },
);

Then(
  "the dialog's buttons are below its content",
  async function (this: SpecWorld) {
    const body = await box(this, content);
    const row = await box(this, ".dialog-buttons");
    assert.ok(
      row.y >= body.y + body.height - 0.5,
      "The buttons do not start below the content.",
    );
  },
);

Then(
  "the dialog is named {string}",
  async function (this: SpecWorld, name: string) {
    const named = this.browserPage.getByRole("region", { name, exact: true });
    assert.equal(await named.count(), 1, `No region is named ${name}.`);
    assert.match(
      (await named.getAttribute("class")) ?? "",
      /\bdialog\b/,
      "The region so named is not the dialog.",
    );
  },
);

Then(
  "the dialog has as much space to its left as to its right",
  async function (this: SpecWorld) {
    const shape = await box(this, dialog);
    const width = await this.browserPage.evaluate<number>(
      "document.documentElement.clientWidth",
    );
    const left = shape.x;
    const right = width - (shape.x + shape.width);
    assert.ok(
      Math.abs(left - right) <= 1,
      `The dialog has ${Math.round(left)} pixels to its left and ${Math.round(right)} to its right.`,
    );
  },
);

Then(
  "the dialog reaches from one side of the page's gutter to the other",
  async function (this: SpecWorld) {
    const shape = await box(this, dialog);
    const column = await box(this, "main .page");
    const inset = Number.parseFloat(
      await styleOf(this, "main .page", "padding-left"),
    );
    const outset = Number.parseFloat(
      await styleOf(this, "main .page", "padding-right"),
    );
    assert.ok(
      Math.abs(shape.x - (column.x + inset)) <= 1,
      "The dialog does not start at the gutter.",
    );
    assert.ok(
      Math.abs(shape.x + shape.width - (column.x + column.width - outset)) <= 1,
      "The dialog does not end at the gutter.",
    );
  },
);

Then(
  "the submit button is the furthest right of the dialog's buttons",
  async function (this: SpecWorld) {
    const all = this.browserPage.locator(buttons);
    const count = await all.count();
    assert.ok(count > 1, "There is no other button to be further right than.");
    const pressed = await box(this, submit);
    for (let index = 0; index < count; index += 1) {
      const other = await all.nth(index).boundingBox();
      assert.ok(other !== null);
      assert.ok(
        pressed.x + pressed.width >= other.x + other.width - 0.5,
        "Another button reaches further right than the submit button.",
      );
    }
  },
);

Then(
  "the submit button is the last of the dialog's buttons",
  async function (this: SpecWorld) {
    const all = this.browserPage.locator(buttons);
    const count = await all.count();
    const last = all.nth(count - 1);
    assert.equal(
      await last.getAttribute("type"),
      "submit",
      "The last button is not the submit button.",
    );

    // Last in reading order, and not shown above any other button either.
    const pressed = await last.boundingBox();
    assert.ok(pressed !== null);
    for (let index = 0; index < count - 1; index += 1) {
      const other = await all.nth(index).boundingBox();
      assert.ok(other !== null);
      assert.ok(
        pressed.y >= other.y - 0.5,
        "The submit button is shown above another button.",
      );
    }
  },
);

Then(
  "the submit button is at least {int} pixels tall",
  async function (this: SpecWorld, pixels: number) {
    const pressed = await box(this, submit);
    assert.ok(
      pressed.height >= pixels,
      `The submit button is ${Math.round(pressed.height)} pixels tall, and wanted ${pixels}.`,
    );
  },
);

Then(
  "no other button in the dialog shares the submit button's colour",
  async function (this: SpecWorld) {
    const found = await this.browserPage.evaluate<
      { type: string | null; colour: string }[]
    >(
      `[...document.querySelectorAll(${JSON.stringify(buttons)})].map((element) => ({
        type: element.getAttribute("type"),
        colour: getComputedStyle(element).backgroundColor,
      }))`,
    );
    const pressed = found.filter((button) => button.type === "submit");
    const others = found.filter((button) => button.type !== "submit");
    assert.equal(pressed.length, 1, "There is not exactly one submit button.");
    assert.ok(others.length > 0, "There is no other button to compare with.");
    for (const other of others) {
      assert.notEqual(
        other.colour,
        pressed[0]!.colour,
        "Another button is the submit button's colour.",
      );
    }
  },
);

Then(
  "the dialog's title bar is the colour of the section navigation",
  async function (this: SpecWorld) {
    assert.equal(
      await styleOf(this, title, "background-color"),
      await paintedBy(this, "--accent-strong"),
    );
  },
);

Then("the dialog's content is white", async function (this: SpecWorld) {
  assert.equal(
    await styleOf(this, content, "background-color"),
    "rgb(255, 255, 255)",
  );
});

Then(
  "the submit button is the colour of the section navigation",
  async function (this: SpecWorld) {
    assert.equal(
      await styleOf(this, submit, "background-color"),
      await paintedBy(this, "--accent-strong"),
    );
  },
);

Then(
  "the submit button is lighter than the dialog's content",
  async function (this: SpecWorld) {
    const pressed = luminance(await styleOf(this, submit, "background-color"));
    const around = luminance(await styleOf(this, content, "background-color"));
    assert.ok(
      pressed > around,
      "The submit button is not lighter than the content around it.",
    );
  },
);

Then(
  "the dialog's title reads against its bar at no less than {float} to 1",
  async function (this: SpecWorld, least: number) {
    const ratio = contrast(
      await styleOf(this, title, "color"),
      await styleOf(this, title, "background-color"),
    );
    assert.ok(
      ratio >= least,
      `The title reads at ${ratio.toFixed(2)} to 1, and wanted ${least}.`,
    );
  },
);

Then(
  "the submit button stands out from the dialog's content at no less than {float} to 1",
  async function (this: SpecWorld, least: number) {
    const ratio = contrast(
      await styleOf(this, submit, "background-color"),
      await styleOf(this, content, "background-color"),
    );
    assert.ok(
      ratio >= least,
      `The submit button stands out at ${ratio.toFixed(2)} to 1, and wanted ${least}.`,
    );
  },
);

Then(
  "the submit button's label reads against it at no less than {float} to 1",
  async function (this: SpecWorld, least: number) {
    const ratio = contrast(
      await styleOf(this, submit, "color"),
      await styleOf(this, submit, "background-color"),
    );
    assert.ok(
      ratio >= least,
      `The label reads at ${ratio.toFixed(2)} to 1, and wanted ${least}.`,
    );
  },
);

// Found by the label a reader sees, as assistive technology finds them, rather
// than by name or id.
Then("the dialog asks for an email address", async function (this: SpecWorld) {
  const input = this.browserPage
    .locator(dialog)
    .getByLabel("Email address", { exact: true });
  assert.equal(
    await input.count(),
    1,
    "The dialog has no field labelled Email address.",
  );
  assert.equal(await input.getAttribute("type"), "email");
});

Then("the dialog asks for a password", async function (this: SpecWorld) {
  const input = this.browserPage
    .locator(dialog)
    .getByLabel("Password", { exact: true });
  assert.equal(
    await input.count(),
    1,
    "The dialog has no field labelled Password.",
  );
  assert.equal(await input.getAttribute("type"), "password");
});

When("the dialog is submitted", async function (this: SpecWorld) {
  await this.browserPage.click(submit);
  await this.browserPage.waitForLoadState();
});

Then(
  "the reader is told registering is not open yet",
  async function (this: SpecWorld) {
    const status = this.browserPage.getByRole("status");
    assert.equal(
      await status.count(),
      1,
      "Nothing on the page is announced to the reader.",
    );
    assert.match((await status.textContent()) ?? "", /not open yet/i);
  },
);

When("the dialog is cancelled", async function (this: SpecWorld) {
  await this.browserPage
    .locator(buttons)
    .getByText("Cancel", { exact: true })
    .click();
  await this.browserPage.waitForLoadState();
});

Then("the home page is shown", function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, "/");
});

interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

interface FieldSeen {
  name: string;
  // The nearest thing around the input that draws a border: what a reader sees
  // as the field.
  box: Rect | null;
  label: { text: string; rect: Rect } | null;
  message: {
    text: string;
    rect: Rect;
    weight: string;
    colour: string;
    background: string | null;
  } | null;
  describedBy: string[];
}

// Everything each field in the dialog shows and announces, found from the input
// and the input's own label rather than from class names, so that a label moved
// out of the border fails however tidy the markup around it looks.
const fieldsOf = async (world: SpecWorld): Promise<FieldSeen[]> => {
  const seen = await world.browserPage.evaluate<FieldSeen[]>(`(() => {
    const rect = (element) => {
      const r = element.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const transparent = (element) =>
      ["rgba(0, 0, 0, 0)", "transparent"].includes(getComputedStyle(element).backgroundColor);
    return [...document.querySelectorAll("section.dialog input")].map((input) => {
      let box = input;
      while (box && parseFloat(getComputedStyle(box).borderTopWidth) === 0) box = box.parentElement;
      const label = input.labels && input.labels[0];
      const field = input.closest(".field");
      const message = field && field.querySelector(".field-message");
      let back = message;
      while (back && transparent(back)) back = back.parentElement;
      const describedBy = (input.getAttribute("aria-describedby") || "")
        .split(/\\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((element) => element.textContent.trim());
      return {
        name: input.name,
        box: box ? rect(box) : null,
        label: label ? { text: label.textContent.trim(), rect: rect(label) } : null,
        message: message
          ? {
              text: message.textContent.trim(),
              rect: rect(message),
              weight: getComputedStyle(message).fontWeight,
              colour: getComputedStyle(message).color,
              background: back ? getComputedStyle(back).backgroundColor : null,
            }
          : null,
        describedBy,
      };
    });
  })()`);
  assert.ok(seen.length > 0, "The dialog has no fields.");
  return seen;
};

const within = (inner: Rect, outer: Rect): boolean =>
  inner.left >= outer.left - 0.5 &&
  inner.right <= outer.right + 0.5 &&
  inner.top >= outer.top - 0.5 &&
  inner.bottom <= outer.bottom + 0.5;

Then(
  "every label in the dialog is inside its field",
  async function (this: SpecWorld) {
    for (const field of await fieldsOf(this)) {
      assert.ok(field.label !== null, `The ${field.name} field has no label.`);
      assert.ok(field.box !== null, `The ${field.name} field draws no border.`);
      assert.ok(
        field.label.rect.width > 0 && field.label.rect.height > 0,
        `The label "${field.label.text}" is not shown.`,
      );
      assert.ok(
        within(field.label.rect, field.box),
        `The label "${field.label.text}" is not inside its field's border.`,
      );
    }
  },
);

When(
  "something is typed into every field in the dialog",
  async function (this: SpecWorld) {
    const inputs = this.browserPage.locator("section.dialog input");
    const count = await inputs.count();
    for (let index = 0; index < count; index += 1) {
      await inputs.nth(index).fill("someone@example.com");
    }
  },
);

Then(
  "every field in the dialog has a message beneath it",
  async function (this: SpecWorld) {
    for (const field of await fieldsOf(this)) {
      assert.ok(
        field.message !== null,
        `The ${field.name} field has no message.`,
      );
      assert.ok(
        field.message.text !== "",
        `The ${field.name} field's message says nothing.`,
      );
      assert.ok(
        field.message.rect.height > 0,
        `The ${field.name} field's message is not shown.`,
      );
      assert.ok(field.box !== null);
      assert.ok(
        field.message.rect.top >= field.box.bottom - 0.5,
        `The ${field.name} field's message is not beneath the field.`,
      );
    }
  },
);

Then("every message in the dialog is bold", async function (this: SpecWorld) {
  for (const field of await fieldsOf(this)) {
    assert.ok(
      field.message !== null,
      `The ${field.name} field has no message.`,
    );
    assert.ok(
      Number(field.message.weight) >= 700,
      `The ${field.name} field's message has a weight of ${field.message.weight}.`,
    );
  }
});

Then(
  "every message in the dialog is announced with its field",
  async function (this: SpecWorld) {
    for (const field of await fieldsOf(this)) {
      assert.ok(
        field.message !== null,
        `The ${field.name} field has no message.`,
      );
      assert.ok(
        field.describedBy.includes(field.message.text),
        `The ${field.name} field does not announce "${field.message.text}".`,
      );
    }
  },
);

// Red is the red channel well ahead of both others, whichever theme's red it is.
Then("every message in the dialog is red", async function (this: SpecWorld) {
  for (const field of await fieldsOf(this)) {
    assert.ok(
      field.message !== null,
      `The ${field.name} field has no message.`,
    );
    const [red = 0, green = 0, blue = 0] =
      field.message.colour.match(/[\d.]+/g)?.map(Number) ?? [];
    assert.ok(
      red >= 150 && red >= green * 1.5 && red >= blue * 1.5,
      `The ${field.name} field's message is ${field.message.colour}, which is not red.`,
    );
  }
});

Then(
  "every message in the dialog reads against its content at no less than {float} to 1",
  async function (this: SpecWorld, least: number) {
    for (const field of await fieldsOf(this)) {
      assert.ok(
        field.message !== null,
        `The ${field.name} field has no message.`,
      );
      assert.ok(
        field.message.background !== null,
        `Nothing behind the ${field.name} field's message.`,
      );
      const ratio = contrast(field.message.colour, field.message.background);
      assert.ok(
        ratio >= least,
        `The ${field.name} field's message reads at ${ratio.toFixed(2)} to 1, and wanted ${least}.`,
      );
    }
  },
);
