@browser @postgres
Feature: A block's summary ranks its players

  A block is shown three ways (`block.feature`). Its summary, at the block's
  address followed by "summary", as
  "/2026/ac/spring-open/competitions/block-a/summary", is the one for a
  phone: a short table with a row for each player and three numbers beside
  them, where the grid has a column for every player.

  A row is headed by the player as the tournament's other pages show one:
  their name, leading to their own page, what they represent and their flag.
  A withdrawn player's row says they have withdrawn. Beside them are the
  matches they have won, headed "Wins", the matches they have lost, headed
  "Losses", and their net hoops, headed "Net Hoops" and, being two words, on
  two lines as the grid's headings are. Where each match is a single game, a
  game won is a match won, so the same three serve a block of any best-of.
  Net hoops carry their sign, as "+9" and "-9", so that ahead and behind
  read as such down the column; none is "0".

  The rows are the players ranked (`PublicBlockOfTournament.feature`): by the
  share of their decided matches they have won, then by their net hoops.
  Beneath the table the page says so, and that a tournament's own
  regulations may place its players otherwise, since a ranking that claimed
  to be the final placings would be wrong for any tournament whose
  regulations decide them some other way.

  Like the grid, it is headed by the block's name, offers the block's three
  views with Summary marked as the one being read, and its sections are the
  tournament's, with the block marked. It is not a page wherever the grid is
  not, and an address the tournament has moved on from leads to the summary
  where the tournament is now.

  Where a scenario says nothing else, the tournament is for the sport "ac"
  and starts on 3 October 2026, and its block is the best of 3, so that two
  players can meet more than once.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: The page is the block's summary, for anybody

    Scenario: The page is headed by the block's name
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the page is headed "Block A"

    Scenario: A reader not signed in is shown the summary
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the first row of the summary is "Sam Someone"

  Rule: A row for each player, ranked

    Scenario: The players are ranked
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the first row of the summary is "Alex Another"
      And the second row of the summary is "Sam Someone"

    Scenario: A player's row says what they represent
      Given the player is to represent "Canterbury"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary says they represent "Canterbury"

    Scenario: A player's name leads to their own page
      Given the page at "/2026/ac/spring-open/competitions/block-a/summary" is open
      When the name of "Alex Another" in the summary is pressed
      Then the address is "/2026/ac/spring-open/players/alex-another"

    Scenario: A withdrawn player's row says they have withdrawn
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Alex Another" in the summary says they have withdrawn

    Scenario: A player who has not withdrawn does not say so
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Sam Someone" in the summary does not say they have withdrawn

  Rule: Beside each player are their wins, their losses and their net hoops

    Scenario: The columns are headed in order
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the first column of the summary is headed "Wins"
      And the second column of the summary is headed "Losses"
      And the third column of the summary is headed "Net Hoops"

    Scenario: A heading of two words is on two lines
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the third column of the summary is headed in 2 lines

    Scenario: A player's wins are the matches they have won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Wins" of "Sam Someone" in the summary are "1"

    Scenario: A player's losses are the matches they have lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Losses" of "Alex Another" in the summary are "1"

    Scenario: Net hoops ahead carry a plus
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Net Hoops" of "Sam Someone" in the summary are "+9"

    Scenario: Net hoops behind carry a minus
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Net Hoops" of "Alex Another" in the summary are "-9"

    Scenario: No net hoops carry no sign
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Net Hoops" of "Sam Someone" in the summary are "0"

    Scenario: Where each match is a single game, a game won is a win
      Given the block is to be the best of 1
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the "Wins" of "Sam Someone" in the summary are "1"

  Rule: Beneath the table the page says how the players are ranked

    Scenario: The page says how the players are ranked
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the page says the words for "blockSummary.ranking"

  Rule: On a phone the summary fits the window

    Background:
      Given "organiser@example.com" has added the block "Block C" to "Spring Open"
      And 8 players have been entered in "Block C" of "Spring Open"

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/block-c/summary" is opened
      Then the page is no wider than the window

  Rule: The block's three views are offered, the summary marked

    Scenario: The summary is marked as the view being read
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the view "Summary" is marked as the one being read

    Scenario: The grid is not marked
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the view "Grid" is not marked as the one being read

    Scenario: Grid leads to the grid
      Given the page at "/2026/ac/spring-open/competitions/block-a/summary" is open
      When the view "Grid" is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a/grid"

  Rule: Its sections are the tournament's, with the block marked

    Scenario: The block is marked as the section being read
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the section "Block A" is marked as current

  Rule: An address with no block a reader is sent to is not a page

    Scenario: A slug no competition has is not found
      When the page at "/2026/ac/spring-open/competitions/block-z/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A knockout has no summary
      Given "organiser@example.com" has added the knockout "Knockout" to "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/knockout/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's blocks are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the summary where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the address is "/2026/gc/spring-open/competitions/block-a/summary"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the block's name, the players' names and what they
    represent, and the numbers, which are what the tournament's managers and
    scorers typed or what is counted from it.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then every word in the page's content but the tournament's own is in the test locale
