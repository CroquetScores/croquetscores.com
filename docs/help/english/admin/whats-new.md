# What's new for Tournament Managers

## Released 2026-10-23

These are the major changes since the last release. Each links to the pull request that made it.

- **Handicaps, drawn results and the world rankings are set on each competition.** They used to be a tournament's to say, so one tournament could not hold a handicap block beside a level one, or a test that may be drawn beside a knockout that cannot. Each competition, and each test, now asks for all three when it is added or edited, and the tournament form no longer does. The last is asked only where the sport has world rankings, and a competition that does not count is left out of the rankings file. See [Competitions](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **The admin's list of tournaments can be narrowed by country, region and sport.** The choices are in the address, so a filtered list can be linked to, and only what your list holds is offered. A region is offered once a country is chosen. Tournaments before November 2026 have no region, so choosing one hides them, and the public lists say so. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **World ranking officers are now one role for each sport.** An Association Croquet officer sees and looks after Association Croquet tournaments, and a Golf Croquet officer Golf Croquet's. A tournament you manage or score is still in your list whatever its sport. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **The Rankings tab explains the file in one paragraph, whatever the sport,** with the download link beneath it. See [Rankings](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **A tournament's name may not be all lower case or all capitals,** and the message now says so as a rule. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Remove is a trash can** on the managers and scorers tabs, the competition's players and the administrator's accounts page, as Archive and Delete already were. It is still called Remove when you point at it, and a screen reader still reads it as Remove. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Every language has new words.** The site's wording in all sixteen other languages is written afresh, and the help is brought into line with it. The help for readers and for accounts, and the terms of use, are now in every language too. None has been read by a native speaker yet, so tell us what reads badly. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Behind the scenes.** The import of the old sites gives some time zones and one tournament a different country ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), and loads a dump into the server and makes the read models with a script ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). The site is deployed by a script, from a computer or from GitHub, and no longer on every merge ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Released 2026-10-19

These are the major changes for people who run tournaments. The [help for tournament managers](../tournament-managers/index.md) has all the details.

- **Players are entered once, into the tournament.** On the old site, players were added inside each competition. Now the tournament's **Players** tab is where you add, correct, order and archive them, and a player corrected there is corrected in every competition they are in and on every public page. See [Players](../tournament-managers/standard-tournament/players.md).

- **Players are put into a competition from a list.** On a competition's page, choose a player of the tournament from the drop-down and press **Add Player**. The drop-down offers only players not already in the competition. In a knockout it also offers **Bye** for the places left over. See [Entering players in a competition](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **One button adds a competition.** In place of the separate new block, new Swiss and new knockout buttons, press **Add Competition**. The dialog asks for the name, and the kind (a block, a knockout or a Swiss), and then what that kind needs: what each match is the best of, and for a knockout the places in its draw. It stays open so that you can add several at once. A competition's kind cannot be changed afterwards: archive it and add it again. See [Competitions](../tournament-managers/standard-tournament/competitions.md).

- **Manager notes: use them instead of a commentary to tell players what they need to know.** The format, a change to the order of play, the time of lunch. A note is written on the tournament's **Notes** tab, with a title and a description in Markdown, and you can preview it before you add it. Players find notes on the tournament's public Notes page. A note they have not read is marked with an asterisk, and so is the Notes section on every page of the tournament, until they open it. A note you edit is marked again for everyone who had read it. See [Notes](../tournament-managers/standard-tournament/notes.md).

- **The old site's tournament Notes are now the Subtitle.** What you wrote there is kept as the tournament's subtitle, and is still shown beneath the tournament's name on every public page. It is written in Markdown and can be up to 2000 characters. It is for what readers should know whatever page they are on. Use a note for news that changes as the tournament goes on.
