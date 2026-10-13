@browser @postgres
Feature: The players tab of a tournament's page

  The Players tab is where a manager sees a tournament's players, adds them,
  corrects them, puts them in order, archives the ones entered by mistake or
  who withdrew, and restores them (`view.feature`). It is the tab the page opens on, since
  entering the players is the first thing done to a tournament.

  Add Player, above the list, opens the player dialog to add players, and a
  player's name or their Edit opens it to change them (`player.feature`).
  Edit Tournament, after Add Player, leads to the page that edits the
  tournament itself (`edit.feature`), so that a manager who has just entered
  the players and sees something about the tournament that is wrong need not
  go back to the list of tournaments to change it. It is a manager's, as
  Add Player is: a world ranking officer shown the players has no tournament
  to edit.
  Edit says in a button what the name does as a link, for a reader who does
  not think to press a name, and comes before Archive, as it does for a
  competition, so that changing a player is offered ahead of setting them
  aside. Whenever the
  dialog adds a player or saves one, the list is asked for again, so that it
  says who the players are now.

  The players in use come first, in the tournament's order
  (`PlayersOfTournament.feature`), which is the order they are entered in its
  competitions in. Each says their name, what they represent and the flag
  they fly, where they have either, and offers Edit, Archive, Up and Down. They are
  said in that order, as "Sam Someone (Canterbury Croquet Club)" and then the
  flag. The flag is shown as its picture, and is named for a reader who cannot
  see it by the country it is the flag of, in the reader's language.

  A player who has played any games in use cannot be archived, since the
  games would then be against somebody who is no longer there
  (`archivePlayer.feature`), so such a player is not offered Archive. An
  archived game counts for nothing, so a player whose only games are archived
  is offered Archive, and their archived games go with them
  (`ArchivePlayer.feature`).

  The archived players come after those in use, under a heading of their own,
  in the order they were archived, since each is put last when archived
  (`archivePlayer.feature`). Each is struck through, and says in words that
  they are archived as well, since a line through a name is not read out.
  Each offers Restore alone, since an archived player can only be restored,
  and so their name does not open the dialog to change them.

  Up and Down are shown as arrows pointing up and down, and are named "Up" and
  "Down" for a reader who cannot see them. They come last of what a row offers,
  so that they are in the same place on every row.

  Up and Down move a player one place among those in use, putting them just
  before the player above or just after the player below
  (`movePlayer.feature`). The first is not offered Up and the last is not
  offered Down, since there is nowhere for them to go, so a single player is
  offered neither. Archive puts a player among the archived, last, and Restore
  puts them back among those in use, after those that stayed there
  (`restorePlayer.feature`).

  Archiving a player removes them from every competition they are in,
  archived competitions among them, and restoring them does not put them back
  (`ArchivePlayer.feature`). So Archive on a player who is in any competition
  asks first, in a modal dialog (`STYLE.md`) titled Archive Player, that names
  the player, lists the competitions they will be removed from in the
  tournament's order, says that restoring them will not put them back, and
  offers Archive and Cancel. Cancel archives nobody. A player who is in no
  competition loses nothing by being archived, so Archive does not ask.

  Up, Down and Restore do not ask first either: each is undone by pressing
  the other way, and nothing is lost by any of them. Whatever is pressed, the
  list is asked for again.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page, whose first tab this is, which is what opening the
  players of a tournament does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: The players in use are listed in the tournament's order

    Scenario: A player added is listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is listed

    Scenario: The players are in the tournament's order
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has moved the player "Alex Another" in "Spring Open" up
      When the players of "Spring Open" are opened
      Then the first player listed is "Alex Another"

    Scenario: The players are not in order of their names
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the first player listed is "Sam Someone"

    Scenario: A tournament with no players says so
      When the players of "Spring Open" are opened
      Then the tab says there are no players

  Rule: Each player says what they represent and the flag they fly

    Scenario: A player says what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is shown representing "Canterbury Croquet Club"

    Scenario: A player representing nothing says nothing of it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is shown representing nothing

    Scenario: A player shows the flag they fly
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is shown flying the flag "nz"

    Scenario: A flag is named by its country, for a reader who cannot see it
      Given the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the flag of the player "Sam Someone" is named "New Zealand"

    Scenario: A flag is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And the player is to fly the flag "de"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the flag of the player "Sam Someone" is named "Alemania"

    Scenario: A player flying no flag shows none
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is shown flying no flag

  Rule: Edit Tournament, after Add Player, leads to editing the tournament

    Scenario: The tab offers Edit Tournament
      When the players of "Spring Open" are opened
      Then the tab offers "Edit Tournament"

    Scenario: Edit Tournament is after Add Player
      When the players of "Spring Open" are opened
      Then "Edit Tournament" is after "Add Player"

    Scenario: Edit Tournament is above the players
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then "Edit Tournament" is above the players

    Scenario: Edit Tournament leads to editing the tournament
      Given the players of "Spring Open" are open
      When "Edit Tournament" is pressed
      Then the address is "/admin/2026/ac/spring-open/edit"

    Scenario: A world ranking officer is not offered Edit Tournament
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the tab does not offer "Edit Tournament"

  Rule: Add Player, a player's name and Edit open the player dialog

    Scenario: The tab offers Add Player
      When the players of "Spring Open" are opened
      Then the tab offers "Add Player"

    Scenario: Add Player is above the players
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then "Add Player" is above the players

    Scenario: Add Player opens the dialog to add a player
      Given the players of "Spring Open" are open
      When "Add Player" is pressed
      Then the player dialog is titled "Add Player"

    Scenario: A player's name opens the dialog to change them
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      When the name of the player "Sam Someone" is pressed
      Then the player dialog is titled "Edit Player"

    Scenario: Edit opens the dialog to change them
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      When "Edit" is pressed on the player "Sam Someone"
      Then the player dialog is titled "Edit Player"

    Scenario: A player renamed from Edit is listed by their new name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      And "Edit" is pressed on the player "Sam Someone"
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" is listed

    Scenario: A player added in the dialog is listed
      Given the players of "Spring Open" are open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" is listed

    Scenario: A player added in the dialog no longer leaves the tab saying there are none
      Given the players of "Spring Open" are open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the tab does not say there are no players

    Scenario: A player renamed in the dialog is listed by their new name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" is listed

  Rule: What a player offers is what can be done to them

    Scenario Outline: A player in use offers what can be done to them
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Alex Another" offers "<option>"

      Examples:
        | option  |
        | Edit    |
        | Up      |
        | Down    |
        | Archive |

    Scenario: Edit comes before Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then "Edit" on the player "Sam Someone" comes before "Archive"

    Scenario: The first player does not offer Up
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Up"

    Scenario: The last player does not offer Down
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Alex Another" does not offer "Down"

    Scenario: The last in use does not offer Down though an archived one comes after them
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Down"

    Scenario Outline: An archived player does not offer to move
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Alex Another" does not offer "<option>"

      Examples:
        | option |
        | Up     |
        | Down   |

  Rule: A player who has played a game in use is not offered Archive

    Scenario: A player who has not played is offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" offers "Archive"

    Scenario: A player who has played is not offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Archive"

    Scenario: A player whose only game is archived is offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" offers "Archive"

    Scenario: A player in use does not offer Restore
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Restore"

  Rule: The archived players are listed after those in use, struck through

    Scenario: An archived player is listed among the archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is listed among the archived

    Scenario: An archived player is not listed among those in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is not listed among those in use

    Scenario: The archived players come after those in use
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Alex Another" is listed after "Sam Someone"

    Scenario: The archived players are in the order they were archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Alex Another" is listed before "Sam Someone"

    Scenario: The archived players are under a heading of their own
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the archived players are headed "Archived players"

    Scenario: No heading for the archived is shown where none is archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then no heading for the archived players is shown

    Scenario: An archived player is struck through
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is struck through

    Scenario: A player in use is not struck through
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is not struck through

    Scenario: An archived player is said to be archived to a screen reader
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is announced as archived

    Scenario: An archived player still shows what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is shown representing "Canterbury Croquet Club"

    Scenario: An archived player offers Restore
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" offers "Restore"

    Scenario: An archived player does not offer Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Archive"

    Scenario: An archived player does not offer Edit
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Edit"

    Scenario: An archived player's name does not open the dialog
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the name of the player "Sam Someone" cannot be pressed

  Rule: Up and Down move a player a place

    Scenario: Up moves a player before the player above
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the players of "Spring Open" are open
      When "Up" is pressed on the player "Alex Another"
      Then the first player listed is "Alex Another"

    Scenario: Down moves a player after the player below
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the players of "Spring Open" are open
      When "Down" is pressed on the player "Sam Someone"
      Then the first player listed is "Alex Another"

    Scenario: A player moved is kept in their new place
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the players of "Spring Open" are open
      And "Up" is pressed on the player "Alex Another"
      When the players of "Spring Open" are opened
      Then the first player listed is "Alex Another"

    Scenario: A player moved to the top no longer offers Up
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the players of "Spring Open" are open
      When "Up" is pressed on the player "Alex Another"
      Then the player "Alex Another" does not offer "Up"

    Scenario: Moving does not ask first
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the players of "Spring Open" are open
      When "Up" is pressed on the player "Alex Another"
      Then no modal dialog is open

  Rule: Archive and Restore move a player between those in use and the archived

    Scenario: Archiving a player lists them among the archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the player "Sam Someone" is listed among the archived

    Scenario: Archiving a player in no competition does not ask first
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then no modal dialog is open

    Scenario: A player archived from the tab is kept archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is listed among the archived

    Scenario: Restoring a player lists them among those in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And the players of "Spring Open" are open
      When "Restore" is pressed on the player "Sam Someone"
      Then the player "Sam Someone" is not listed among the archived

    Scenario: A restored player comes after those that stayed in use
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      And the players of "Spring Open" are open
      When "Restore" is pressed on the player "Alex Another"
      Then the first player listed is "Sam Someone"

    Scenario: A player restored from the tab is kept restored
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And the players of "Spring Open" are open
      And "Restore" is pressed on the player "Sam Someone"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is not listed among the archived

  Rule: Archiving a player who is in a competition asks first

    Scenario: Archiving a player in a competition asks first
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog titled "Archive Player" is open

    Scenario: Asking first names the player
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog names "Sam Someone"

    Scenario: Asking first names the competition they will be removed from
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog names "Block A"

    Scenario: Asking first names each competition they will be removed from
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog names "Block B"

    Scenario: Asking first does not name a competition they are not in
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog does not name "Block B"

    Scenario: Asking first names the competitions in the tournament's order
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog names "Block B" before "Block A"

    Scenario: Asking first names an archived competition they will be removed from
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog names "Block A"

    Scenario: Asking first names a competition they withdrew from
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog names "Block A"

    Scenario: Asking first says restoring will not put them back
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog says the words for "admin.players.archive.explanation"

    Scenario: Asking first offers Archive first
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog's first button is "Archive"

    Scenario: Asking first offers Cancel
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the modal dialog's second button is "Cancel"

  Rule: Archive in the modal dialog archives the player

    Scenario: Archiving in the modal dialog lists the player among the archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      When "Archive" is pressed in the modal dialog
      Then the player "Sam Someone" is listed among the archived

    Scenario: A player archived in the modal dialog is kept archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      And "Archive" is pressed in the modal dialog
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is listed among the archived

    Scenario: Archiving in the modal dialog closes it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      When "Archive" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: Cancel in the modal dialog archives nobody

    Scenario: Cancelling leaves the player in use
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      When "Cancel" is pressed in the modal dialog
      Then the player "Sam Someone" is not listed among the archived

    Scenario: Cancelling leaves the player in use when the tab is opened again
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      And "Cancel" is pressed in the modal dialog
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is not listed among the archived

    Scenario: Cancelling closes the modal dialog
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      And "Archive" is pressed on the player "Sam Someone"
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A player's name and what
    they represent are what the manager typed, and nobody's language. A
    flag's name is a word of the reader's language, and is looked at.

    Scenario: The players in use are in the reader's language
      Given a browser that asks for "en-XA"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the players of "Spring Open" are opened
      Then every word in the tab but the players' own is in the test locale

    Scenario: A flag is named in the reader's language
      Given a browser that asks for "en-XA"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the flag of the player "Sam Someone" is named in the test locale

    Scenario: The archived players are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then every word in the tab but the players' own is in the test locale

    Scenario: Asking before archiving is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the players of "Spring Open" are open
      When the way to archive the player "Sam Someone" is pressed
      Then every word in the modal dialog but the player's and the competitions' names is in the test locale

    Scenario: A tournament with no players says so in the reader's language
      Given a browser that asks for "en-XA"
      When the players of "Spring Open" are opened
      Then every word in the tab but the players' own is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Player can be pressed with a thumb
      When the players of "Spring Open" are opened
      Then the button "Add Player" is at least 44 pixels tall

    Scenario Outline: What a player offers can be pressed with a thumb
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the players of "Spring Open" are opened
      Then "<option>" on the player "<player>" is at least 44 pixels tall

      Examples:
        | player       | option  |
        | Sam Someone  | Archive |
        | Sam Someone  | Down    |
        | Pat Player   | Up      |
        | Alex Another | Restore |

    Scenario: A player's name can be pressed with a thumb
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the name of the player "Sam Someone" is at least 44 pixels tall

    Scenario: A long name wraps rather than widening the page
      Given the player is to represent "The Very Long Named Croquet And Lawn Bowls Club Of The Northern Districts"
      And "organiser@example.com" has added the player "Maximilian Alexander Fitzwilliam-Worthington" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the page is no wider than the window

  Rule: A world ranking officer who does not manage the tournament is shown its players to change their world ranking names alone

    An account that holds the World Ranking Officer role may change any
    player's world ranking name, and nothing else (`changeWorldRankingName.feature`).
    So where it does not manage the tournament it is shown every player, in
    use and archived, as a manager is, but offered no way to add a player, nor
    to archive, restore or move one: only Edit, and a name to press, which
    open the player dialog to change the world ranking name
    (`player.feature`).

    Scenario: A world ranking officer is shown the players
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the player "Sam Someone" is listed

    Scenario: A world ranking officer is shown the archived players
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the player "Sam Someone" is listed among the archived

    Scenario: A world ranking officer is not offered Add Player
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the tab does not offer "Add Player"

    Scenario Outline: A world ranking officer is offered nothing but Edit
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the player "Sam Someone" does not offer "<option>"

      Examples:
        | option  |
        | Archive |
        | Up      |
        | Down    |

    Scenario: A world ranking officer is offered Edit
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the player "Sam Someone" offers "Edit"

    Scenario: A world ranking officer is not offered Restore
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of "Spring Open" are open
      Then the player "Sam Someone" does not offer "Restore"
