@browser @postgres
Feature: A test's page shows its matches, the first team down one side

  A tournament played by teams has its tests among its sections, each said as
  its two teams' short names with "vs" between (`tournament.feature`), and
  found at the tournament's address followed by "tests" and the test's slug,
  as "/2026/ac/spring-tests/tests/aus-v-eng". A test there is shown two ways,
  as the old site showed one: its grid, at the test's address followed by
  "grid", and its order of play (`orderOfPlay.feature`), each offering both on
  the line of the test's name. A test has no summary, since its grid is
  already as short as a summary would be. The view a reader chose last is
  the one the test's own address shows, as a block's is (`block.feature`),
  and the grid where they chose the summary, which a test has not.

  The grid is headed by the test, said by its teams' names, as "Australia vs
  England", where the section bar, with less room, says it by their short
  names, and says what each match is the best of, as "Each match is the best
  of 1". Then a table as the old site's was
  (`PublicTestOfTournament.feature`): headed by the first team's name, "vs",
  and the second team's, each over its own side; a row for each match
  played, in the order it
  began, the first team's player on the left and the second team's on the
  right, and between them the match's games, each the first side's score
  then the second's, as "26 - 17", the winner's marked as won by more than
  its colour; and, beneath the matches, each team's games, headed "Games",
  and hoops, headed "Hoops", on its own side. Where each match is the best of
  more than 1, each team's matches won, headed "Matches", come above its
  games, since a match is then more than a game and the matches are what
  decide the test; where each is the best of 1, its matches are its games,
  and are not said twice.

  On a phone the page is no wider than the window. Its sections are the
  tournament's, with the test marked, and only that test where another
  between the same two teams is said the same way.

  A slug no test has, a competition that is not a test, and any test of an
  archived tournament are not pages. An address the tournament has moved on
  from leads to the test where the tournament is now.

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

  Rule: The page is the test's, for anybody

    Scenario: The page is headed by the test
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the page is headed "Australia vs England"

    Scenario: The page says what each match is the best of
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test says each match is the best of 3

    Scenario: A reader not signed in is shown the test
      Given nobody is signed in
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first match of the test is "Pat Player" against "Kim Keeper"

  Rule: The table is headed by the two teams, the first on the left

    Scenario: The first team heads the left
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test's table is headed "Australia" on the left

    Scenario: The second team heads the right
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test's table is headed "England" on the right

  Rule: A row for each match, the first team's player on the left, its games between

    Scenario: The first team's player is on the left whoever won
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first match of the test is "Pat Player" against "Kim Keeper"

    Scenario: The matches are in the order they began
      Given "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first match of the test is "Pam Partner" against "Ken Kicker"
      And the second match of the test is "Pat Player" against "Kim Keeper"

    Scenario: A game is the first side's score then the second's
      Given "Kim Keeper" has beaten "Pat Player" 26tp to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first game of the first match of the test is "17 - 26tp"

    Scenario: A match's games are each shown, oldest first
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first game of the first match of the test is "17 - 26"
      And the second game of the first match of the test is "26 - 3"

    Scenario: The winner's score is marked as won
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the second side's score in the first game of the first match of the test is marked as won

    Scenario: The loser's score is not marked as won
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first side's score in the first game of the first match of the test is not marked as won

  Rule: Beneath the matches are each team's games and hoops, on its own side

    Background:
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Ken Kicker" has beaten "Pam Partner" 26 to 20 in "AUS v ENG" of "Spring Tests"

    Scenario: Each team's games are on its own side
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test's "Games" are "1" on the left and "1" on the right

    Scenario: Each team's hoops are on its own side
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test's "Hoops" are "46" on the left and "43" on the right

    Scenario: Where each match is the best of 1 there are no matches beneath
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test has no "Matches" beneath its matches

  Rule: Where each match is the best of more than 1, each team's matches won come above its games

    Background:
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 3 in "AUS v ENG" of "Spring Tests"

    Scenario: Each team's matches are on its own side
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the test's "Matches" are "1" on the left and "0" on the right

    Scenario: The matches come first beneath the matches played
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first total beneath the test's matches is headed "Matches"

    Scenario: The games come after the matches
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the second total beneath the test's matches is headed "Games"

  Rule: The test's two views are offered, and its own address shows the view chosen last

    Scenario: The views are offered in order
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the first view offered is "Grid"
      And the second view offered is "Order of Play"

    Scenario: A test offers no summary
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the view "Summary" is not offered

    Scenario: A reader who has chosen no view is shown the grid
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: A reader who chose the order of play is shown the order of play
      Given the page at "/2026/ac/spring-tests/tests/aus-v-eng/order-of-play" is open
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the view "Order of Play" is marked as the one being read

    Scenario: A reader who chose a summary is shown the grid
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the page at "/2026/ac/spring-open/competitions/block-a/summary" is open
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: A test has no summary page
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng/summary" is opened
      Then the page says the words for "errors.notFound"

  Rule: On a phone the page fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the page is no wider than the window

  Rule: Its sections are the tournament's, with the test marked

    Scenario: The test is marked as the section being read
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the section "AUS vs ENG" is marked as current

    Scenario: Of two tests between the same teams, only the one being read is marked
      Given "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then 1 section is marked as current

  Rule: An address with no test a reader is sent to is not a page

    Scenario: A slug no test has is not found
      When the page at "/2026/ac/spring-tests/tests/aus-v-nz" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A competition that is not a test is not found under the tests
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the page at "/2026/ac/spring-open/tests/block-a" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's tests are not found
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the test where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Tests" to the sport "gc"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng/grid" is opened
      Then the address is "/2026/gc/spring-tests/tests/aus-v-eng/grid"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the teams' names, the players' names and the numbers.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: Where each match is the best of more than 1 the page is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the page at "/2026/ac/spring-tests/tests/aus-v-eng" is opened
      Then every word in the page's content but the tournament's own is in the test locale
