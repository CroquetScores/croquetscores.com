@browser @postgres
Feature: A player is added to a team, or changed, in a modal dialog

  A manager adds the players to a team from the team's page, by pressing "Add
  Player", and changes one by pressing their name or their Edit
  (`team-players.feature`). Either opens the team player dialog over the
  page. It asks for what a player in a team is (`TeamPlayer.feature`): their
  name.

  It is the player dialog of a Standard tournament (`player.feature`) without
  its Representing and its Flag, since a player in a team represents their
  team and the team flies the flag (`TeamPlayer.feature`). It asks for the
  name the same way, so that a manager who has used one has used the other:
  titled "Add Player" with Add, or "Edit Player" with Save; Add keeping the
  dialog open and emptying it for the next, Save closing it; and Cancel and
  Escape keeping nothing. What the player dialog says of how it sits over the
  page, and is laid out and read, is said of this one, and is not said again
  here.

  This says what is its own. The player is added to the team whose page it
  was opened from, and to no other. A name another player in the same team
  has is refused beneath the name, with `Team.PlayerNameTaken`, however it is
  capitalised; a name a player in another team has is not, since a player is
  always chosen from their team (`addTeamPlayer.feature`).

  A player in a team is never named as a bye (`TeamPlayer.feature`). The
  player dialog explains its refusal in a dialog of its own, since a manager
  who types a bye there is looking for a knockout's byes, which are offered
  where its players are entered. A test has no byes to point the reader to,
  so there is nothing to explain beyond the refusal: a name whose first word
  is "bye" is refused beneath the name, with `TeamPlayer.NamedBye`, as any
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
        | field |
        | Name  |

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

  Rule: Save keeps the change and closes the dialog

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

    Scenario: A refused dialog stays open
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Sa" is typed as the "Name"
      When "Add" is pressed
      Then the team player dialog is open

  Rule: A name whose first word is "bye" is refused beneath the name

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
        | Bye Someone |

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

    Scenario: A name with "bye" in it but not as its first word is added
      Given the page of the team "Australia" in "Spring Tests" is open
      And "Add Player" is pressed
      And "Byers Kim" is typed as the "Name"
      When "Add" is pressed
      Then the team "Australia" of "Spring Tests" has the player "Byers Kim"

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
