@browser @postgres
Feature: The players of a team, on the team's page

  A team's page (`view.feature` beneath the team) lists the team's players,
  and is where a manager adds them, corrects them, puts them in order,
  archives the ones entered by mistake and restores them. It works as the
  Players tab of a Standard tournament does (`players-tab.feature`), for the
  team's players rather than the tournament's, and what is said there is said
  here unless this says otherwise.

  Add Player, above the list, opens the team player dialog to add players to
  the team, and a player's name or their Edit opens it to change them
  (`team-player.feature`). Whenever the dialog adds a player or saves one,
  the list is asked for again.

  The players in use come first, in the team's order
  (`PlayersOfTeam.feature`). Each says their name alone: a player in a team
  represents their team and flies no flag of their own (`TeamPlayer.feature`),
  and the team, with its flag, heads the page (`view.feature` beneath the
  team). Each offers Edit, Archive, Up and Down, Up and Down last and shown as
  arrows. Up and Down move a player a place among the team's players in use
  (`moveTeamPlayer.feature`); another team's players are no part of it.

  A player who has played any games in use in a test cannot be archived
  (`archiveTeamPlayer.feature`), so such a player is not offered Archive; a
  player whose only games are archived is. A player in a team is in no
  competition (`TeamPlayer.feature`), so archiving one takes them out of
  nothing, and Archive never asks first, as it does on the Players tab for a
  player who is in a competition.

  The archived players come after those in use, under a heading of their own,
  in the order they were archived. Each is struck through, says in words that
  they are archived, and offers Restore alone, so their name does not open
  the dialog.

  Up, Down, Archive and Restore do not ask first: each is undone by pressing
  the other way, and nothing is lost by any of them. Whatever is pressed, the
  list is asked for again.

  The list is the page's, so a scenario opens the team's page, which is what
  opening the players of a team does. Unless a scenario says otherwise, a
  team's short name is the first three letters of its name in capitals
  (`Team.feature`).

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the tournament "Spring Tests" starts on "2026-10-03"
    And the tournament "Spring Tests" is for the sport "ac"
    And the tournament "Spring Tests" is played in the format "Teams"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"

  Rule: The team's players in use are listed in the team's order

    Scenario: A player added is listed
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is listed

    Scenario: Another team's player is not listed
      Given "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Chris Third" is not listed

    Scenario: The players are in the team's order
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has moved the player "Alex Another" of the team "Australia" of "Spring Tests" up
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the first player listed is "Alex Another"

    Scenario: A team with no players says so
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the page says there are no players

  Rule: Each player says their name alone

    Scenario: A player is shown representing nothing of their own
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is shown representing nothing

    Scenario: A player shows no flag
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is shown flying no flag

  Rule: Add Player, a player's name and Edit open the team player dialog

    Scenario: The page offers Add Player
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the page offers "Add Player"

    Scenario: Add Player is above the players
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then "Add Player" is above the players

    Scenario: Add Player opens the dialog to add a player
      Given the players of the team "Australia" in "Spring Tests" are open
      When "Add Player" is pressed
      Then the team player dialog is titled "Add Player"

    Scenario: A player's name opens the dialog to change them
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      When the name of the player "Sam Someone" is pressed
      Then the team player dialog is titled "Edit Player"

    Scenario: Edit opens the dialog to change them
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      When "Edit" is pressed on the player "Sam Someone"
      Then the team player dialog is titled "Edit Player"

    Scenario: A player added in the dialog is listed
      Given the players of the team "Australia" in "Spring Tests" are open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" is listed

    Scenario: A player renamed in the dialog is listed by their new name
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      And "Edit" is pressed on the player "Sam Someone"
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" is listed

  Rule: What a player offers is what can be done to them

    Scenario Outline: A player in use offers what can be done to them
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Alex Another" offers "<option>"

      Examples:
        | option  |
        | Edit    |
        | Archive |
        | Up      |
        | Down    |

    Scenario: The first player does not offer Up
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" does not offer "Up"

    Scenario: The last player does not offer Down
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Alex Another" does not offer "Down"

  Rule: A player who has played a game in use is not offered Archive

    Scenario: A player who has played is not offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" does not offer "Archive"

    Scenario: A player whose only game is archived is offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" offers "Archive"

  Rule: The archived players are listed after those in use, struck through

    Scenario: An archived player is listed among the archived
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is listed among the archived

    Scenario: The archived players are under a heading of their own
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the archived players are headed "Archived players"

    Scenario: An archived player is struck through
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is struck through

    Scenario: An archived player is said to be archived to a screen reader
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is announced as archived

    Scenario Outline: An archived player offers nothing but Restore
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" does not offer "<option>"

      Examples:
        | option  |
        | Edit    |
        | Archive |
        | Up      |
        | Down    |

    Scenario: An archived player offers Restore
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" offers "Restore"

    Scenario: An archived player's name does not open the dialog
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the name of the player "Sam Someone" cannot be pressed

  Rule: Up and Down move a player a place in the team

    Scenario: Up moves a player before the player above
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      When "Up" is pressed on the player "Alex Another"
      Then the first player listed is "Alex Another"

    Scenario: A player moved is kept in their new place
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      And "Up" is pressed on the player "Alex Another"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the first player listed is "Alex Another"

  Rule: Archive and Restore move a player between those in use and the archived, without asking

    Scenario: Archiving a player lists them among the archived
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then the player "Sam Someone" is listed among the archived

    Scenario: Archiving a player does not ask first
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      When "Archive" is pressed on the player "Sam Someone"
      Then no modal dialog is open

    Scenario: A player archived from the page is kept archived
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      And "Archive" is pressed on the player "Sam Someone"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the player "Sam Someone" is listed among the archived

    Scenario: Restoring a player lists them among those in use
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Sam Someone" of the team "Australia" of "Spring Tests"
      And the players of the team "Australia" in "Spring Tests" are open
      When "Restore" is pressed on the player "Sam Someone"
      Then the player "Sam Someone" is not listed among the archived

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). A player's name is what
    the manager typed, and nobody's language.

    Scenario: The players are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Alex Another" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then every word in the list but the players' own is in the test locale

    Scenario: A team with no players says so in the reader's language
      Given a browser that asks for "en-XA"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then every word in the list but the players' own is in the test locale

  Rule: The list is laid out for a phone first

    Scenario: Add Player can be pressed with a thumb
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the button "Add Player" is at least 44 pixels tall

    Scenario Outline: What a player offers can be pressed with a thumb
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Alex Another" of the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then "<option>" on the player "<player>" is at least 44 pixels tall

      Examples:
        | player       | option  |
        | Sam Someone  | Edit    |
        | Sam Someone  | Archive |
        | Sam Someone  | Down    |
        | Pat Player   | Up      |
        | Alex Another | Restore |

    Scenario: A long name wraps rather than widening the page
      Given "organiser@example.com" has added the player "Maximilian Alexander Fitzwilliam-Worthington" to the team "Australia" of "Spring Tests"
      When the players of the team "Australia" in "Spring Tests" are opened
      Then the page is no wider than the window

  Rule: A world ranking officer who does not manage the tournament is shown the team's players to change their world ranking names alone

    As on a Standard tournament's Players tab (`players-tab.feature`), a world
    ranking officer who does not manage the tournament is shown every player
    of the team, offered only Edit, and a name to press, which open the team
    player dialog to change the world ranking name alone
    (`team-player.feature`).

    Scenario: A world ranking officer is shown the team's players
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of the team "Australia" in "Spring Tests" are open
      Then the first player listed is "Sam Someone"

    Scenario: A world ranking officer is not offered Add Player
      Given "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of the team "Australia" in "Spring Tests" are open
      Then the page does not offer "Add Player"

    Scenario: A world ranking officer is offered nothing but Edit
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of the team "Australia" in "Spring Tests" are open
      Then the player "Sam Someone" does not offer "Archive"

    Scenario: A world ranking officer is offered Edit
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "AC World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      When the players of the team "Australia" in "Spring Tests" are open
      Then the player "Sam Someone" offers "Edit"
