@browser @postgres
Feature: A tournament played by teams has a summary of how its teams stand

  A tournament played by teams has a Summary section after Recent
  (`tournament.feature`), leading to the tournament's address followed by
  "summary", as "/2026/ac/spring-tests/summary". It shows how the teams stand
  as the old site's summary did (`PublicTeamSummaryOfTournament.feature`), in
  one table, whose first heading, above the teams, is the tournament's name,
  as the old site's was. The name is not shown again above the table, since
  the table says it; the page is still headed by it for whatever reads the
  page aloud.

  The table has a row for each team, ranked, said by its name, as
  "Australia", where the section bar says a test by its teams' short names,
  since the summary is where a reader looks for each team as a whole, and
  beside it, grouped under "Tests", "Games" and "Hoops", the tests it has won,
  lost and drawn, headed "Wins", "Losses" and "Draws"; the games it has won
  and lost, headed "Wins" and "Losses"; and its hoops for, against and net,
  headed "For", "Against" and "Net". Where any of the tournament's tests has
  matches the best of more than 1, the matches it has won and lost, headed
  "Wins" and "Losses" under "Matches", come after its tests, as the teams are
  ranked by them after their tests; where every test's matches are the best
  of 1, a match is its one game, and is not said twice. The numbers are written as the reader's
  language writes them, so that a thousand or more is grouped as the old site
  grouped it, as "1,970".

  On a phone the table scrolls across within the page where it is wider than
  the window, so that the page itself is no wider than the window. Its
  sections are the tournament's, with Summary marked.

  A tournament with a test in a group has no summary either, as the old
  site's had none: each group's page shows how the teams of that group stand
  (`group.feature`), and the tournament offers no Summary
  (`tournament.feature`).

  A Standard tournament has no summary, and its address followed by
  "summary" is not a page; nor is an archived tournament's, or any the website
  never had. An address the tournament has moved on from leads to the
  summary where the tournament is now.

  Where a scenario says nothing else, "Spring Tests" is played by teams, its
  teams "Australia", "AUS", with "Pat Player" and "Pam Partner", and
  "England", "ENG", with "Kim Keeper" and "Ken Kicker", and its test between
  them is expected to have 2 matches, each the best of 1.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the team is to be known for short as "AUS"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And the team is to be known for short as "ENG"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
    And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the player "Ken Kicker" to the team "England" of "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
    And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches

  Rule: The page is the tournament's summary, for anybody

    Scenario: The page is headed by the tournament's name
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the page is headed "Spring Tests"

    Scenario: The table's first heading is the tournament's name
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the summary's first heading is "Spring Tests"

    Scenario: The tournament's name is not shown above the table
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the page's heading is not shown

    Scenario: A reader not signed in is shown the summary
      Given nobody is signed in
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the first team of the summary is "Australia"

  Rule: A row for each team, ranked, said by its name

    Scenario: The teams are ranked
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the first team of the summary is "England"
      And the second team of the summary is "Australia"

  Rule: Beside each team are its tests, its games and its hoops

    Scenario Outline: The columns are grouped and headed in order
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the <place> column of the teams' summary is headed "<heading>" under "<group>"

      Examples:
        | place   | group | heading |
        | first   | Tests | Wins    |
        | second  | Tests | Losses  |
        | third   | Tests | Draws   |
        | fourth  | Games | Wins    |
        | fifth   | Games | Losses  |
        | sixth   | Hoops | For     |
        | seventh | Hoops | Against |
        | eighth  | Hoops | Net     |

    Scenario Outline: A team's numbers are under their headings
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pam Partner" has beaten "Ken Kicker" 26 to 20 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the <place> number of "<team>" in the summary is "<number>"

      Examples:
        | team      | place   | number |
        | Australia | first   | 1      |
        | England   | second  | 1      |
        | Australia | third   | 0      |
        | Australia | fourth  | 2      |
        | England   | fifth   | 2      |
        | Australia | sixth   | 52     |
        | Australia | seventh | 37     |
        | Australia | eighth  | 15     |
        | England   | eighth  | -15    |

    Scenario: A thousand or more is grouped as the reader's language groups it
      Given "Pat Player" has beaten "Kim Keeper" 1970 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the sixth number of "Australia" in the summary is "1,970"

  Rule: Where a test has matches the best of more than 1, the matches come after the tests

    Background:
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3

    Scenario Outline: The matches are grouped and headed after the tests
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the <place> column of the teams' summary is headed "<heading>" under "<group>"

      Examples:
        | place  | group   | heading |
        | third  | Tests   | Draws   |
        | fourth | Matches | Wins    |
        | fifth  | Matches | Losses  |
        | sixth  | Games   | Wins    |

    Scenario Outline: A team's matches are under their headings
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the <place> number of "<team>" in the summary is "<number>"

      Examples:
        | team      | place  | number |
        | Australia | fourth | 1      |
        | England   | fifth  | 1      |
        | Australia | sixth  | 2      |

    Scenario: The matches are in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then every word in the page's content but the tournament's own is in the test locale

  Rule: Where every test's matches are the best of 1, there are no matches

    Scenario: There is no column under "Matches"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the teams' summary has no column under "Matches"

  Rule: On a phone the page fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the page is no wider than the window

  Rule: Its sections are the tournament's, with Summary marked

    Scenario: Summary is marked as the section being read
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the section "Summary" is marked as current

    Scenario: Recent is not marked
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the section "Recent" is not marked as current

  Rule: An address with no summary a reader is sent to is not a page

    Scenario: A Standard tournament has no summary
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A tournament with a test in a group has no summary
      Given the test is to be in the group "Block A"
      And "organiser@example.com" has added the test between "England" and "Australia" to "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's summary is not found
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the summary where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then the address is "/2026/gc/spring-tests/summary"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the tournament's name and the teams' names, which are
    what its managers called them, and the numbers.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/summary" is opened
      Then every word in the page's content but the tournament's own is in the test locale
