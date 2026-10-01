@browser @postgres
Feature: A test's page in the admin

  /admin/{year}/{sport}/{slug}/tests/{test slug} is where a manager or a
  scorer enters a test's scores, having pressed its name or View on the
  tournament's Tests tab (`tests-tab.feature`) or the test in the section bar
  (`TournamentSections.feature`). It is headed by the test's name, its teams'
  short names, as "AUS v ENG", and beneath that its teams' names, the days it
  is played, how many matches it is expected to have and what each is the
  best of, and its group where it is in one, written as the Tests tab writes
  them, so that a reader who has come to the wrong test sees so at once.

  A test has no players entered in it (`gamesInATest.feature`), so it has no
  Players tab, as a competition's page has, and its scores are the one thing
  to show: they are the page, with no tabs. The page is otherwise a
  competition's Scores tab (`scores-tab.feature`), and what is said there of
  a block is said here unless this says otherwise. Add Score, above the list,
  opens the score dialog (`test-score.feature`), and a score's Edit opens it
  to correct that score. The scores in use come first, in the order they were
  entered, each saying the winner and their score, then the loser and theirs,
  and offering Edit and Archive. A test has no rounds that depend on one
  another, so every score in it is offered Archive. The archived scores come
  after, under a heading of their own, struck through, each offering Restore
  alone. Archive and Restore do not ask first, and whatever is pressed, the
  list is asked for again.

  A score in a test whose player has been archived since is not restored
  until the player is (`gamesInATest.feature`), and Restore says so above the
  list, by the refusal's code, rather than doing nothing.

  The test is marked in the section bar as the section being read. A manager
  and a scorer see the same page, since a scorer can do to a score all that a
  manager can. Anybody else is refused by the refusal's code in place of the
  scores, as a competition's page refuses them (`view.feature` beneath the
  competition): `Tournament.NotAManagerOrScorer` for somebody with no part in
  the tournament, `Tournament.Archived` for an archived tournament,
  `Tournament.CompetitionArchived` for an archived test, and
  `Tournament.NoSuchCompetition` where the tournament has no test at the
  address. An address the tournament has moved on from sends the reader to
  the test where it is now.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is. Unless a scenario
  says otherwise, a team's short name is the first three letters of its name
  in capitals (`Team.feature`), and a test starts and finishes on the
  tournament's first day.

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
    And "organiser@example.com" has added the player "Sam Someone" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Alex Another" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Chris Third" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Pat Fourth" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

  Rule: Only a reader signed in sees the page

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the page
      Given the reader has signed out
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/2026/ac/spring-tests/tests/aus-v-eng"

  Rule: The page is headed by the test's name, its teams and its days

    Scenario: The page is headed by the test's name
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page is headed "AUS v ENG"

    Scenario: The page names the first team
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page names the team "Australia"

    Scenario: The page names the second team
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page names the team "England"

    Scenario: The page says the day the test is played
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page says the test is played on "2026-10-03"

    Scenario: The page says how many matches the test is expected to have
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page says the test is expected to have 1 match

    Scenario: The page says what each match is the best of
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page says each match is the best of 1

    Scenario: The page has no tabs
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then no tab is offered

    Scenario: The test is marked in the section bar
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the section "AUS v ENG" is marked as current

  Rule: The scores in use are listed in the order they were entered

    Scenario: A score entered is listed
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the score of "Sam Someone" beating "Chris Third" 26 to 17 is listed

    Scenario: The scores are in the order they were entered
      Given "Chris Third" has beaten "Alex Another" 26 to 3 in "AUS v ENG" of "Spring Tests"
      And "Sam Someone" has beaten "Pat Fourth" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the first score listed is of "Chris Third" beating "Alex Another"

    Scenario: A test with no scores says so
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page says there are no scores

    Scenario: A player is listed by what their team calls them now
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has renamed the player "Sam Someone" of the team "Australia" of "Spring Tests" to "Samantha Someone"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the score of "Samantha Someone" beating "Chris Third" 26 to 17 is listed

  Rule: Add Score opens the score dialog

    Scenario: The page offers Add Score
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page offers "Add Score"

    Scenario: Add Score opens the score dialog
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

    Scenario: A score added in the dialog is listed
      Given the page of the test "AUS v ENG" in "Spring Tests" is open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Chris Third" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score of "Sam Someone" beating "Chris Third" 26 to 17 is listed

  Rule: Every score in use offers Edit and Archive

    Scenario Outline: A score in use offers what can be done to it
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Sam Someone" has beaten "Pat Fourth" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the score of "Sam Someone" beating "Chris Third" offers "<option>"

      Examples:
        | option  |
        | Edit    |
        | Archive |

    Scenario: Edit opens the score dialog to correct the score
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Edit" is pressed on the score of "Sam Someone" beating "Chris Third"
      Then the score dialog is titled "Edit Score"

  Rule: Archive and Restore move a score between those in use and the archived

    Scenario: Archiving a score lists it among the archived
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Archive" is pressed on the score of "Sam Someone" beating "Chris Third"
      Then the score of "Sam Someone" beating "Chris Third" is listed among the archived

    Scenario: An archived score is struck through
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the score of "Sam Someone" beating "Chris Third" is struck through

    Scenario: Restoring a score lists it among those in use
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Restore" is pressed on the score of "Sam Someone" beating "Chris Third"
      Then the score of "Sam Someone" beating "Chris Third" is not listed among the archived

    Scenario: Restoring a score whose player is archived says why it is not restored
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the player "Chris Third" of the team "England" of "Spring Tests"
      And the page of the test "AUS v ENG" in "Spring Tests" is open
      When "Restore" is pressed on the score of "Sam Someone" beating "Chris Third"
      Then the page is refused above the list with "TeamPlayer.Archived"

  Rule: A scorer sees the same page

    Scenario: A scorer is offered Add Score
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page offers "Add Score"

    Scenario: A scorer is offered Archive
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Tests"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the score of "Sam Someone" beating "Chris Third" offers "Archive"

  Rule: Only a manager or a scorer of a tournament there is sees a test there is

    Scenario: A reader with no part in the tournament is told they cannot see the test
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page is refused with "Tournament.NotAManagerOrScorer"

    Scenario: An archived tournament says it can only be restored
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page is refused with "Tournament.Archived"

    Scenario: An archived test says it can only be restored
      Given "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page is refused with "Tournament.CompetitionArchived"

    Scenario: An address no test has been found at says so
      When the page at "/admin/2026/ac/spring-tests/tests/no-such-test" is opened
      Then the page is refused with "Tournament.NoSuchCompetition"

    Scenario: A refused page offers no Add Score
      Given "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the page does not offer "Add Score"

  Rule: An address the tournament has moved on from sends the reader to where it is

    Scenario: The old address of a test in a tournament moved to another sport leads to it
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the page at "/admin/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the address is "/admin/2026/gc/spring-tests/tests/aus-v-eng"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). The test's name, its teams'
    names and its players' are what the manager typed, and nobody's language.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Sam Someone" has beaten "Pat Fourth" 26 to 3 in "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Pat Fourth" in "AUS v ENG" of "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then every word in the admin's content but the test's, the teams' and the players' own is in the test locale

    Scenario: A refused page is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then every word in the admin's content is in the test locale

  Rule: The page is laid out for a phone first

    Scenario: Add Score can be pressed with a thumb
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then the button "Add Score" is at least 44 pixels tall

    Scenario Outline: What a score offers can be pressed with a thumb
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page of the test "AUS v ENG" in "Spring Tests" is opened
      Then "<option>" on the score of "Sam Someone" beating "Chris Third" is at least 44 pixels tall

      Examples:
        | option  |
        | Edit    |
        | Archive |
