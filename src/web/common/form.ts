// A form sends what was typed as a request. When the request is refused for
// breaking its rules, the reader is not sent to an error page: the form is
// shown again, as it was, with each rule broken said beneath the field it is
// about. Whoever typed it is owed every rule at once, and owed it beside what
// they typed.
//
// Which field a rule is about is not the form's to say. The domain declares it
// with the rule and the refusal carries it, so a form's fields are named for
// the request's, and a rule goes beneath the field it reads. A rule reading
// more than one field is about no one of them, and is said above them all.
//
// Nor are the words. A rule is said in the reader's language, looked up by its
// code, so every form saying a rule says it the same way; a rule with no words
// is still said, in the catalogue's words for one it cannot name, rather than
// the form showing itself again as though nothing were wrong. Nothing here says
// anything in words of its own.
import type { FastifyReply, FastifyRequest } from "fastify";

import { RequestInvalid } from "../../application/common/ValidationBehaviour.js";
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import type { Dialog, Field } from "./dialog.js";
import { speakingOf, type Speaking } from "./language.js";

/** What was typed into each field, by the field's name. */
export type Typed = Readonly<Record<string, string | undefined>>;

/**
 * What was typed, from whatever arrived as the form's body. A browser sends
 * what was typed in each field as text, once. Anything else under a field's
 * name — the field sent twice, which arrives as a list, or a body that is not a
 * form's at all — was not typed into the form, and counts as nothing typed
 * there rather than as something for the form to fail on when writing it back.
 */
export const typedFrom = (body: unknown): Typed => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(body).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string",
    ),
  );
};

const saidOnce = (list: string[], text: string): void => {
  if (!list.includes(text)) list.push(text);
};

/**
 * The form as it is shown again once refused for breaking `broken`: what was
 * typed back in its fields, each rule beneath the field it reads, and the
 * reader taken to the first field that needs attention — or, when only the form
 * as a whole does, to what is said above the fields.
 */
export const refusedForm = (
  dialog: Dialog,
  typed: Typed,
  broken: readonly BrokenRule[],
  speaking: Speaking,
): Dialog => {
  const fieldNames = new Set(dialog.fields.map((field) => field.name));
  const beneath = new Map<string, string[]>();
  const above: string[] = [];

  for (const rule of broken) {
    const text = speaking.knows(rule.code)
      ? speaking.say(rule.code)
      : speaking.say("form.otherwise");
    const [only, ...more] = rule.fields;
    if (only !== undefined && more.length === 0 && fieldNames.has(only)) {
      const said = beneath.get(only) ?? [];
      saidOnce(said, text);
      beneath.set(only, said);
    } else {
      saidOnce(above, text);
    }
  }

  // A field before what is said above them all, where there is one: the
  // reader can put a field right, and it is what a screen reader should start
  // on. What is said above is taken to only when no field needs anything.
  const first = dialog.fields.find((field) => beneath.has(field.name));

  return {
    ...dialog,
    problems:
      above.length === 0
        ? undefined
        : { messages: above, autofocus: first === undefined },
    // What was typed is put back, except into a password field, which has
    // nowhere to hold it: a password is never sent back to the reader.
    fields: dialog.fields.map((field): Field => {
      const said = {
        messages: beneath.get(field.name),
        invalid: beneath.has(field.name),
        autofocus: field === first,
      };
      return field.type === "password"
        ? { ...field, ...said }
        : { ...field, ...said, value: typed[field.name] };
    }),
  };
};

export interface Form {
  /** The form as it is when opened fresh. */
  readonly dialog: Dialog;
  readonly typed: Typed;
  /** The whole page around a dialog, as the route shows it. */
  show(dialog: Dialog): string;
}

/**
 * Sends what the form asked for. A request refused for breaking its rules is
 * answered with the form shown again, and `refused` says so, so the route does
 * nothing more; anything else goes on to the error mapping, as it would from
 * any route.
 */
export const submitForm = async <TResult>(
  request: FastifyRequest,
  reply: FastifyReply,
  form: Form,
  send: () => Promise<TResult>,
): Promise<
  | { readonly refused: false; readonly result: TResult }
  | { readonly refused: true }
> => {
  try {
    return { refused: false, result: await send() };
  } catch (failure) {
    if (!(failure instanceof RequestInvalid)) throw failure;

    // 422 rather than 200, because the request was not carried out, and
    // rather than 400, because it was understood and refused for what it said.
    // Never kept by anything in between: it holds what the reader typed.
    await reply
      .code(422)
      .header("cache-control", "no-store")
      .type("text/html; charset=utf-8")
      .send(
        form.show(
          refusedForm(
            form.dialog,
            form.typed,
            failure.broken,
            speakingOf(request),
          ),
        ),
      );
    return { refused: true };
  }
};
