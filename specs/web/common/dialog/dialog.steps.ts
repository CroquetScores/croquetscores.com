import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { closes, opens, unmarked } from "../../support/languages.js";

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

// Registering needs scripting, so a scenario that means to use the register
// page switches it on first; one that opens it without is sent away from it.
const openRegisterWithScripting = async function (
  this: SpecWorld,
): Promise<void> {
  await withScripting(this);
  await openRegister.call(this);
};

Given("the register page is open with scripting on", openRegisterWithScripting);
When(
  "the register page is opened with scripting on",
  openRegisterWithScripting,
);
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
    // Told, rather than merely shown: the browser has taken the reader to the
    // notice, so a screen reader reads it on arrival. Checking the page merely
    // contains the words would pass for a page nobody is ever taken to — the
    // body's own text contains everything on it.
    const focused = await this.browserPage.evaluate<{
      tag: string;
      text: string;
    }>(
      `(() => {
        const active = document.activeElement;
        if (!active) return { tag: "", text: "" };
        return { tag: active.tagName.toLowerCase(), text: (active.textContent || "").trim() };
      })()`,
    );
    assert.ok(
      !["", "body", "html"].includes(focused.tag),
      "The reader was left where they landed rather than taken to the notice.",
    );
    assert.match(
      focused.text,
      /not open yet/i,
      `The reader was taken to "${focused.text}" rather than to the notice.`,
    );
  },
);

