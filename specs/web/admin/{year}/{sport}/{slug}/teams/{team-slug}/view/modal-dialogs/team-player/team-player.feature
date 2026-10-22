@browser @postgres
Feature: A player is added to a team, or changed, in a modal dialog

  A manager adds the players to a team from the team's page, by pressing "Add
  Player", and changes one by pressing their name or their Edit
  (`team-players.feature`). Either opens the team player dialog over the
  page. It asks for what a player in a team is (`TeamPlayer.feature`): their
  name and, beneath it, the name the world rankings know them by, headed
  "World Ranking Player Name" (`WorldRankingName.feature`).

  It is the player dialog of a Standard tournament (`player.feature`) without
  its Representing and its Flag, and asks for the world ranking name as that
  does, in a tournament of association or golf croquet alone: following the name while a player is added until it is typed in,
  kept as the name when left empty, and left as it is when a player's name is
  corrected, since a player in a team represents their
  team and the team flies the flag (`TeamPlayer.feature`). It asks for the
  name the same way, so that a manager who has used one has used the other:
  titled "Add Player" with Add, or "Edit Player" with Save; Add keeping the
  dialog open and emptying it for the next, Save closing it; and Cancel and
  Escape keeping nothing. What the player dialog says of how it sits over the
  page, and is laid out and read, is said of this one, and is not said again
  here.

  In a tournament of association or golf croquet it offers the world
  ranking players as the name and the world ranking name are typed, and marks
  the world ranking name with a tick or a question mark, as the player dialog
  does. That it does is said here; how is said there.

  This says what is its own. The player is added to the team whose page it
  was opened from, and to no other. A name another player in the same team
  has is refused beneath the name, with `Team.PlayerNameTaken`, however it is
  capitalised; a name a player in another team has is not, since a player is
  always chosen from their team (`addTeamPlayer.feature`).

  A player in a team is never named as a bye (`TeamPlayer.feature`). The
  player dialog explains its refusal in a dialog of its own, since a manager
  who types a bye there is looking for a knockout's byes, which are offered
  where its players are entered. A test has no byes to point the reader to,
  so there is nothing to explain beyond the refusal: a name that is a bye, or
  a bye numbered, is refused beneath the name, with `TeamPlayer.NamedBye`, as any
  other name that breaks a rule is, and the dialog about byes does not open.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

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

  Rule: The dialog asks what the player dialog asks

    Scenario: Add Player opens the dialog titled for what it does
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog is titled "Add Player"

    Scenario Outline: The dialog asks for a player's name
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog asks for "<field>"

      Examples:
        | field                     |
        | Name                      |
        | World Ranking Player Name |

    Scenario: The world ranking name is asked for beneath the name
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the field after "Name" in the team player dialog is "World Ranking Player Name"

    Scenario Outline: The dialog asks for nothing more of a player
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog does not ask for "<field>"

      Examples:
        | field        |
        | Representing |
        | Flag         |

    Scenario: The dialog is announced as a modal dialog
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog is announced as a modal dialog

    Scenario: Opening the dialog leaves the address as it was
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the address is "/admin/2026/ac/spring-tests/teams/aus"

    Scenario: The reader is put in the name when the dialog opens
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then "Name" has the focus

  Rule: Add adds the player to the team the page is of

    Scenario: The player added is one of the team's players
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" has the player "Sam Someone"

    Scenario: The player added is not another team's
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the team "England" of "Spring Tests" does not have the player "Sam Someone"

    Scenario: Adding leaves the dialog open
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the team player dialog is open

    Scenario: Adding says who was added
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the team player dialog says "Sam Someone" was added

    Scenario: Adding empties the name
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is empty

    Scenario: A tournament of another sport asks for no world ranking name
      Given the tournament "Spring Tests" is for the sport "rc"
      And the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog does not ask for "World Ranking Player Name"

    Scenario: A tournament of American 6 Wicket asks for no world ranking name
      Given the tournament "Spring Tests" is for the sport "a6w"
      And the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog does not ask for "World Ranking Player Name"

    Scenario: The world ranking name follows the name as it is typed
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When "Sam Someone" is typed as the "Name"
      Then "World Ranking Player Name" says "Sam Someone"

    Scenario: A world ranking name typed in no longer follows the name
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Sam Someones" is typed as the "Name"
      Then "World Ranking Player Name" says "Samuel Someone"

    Scenario: The player added has the world ranking name typed
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Add" is pressed
      Then the player "Sam Someone" of the team "Australia" of "Spring Tests" has the world ranking name "Samuel Someone"

    Scenario: The player added with the world ranking name left to follow has their name
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the player "Sam Someone" of the team "Australia" of "Spring Tests" has the world ranking name "Sam Someone"

  Rule: Save keeps the change and closes the dialog

    Scenario: The world ranking name is the player's
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      When the name of the player "Sam Someone" is pressed
      Then "World Ranking Player Name" says "Samuel Someone"

    Scenario: A renamed player keeps their world ranking name
      Given the player is to have the world ranking name "Samuel Someone"
      And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the player "Samantha Someone" of the team "Australia" of "Spring Tests" has the world ranking name "Samuel Someone"

    Scenario: A world ranking name changed is kept
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And the name of the player "Sam Someone" is pressed
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Save" is pressed
      Then the player "Sam Someone" of the team "Australia" of "Spring Tests" has the world ranking name "Samuel Someone"

    Scenario: A renamed player is kept by their new name
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the team "Australia" of "Spring Tests" has the player "Samantha Someone"

    Scenario: Saving closes the dialog
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And the name of the player "Sam Someone" is pressed
      And "Samantha Someone" is typed as the "Name"
      When "Save" is pressed
      Then the team player dialog is not open

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: Cancelling adds nobody
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Cancel" is pressed
      Then the team "Australia" of "Spring Tests" has no players

    Scenario: Escape closes the dialog
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When Escape is pressed
      Then the team player dialog is not open

    Scenario: The reader is back on Add Player once the dialog is cancelled
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When "Cancel" is pressed
      Then "Add Player" has the focus

  Rule: A name is refused where the team refuses it, and only there

    Scenario Outline: A name that could not be a person's is refused beside the name
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "<name>" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "<code>"

      Examples:
        | name | code                |
        |      | PersonName.Missing  |
        | Sa   | PersonName.TooShort |

    Scenario: A name another player in the team has is refused beside the name
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "SAM SOMEONE" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "Team.PlayerNameTaken"

    Scenario: A name a player in another team has is added
      Given "organiser@example.com" has added the player "Sam Someone" to the team "England" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" has the player "Sam Someone"

    Scenario: A world ranking name that could not be one is refused beside it
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sam Someone" is typed as the "Name"
      And "Sa" is typed as the "World Ranking Player Name"
      When "Add" is pressed
      Then "World Ranking Player Name" is refused with "WorldRankingName.TooShort"

    Scenario: A refused dialog stays open
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      When "Add" is pressed
      Then the team player dialog is open

  Rule: A name that is a bye is refused beneath the name

    Scenario Outline: A name as a bye is refused beside the name
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "<name>" is typed as the "Name"
      When "Add" is pressed
      Then "Name" is refused with "TeamPlayer.NamedBye"

      Examples:
        | name        |
        | Bye         |
        | Bye 2       |
        | Bye (2)     |

    Scenario: A player named as a bye is not added
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" has no players

    Scenario: A player named as a bye opens no dialog about byes
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Bye" is typed as the "Name"
      When "Add" is pressed
      Then the dialog about byes is not open

    Scenario: A player renamed as a bye keeps their name
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And the page of the team "Australia" in "Spring Tests" is open
      And the name of the player "Sam Someone" is pressed
      And "Bye 2" is typed as the "Name"
      When "Save" is pressed
      Then the team "Australia" of "Spring Tests" has the player "Sam Someone"

    Scenario Outline: A name with "bye" in it that is not a bye is added
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "<name>" is typed as the "Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" has the player "<name>"

      Examples:
        | name          |
        | Byers Kim     |
        | Bye / Bassett |
        | Bye Someone   |

  Rule: The dialog offers the world ranking players and marks the world ranking name as the player dialog does

    Scenario: Typing in the name offers the world ranking players
      Given the association croquet players include "Keith Aiton"
      And the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When "Kei" is typed as the "Name"
      Then "Name" offers "Keith Aiton"

    Scenario: Typing in the world ranking name offers the world ranking players
      Given the association croquet players include "Keith Aiton"
      And the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When "Kei" is typed as the "World Ranking Player Name"
      Then "World Ranking Player Name" offers "Keith Aiton"

    Scenario: A world ranking name the world rankings know is ticked
      Given the association croquet players include "Keith Aiton"
      And the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When "Keith Aiton" is typed as the "Name"
      Then the world ranking name is ticked

    Scenario: A world ranking name the world rankings do not know is questioned
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      When "Sam Someone" is typed as the "Name"
      Then the world ranking name is questioned

  Rule: Every word the dialog says is in the reader's language

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the page of the team "Australia" in "Spring Tests" is open
      When the way to add a player is pressed
      Then every word in the team player dialog is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the page of the team "Australia" in "Spring Tests" is open
      When "Add Player" is pressed
      Then the team player dialog is no wider than the window

  Rule: A world ranking officer who does not manage the tournament changes the world ranking name alone

    Scenario: The name is shown and cannot be changed
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of the team "Australia" in "Spring Tests" is open
      When the name of the player "Sam Someone" is pressed
      Then "Name" cannot be changed

    Scenario: The world ranking name can be changed
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of the team "Australia" in "Spring Tests" is open
      When the name of the player "Sam Someone" is pressed
      Then "World Ranking Player Name" can be changed

    Scenario: The world ranking name changed is kept
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "ranker@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "ranker@example.com" has been given the role "World Ranking Officer"
      And the reader has signed in as "ranker@example.com" with the password "another horse battery staple"
      And the page of the team "Australia" in "Spring Tests" is open
      And the name of the player "Sam Someone" is pressed
      And "Samuel Someone" is typed as the "World Ranking Player Name"
      When "Save" is pressed
      Then the player "Sam Someone" of the team "Australia" of "Spring Tests" has the world ranking name "Samuel Someone"
