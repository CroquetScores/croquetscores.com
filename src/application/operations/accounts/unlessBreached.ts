import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";

/**
 * Refuses `request` as `Password.Breached` where `password` has been breached,
 * the way a password too short is refused, because it is the same thing to
 * whoever typed it. Asked with no transaction held, since the question goes
 * to another site and takes as long as that site takes. A password nobody
 * could check is neither allowed nor refused here; the check's own refusal is
 * let out as it came.
 */
export const unlessBreached = async (
  breached: BreachedPasswords,
  request: object,
  password: string,
): Promise<void> => {
  if (await breached.isBreached(password.trim())) {
    throw new RequestInvalid(request, [
      { code: "Password.Breached", fields: ["password"] },
    ]);
  }
};