Then(
  "the page still says registering is not open yet",
  async function (this: SpecWorld) {
    const notice = this.browserPage.locator("section.dialog .notice");
    assert.equal(
      await notice.count(),
      1,
      "The dialog carries no notice any more.",
    );
    assert.match((await notice.textContent()) ?? "", /not open yet/i);
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
  // Whether the input says what is in it is wrong.
  invalid: boolean;
  message: {
    text: string;
    rect: Rect;
    weight: string;
    colour: string;
    background: string | null;
  } | null;
  describedBy: string[];
}

// How a field is found in the page, written once for every step that looks: by
// what is drawn and by the input's own label rather than by class names, and
// never a hidden input, which is not a field a reader sees or types into; so
// that steps cannot come to disagree about what the field is, and so that a
// field drawn some other way fails however tidy the markup around it looks.
const looking = `
  const rect = (element) => {
    const r = element.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
  };
  // What a reader sees as the field: the nearest thing around the input that
  // draws a border.
  const boxOf = (input) => {
    let box = input;
    while (box && parseFloat(getComputedStyle(box).borderTopWidth) === 0) box = box.parentElement;
    return box;
  };
  // The label is the box around the field, so what is measured is the element
  // in it that holds its text: the one that does not hold the input.
  const labelTextOf = (input) => {
    const label = input.labels && input.labels[0];
    if (!label) return null;
    return [...label.children].find((child) => !child.contains(input)) || label;
  };
  // What is painted behind an element: its own background, or, where it has
  // none, the first thing around it that has one.
  const behind = (element) => {
    let back = element;
    while (back && ["rgba(0, 0, 0, 0)", "transparent"].includes(getComputedStyle(back).backgroundColor)) back = back.parentElement;
    return back ? getComputedStyle(back).backgroundColor : null;
  };
`;

// Everything each field in the dialog shows and announces beneath itself.
const fieldsOf = async (world: SpecWorld): Promise<FieldSeen[]> => {
  const seen = await world.browserPage.evaluate<FieldSeen[]>(`(() => {
    ${looking}
    return [...document.querySelectorAll("section.dialog input:not([type=hidden])")].map((input) => {
      const box = boxOf(input);
      const field = input.closest(".field");
      const message = field && field.querySelector(".field-message");
      const describedBy = (input.getAttribute("aria-describedby") || "")
        .split(/\\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .map((element) => element.textContent.trim());
      return {
        name: input.name,
        box: box ? rect(box) : null,
        invalid: input.getAttribute("aria-invalid") === "true",
        message: message
          ? {
              text: message.textContent.trim(),
              rect: rect(message),
              weight: getComputedStyle(message).fontWeight,
              colour: getComputedStyle(message).color,
              background: behind(message),
            }
          : null,
        describedBy,
      };
    });
  })()`);
  assert.ok(seen.length > 0, "The dialog has no fields.");
  return seen;
};

When(
  "the field's border is pressed where nothing can be typed",
  async function (this: SpecWorld) {
    // The corner of whatever draws the border — found the same way a reader
    // finds the field, by what is drawn, not by what it is called. Inside the
    // border, and outside both the label's text and the input.
    const corner = await this.browserPage.evaluate<{ x: number; y: number }>(
      `(() => {
        ${looking}
        const r = rect(boxOf(document.querySelector("section.dialog input")));
        return { x: r.left + 2, y: r.top + 2 };
      })()`,
    );
    await this.browserPage.mouse.click(corner.x, corner.y);
  },
);

Then("the field it names is focused", async function (this: SpecWorld) {
  const focused = await this.browserPage.evaluate<string>(
    `(() => {
      const active = document.activeElement;
      if (!active) return "";
      return active.tagName.toLowerCase() + ":" + (active.getAttribute("name") || "");
    })()`,
  );
  const first =
    (await this.browserPage
      .locator("section.dialog input")
      .first()
      .getAttribute("name")) ?? "";
  assert.equal(
    focused,
    `input:${first}`,
    `Pressing the field's border focused ${focused || "nothing"}.`,
  );
});

Then(
  "no field in the dialog is marked as wrong",
  async function (this: SpecWorld) {
    for (const field of await fieldsOf(this)) {
      assert.equal(
        field.invalid,
        false,
        `The ${field.name} field says what is in it is wrong before anything has been typed.`,
      );
    }
  },
);

type WithMessage = FieldSeen & { message: NonNullable<FieldSeen["message"]> };

// The fields that have a message, which a form shows only where something
// needs attention. A dialog showing none has nothing for these steps to judge,
// and says so rather than passing over an empty list.
const messagesOf = async (world: SpecWorld): Promise<WithMessage[]> => {
  const shown = (await fieldsOf(world)).filter(
    (field): field is WithMessage => field.message !== null,
  );
  assert.ok(shown.length > 0, "No field in the dialog has a message.");
  return shown;
};

Then("no field in the dialog has a message", async function (this: SpecWorld) {
  for (const field of await fieldsOf(this)) {
    assert.equal(
      field.message,
      null,
      `The ${field.name} field says "${field.message?.text}".`,
    );
  }
});

Then(
  "every message in the dialog sits beneath its field",
  async function (this: SpecWorld) {
    for (const field of await messagesOf(this)) {
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
  for (const field of await messagesOf(this)) {
    assert.ok(
      Number(field.message.weight) >= 700,
      `The ${field.name} field's message has a weight of ${field.message.weight}.`,
    );
  }
});

Then(
  "every message in the dialog is announced with its field",
  async function (this: SpecWorld) {
    for (const field of await messagesOf(this)) {
      assert.ok(
        field.describedBy.includes(field.message.text),
        `The ${field.name} field does not announce "${field.message.text}".`,
      );
    }
  },
);

// Red is the red channel well ahead of both others, whichever theme's red it is.
Then("every message in the dialog is red", async function (this: SpecWorld) {
  for (const field of await messagesOf(this)) {
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
    for (const field of await messagesOf(this)) {
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

interface LabelSeen {
  text: string;
  // What a reader sees as the field: the nearest thing around the input that
  // draws a border.
  box: Rect;
  input: Rect;
  label: Rect;
  fontSize: number;
  colour: string;
  // What is painted behind the label's words, which once it is lifted is its
  // own background rather than the dialog's.
  background: string | null;
  transitions: string[];
  animation: string;
}

// Each field's label as it is drawn. A field with no label, or with no border
// around it, is said here by name, so that it fails as a sentence about the
// field rather than as an error from inside the page.
const labelsOf = async (world: SpecWorld): Promise<LabelSeen[]> => {
  const seen = await world.browserPage.evaluate<
    { name: string; box: Rect | null; label: Omit<LabelSeen, "box"> | null }[]
  >(`(() => {
    ${looking}
    return [...document.querySelectorAll("section.dialog input:not([type=hidden])")].map((input) => {
      const box = boxOf(input);
      const text = labelTextOf(input);
      const style = text && getComputedStyle(text);
      return {
        name: input.name,
        box: box ? rect(box) : null,
        label: text
          ? {
              text: text.textContent.trim(),
              input: rect(input),
              label: rect(text),
              fontSize: parseFloat(style.fontSize),
              colour: style.color,
              background: behind(text),
              transitions: style.transitionDuration.split(",").map((value) => value.trim()),
              animation: style.animationName,
            }
          : null,
      };
    });
  })()`);
  assert.ok(seen.length > 0, "The dialog has no fields.");
  return seen.map(({ name, box, label }) => {
    assert.ok(label !== null, `The ${name} field has no label.`);
    assert.ok(box !== null, `The ${name} field draws no border.`);
    return { ...label, box };
  });
};

// "the email address field" is the field whose label reads "Email address".
// Found by its words with the test locale's marks taken off, so that a field is
// named the same way in a scenario whatever language the page is in.
const labelOf = async (world: SpecWorld, field: string): Promise<LabelSeen> => {
  const found = (await labelsOf(world)).find(
    (seen) => unmarked(seen.text).toLowerCase() === field.toLowerCase(),
  );
  assert.ok(found !== undefined, `The dialog has no ${field} field.`);
  return found;
};

// Found by the label a reader sees, spelled as the dialog spells it, as
// assistive technology finds a field.
const inputOf = async (world: SpecWorld, field: string) =>
  world.browserPage
    .locator(dialog)
    .getByLabel((await labelOf(world, field)).text, { exact: true });

// Resting is lying across the middle of the line the input takes, starting no
// further left than the input does: where whatever is typed would be.
const assertResting = (seen: LabelSeen): void => {
  const middle = seen.input.top + seen.input.height / 2;
  assert.ok(
    seen.label.top <= middle && seen.label.bottom >= middle,
    `The label "${seen.text}" is not on the line where the field is typed in.`,
  );
  assert.ok(
    seen.label.left >= seen.input.left - 0.5,
    `The label "${seen.text}" starts to the left of where the field is typed in.`,
  );
};

const assertBetweenSides = (seen: LabelSeen): void => {
  assert.ok(
    seen.label.left >= seen.box.left - 0.5 &&
      seen.label.right <= seen.box.right + 0.5,
    `The label "${seen.text}" runs past a side of its field.`,
  );
};

Then(
  "every label in the dialog is between its field's sides",
  async function (this: SpecWorld) {
    for (const seen of await labelsOf(this)) assertBetweenSides(seen);
  },
);

Then(
  /^the (.+) field's label is between its field's sides$/,
  async function (this: SpecWorld, field: string) {
    assertBetweenSides(await labelOf(this, field));
  },
);

Then(
  "every field in the dialog is as tall as the submit button",
  async function (this: SpecWorld) {
    const pressed = await box(this, submit);
    for (const seen of await labelsOf(this)) {
      assert.ok(
        Math.abs(seen.box.height - pressed.height) <= 1,
        `The ${seen.text} field is ${Math.round(seen.box.height)} pixels tall, and the submit button ${Math.round(pressed.height)}.`,
      );
    }
  },
);

Then(
  "every label in the dialog rests where its field is typed in",
  async function (this: SpecWorld) {
    for (const seen of await labelsOf(this)) assertResting(seen);
  },
);

Then(
  /^the (.+) field's label rests where its field is typed in$/,
  async function (this: SpecWorld, field: string) {
    assertResting(await labelOf(this, field));
  },
);

When(
  /^the (.+) field is focused$/,
  async function (this: SpecWorld, field: string) {
    await (await inputOf(this, field)).focus();
  },
);

When(
  /^something is typed into the (.+) field$/,
  async function (this: SpecWorld, field: string) {
    await (await inputOf(this, field)).fill("someone@example.com");
  },
);

Then(
  /^the (.+) field's label is on the field's top edge$/,
  async function (this: SpecWorld, field: string) {
    const seen = await labelOf(this, field);
    assert.ok(
      seen.label.top < seen.box.top && seen.label.bottom > seen.box.top,
      `The label "${seen.text}" does not sit across its field's top edge.`,
    );
  },
);

Then(
  /^the (.+) field's label is smaller than the (.+) field's label$/,
  async function (this: SpecWorld, field: string, other: string) {
    const seen = await labelOf(this, field);
    const compared = await labelOf(this, other);
    assert.ok(
      seen.fontSize < compared.fontSize,
      `The label "${seen.text}" is ${seen.fontSize} pixels, and "${compared.text}" ${compared.fontSize}.`,
    );
  },
);

Then(
  /^the (.+) field's label is not animated$/,
  async function (this: SpecWorld, field: string) {
    const seen = await labelOf(this, field);
    for (const duration of seen.transitions) {
      assert.equal(
        Number.parseFloat(duration),
        0,
        `The label "${seen.text}" moves over ${duration}.`,
      );
    }
    assert.equal(
      seen.animation,
      "none",
      `The label "${seen.text}" runs the animation ${seen.animation}.`,
    );
  },
);

Then(
  /^the (.+) field's label reads against what is behind it at no less than ([\d.]+) to 1$/,
  async function (this: SpecWorld, field: string, least: string) {
    const seen = await labelOf(this, field);
    assert.ok(
      seen.background !== null,
      `Nothing behind the label "${seen.text}".`,
    );
    const ratio = contrast(seen.colour, seen.background);
    assert.ok(
      ratio >= Number(least),
      `The label "${seen.text}" reads at ${ratio.toFixed(2)} to 1, and wanted ${least}.`,
    );
  },
);

// What a reader types, and what a field then holds and says ---------------

When(
  /^"([^"]*)" is typed into the (.+) field$/,
  async function (this: SpecWorld, text: string, field: string) {
    await (await inputOf(this, field)).fill(text);
  },
);

Then(
  /^the (.+) field is marked as wrong$/,
  async function (this: SpecWorld, field: string) {
    assert.equal(
      await (await inputOf(this, field)).getAttribute("aria-invalid"),
      "true",
      `The ${field} field is not marked as wrong.`,
    );
  },
);

Then(
  /^the (.+) field is not marked as wrong$/,
  async function (this: SpecWorld, field: string) {
    assert.notEqual(
      await (await inputOf(this, field)).getAttribute("aria-invalid"),
      "true",
      `The ${field} field is marked as wrong.`,
    );
  },
);

// The input a reader knows by `field`, found in the page by its label's words
// as the page spells them, for steps that ask the page about it directly.
const inputByLabel = (field: string): string => `
  [...document.querySelectorAll("section.dialog input")].find(
    (input) => [...(input.labels?.[0]?.children ?? [])]
      .some((child) => !child.contains(input) && child.textContent.split(${JSON.stringify(opens)}).join("").split(${JSON.stringify(closes)}).join("").trim().toLowerCase() === ${JSON.stringify(field.toLowerCase())}),
  )`;

// No message beneath it, and none announced with it: either would be the
// reader told something about the field.
Then(
  /^the (.+) field has no message$/,
  async function (this: SpecWorld, field: string) {
    const said = await this.browserPage.evaluate<{
      beneath: string | null;
      announced: string | null;
    } | null>(`(() => {
      const input = ${inputByLabel(field)};
      if (!input) return null;
      return {
        beneath: input.closest(".field")?.querySelector(".field-message")?.textContent.trim() ?? null,
        announced: input.getAttribute("aria-describedby"),
      };
    })()`);
    assert.ok(said !== null, `The dialog has no ${field} field.`);
    assert.equal(
      said.beneath,
      null,
      `The ${field} field says "${said.beneath}".`,
    );
    assert.equal(
      said.announced,
      null,
      `The ${field} field announces ${said.announced}.`,
    );
  },
);

Then(
  /^the (.+) field holds "([^"]*)"$/,
  async function (this: SpecWorld, field: string, text: string) {
    assert.equal(await (await inputOf(this, field)).inputValue(), text);
  },
);

Then(
  /^the (.+) field is empty$/,
  async function (this: SpecWorld, field: string) {
    assert.equal(await (await inputOf(this, field)).inputValue(), "");
  },
);

Then(
  /^the reader is taken to the (.+) field$/,
  async function (this: SpecWorld, field: string) {
    const focused = await this.browserPage.evaluate<boolean | null>(`(() => {
      const input = ${inputByLabel(field)};
      return input ? input === document.activeElement : null;
    })()`);
    assert.ok(focused !== null, `The dialog has no ${field} field.`);
    assert.ok(focused, `The reader was not taken to the ${field} field.`);
  },
);
