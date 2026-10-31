@browser @postgres
Feature: A test is added to a tournament, or changed, in a modal dialog

  A manager adds the tests to a tournament played by teams from its Tests
  tab, by pressing "Add Test" (`tests-tab.feature`). That opens the test
  dialog over the page. It asks for what a test is (`addTest.feature`): the
  two teams it is between, the days it starts and finishes, how many matches
  it is expected to have, what each match is the best of, and the group it
  is in, if any.

  It is a modal dialog, as the player dialog is (`player.feature`): it sits
  over the page it was opened from, nothing outside it can be pressed or
  reached by the keyboard while it is open, it has no address, and it has a
  Cancel button, which Escape does as well. Cancelling keeps nothing that was
  not already kept, and the reader is back on Add Test.

  The dialog reads in the order a test is said aloud: Team A, then Team B,
  each a drop-down, then Starts and Finishes, then Expected Matches, Best Of
  and Group. Each drop-down offers the
  tournament's teams in use, in the tournament's order
  (`TeamsOfTournament.feature`), by name, since a reader choosing a team
  knows it by its name; an archived team is not offered, since a test with
  one is refused. Team B offers every team but the one chosen as Team A,
  since a team does not play a test against itself (`addTest.feature`), and
  choosing as Team A the team chosen as Team B leaves no team chosen as Team
  B, as choosing a score's winner leaves no loser of their own team
  (`test-score.feature`). Neither has a team chosen to begin with, so that a
  test is never added between teams the reader did not choose. A test has no
  name of its own to type: it is called by its teams' short names.

  A test is played within its tournament, so Starts and Finishes begin on the
  tournament's first day, and offer only its days where the browser's picker
  of days can be told which: a test begun on any other would only be refused.

  Expected Matches and Best Of are whole numbers, each typed on a keypad of
  numbers, and begin on 1, as a block's best-of does
  (`competition.feature`). Best Of may be even, and is not refused for it. A
  Group is typed, and begins empty, since most tests are in none; left empty,
  the test is in no group.

  Tests are added a round at a time, between teams who meet on the same day,
  so Add does not close the dialog, as it does not for a competition
  (`competition.feature`). It adds the test, tells the reader in words which
  test was added, by its name, and empties the teams for the next, with the
  reader back on Team A. A screen reader is told as well. The days, the
  expected matches, the best-of and the group are left as they were, so that
  the next test of the round is its two teams alone.

  A test is changed in the same dialog, from Edit on the test
  (`tests-tab.feature`), so that adding and changing cannot come to ask
  different things. Opened from Edit, it is titled "Edit Test", its button is
  Save, and it begins as the test is: its teams chosen, and its days, its
  expected matches, its best-of and its group as they are. Save keeps the
  change and closes the dialog, since a test is changed one at a time, and
  the reader is back on the Edit they pressed, or on the test's new Edit
  where its name has changed.

  A test with games in use keeps its teams (`updateTest.feature`), so the
  dialog opened on one shows Team A and Team B as they are, and they cannot
  be changed, as a score's players are shown when they cannot be changed
  (`score-modal-dialog.feature`); the reader begins on Starts. The rest can
  be changed, within what has been played: expected matches fewer than the
  matches started are refused beneath Expected Matches
  (`Tournament.ExpectedMatchesBelowStarted`), and a best-of fewer than the
  most games any two players have played beneath Best Of
  (`Tournament.BestOfBelowGamesPlayed`). A test given its first game while
  the dialog is open, and its teams changed, is refused with
  `Tournament.TestHasGames`, which is about the test as a whole rather than
  any one field, so it is said above the fields.

  Everything is required. What is refused is said beneath the field it is
  about, by the refusal's code, and what was chosen stays chosen so that it
  can be put right: a team not chosen, beneath it; a test that starts before
  the tournament, beneath
  Starts; one that finishes after the tournament, or before it starts,
  beneath Finishes; expected matches or a best-of that is not a whole number
  of at least one, beneath each; and a group too long, beneath it. A refusal about no one field is said above the fields.
  Nothing refused is kept, and the dialog stays open.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is. Unless a
  scenario says otherwise, a team's short name is the first three letters of
  its name in capitals (`Team.feature`).

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the tournament "Spring Tests" starts on "2026-10-03"
    And the tournament "Spring Tests" finishes on "2026-10-05"
    And the tournament "Spring Tests" is for the sport "ac"
    And the tournament "Spring Tests" is played in the format "Teams"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the team "Scotland" to "Spring Tests"

  Rule: Add Test opens the dialog to add a test

    Scenario: Add Test opens the test dialog
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog is open

    Scenario: The dialog is titled for what it does
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog is titled "Add Test"

    Scenario: The dialog adds with Add
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog's first button is "Add"

    Scenario Outline: The dialog asks for what a test is
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog asks for "<field>"

      Examples:
        | field            |
        | Team A           |
        | Team B           |
        | Starts           |
        | Finishes         |
        | Expected Matches |
        | Best Of          |
        | Group            |

    Scenario Outline: The numbers begin on 1
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "<field>" says "1"

      Examples:
        | field            |
        | Expected Matches |
        | Best Of          |

    Scenario: The group begins empty
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "Group" is empty

    Scenario Outline: The numbers are typed on a keypad of numbers
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "<field>" is typed on a keypad of numbers

      Examples:
        | field            |
        | Expected Matches |
        | Best Of          |

    Scenario: The dialog does not ask for a name
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog does not ask for "Name"

  Rule: A tournament whose format has no groups is not asked for one

    The regulations of the Eire Cup and the Interstate Shield have no groups
    (`addTest.feature`), so the dialog does not offer a Group there, rather
    than offer it and refuse what is typed in it.

    Scenario Outline: The dialog does not ask for a group in <format>
      Given "organiser@example.com" has created the tournament "Spring Cup"
      And the tournament "Spring Cup" starts on "2026-10-03"
      And the tournament "Spring Cup" finishes on "2026-10-05"
      And the tournament "Spring Cup" is for the sport "ac"
      And the tournament "Spring Cup" is played in the format "<format>"
      And "organiser@example.com" has added the team "Australia" to "Spring Cup"
      And "organiser@example.com" has added the team "England" to "Spring Cup"
      And the tests of "Spring Cup" are open
      When "Add Test" is pressed
      And "Starts" says "2026-10-03"
      Then the test dialog does not ask for "Group"

      Examples:
        | format            |
        | Eire Cup          |
        | Interstate Shield |

    Scenario Outline: The dialog to change a test does not ask for a group in <format>
      Given "organiser@example.com" has created the tournament "Spring Cup"
      And the tournament "Spring Cup" starts on "2026-10-03"
      And the tournament "Spring Cup" finishes on "2026-10-05"
      And the tournament "Spring Cup" is for the sport "ac"
      And the tournament "Spring Cup" is played in the format "<format>"
      And "organiser@example.com" has added the team "Australia" to "Spring Cup"
      And "organiser@example.com" has added the team "England" to "Spring Cup"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Cup"
      And the tests of "Spring Cup" are open
      When "Edit" is pressed on the test "AUS v ENG"
      And "Starts" says "2026-10-03"
      Then the test dialog does not ask for "Group"

      Examples:
        | format            |
        | Eire Cup          |
        | Interstate Shield |

    Scenario: The dialog still asks for a group in Teams
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog asks for "Group"

  Rule: The dialog reads in the order a test is said aloud

    Scenario: Team A comes first
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "Team A" is the first thing the test dialog asks for

    Scenario: Starts comes after the teams
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "Starts" comes after "Team B"

    Scenario: Finishes comes after Starts
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "Finishes" comes after "Starts"

  Rule: The teams offered are those in use, in the tournament's order, none chosen

    Scenario Outline: No team is chosen to begin with
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then no team is chosen as "<field>"

      Examples:
        | field  |
        | Team A |
        | Team B |

    Scenario: A team in use is offered
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the team "Australia" is offered as "Team A"

    Scenario: The teams are offered in the tournament's order
      Given "organiser@example.com" has moved the team "Scotland" in "Spring Tests" up
      And the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the team "Scotland" is offered before the team "England" as "Team B"

    Scenario: An archived team is not offered
      Given "organiser@example.com" has archived the team "Scotland" in "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the team "Scotland" is not offered as "Team A"

    Scenario: A team is offered by its name
      Given the team is to be known for short as "Oz"
      And "organiser@example.com" has added the team "Australia A" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the team "Australia A" is offered as "Team A"

  Rule: Team B offers every team but the one chosen as Team A

    Scenario: The team chosen as Team A is not offered as Team B
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When the team "Australia" is chosen as "Team A"
      Then the team "Australia" is not offered as "Team B"

    Scenario: Every other team is offered as Team B
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When the team "Australia" is chosen as "Team A"
      Then the team "England" is offered as "Team B"

    Scenario: Team A offers every team whatever is chosen as Team B
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When the team "Australia" is chosen as "Team B"
      Then the team "Australia" is offered as "Team A"

    Scenario: Choosing as Team A the team chosen as Team B leaves none chosen as Team B
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team B"
      When the team "Australia" is chosen as "Team A"
      Then no team is chosen as "Team B"

    Scenario: Another team chosen as Team B stays chosen
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "England" is chosen as "Team B"
      When the team "Australia" is chosen as "Team A"
      Then the "Team B" chosen is "England"

    Scenario: A test being changed does not offer its Team A as Team B
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then the team "Australia" is not offered as "Team B"

  Rule: The days begin on the tournament's first day, and offer only its days

    Scenario Outline: A day begins on the tournament's first day
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "<field>" says "2026-10-03"

      Examples:
        | field    |
        | Starts   |
        | Finishes |

    Scenario Outline: A day offers none before the tournament's first
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "<field>" offers no day before "2026-10-03"

      Examples:
        | field    |
        | Starts   |
        | Finishes |

    Scenario Outline: A day offers none after the tournament's last
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "<field>" offers no day after "2026-10-05"

      Examples:
        | field    |
        | Starts   |
        | Finishes |

  Rule: The dialog sits over the page, and nothing outside it can be reached

    Scenario: Opening the dialog leaves the address as it was
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the address is "/admin/2026/ac/spring-tests"

    Scenario: The dialog is announced as a modal dialog
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog is announced as a modal dialog

    Scenario: The dialog is named by its title
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog is named "Add Test"

    Scenario: The reader is put on Team A when the dialog opens
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "Team A" has the focus

    Scenario: The keyboard does not leave the dialog going forward
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When Tab is pressed until the focus comes round again
      Then the focus never left the test dialog

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: The dialog has a Cancel button
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog's second button is "Cancel"

    Scenario: Cancel closes the dialog
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When "Cancel" is pressed
      Then the test dialog is not open

    Scenario: Escape closes the dialog
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When Escape is pressed
      Then the test dialog is not open

    Scenario: Cancelling adds nothing
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Cancel" is pressed
      Then "Spring Tests" has no tests

    Scenario: Cancelling keeps the tests already added
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "Add" is pressed
      When "Cancel" is pressed
      Then "Spring Tests" has the test "AUS v ENG"

    Scenario: The reader is back on Add Test once the dialog is cancelled
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When "Cancel" is pressed
      Then "Add Test" has the focus

  Rule: A test asks how it is played and counted

    A test is asked the three that every competition is (`competition.feature`):
    "Played with handicaps", "Allows drawn results" and "Counts toward world
    rankings", the last only where it can be counted.

    Scenario Outline: The dialog asks for each
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog asks for "<field>"

      Examples:
        | field                        |
        | Played with handicaps        |
        | Allows drawn results         |
        | Counts toward world rankings |

    Scenario: A new test is not played with handicaps to begin with
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "Played with handicaps" is not ticked

    Scenario: A test allowing drawn results is not asked about the world rankings
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      When the reader ticks "Allows drawn results"
      Then the test dialog does not ask for "Counts toward world rankings"

    Scenario: A test added allowing drawn results is kept so
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And the reader ticks "Allows drawn results"
      When "Add" is pressed
      Then the competition "AUS v ENG" of "Spring Tests" allows drawn results

    Scenario: A test changed begins as it is played
      Given the competition is to be played under handicap
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then "Played with handicaps" is ticked

  Rule: Add adds the test as it was asked for

    Scenario: The test added is one of the tournament's tests
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then "Spring Tests" has the test "AUS v ENG"

    Scenario: The test added starts on the day chosen
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2026-10-04" is chosen as "Starts"
      And "2026-10-05" is chosen as "Finishes"
      When "Add" is pressed
      Then the test "AUS v ENG" of "Spring Tests" starts on "2026-10-04"

    Scenario: The test added finishes on the day chosen
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2026-10-04" is chosen as "Starts"
      And "2026-10-05" is chosen as "Finishes"
      When "Add" is pressed
      Then the test "AUS v ENG" of "Spring Tests" finishes on "2026-10-05"

    Scenario: The test added is expected to have the matches typed
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "21" is typed as the "Expected Matches"
      When "Add" is pressed
      Then the test "AUS v ENG" of "Spring Tests" is expected to have 21 matches

    Scenario: Each match of the test added is the best of what was typed
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2" is typed as the "Best Of"
      When "Add" is pressed
      Then each match of the test "AUS v ENG" of "Spring Tests" is the best of 2

    Scenario: The test added is in the group typed
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "Group A" is typed as the "Group"
      When "Add" is pressed
      Then the test "AUS v ENG" of "Spring Tests" is in the group "Group A"

    Scenario: A test added with the group left empty is in none
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then the test "AUS v ENG" of "Spring Tests" is in no group

  Rule: Add leaves the dialog open, ready for the next test of the round

    Scenario: Adding leaves the dialog open
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then the test dialog is open

    Scenario: Adding says which test was added, by its name
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then the test dialog says "AUS v ENG" was added

    Scenario: Which test was added is told to a screen reader
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then what the test dialog says about which test was added is announced

    Scenario Outline: Adding empties the teams
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then no team is chosen as "<field>"

      Examples:
        | field  |
        | Team A |
        | Team B |

    Scenario Outline: Adding leaves the days as they were
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2026-10-04" is chosen as "Starts"
      And "2026-10-04" is chosen as "Finishes"
      When "Add" is pressed
      Then "<field>" says "2026-10-04"

      Examples:
        | field    |
        | Starts   |
        | Finishes |

    Scenario Outline: Adding leaves how the test is played as it was
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "<value>" is typed as the "<field>"
      When "Add" is pressed
      Then "<field>" says "<value>"

      Examples:
        | field            | value   |
        | Expected Matches | 21      |
        | Best Of          | 3       |
        | Group            | Group A |

    Scenario: Adding puts the reader back on Team A
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then "Team A" has the focus

    Scenario: Which test was added is no longer said once the next team is chosen
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "Add" is pressed
      When the team "Scotland" is chosen as "Team A"
      Then the test dialog says no test was added

  Rule: What is refused is said beside the field it is about

    Scenario: A Team A not chosen is refused beside it
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then "Team A" is refused with "AddTest.FirstTeamMissing"

    Scenario: A Team B not chosen is refused beside it
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      When "Add" is pressed
      Then "Team B" is refused with "AddTest.SecondTeamMissing"

    Scenario: A test that finishes before it starts is refused beside Finishes
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2026-10-05" is chosen as "Starts"
      And "2026-10-04" is chosen as "Finishes"
      When "Add" is pressed
      Then "Finishes" is refused with "Tournament.TestFinishesBeforeStarts"

    Scenario: A test that starts before the tournament is refused beside Starts
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2026-10-02" is typed as "Starts"
      When "Add" is pressed
      Then "Starts" is refused with "Tournament.TestStartsBeforeTournament"

    Scenario: A test that finishes after the tournament is refused beside Finishes
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2026-10-06" is typed as "Finishes"
      When "Add" is pressed
      Then "Finishes" is refused with "Tournament.TestFinishesAfterTournament"

    Scenario Outline: A number that breaks its rules is refused beside it
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "0" is typed as the "<field>"
      When "Add" is pressed
      Then "<field>" is refused with "<code>"

      Examples:
        | field            | code                     |
        | Expected Matches | ExpectedMatches.TooSmall |
        | Best Of          | BestOf.TooSmall          |

    Scenario: An even best-of is accepted
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "2" is typed as the "Best Of"
      When "Add" is pressed
      Then "Spring Tests" has the test "AUS v ENG"

    Scenario: A group too long is refused beside it
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And 255 characters are typed as the "Group"
      When "Add" is pressed
      Then "Group" is refused with "TestGroup.TooLong"

    Scenario: A team archived while the dialog is open is refused above the fields
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      When "Add" is pressed
      Then the test dialog is refused above its fields with "Team.Archived"

    Scenario: A refused test is not added
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      When "Add" is pressed
      Then "Spring Tests" has no tests

    Scenario: A refused dialog keeps what was chosen
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      When "Add" is pressed
      Then the "Team A" chosen is "Australia"

    Scenario: The reader is taken to the field refused
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      When "Add" is pressed
      Then "Team B" has the focus

  Rule: Edit opens the dialog on the test, to change it

    Scenario: The dialog to change a test is titled for what it does
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then the test dialog is titled "Edit Test"

    Scenario: The dialog to change a test saves with Save
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then the test dialog's first button is "Save"

    Scenario Outline: The dialog begins with the test's teams chosen
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then the "<field>" chosen is "<team>"

      Examples:
        | field  | team      |
        | Team A | Australia |
        | Team B | England   |

    Scenario Outline: The dialog begins with the test's days and how it is played
      Given the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-05"
      And the test is to be expected to have 21 matches
      And each match of the test is to be the best of 3
      And the test is to be in the group "Group A"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then "<field>" says "<value>"

      Examples:
        | field            | value      |
        | Starts           | 2026-10-04 |
        | Finishes         | 2026-10-05 |
        | Expected Matches | 21         |
        | Best Of          | 3          |
        | Group            | Group A    |

  Rule: Save keeps the change and closes the dialog

    Scenario: A test given another team is kept between its new teams
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      When "Save" is pressed
      Then "Spring Tests" has the test "AUS v SCO"

    Scenario: A test given another best-of keeps it
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And "3" is typed as the "Best Of"
      When "Save" is pressed
      Then each match of the test "AUS v ENG" of "Spring Tests" is the best of 3

    Scenario: Saving closes the dialog
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And "Group A" is typed as the "Group"
      When "Save" is pressed
      Then the test dialog is not open

    Scenario: The reader is back on the test's Edit once it is saved
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      When "Save" is pressed
      Then "Edit" on the test "AUS v SCO" has the focus

    Scenario: Cancelling keeps the test as it was
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      When "Cancel" is pressed
      Then "Spring Tests" has the test "AUS v ENG"

  Rule: A test with games keeps its teams, and the rest can be changed

    Scenario Outline: The teams of a test with a game cannot be changed
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then "<field>" cannot be changed

      Examples:
        | field  |
        | Team A |
        | Team B |

    Scenario: The teams of a test with a game are shown as they are
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then the test dialog shows "England" as "Team B"

    Scenario: The reader begins on Starts in a test with a game
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then "Starts" has the focus

    Scenario: The teams of a test whose only game is archived can be changed
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      When "Save" is pressed
      Then "Spring Tests" has the test "AUS v SCO"

    Scenario: A test with a game is given a group
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And "Group A" is typed as the "Group"
      When "Save" is pressed
      Then the test "AUS v ENG" of "Spring Tests" is in the group "Group A"

    Scenario: Expected matches fewer than the matches started are refused beside them
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And the test is to be expected to have 21 matches
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Alex Another" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And "1" is typed as the "Expected Matches"
      When "Save" is pressed
      Then "Expected Matches" is refused with "Tournament.ExpectedMatchesBelowStarted"

    Scenario: A best-of fewer than the most games played is refused beside it
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And each match of the test is to be the best of 3
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And "1" is typed as the "Best Of"
      When "Save" is pressed
      Then "Best Of" is refused with "Tournament.BestOfBelowGamesPlayed"

  Rule: What Save refuses is said, and nothing is kept

    Scenario: A test given a game while the dialog is open is refused above the fields
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When "Save" is pressed
      Then the test dialog is refused above its fields with "Tournament.TestHasGames"

    Scenario: A refused change is not kept
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      And "0" is typed as the "Best Of"
      When "Save" is pressed
      Then "Spring Tests" has the test "AUS v ENG"

    Scenario: A refused dialog stays open
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And "0" is typed as the "Best Of"
      When "Save" is pressed
      Then the test dialog is open

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). The teams' names, and the
    name of the test said to be added, are what the manager typed, so they
    are not read for marks.

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the tests of "Spring Tests" are open
      When the way to add a test is pressed
      Then every word in the test dialog but the teams' names is in the test locale

    Scenario: A refused dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the tests of "Spring Tests" are open
      And the way to add a test is pressed
      When the test dialog is sent as it is
      Then the test dialog says what it refused
      And every word in the test dialog but the teams' names is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog is no wider than the window

    Scenario Outline: Each button can be pressed with a thumb
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button |
        | Add    |
        | Cancel |

    Scenario Outline: Each field can be pressed with a thumb
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then "<field>" is at least 44 pixels tall

      Examples:
        | field            |
        | Team A           |
        | Team B           |
        | Starts           |
        | Finishes         |
        | Expected Matches |
        | Best Of          |
        | Group            |
