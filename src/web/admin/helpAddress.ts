// Where in the help a dialog's help icon leads (ModalDialog.tsx): a section of
// a page of the manager's help, by the bookmark it is given in every language.
// Written once here so that the dialogs name the page and the section and not
// the folders between, which only the two kinds of tournament differ in.

const managers = "/help/tournament-managers";

/** A section of a page of the help for a tournament played by players. */
export const standardHelp = (page: string, bookmark: string): string =>
  `${managers}/standard-tournament/${page}#${bookmark}`;

/** A section of a page of the help for a tournament played by teams. */
export const teamsHelp = (page: string, bookmark: string): string =>
  `${managers}/teams-tournament/${page}#${bookmark}`;
