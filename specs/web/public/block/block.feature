@browser @postgres
Feature: A block's page shows its results as a grid

  Each competition of a tournament is a section of it, found at the
  tournament's address followed by the competition's slug, as
  "/2026/ac/spring-open/competitions/block-a" (`tournamentPages.ts`). A
  block's page there shows its results as a grid, as the old site did
  (`PublicBlockOfTournament.feature`), and is headed by the block's name.

  The grid has a row for each player entered in the block, in the block's
  order, headed by the player as the tournament's other pages show one: their
  name, leading to their own page, what they represent and their flag. A
  withdrawn player's row says they have withdrawn, and their name is struck
  through, as are their games, which count for nothing
  (`PublicBlockOfTournament.feature`).

  It has a column for each player too, in the same order, so that the cell
  where a player's row meets their opponent's column holds the games between
  them. A column is headed by the player's initials, since there is no room
  across a phone for every name, and is named in full for whatever reads the
  page aloud. A player's initials are the first letter or digit of each word
  of their name, a word being what spaces part, so "Kerri-Ann Organ" is "KO".
  Where a player's row meets their own column there is nothing to hold, and
  the cell is blacked out.

  A cell holds the row player's score in each game against the column
  player, as it was typed, oldest first, one beneath another, so that a best
  of 3 has room for three. Each score is marked as won, lost or drawn, for
  the row player, so the same game reads as won in one player's row and lost
  in the other's. The marks are told apart by more than colour. A withdrawn
  game was played, so it is in its cell, but it counts for nothing
  (`withdrawGame.feature`), so it is marked as withdrawn, struck through,
  and left out of the totals.

  After the players' columns come each player's totals, as the old site had
  them. Where each match is a single game, a game won is a match won, and the
  totals are the player's wins and their net hoops, headed "Wins" and "Net
  Hoops". Where a match is the best of more than one game, the totals are the
  matches they have won, their net games, the games they have won and their
  net hoops, headed "Matches", "Net Games", "Games" and "Net Hoops", in that
  order, since matches decide a block before games and games before hoops. A
  heading of more than one word has a word to a line, so that its column is
  no wider than its numbers need.

  The grid is wider than a phone when a block has more than a few players,
  so on a phone the grid scrolls across within the page, and the page itself
  is no wider than the window.

  Its sections are the tournament's, with the block marked.

  The grid is one of three views of a block, as it was on the old site: the
  grid, a summary (`blockSummary.feature`) and the order of play
  (`orderOfPlay.feature`). Each is at the block's address followed by
  its own name, "grid", "summary" and "order-of-play", and each, on the same
  line as its heading and against the right edge, offers all three, Grid,
  Summary and Order of Play, the one being read marked as the view being
  read. Where there is not room beside the heading, they wrap beneath it.

  A reader who chooses a view keeps it until they choose another, as on the
  old site: the block's own address, which is where the section bar and every
  other page lead, shows the view they chose last, and the grid where they
  have chosen none, since it is the whole of the block at once. Opening a
  view at its own address is choosing it, whether by pressing it among the
  views offered or by following a link to it. The choice is one for every
  block, knockout and Swiss (`knockout.feature`, `swiss.feature`), on every
  tournament, so that
  a reader who follows a tournament on a phone chooses the summary once
  rather than once a competition.

  The choice is kept in a cookie for a year, held to the standard the theme's
  is (`theme.feature`): never sent in the clear, and not to be read by a
  script on the page.

  A block that is archived and a slug no competition has are not pages; nor
  is any block of an archived tournament, or one the website never had. A
  knockout or a Swiss at the same address is shown as one
  (`knockout.feature`, `swiss.feature`). An address the tournament has moved
  on from leads to the block where the tournament is now.

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

  Rule: The page is the block's, for anybody

    Scenario: The page is headed by the block's name
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the page is headed "Block A"

    Scenario: A reader not signed in is shown the grid
      Given nobody is signed in
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is "26"

  Rule: A row for each player, in the block's order

    Scenario: The players' rows are in the block's order
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first row of the grid is "Sam Someone"
      And the second row of the grid is "Alex Another"

    Scenario: A player moved in the block is where they were moved to
      Given "organiser@example.com" has moved the player "Alex Another" in "Block A" of "Spring Open" up
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first row of the grid is "Alex Another"

    Scenario: A player's row says what they represent
      Given the player is to represent "Canterbury"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the row of "Chris Third" in the grid says they represent "Canterbury"

    Scenario: A player's name leads to their own page
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      When the name of "Alex Another" in the grid is pressed
      Then the address is "/2026/ac/spring-open/players/alex-another"

    Scenario: A withdrawn player's row says they have withdrawn
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the row of "Alex Another" in the grid says they have withdrawn

    Scenario: A player who has not withdrawn does not say so
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the row of "Sam Someone" in the grid does not say they have withdrawn

  Rule: A column for each player, headed by their initials

    Scenario: The players' columns are in the block's order
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first column of the grid is headed "SS"
      And the second column of the grid is headed "AA"

    Scenario: A column is named in full
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first column of the grid is named "Sam Someone"

    Scenario Outline: A player's initials are the first letter or digit of each word of their name
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has added the player "<name>" to "Spring Open"
      And "organiser@example.com" has entered the player "<name>" in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b" is opened
      Then the first column of the grid is headed "<initials>"

      Examples:
        | name            | initials |
        | Kerri-Ann Organ | KO       |
        | Jan van Dijk    | JvD      |
        | Agent 007       | A0       |
        | 李 小龍         | 李小     |

    Scenario: Where a player meets themselves the cell is blacked out
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the cell where "Sam Someone" meets "Sam Someone" is blacked out

  Rule: A cell holds the row player's score in each game against the column player

    Scenario: A cell holds the row player's score
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is "26"

    Scenario: The opponent's cell holds their own score
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Alex Another" meets "Sam Someone" is "17"

    Scenario: A score is shown as it was typed
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is "26tp"

    Scenario: A score won is marked as won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is marked as won

    Scenario: A score lost is marked as lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Alex Another" meets "Sam Someone" is marked as lost

    Scenario: A score drawn is marked as drawn
      Given "organiser@example.com" has created the tournament "Autumn Open" allowing drawn games
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Autumn Open"
      When the page at "/2026/ac/autumn-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is marked as drawn

    Scenario: The games between two players are oldest first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is "26"
      And the second score where "Sam Someone" meets "Alex Another" is "20"

    Scenario: An archived game is not shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the cell where "Sam Someone" meets "Alex Another" is empty

  Rule: A withdrawn game is shown, struck through, and counts for nothing

    Scenario: A withdrawn game is shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is "26"

    Scenario: A withdrawn game is marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is marked as withdrawn

    Scenario: A game not withdrawn is not marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is not marked as withdrawn

    Scenario: A withdrawn game is struck through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is struck through

    Scenario: A withdrawn game is not counted in the totals
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the "Games" of "Sam Someone" in the grid are "0"

  Rule: A withdrawn player's name and games are struck through, and their games count for nothing

    Scenario: A withdrawn player's name is struck through
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the name of "Alex Another" in the grid is struck through

    Scenario: A player who has not withdrawn is not struck through
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the name of "Sam Someone" in the grid is not struck through

    Scenario: A withdrawn player's game is marked as withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Alex Another" meets "Sam Someone" is marked as withdrawn

    Scenario: A withdrawn player's game is struck through in their opponent's row too
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first score where "Sam Someone" meets "Alex Another" is struck through

    Scenario: A withdrawn player's game is not counted in the totals
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the "Games" of "Sam Someone" in the grid are "0"

  Rule: Where a match is the best of more than one game, the totals are matches, net games, games and net hoops

    Scenario: The totals are headed in order
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first total of the grid is headed "Matches"
      And the second total of the grid is headed "Net Games"
      And the third total of the grid is headed "Games"
      And the fourth total of the grid is headed "Net Hoops"

    Scenario: A total headed in two words has a word to a line
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the second total of the grid is headed in 2 lines

    Scenario: A total headed in one word has one line
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first total of the grid is headed in 1 line

    Scenario: A player's matches are shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the "Matches" of "Sam Someone" in the grid are "1"

    Scenario: A player's net games are shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the "Net Games" of "Alex Another" in the grid are "-2"

    Scenario: A player's games are shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the "Games" of "Sam Someone" in the grid are "2"

    Scenario: A player's net hoops are shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the "Net Hoops" of "Alex Another" in the grid are "-9"

  Rule: Where each match is a single game, the totals are wins and net hoops

    Background:
      Given the block is to be the best of 1
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"

    Scenario: The totals are headed in order
      When the page at "/2026/ac/spring-open/competitions/block-b" is opened
      Then the first total of the grid is headed "Wins"
      And the second total of the grid is headed "Net Hoops"

    Scenario: There are two totals
      When the page at "/2026/ac/spring-open/competitions/block-b" is opened
      Then the grid has 2 totals

    Scenario: A player's wins are shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b" is opened
      Then the "Wins" of "Sam Someone" in the grid are "1"

    Scenario: A player's net hoops are shown
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b" is opened
      Then the "Net Hoops" of "Alex Another" in the grid are "-9"

  Rule: On a phone the grid scrolls across within the page

    Background:
      Given "organiser@example.com" has added the block "Block C" to "Spring Open"
      And 8 players have been entered in "Block C" of "Spring Open"

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/block-c" is opened
      Then the page is no wider than the window

    Scenario: On a phone the grid can be scrolled across
      Given a viewport 375 pixels wide
      When the page at "/2026/ac/spring-open/competitions/block-c" is opened
      Then the grid can be scrolled across

  Rule: The block's three views are offered, the grid marked

    Scenario: The views are offered in order
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first view offered is "Grid"
      And the second view offered is "Summary"
      And the third view offered is "Order of Play"

    Scenario: The grid is marked as the view being read
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: The summary is not marked
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Summary" is not marked as the one being read

    Scenario: Grid leads to the grid
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      When the view "Grid" is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a/grid"

    Scenario: Summary leads to the summary
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      When the view "Summary" is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a/summary"

    Scenario: Order of Play leads to the order of play
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      When the view "Order of Play" is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a/order-of-play"

  Rule: The block's own address shows the view a reader chose last

    Scenario: A reader who has chosen no view is shown the grid
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: A reader who chose the summary is shown the summary
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      And the view "Summary" is pressed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Summary" is marked as the one being read

    Scenario: A reader who chose the order of play is shown the order of play
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      And the view "Order of Play" is pressed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Order of Play" is marked as the one being read

    Scenario: A reader who chose the grid again is shown the grid
      Given the page at "/2026/ac/spring-open/competitions/block-a" is open
      And the view "Summary" is pressed
      And the view "Grid" is pressed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Grid" is marked as the one being read

    Scenario: Following a link to a view chooses it
      Given the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is open
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the view "Order of Play" is marked as the one being read

    Scenario: The section bar leads to the view chosen
      Given the page at "/2026/ac/spring-open/competitions/block-a/summary" is open
      And the page at "/2026/ac/spring-open" is open
      When the section "Block A" is pressed
      Then the view "Summary" is marked as the one being read

    Scenario: The view chosen is the one every block is shown in
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the page at "/2026/ac/spring-open/competitions/block-a/summary" is open
      When the page at "/2026/ac/spring-open/competitions/block-b" is opened
      Then the view "Summary" is marked as the one being read

    Scenario: The view chosen is kept in a cookie never sent in the clear
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the view chosen is kept in a cookie marked Secure

    Scenario: The view chosen is kept in a cookie no script on the page can read
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the view chosen is kept in a cookie marked HttpOnly

  Rule: Its sections are the tournament's, with the block marked

    Scenario: The block is marked as the section being read
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the section "Block A" is marked as current

    Scenario: Recent is not marked
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the section "Recent" is not marked as current

  Rule: An address with no block a reader is sent to is not a page

    Scenario: A slug no competition has is not found
      When the page at "/2026/ac/spring-open/competitions/block-z" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived block is not found
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's blocks are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the block where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the address is "/2026/gc/spring-open/competitions/block-a"

    Scenario: An old address in another script leads to the block where the tournament is now
      Given "organiser@example.com" has created the tournament "Кубок"
      And "organiser@example.com" has added the block "Block A" to "Кубок"
      And "organiser@example.com" has moved the tournament "Кубок" to the sport "gc"
      When the page at "/2026/ac/кубок/competitions/block-a" is opened
      Then the page is headed "Block A"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the block's name, the players' names, initials and what they
    represent, the scores and the totals, which are what the tournament's
    managers and scorers typed or what is counted from it.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then every word in the page's content but the tournament's own is in the test locale
