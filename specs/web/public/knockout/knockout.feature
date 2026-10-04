@browser @postgres
Feature: A knockout's grid draws its draw round by round

  Each competition of a tournament is a section of it, found at the
  tournament's address followed by the competition's slug, as
  "/2026/ac/spring-open/competitions/finals". A knockout there is shown three
  ways, as a block is (`block.feature`): its grid, at the knockout's address
  followed by "grid", its summary (`knockoutSummary.feature`) and its order
  of play (`orderOfPlay.feature`), each offering all three on the
  line of the knockout's name. The view a reader chose last is the one the
  knockout's own address shows, the grid where they have chosen none, and the
  choice is the one they made on a block's pages or a knockout's, whichever
  was last, since it is one choice for every competition.

  The grid draws the draw as the old site did (`PublicKnockoutOfTournament.feature`):
  a column for each round, first round first, from left to right, each headed
  by the round's name. The last round is the "Final", the one before it the
  "Semi Finals" and the one before that the "Quarter Finals"; any before those
  are "Round 1", "Round 2" and so on, counted from the first.

  A round's column has its matches in the order of the draw, each match its
  two sides one above the other. A side is a player, shown as the
  tournament's other pages show one, their name leading to their own page, a
  bye, said as "Bye", or a place not yet known, left empty until the match
  before it is decided. A withdrawn player says they have withdrawn. Beside
  each side is a cell for each game the match is the best of, holding the
  side's score in that game as it was typed, oldest first, and empty for a
  game not played. Each score is marked as won or lost, as the block's grid
  marks it, by more than its colour.

  A later round's match stands beside the two matches whose winners it is
  between, and level with the gap between them, so that a reader follows a
  player along a line from the first round to the final.

  The grid is wider than a phone, so on a phone it scrolls across within the
  page, and the page itself is no wider than the window. While there is more
  of it to the right, an arrow halfway down its right edge says so, and
  pressing it brings the final into view, so that a reader who does not think
  to scroll still finds the rounds beyond the first. Once it has been scrolled
  away from its start, an arrow halfway down its left edge leads back, and
  pressing it brings the first round into view. Where the whole grid fits
  there is neither, and there is no arrow on to the right once the grid has
  been scrolled to its end, nor back to the left while it is at its start.
  Since halfway down a grid of many rounds can be out of the window, the same
  arrows stand above the grid and below it as well, at either end, and above
  and below it there is nothing at all where the whole grid fits, rather than
  room kept for them.

  Its sections are the tournament's, with the knockout marked.

  A knockout that is archived, a slug no competition has, and a Swiss, which
  is shown otherwise and is not a page until the feature that shows it
  lands, are not pages; nor is any knockout of an archived tournament, or one
  the website never had. An address the tournament has moved on from leads to
  the knockout where the tournament is now.

  Where a scenario says nothing else, the tournament is for the sport "ac"
  and starts on 3 October 2026, and its knockout has a draw of 4 places, its
  first round the best of 3 and its final the best of 1, with "Sam Someone"
  drawn against "Alex Another" and "Chris Third" against "Pat Fourth".

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
    And the knockout's first round is to be the best of 3
    And the knockout's second round is to be the best of 1
    And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
    And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"

  Rule: The page is the knockout's, for anybody

    Scenario: The page is headed by the knockout's name
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the page is headed "Finals"

    Scenario: A reader not signed in is shown the grid
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the first match of the first round in the grid is "Sam Someone"

  Rule: A column for each round, headed by its name

    Scenario: The rounds are headed from the first to the final
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first round in the grid is headed "Semi Finals"
      And the second round in the grid is headed "Final"

    Scenario: The round before the semi-finals is the quarter-finals
      Given the knockout's first round is to be the best of 1
      And the knockout's second round is to be the best of 1
      And the knockout is to have a draw of 8 places
      And its third round is to be the best of 1
      And "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And 8 players have been entered in "Plate" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/plate" is opened
      Then the first round in the grid is headed "Quarter Finals"

    Scenario: A round before the quarter-finals is counted from the first
      Given the knockout's first round is to be the best of 1
      And the knockout's second round is to be the best of 1
      And the knockout is to have a draw of 16 places
      And its third round is to be the best of 1
      And its fourth round is to be the best of 1
      And "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And 16 players have been entered in "Plate" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/plate" is opened
      Then the first round in the grid is headed "Round 1"

  Rule: A match is its two sides one above the other, in the order of the draw

    Scenario: The first two places meet in the first match
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the first match of the first round in the grid is "Sam Someone"
      And the second side of the first match of the first round in the grid is "Alex Another"

    Scenario: The next two places meet in the next match
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the second match of the first round in the grid is "Chris Third"
      And the second side of the second match of the first round in the grid is "Pat Fourth"

    Scenario: The second side is beneath the first
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the second side of the first match of the first round in the grid is beneath its first

    Scenario: A player's name leads to their own page
      Given the page at "/2026/ac/spring-open/competitions/finals" is open
      When the name of "Alex Another" in the grid is pressed
      Then the address is "/2026/ac/spring-open/players/alex-another"

    Scenario: A side says what its player represents
      # Kim is drawn last, since players are drawn in the tournament's order.
      Given the player is to represent "Canterbury"
      And "organiser@example.com" has added the player "Kim Fifth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Kim Fifth" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/plate" is opened
      Then the second side of the second match of the first round in the grid says they represent "Canterbury"

    Scenario: A withdrawn player says they have withdrawn
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the second side of the first match of the first round in the grid says they have withdrawn

    Scenario: A bye is said as a bye
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/plate" is opened
      Then the second side of the first match of the first round in the grid is a bye

    Scenario: A side not yet known is empty
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the first match of the second round in the grid is not yet known

    Scenario: The winner of a match is a side of the next
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the first match of the second round in the grid is "Sam Someone"

  Rule: Beside each side is a cell for each game of the match, holding the side's score

    Scenario: A side has a cell for each game the match is the best of
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the first match of the first round in the grid has room for 3 scores

    Scenario: A side in the final has a cell for each game it is the best of
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first side of the first match of the second round in the grid has room for 1 score

    Scenario: A side's score is in the cell of its game
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first score of the first side of the first match of the first round in the grid is "26"

    Scenario: The other side's score is in the cell of the same game
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first score of the second side of the first match of the first round in the grid is "17"

    Scenario: A score is shown as it was typed
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first score of the first side of the first match of the first round in the grid is "26tp"

    Scenario: The games are oldest first
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first score of the first side of the first match of the first round in the grid is "17"
      And the second score of the first side of the first match of the first round in the grid is "26"

    Scenario: A game not played leaves its cell empty
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the second score of the first side of the first match of the first round in the grid is empty

    Scenario: A score won is marked as won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first score of the first side of the first match of the first round in the grid is marked as won

    Scenario: A score lost is marked as lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first score of the second side of the first match of the first round in the grid is marked as lost

  Rule: A later round's match stands beside and between the two matches before it

    Scenario: The final is to the right of the semi-finals
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first match of the second round in the grid is to the right of the first match of the first round

    Scenario: The final is level with the gap between the semi-finals
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first match of the second round in the grid is between the first and second matches of the first round

  Rule: On a phone the grid scrolls across within the page

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the page is no wider than the window

    Scenario: On a phone the grid can be scrolled across
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the grid can be scrolled across

    Scenario: On a phone an arrow says there is more of the grid to the right
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then an arrow across the grid is shown

    Scenario: Pressing the arrow brings the final into view
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow across the grid is pressed
      Then the final is in view within the grid

    Scenario: Once the grid is scrolled to its end there is no arrow
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow across the grid is pressed
      Then no arrow across the grid is shown

    Scenario: Where the whole grid fits there is no arrow
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then no arrow across the grid is shown

    Scenario: At the grid's start there is no arrow back
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then no arrow back across the grid is shown

    Scenario: Once the grid is scrolled from its start an arrow leads back
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow across the grid is pressed
      Then an arrow back across the grid is shown

    Scenario: Pressing the arrow back brings the first round into view
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      And the arrow across the grid is pressed
      When the arrow back across the grid is pressed
      Then the first round is in view within the grid

    Scenario: Where the whole grid fits there is no arrow back
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then no arrow back across the grid is shown

    Scenario: On a phone an arrow above the grid says there is more to the right
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then an arrow above the grid is shown

    Scenario: The arrow above the grid is above it
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the arrow above the grid is above the first round

    Scenario: Pressing the arrow above the grid brings the final into view
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow above the grid is pressed
      Then the final is in view within the grid

    Scenario: Once the grid is scrolled from its start an arrow back is above it
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow across the grid is pressed
      Then an arrow back above the grid is shown

    Scenario: Where the whole grid fits there is no arrow above it
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then no arrow above the grid is shown

    Scenario: Where the whole grid fits no room is kept above it
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then no room is kept above the grid

    Scenario: Once the grid is scrolled to its end there is no arrow on above it
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow across the grid is pressed
      Then no arrow above the grid is shown

    Scenario: On a phone an arrow below the grid says there is more to the right
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then an arrow below the grid is shown

    Scenario: The arrow below the grid is below it
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the arrow below the grid is below the first round

    Scenario: Pressing the arrow below the grid brings the final into view
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow below the grid is pressed
      Then the final is in view within the grid

    Scenario: Once the grid is scrolled from its start an arrow back is below it
      Given a viewport 375 pixels wide
      And the page at "/2026/ac/spring-open/competitions/finals" is open
      When the arrow across the grid is pressed
      Then an arrow back below the grid is shown

    Scenario: Where the whole grid fits no room is kept below it
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then no room is kept below the grid

    Scenario: The arrow back leads to the first round
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the arrow back across the grid leads to the first round

    Scenario: The arrow on leads to the final
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the arrow across the grid leads to the final

    Scenario: In a knockout of one round the arrow back leads to its round
      Given the knockout is to have a draw of 2 places
      And "organiser@example.com" has added the knockout "Play-off" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Play-off" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Play-off" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/play-off" is opened
      Then the arrow back across the grid leads to the first round

    Scenario: In a knockout of one round the arrow on leads to its round
      Given the knockout is to have a draw of 2 places
      And "organiser@example.com" has added the knockout "Play-off" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Play-off" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Play-off" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/play-off" is opened
      Then the arrow across the grid leads to the final

  Rule: The knockout's three views are offered, and its own address shows the view chosen last

    Scenario: The views are offered in order
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the first view offered is "Grid"
      And the second view offered is "Summary"
      And the third view offered is "Order of Play"

    Scenario: A reader who has chosen no view is shown the grid
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: Grid leads to the grid
      Given the page at "/2026/ac/spring-open/competitions/finals" is open
      When the view "Grid" is pressed
      Then the address is "/2026/ac/spring-open/competitions/finals/grid"

    Scenario: A reader who chose the summary is shown the summary
      Given the page at "/2026/ac/spring-open/competitions/finals/summary" is open
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the view "Summary" is marked as the one being read

    Scenario: The view chosen on a block's pages is the one a knockout is shown in
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is open
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the view "Order of Play" is marked as the one being read

  Rule: Its sections are the tournament's, with the knockout marked

    Scenario: The knockout is marked as the section being read
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the section "Finals" is marked as current

  Rule: An address with no knockout a reader is sent to is not a page

    Scenario: An archived knockout is not found
      Given "organiser@example.com" has archived the competition "Finals" in "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A Swiss is not found
      Given "organiser@example.com" has added the Swiss "Swiss" to "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/swiss" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's knockouts are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the knockout where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/competitions/finals/grid" is opened
      Then the address is "/2026/gc/spring-open/competitions/finals/grid"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the knockout's name, the players' names and what they
    represent, and the scores, which are what the tournament's managers and
    scorers typed.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Pat Fourth" from "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: A bye is said in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/plate" is opened
      Then every word in the page's content but the tournament's own is in the test locale
