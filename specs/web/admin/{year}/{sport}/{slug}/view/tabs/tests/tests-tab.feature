@browser @postgres
Feature: The tests tab of a tournament's page

  A tournament played by teams has a Tests tab where a Standard tournament has
  Competitions (`view.feature`). A test is one of its competitions
  (`addTest.feature`), and the tab does for tests what the Competitions tab
  does for competitions (`competitions-tab.feature`): a manager sees them in
  the tournament's order, adds them, puts them in order, archives them and
  restores them, and a scorer finds the one whose scores they are entering.
  What is said there is said here unless this says otherwise.

  The tests in use come first, in the tournament's order
  (`CompetitionsOfTournament.feature`). Each says its name, which is its
  teams' short names, as "AUS v ENG", and then the days it is played, written
  as the reader's language writes a day: the one day where it starts and
  finishes on the same day, and the first and the last where it does not;
  then how many matches it is expected to have and what each is the best of,
  as "21 matches, best of 3"; and then its group, where it is in one. It
  offers Edit, View, Archive, Up and Down, Up and Down last and shown as
  arrows. A
  test's name and View lead to its own page, beneath the tournament's, at
  /admin/{year}/{sport}/{slug}/tests/{test slug} (`view.feature` beneath
  the test).

  A test in use can be changed (`updateTest.feature`), in the test dialog,
  from Edit (`test.feature`), which comes before View, as it does for a
  competition, so that what is done to a test is offered ahead of going to
  it. A test with games in use keeps its teams, which the dialog shows
  rather than offers, but its days, its expected matches, its best-of and
  its group can still be corrected, so every test in use offers Edit.
  Whenever the dialog keeps a change, the list is asked for again. A test's
  name leads to its page, as a competition's does.

  Every test in use is offered Archive, whether or not it has games, which
  are kept with it and come back when it is restored, as a competition's are.
  The archived tests come after those in use, under a heading of their own,
  each struck through and offering Restore alone. A test whose team has been
  archived since it was is not restored until the team is
  (`restoreCompetition.feature`), and Restore says so above the list, by the
  refusal's code, rather than doing nothing. Archive, Restore, Up and Down do
  not ask first, and whatever is pressed, the list is asked for again.

  A test is added in the test dialog, from Add Test above the list
  (`test.feature`), and whenever the dialog adds one, the list is asked for
  again. A test is between two teams in use, so where the tournament has
  fewer than two, Add Test would open a dialog that could only refuse.
  Instead the tab says, where Add Test would be, that two teams are needed
  first, and leads to the Teams tab.

  A scorer sees the tab as the one tab they are offered (`view.feature`), and
  is shown the tests in use alone, each with its name, its days and View, and
  nothing else: adding, changing, ordering, archiving and restoring are the
  managers'.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page and chooses the tab, which is what opening the tests of a
  tournament does. Unless a scenario says otherwise, a team's short name is
  the first three letters of its name in capitals (`Team.feature`), and a
  test starts and finishes on the tournament's first day.

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

  Rule: The tests in use are listed in the tournament's order

    Scenario: A test added is listed
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is listed

    Scenario: The tests are in the tournament's order
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And "organiser@example.com" has moved the competition "ENG v SCO" in "Spring Tests" up
      When the tests of "Spring Tests" are opened
      Then the first test listed is "ENG v SCO"

    Scenario: A tournament with no tests says so
      When the tests of "Spring Tests" are opened
      Then the tab says there are no tests

  Rule: Each test says the days it is played

    Scenario: A test played on one day says that day
      Given the test is to start on "2026-10-04"
      And the test is to finish on "2026-10-04"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown played on "2026-10-04"

    Scenario: A test played over days says the first
      Given the test is to start on "2026-10-03"
      And the test is to finish on "2026-10-05"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown starting on "2026-10-03"

    Scenario: A test played over days says the last
      Given the test is to start on "2026-10-03"
      And the test is to finish on "2026-10-05"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown finishing on "2026-10-05"

    Scenario: A test's days are written as the reader's language writes them
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the days of the test "AUS v ENG" are written as Spanish writes a day

  Rule: Each test says how it is played and its group

    Scenario: A test says how many matches it is expected to have
      Given the test is to be expected to have 21 matches
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown expected to have 21 matches

    Scenario: A test says what each match is the best of
      Given each match of the test is to be the best of 3
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown with each match the best of 3

    Scenario: A test says its group
      Given the test is to be in the group "Group A"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown in the group "Group A"

    Scenario: A test in no group says nothing of one
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is shown in no group

  Rule: A test is called by its teams' short names as they are now

    Scenario: A test is listed by a team's new short name
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the team "Australia" of "Spring Tests" the short name "Oz"
      When the tests of "Spring Tests" are opened
      Then the test "Oz v ENG" is listed

  Rule: Add Test opens the test dialog once there are two teams

    Scenario: The tab offers Add Test
      When the tests of "Spring Tests" are opened
      Then the tab offers "Add Test"

    Scenario: Add Test is above the tests
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then "Add Test" is above the tests

    Scenario: Add Test opens the dialog to add a test
      Given the tests of "Spring Tests" are open
      When "Add Test" is pressed
      Then the test dialog is titled "Add Test"

    Scenario: A test added in the dialog is listed
      Given the tests of "Spring Tests" are open
      And "Add Test" is pressed
      And the team "Australia" is chosen as "Team A"
      And the team "England" is chosen as "Team B"
      When "Add" is pressed
      Then the test "AUS v ENG" is listed

    Scenario: A tournament with one team in use does not offer Add Test
      Given "organiser@example.com" has archived the team "England" in "Spring Tests"
      And "organiser@example.com" has archived the team "Scotland" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the tab does not offer "Add Test"

    Scenario: A tournament with one team in use says two are needed
      Given "organiser@example.com" has archived the team "England" in "Spring Tests"
      And "organiser@example.com" has archived the team "Scotland" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the tab says the words for "admin.tests.twoTeamsNeeded"

    Scenario: Saying two teams are needed leads to the Teams tab
      Given "organiser@example.com" has archived the team "England" in "Spring Tests"
      And "organiser@example.com" has archived the team "Scotland" in "Spring Tests"
      And the tests of "Spring Tests" are open
      When the way to the teams is pressed
      Then the tab "Teams" is the one being read

  Rule: A test's name and View lead to its page

    Scenario: A test's name leads to its page
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the name of the test "AUS v ENG" leads to "/admin/2026/ac/spring-tests/tests/aus-v-eng"

    Scenario: View leads to the test's page
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then "View" on the test "AUS v ENG" leads to "/admin/2026/ac/spring-tests/tests/aus-v-eng"

    Scenario: Pressing View opens the test's page
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "View" is pressed on the test "AUS v ENG"
      Then the address is "/admin/2026/ac/spring-tests/tests/aus-v-eng"

  Rule: What a test offers is what can be done to it

    Scenario Outline: A test in use offers what can be done to it
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And "organiser@example.com" has added the test between "Scotland" and "Australia" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "ENG v SCO" offers "<option>"

      Examples:
        | option  |
        | Edit    |
        | View    |
        | Archive |
        | Up      |
        | Down    |

    Scenario: Edit comes before View
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then "Edit" on the test "AUS v ENG" comes before "View"

    Scenario: A test with a game offers Edit
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" offers "Edit"

    Scenario: Edit opens the dialog to change the test
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Edit" is pressed on the test "AUS v ENG"
      Then the test dialog is titled "Edit Test"

    Scenario: A test changed in the dialog is listed by its new name
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Edit" is pressed on the test "AUS v ENG"
      And the team "Scotland" is chosen as "Team B"
      When "Save" is pressed
      Then the test "AUS v SCO" is listed

    Scenario: A test with games is offered Archive
      Given "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" offers "Archive"

    Scenario: The first test does not offer Up
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" does not offer "Up"

    Scenario: The last test does not offer Down
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "ENG v SCO" does not offer "Down"

  Rule: Up and Down move a test a place

    Scenario: Up moves a test before the one above
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Up" is pressed on the test "ENG v SCO"
      Then the first test listed is "ENG v SCO"

    Scenario: A test moved is kept in its new place
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And the tests of "Spring Tests" are open
      And "Up" is pressed on the test "ENG v SCO"
      When the tests of "Spring Tests" are opened
      Then the first test listed is "ENG v SCO"

  Rule: Archive and Restore move a test between those in use and the archived

    Scenario: Archiving a test lists it among the archived
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Archive" is pressed on the test "AUS v ENG"
      Then the test "AUS v ENG" is listed among the archived

    Scenario: The archived tests are under a heading of their own
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the archived tests are headed "Archived tests"

    Scenario: An archived test is struck through
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" is struck through

    Scenario Outline: An archived test offers nothing but Restore
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the test "AUS v ENG" does not offer "<option>"

      Examples:
        | option  |
        | Edit    |
        | View    |
        | Archive |
        | Up      |
        | Down    |

    Scenario: Restoring a test lists it among those in use
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Restore" is pressed on the test "AUS v ENG"
      Then the test "AUS v ENG" is not listed among the archived

    Scenario: Restoring a test whose team is archived says why it is not restored
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Restore" is pressed on the test "AUS v ENG"
      Then the tab is refused with "Team.Archived"

    Scenario: A test whose team is archived stays archived
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      And the tests of "Spring Tests" are open
      When "Restore" is pressed on the test "AUS v ENG"
      Then the test "AUS v ENG" is listed among the archived

  Rule: A scorer sees the tests in use, and can only view them

    Scenario: A scorer sees a test in use
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Tests" is opened
      Then the test "AUS v ENG" is listed

    Scenario: A scorer does not see an archived test
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Tests" is opened
      Then the test "AUS v ENG" is not listed

    Scenario: A scorer is offered View
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Tests" is opened
      Then the test "AUS v ENG" offers "View"

    Scenario Outline: A scorer is offered nothing a manager does to a test
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Tests" is opened
      Then the test "AUS v ENG" does not offer "<option>"

      Examples:
        | option  |
        | Edit    |
        | Archive |
        | Down    |

    Scenario: A scorer is not offered Add Test
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of "Spring Tests" is opened
      Then the tab does not offer "Add Test"

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A test's name is made of
    its teams' short names, and its group is what the manager typed, so
    neither is anybody's language.

    Scenario: The tests are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And "organiser@example.com" has archived the competition "ENG v SCO" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then every word in the tab but the tests' names and groups is in the test locale

    Scenario: Saying two teams are needed is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      And "organiser@example.com" has archived the team "Scotland" in "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then every word in the tab but the tests' names is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Test can be pressed with a thumb
      When the tests of "Spring Tests" are opened
      Then the button "Add Test" is at least 44 pixels tall

    Scenario Outline: What a test offers can be pressed with a thumb
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then "<option>" on the test "<test>" is at least 44 pixels tall

      Examples:
        | test      | option  |
        | AUS v ENG | Edit    |
        | AUS v ENG | View    |
        | AUS v ENG | Archive |
        | AUS v ENG | Down    |
        | ENG v SCO | Up      |

    Scenario: Many tests do not widen the page
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has added the test between "England" and "Scotland" to "Spring Tests"
      And "organiser@example.com" has added the test between "Scotland" and "Australia" to "Spring Tests"
      When the tests of "Spring Tests" are opened
      Then the page is no wider than the window
