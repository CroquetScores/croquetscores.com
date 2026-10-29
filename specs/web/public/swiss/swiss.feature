@browser @postgres
Feature: A Swiss's grid ranks its players with their results

  Each competition of a tournament is a section of it, found at the
  tournament's address followed by the competition's slug, as
  "/2026/ac/spring-open/competitions/zed". A Swiss there is shown three ways,
  as a block and a knockout are (`block.feature`, `knockout.feature`): its
  grid, at the Swiss's address followed by "grid", its summary
  (`swissSummary.feature`) and its order of play (`orderOfPlay.feature`), each
  offering all three on the line of the Swiss's name. The view a reader chose
  last is the one the Swiss's own address shows, the grid where they have
  chosen none, since it is one choice for every competition.

  The grid is a table as the old site's was (`PublicSwissOfTournament.feature`):
  a row for each player, ranked, headed by the player as the tournament's
  other pages show one, their name leading to their own page, what they
  represent and their flag, and saying so where they have withdrawn, their
  name struck through. Beside
  them are the games they have played, headed "Games", the games they have
  won, headed "Wins", the share of their games they have won, headed "Win %"
  and written to one decimal place, as "75.0%", and their results, headed
  "Results". A player who has played no game has no wins or share to show,
  and those are left empty.

  A player's results are each game they played, in the order the games were
  added, each said as the old site said it: the opponent, by the first letter
  of their first name and their last name, as "C. Denny", their last name
  being their last word with a letter in it, so that a number added to tell
  two players of one name apart, as "Andrew Hobbs (2)", is left out; and the
  margin, as
  "+4" for a game won by 4, "-1" for one lost by 1 and "0" for one drawn,
  with the opponent's whole name for whatever reads the page aloud. Where
  the scorer wrote peeling after either score, as "tp" in "26tp", it follows
  the margin, the winner's first and then the loser's, as it does in the
  rankings text file (`rankingsTextFile.feature`), so that a game won 26tp to
  17 is "+9tp" to the winner and "-9tp" to the loser. Each is
  marked won, lost or drawn by more than its colour, the sign of its margin
  saying which. A withdrawn game was played, so it is among the results, but
  it counts for nothing (`withdrawGame.feature`), so it is marked as
  withdrawn, struck through, and left out of the games, wins and win share.
  So is every game of a withdrawn player, theirs and their opponents', since
  what they played must not rank those they met above those they did not
  (`PublicSwissOfTournament.feature`).

  On a phone the results wrap within their column, and where the table is
  still wider than the window it scrolls across within the page, as a
  block's grid does, so that the page itself is no wider than the window.

  Its sections are the tournament's, with the Swiss marked.

  A Swiss that is archived, and any Swiss of an archived tournament, are not
  pages. An address the tournament has moved on from leads to the Swiss where
  the tournament is now.

  Where a scenario says nothing else, the tournament is for the sport "gc"
  and starts on 3 October 2026, and its Swiss "Zed" has "Sam Someone", "Alex
  Another" and "Chris Third" entered in it, in that order.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And the tournament is to be for the sport "gc"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And "organiser@example.com" has added the Swiss "Zed" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Zed" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Zed" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Zed" of "Spring Open"

  Rule: The page is the Swiss's, for anybody

    Scenario: The page is headed by the Swiss's name
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the competition is headed "Zed"

    Scenario: A reader not signed in is shown the grid
      Given nobody is signed in
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first row of the Swiss is "Sam Someone"

  Rule: A row for each player, ranked

    Scenario: The players are ranked
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first row of the Swiss is "Alex Another"

    Scenario: A player's row says what they represent
      Given the player is to represent "Canterbury"
      And "organiser@example.com" has added the player "Kim Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Kim Fourth" in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the row of "Kim Fourth" in the Swiss says they represent "Canterbury"

    Scenario: A player's name leads to their own page
      Given the page at "/2026/gc/spring-open/competitions/zed" is open
      When the name of "Alex Another" in the Swiss is pressed
      Then the address is "/2026/gc/spring-open/players/alex-another"

    Scenario: A withdrawn player's row says they have withdrawn
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the row of "Alex Another" in the Swiss says they have withdrawn

    Scenario: A withdrawn player's name is struck through
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the name of "Alex Another" in the Swiss is struck through

    Scenario: A player who has not withdrawn is not struck through
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the name of "Sam Someone" in the Swiss is not struck through

  Rule: Beside each player are their games, wins, win share and results

    Scenario: The columns are headed in order
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first column of the Swiss is headed "Games"
      And the second column of the Swiss is headed "Wins"
      And the third column of the Swiss is headed "Win %"
      And the fourth column of the Swiss is headed "Results"

    Scenario: A player's games are shown
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Games" of "Sam Someone" in the Swiss are "2"

    Scenario: A player's wins are shown
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Wins" of "Sam Someone" in the Swiss are "1"

    Scenario: A player's win share is shown to one decimal place
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Win %" of "Sam Someone" in the Swiss are "66.7%"

    Scenario: A player who has played no game has no wins shown
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Wins" of "Sam Someone" in the Swiss are ""

    Scenario: A player who has played no game has no win share shown
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Win %" of "Sam Someone" in the Swiss are ""

  Rule: A player's results are each game they played, the opponent and the margin

    Scenario: A game won is the opponent and the margin with a plus
      Given "Sam Someone" has beaten "Chris Third" 7 to 3 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "C. Third +4"

    Scenario: A game lost is the opponent and the margin with a minus
      Given "Sam Someone" has beaten "Chris Third" 7 to 6 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Chris Third" in the Swiss is "S. Someone -1"

    Scenario: The winner's peeling follows the margin
      Given "Sam Someone" has beaten "Chris Third" 26tp to 17 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "C. Third +9tp"

    Scenario: The loser sees the winner's peeling after their own margin
      Given "Sam Someone" has beaten "Chris Third" 26tp to 17 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Chris Third" in the Swiss is "S. Someone -9tp"

    Scenario: The loser's peeling follows the winner's
      Given "Sam Someone" has beaten "Chris Third" 26tp to 17p in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "C. Third +9tpp"

    Scenario: A game with no peeling has none shown
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "C. Third +9"

    Scenario: The results are in the order the games were added
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 7 to 6 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "A. Another +3"
      And the second result of "Sam Someone" in the Swiss is "C. Third -1"

    Scenario: A result is the opponent's last name after the first letter of their first
      Given "organiser@example.com" has added the player "Jan van Dijk" to "Spring Open"
      And "organiser@example.com" has entered the player "Jan van Dijk" in "Zed" of "Spring Open"
      And "Sam Someone" has beaten "Jan van Dijk" 7 to 3 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "J. Dijk +4"

    Scenario: A number after a name is left out of a result
      Given "organiser@example.com" has added the player "Andrew Hobbs (2)" to "Spring Open"
      And "organiser@example.com" has entered the player "Andrew Hobbs (2)" in "Zed" of "Spring Open"
      And "Sam Someone" has beaten "Andrew Hobbs (2)" 7 to 3 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "A. Hobbs +4"

    Scenario: A result names the opponent in full for whatever reads the page aloud
      Given "Sam Someone" has beaten "Chris Third" 7 to 3 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss names "Chris Third" in full

    Scenario: A result won is marked as won
      Given "Sam Someone" has beaten "Chris Third" 7 to 3 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is marked as won

    Scenario: A result lost is marked as lost
      Given "Sam Someone" has beaten "Chris Third" 7 to 3 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Chris Third" in the Swiss is marked as lost

  Rule: A withdrawn game is among the results, struck through, and counts for nothing

    Scenario: A withdrawn game is among the results
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is "A. Another +3"

    Scenario: A withdrawn game is marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is marked as withdrawn

    Scenario: A game not withdrawn is not marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is not marked as withdrawn

    Scenario: A withdrawn game is struck through
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is struck through

    Scenario: A withdrawn game is not among the games played
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Games" of "Sam Someone" in the Swiss are "0"

    Scenario: A withdrawn player's result is marked as withdrawn in their opponent's row
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Sam Someone" in the Swiss is marked as withdrawn

    Scenario: A withdrawn player's result is struck through
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first result of "Alex Another" in the Swiss is struck through

    Scenario: A withdrawn player's game is not among the games played
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the "Games" of "Sam Someone" in the Swiss are "0"

  Rule: On a phone the page fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 7 to 4 in "Zed" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 7 to 6 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the page is no wider than the window

  Rule: The Swiss's three views are offered, and its own address shows the view chosen last

    Scenario: The views are offered in order
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the first view offered is "Grid"
      And the second view offered is "Summary"
      And the third view offered is "Order of Play"

    Scenario: A reader who has chosen no view is shown the grid
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: A reader who chose the summary is shown the summary
      Given the page at "/2026/gc/spring-open/competitions/zed/summary" is open
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the view "Summary" is marked as the one being read

  Rule: Its sections are the tournament's, with the Swiss marked

    Scenario: The Swiss is marked as the section being read
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the section "Zed" is marked as current

  Rule: An address with no Swiss a reader is sent to is not a page

    Scenario: An archived Swiss is not found
      Given "organiser@example.com" has archived the competition "Zed" in "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's Swisses are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the Swiss where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "ac"
      When the page at "/2026/gc/spring-open/competitions/zed/grid" is opened
      Then the address is "/2026/ac/spring-open/competitions/zed/grid"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the Swiss's name, the players' names and what they
    represent, the opponents' names in the results, and the numbers.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Chris Third" from "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed" is opened
      Then every word in the page's content but the tournament's own is in the test locale
