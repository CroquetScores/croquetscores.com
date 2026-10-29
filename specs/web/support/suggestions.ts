import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

// What a field that suggests names is asked about, the same for the admin's
// forms and the public filter: its own list drawn beneath it, or where a
// browser has none to draw (no scripting on the public pages) the datalist
// the field names. The specs are typed without the browser's own types, so
// what each function reads is said by the shape it needs.

type Reading = {
  getAttribute(name: string): string | null;
  readonly list?: {
    readonly options: ArrayLike<{ readonly value: string }>;
  } | null;
  readonly ownerDocument: {
    getElementById(id: string): {
      readonly children: ArrayLike<{ readonly textContent: string | null }>;
    } | null;
  };
};

/** The names `field` suggests, in the order it suggests them. */
export const suggestedTo = (field: Locator): Promise<string[]> =>
  field.evaluate((input: Reading) => {
    const id = input.getAttribute("aria-controls");
    const own = id === null ? null : input.ownerDocument.getElementById(id);
    return own === null
      ? Array.from(input.list?.options ?? []).map((option) => option.value)
      : Array.from(own.children).map((option) => option.textContent ?? "");
  });

/** The list `field` draws beneath itself. */
export const listOf = async (field: Locator): Promise<Locator> => {
  const id = await field.getAttribute("aria-controls");
  assert.ok(id !== null, "The field draws no list of its own.");
  return field.page().locator(`[id="${id}"]`);
};

/** What a browser says is wrong with a field, as it would show the reader. */
export const saidInvalid = (field: {
  readonly validationMessage: string;
}): string => field.validationMessage;

/**
 * Whether `field` has the focus, asked again and again for as long as it takes:
 * a field that is not left takes the focus back once the event that took it
 * has finished, and a field that is left must be seen to stay left.
 */
export const keepsTheFocus = async (
  field: Locator,
  expected: boolean,
): Promise<void> => {
  const has = (): Promise<boolean> =>
    field.evaluate(
      (element: {
        readonly ownerDocument: { readonly activeElement: unknown };
      }) => element === element.ownerDocument.activeElement,
    );
  if (!expected) await new Promise((resolve) => setTimeout(resolve, 300));
  const until = Date.now() + 3000;
  for (;;) {
    if ((await has()) === expected) return;
    if (Date.now() > until) {
      assert.fail(`The field ${expected ? "does not have" : "has"} the focus.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

/** The arrow `field` has at its end, which opens the list. */
export const drawnArrowOf = (field: Locator): Locator =>
  field.locator("xpath=following-sibling::span");

/**
 * What the reader sees as the field: the box drawn round it where the admin's
 * forms draw one, and the field itself where nothing is.
 */
export const controlOf = async (field: Locator): Promise<Locator> => {
  const box = field.locator(
    "xpath=ancestor::*[contains(concat(' ', @class, ' '), ' field-box ')]",
  );
  return (await box.count()) > 0 ? box.first() : field;
};

type Styled = {
  readonly ownerDocument: {
    readonly defaultView: {
      getComputedStyle(element: unknown): { readonly fontSize: string };
    } | null;
  };
};

const textSizeOf = (found: Locator): Promise<string> =>
  found.evaluate(
    (element: Styled) =>
      element.ownerDocument.defaultView!.getComputedStyle(element).fontSize,
  );

// A pixel of difference is a border, and no more.
const WITHIN = 1;

/** Says what `field`'s list is, or is as to `field`: shown, or laid out as it. */
export const checkSuggestions = async (
  field: Locator,
  what: "shown" | "not shown" | "left" | "width" | "size",
): Promise<void> => {
  const list = await listOf(field);
  if (what === "shown" || what === "not shown") {
    assert.equal(await list.isVisible(), what === "shown");
    return;
  }
  const box = await (await controlOf(field)).boundingBox();
  const drawn = await list.boundingBox();
  assert.ok(box !== null, "The field is not on the page.");
  assert.ok(drawn !== null, "The list is not drawn.");
  if (what === "left") {
    assert.ok(
      Math.abs(drawn.x - box.x) <= WITHIN,
      `The list starts at ${String(drawn.x)} and the field at ${String(box.x)}.`,
    );
  } else if (what === "width") {
    assert.ok(
      Math.abs(drawn.width - box.width) <= WITHIN,
      `The list is ${String(drawn.width)} wide and the field ${String(box.width)}.`,
    );
  } else {
    const option = list.locator('[role="option"]').first();
    assert.equal(await textSizeOf(option), await textSizeOf(field));
  }
};

const escaped = (words: string): string =>
  words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Presses the suggestion that says `name`, in the list `field` draws. */
export const pressSuggestion = async (
  field: Locator,
  name: string,
): Promise<void> => {
  const list = await listOf(field);
  await list
    .locator('[role="option"]')
    .filter({ hasText: new RegExp("^" + escaped(name) + "$") })
    .click();
};

/** Whether `what` of the suggestions is as `field` is: the words the scenarios use. */
export const whatOf = (
  words: string,
): "shown" | "not shown" | "left" | "width" | "size" =>
  words === "are shown"
    ? "shown"
    : words === "are not shown"
      ? "not shown"
      : words.startsWith("start")
        ? "left"
        : words.startsWith("are as wide")
          ? "width"
          : "size";
