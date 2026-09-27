@browser @postgres
Feature: The players tab of a tournament's page

  The Players tab is where a manager sees a tournament's players, adds them,
  corrects them, archives the ones entered by mistake or who withdrew, and
  restores them (`view.feature`). It is the tab the page opens on, since
  entering the players is the first thing done to a tournament.

  Add Player, above the list, opens the player dialog to add players, and a
  player's name opens it to change them (`player.feature`). Whenever the
  dialog adds a player or saves one, the list is asked for again, so that it
  says who the players are now.

  The players in use come first, in order of their names as a reader looks
  for a name (`PlayersOfTournament.feature`). Each says their name, what they
  represent and the flag they fly, where they have either, and offers
  Archive. The flag is shown as its picture, beside the name, and is named for
  a reader who cannot see it by the country it is the flag of, in the
  reader's language.

  A player who has played any games cannot be archived, since the games would
  then be against somebody who is no longer there (`archivePlayer.feature`),
  so such a player is not offered Archive. Nothing records games yet, so today
  every player is offered it.

  The archived players come after those in use, under a heading of their own,
  in order of their names. Each is struck through, and says in words that
  they are archived as well, since a line through a name is not read out.
  Each offers Restore alone, since an archived player can only be restored,
  and so their name does not open the dialog to change them.

  Archive and Restore do not ask first: each is undone by the other, and
  nothing is lost by either. Whatever is pressed, the list is asked for again.

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

  Rule: The players in use are listed in order of their names

    Scenario: A player added is listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is listed

    Scenario: The players are in order of their names
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the first player listed is "Alex Another"

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

  Rule: Add Player and a player's name open the player dialog

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

  Rule: A player who has played is not offered Archive

    Scenario: A player who has not played is offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" offers "Archive"

    Scenario: A player who has played is not offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And games that say the player "Sam Someone" in "Spring Open" has played
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" does not offer "Archive"

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

    Scenario: The archived players are in order of their names
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
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

    Scenario: An archived player's name does not open the dialog
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of "Spring Open" are opened
      Then the name of the player "Sam Someone" cannot be pressed

  Rule: Archive and Restore move a player between those in use and the archived

    Scenario: Archiving a player lists them among the archived
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the players of "Spring Open" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the player "Sam Someone" is listed among the archived

    Scenario: Archiving does not ask first
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
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

    Scenario: A restored player is back in order of their name
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      And the players of "Spring Open" are open
      When "Restore" is pressed on the player "Alex Another"
      Then the first player listed is "Alex Another"

    Scenario: A player restored from the tab is kept restored
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And the players of "Spring Open" are open
      And "Restore" is pressed on the player "Sam Someone"
      When the players of "Spring Open" are opened
      Then the player "Sam Someone" is not listed among the archived

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A player's name and what
    they represent are what the manager typed, and nobody's language. A
    flag's name is a word of the reader's language, and is looked at.

    Scenario: The players in use are in the reader's language
      Given a browser that asks for "en-XA"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
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
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the players of "Spring Open" are opened
      Then "<option>" on the player "<player>" is at least 44 pixels tall

      Examples:
        | player       | option  |
        | Sam Someone  | Archive |
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
