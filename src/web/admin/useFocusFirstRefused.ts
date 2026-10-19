import { useEffect } from "react";

/**
 * Takes the reader to the first field of the open dialog that was refused,
 * whenever `refused` changes, as every refused form takes them.
 */
export const useFocusFirstRefused = (refused: unknown): void => {
  useEffect(() => {
    document
      .querySelector<HTMLElement>('dialog[open] [aria-invalid="true"]')
      ?.focus();
  }, [refused]);
};
