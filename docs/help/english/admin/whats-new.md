# What's new for Tournament Managers

## Released 2026-10-25

These are the major changes since the last release. Each links to the pull request that made it.

- **A world ranking officer's list of tournaments can be narrowed by the world rankings.** An officer's list holds every tournament of the sports they look after, which is more than they want to read down. It now has three buttons beside **New Tournament**: **Manager/Scorer**, **World Ranking** and **Not World Ranking**. A tournament is listed when any button that applies to it is on, so each one adds tournaments rather than taking them away. A button that is on has a tick, and **Manager/Scorer** and **World Ranking** are on to begin with. The buttons are for officers only; if you manage or score tournaments, your list is as it was. ([#372](https://github.com/CroquetScores/croquetscores.com/pull/372), [#376](https://github.com/CroquetScores/croquetscores.com/pull/376))

- **A world ranking officer or an administrator can email a tournament's managers.** On the **Managers** tab they are offered **Email Managers**, a link that opens a new email to every manager of the tournament, with the subject "Croquet Scores". Nothing is sent from the site. An officer sees the tab for any tournament of the sport they look after, to read the managers and write to them but not to change them, and a manager is not shown anyone's email address. See [Managers and scorers](../tournament-managers/standard-tournament/managers-and-scorers.md). ([#369](https://github.com/CroquetScores/croquetscores.com/pull/369))

- **A one-day tournament is dated by that day in the rankings file.** It was written as a range of one day, `3-3.10.26`, and is now `3.10.26`, as the world rankings' own lists write a single day. A tournament of more than one day is dated as before. See [Rankings](../tournament-managers/standard-tournament/rankings.md). ([#368](https://github.com/CroquetScores/croquetscores.com/pull/368))

- **Tournaments brought over from the old sites are more faithful.** A tournament's country is now taken from the world rankings' lists of Association Croquet and Golf Croquet events when they have it, instead of from its time zone ([#366](https://github.com/CroquetScores/croquetscores.com/pull/366)). Two more changes ([#377](https://github.com/CroquetScores/croquetscores.com/pull/377)) apply to the next import:
  - Players are brought over from each competition's own list, and found by their exact name among the tournament's players. The old sites copied a tournament's players into every competition and let a manager change the copy, so a pair entered in a doubles competition as "Joe Hogan & Levi Franks" was joined to Joe Hogan alone. It is now a player of its own. A player who is in no competition is no longer brought over.
  - A competition that says what a player represents sets it when the player represented nothing, and one that disagrees afterwards does not change it. A block kept as the best of 2, or of 3 with every pair going to a third game, now keeps it. It is made the best of 1 only where a pair's match would have been decided before their last game, which the site would refuse the rest of.

- **Behind the scenes.** The import can be asked for only the tournaments that started between two days ([#374](https://github.com/CroquetScores/croquetscores.com/pull/374)), and now says what it did in a file for each kind of correction, one of its errors, and a summary of every import, all in the docs folder of the repository (also [#377](https://github.com/CroquetScores/croquetscores.com/pull/377)). Four more Golf Croquet world ranking officers are named in it ([#367](https://github.com/CroquetScores/croquetscores.com/pull/367)), and the site's own address is an Association Croquet officer and no longer an administrator ([#375](https://github.com/CroquetScores/croquetscores.com/pull/375)). Scenarios that failed now and then, or had fallen behind the site, were put right ([#359](https://github.com/CroquetScores/croquetscores.com/pull/359), [#373](https://github.com/CroquetScores/croquetscores.com/pull/373)).

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
