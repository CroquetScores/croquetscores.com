@browser @postgres
Feature: A block's summary ranks its players

  A block is shown three ways (`block.feature`). Its summary, at the block's
  address followed by "summary", as
  "/2026/ac/spring-open/competitions/block-a/summary", is the one for a
  phone: a short table with a row for each player and a few numbers beside
  them, where the grid has a column for every player.

  A row is headed by the player as the tournament's other pages show one:
  their name, leading to their own page, what they represent and their flag.
  A withdrawn player's row says they have withdrawn, and their name is struck
  through, since their games count for nothing
  (`PublicBlockOfTournament.feature`). Beside them are the matches they have
  won, headed "Wins", and the matches they have lost, headed "Losses", then,
  where a match is the best of more than one game, their net games, headed
  "Net Games", and their net hoops, headed "Net Hoops", each of two words on two
  lines as the grid's headings are. Where each match is a single game there
  are no net games to say, so it is "Wins", "Losses" and "Net Hoops". Net
  games and net hoops carry their sign, as "+9" and "-9", so that ahead and
  behind read as such down the column; none is "0". Where the block is played
  as Advantage Golf Croquet, net hoops are headed "Net SF%" in place, as they
  are on the grid (`block.feature`).

  The rows are the players ranked (`PublicBlockOfTournament.feature`): by the
  share of their decided matches they have won, and those level on that as the
  block's tie break says (`placingsOfBlock.feature`). Beneath the table the
  page says it is ranked by the share of matches won, and that a tournament's
  own regulations may place its players otherwise, since a ranking that claimed
  to be the final placings would be wrong for any tournament whose
  regulations decide them some other way.

  At the end of each row is the player's place, headed "#": "1" for the first,
  and "=2" where others share second, as players do who cannot be told apart
  (`placingsOfBlock.feature`). A withdrawn player has no place, so theirs is
  blank. Beneath the table, where any players are level on the matches they
  have won, the page says how they are told apart, as the grid does
  (`block.feature`).

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
      Then the competition is headed "Block A"

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

    Scenario: A withdrawn player's name is struck through
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the name of "Alex Another" in the summary is struck through

    Scenario: A player who has not withdrawn is not struck through
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the name of "Sam Someone" in the summary is not struck through

    Scenario: A withdrawn player's games are not counted
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Wins" of "Sam Someone" in the summary are "0"

  Rule: A name is kept together, so that a narrow row breaks where it reads best

    A phone's row is narrow, and a name that breaks wherever there is a space
    leaves a first name on one line and its last name on the next. So a player's
    name is held together, and a doubles pair's name is held together on each
    side of its ampersand, which stays with the first player and is the one
    place a line may break: "Tim Murphy &" over "Alison Sharpe".

    Nor is a word broken part-way along to fit. Where a name is wider than the
    room beside the numbers, the table is wider than the window and scrolls
    across within the page, as the grid does, so that "Logan McCorkindale &"
    is never "Logan Mc" over "Corkindale".

    Scenario: A player's name has nowhere to break
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the name of "Sam Someone" in the summary has 0 places to break a line

    Scenario: A pair's name has one place to break
      Given "organiser@example.com" has added the player "Tim Murphy & Alison Sharpe" to "Spring Open"
      And "organiser@example.com" has entered the player "Tim Murphy & Alison Sharpe" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the name of "Tim Murphy & Alison Sharpe" in the summary has 1 place to break a line

    Scenario: A pair's name breaks after its ampersand
      Given "organiser@example.com" has added the player "Tim Murphy & Alison Sharpe" to "Spring Open"
      And "organiser@example.com" has entered the player "Tim Murphy & Alison Sharpe" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the name of "Tim Murphy & Alison Sharpe" in the summary breaks after its ampersand

    Scenario: No word of a name is broken on a phone
      Given a viewport 320 pixels wide
      And "organiser@example.com" has added the player "Logan McCorkindale & Felix Gelman White" to "Spring Open"
      And "organiser@example.com" has entered the player "Logan McCorkindale & Felix Gelman White" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then no word of any name in the summary is broken

    Scenario: A table wider than a phone scrolls across within the page
      Given a viewport 320 pixels wide
      And "organiser@example.com" has added the player "Logan McCorkindale & Felix Gelman White" to "Spring Open"
      And "organiser@example.com" has entered the player "Logan McCorkindale & Felix Gelman White" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the summary scrolls sideways
      And the page does not scroll sideways

  Rule: Where a match is the best of more than one game, beside each player are their wins, their losses, their net games and their net hoops

    Scenario: The columns are headed in order
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the first column of the summary is headed "Wins"
      And the second column of the summary is headed "Losses"
      And the third column of the summary is headed "Net Games"
      And the fourth column of the summary is headed "Net Hoops"
      And the fifth column of the summary is headed "#"

    Scenario: A heading of two words is on two lines
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the third column of the summary is headed in 2 lines
      And the fourth column of the summary is headed in 2 lines

    Scenario: A heading of one word is on one line
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the first column of the summary is headed in 1 line

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

    Scenario: Net games ahead carry a plus
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Net Games" of "Sam Someone" in the summary are "+2"

    Scenario: Net games behind carry a minus
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Net Games" of "Alex Another" in the summary are "-2"

    Scenario: No net games carry no sign
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "Net Games" of "Sam Someone" in the summary are "0"

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

  Rule: Where each match is a single game, beside each player are their wins, their losses and their net hoops

    Background:
      Given the block is to be the best of 1
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"

    Scenario: The columns are headed in order
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the first column of the summary is headed "Wins"
      And the second column of the summary is headed "Losses"
      And the third column of the summary is headed "Net Hoops"
      And the fourth column of the summary is headed "#"

    Scenario: A heading of two words is on two lines
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the third column of the summary is headed in 2 lines

    Scenario: A player's wins are the games they have won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the "Wins" of "Sam Someone" in the summary are "1"

    Scenario: A player's losses are the games they have lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the "Losses" of "Alex Another" in the summary are "1"

    Scenario: Net hoops ahead carry a plus
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the "Net Hoops" of "Sam Someone" in the summary are "+9"

  Rule: At the end of each row is the player's place

    Scenario: The last column is headed #
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the fifth column of the summary is headed "#"

    Scenario: The first player's place is 1
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "#" of "Alex Another" in the summary are "1"

    Scenario: The player after is second
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "#" of "Sam Someone" in the summary are "2"

    Scenario: A place players share is marked with an equals sign
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And the block is to go by the tie break "other"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the "#" of "Sam Someone" in the summary are "=2"
      And the "#" of "Chris Third" in the summary are "=2"

    Scenario: Nobody has a place before anything is played
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "#" of "Sam Someone" in the summary are ""

    Scenario: A withdrawn player's place is blank
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the "#" of "Alex Another" in the summary are ""

  Rule: Beneath the table, where players are level on matches won, the page says how they are told apart

    Scenario: Net games then net hoops then who beat who is said in full
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the page says "Tie breaks are decided by net games then net hoops then who beat who."

    Scenario: Net games are left out where each match is a single game
      Given the block is to be the best of 1
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the page says "Tie breaks are decided by net hoops then who beat who."

    Scenario: Who beat who alone is said
      Given the block is to go by the tie break "who-beat-who"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the page says "Tie breaks are decided by who beat who."

    Scenario: That there is no known way is said
      Given the block is to go by the tie break "other"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-b/summary" is opened
      Then the page says "There is no known tie break method."

    Scenario: Nothing is said where no players are level
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the page does not say "Tie breaks are decided by net games then net hoops then who beat who."

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
      Then the page says "Not found"

    Scenario: An archived tournament's blocks are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the page says "Not found"

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

  Rule: A block played as Advantage Golf Croquet is summarised in net SF%

    As the grid shows it (`block.feature`): the page says it is played as
    Advantage Golf Croquet, and its net hoops column, the fourth where a match is
    more than one game and the third where it is a single game, is headed
    "Net SF%", the percentage points a player made less those made against them, in place of
    "Net Hoops". Its values are the plain numbers, with no percent sign after
    them since the heading already says what they are, and a plus or a minus
    before them as they do in any other block.

    Background:
      Given the tournament "Spring Open" is for the sport "gc"
      And the competition is to be played as Advantage
      And "organiser@example.com" has added the block "Block G" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block G" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block G" of "Spring Open"

    Scenario: The page says it is played as Advantage Golf Croquet
      When the page at "/2026/gc/spring-open/competitions/block-g/summary" is opened
      Then the competition says it is played as Advantage Golf Croquet

    Scenario: The fourth column is headed Net SF%
      When the page at "/2026/gc/spring-open/competitions/block-g/summary" is opened
      Then the fourth column of the summary is headed "Net SF%"

    Scenario: Where each match is a single game the third column is headed Net SF%
      Given the block is to be the best of 1
      And the competition is to be played as Advantage
      And "organiser@example.com" has added the block "Block S" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block S" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block S" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/block-s/summary" is opened
      Then the third column of the summary is headed "Net SF%"

    Scenario: Net SF% ahead carries a plus
      Given "Sam Someone" has beaten "Alex Another" 5 of 6 to 5 of 8 in "Block G" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/block-g/summary" is opened
      Then the "Net SF%" of "Sam Someone" in the summary are "+20"

    Scenario: No net SF% carries no sign
      When the page at "/2026/gc/spring-open/competitions/block-g/summary" is opened
      Then the "Net SF%" of "Sam Someone" in the summary are "0"

    Scenario: Net SF% behind carries a minus
      Given "Sam Someone" has beaten "Alex Another" 5 of 6 to 5 of 8 in "Block G" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/block-g/summary" is opened
      Then the "Net SF%" of "Alex Another" in the summary are "-20"

    Scenario: A tie is said to be told apart by net SF%
      Given the block is to be the best of 1
      And the competition is to be played as Advantage
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the block "Block Tie" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block Tie" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block Tie" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block Tie" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 5 of 6 to 5 of 8 in "Block Tie" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/block-tie/summary" is opened
      Then the page says "Tie breaks are decided by net SF% then who beat who."

    Scenario: A block that is not Advantage is still headed Net Hoops
      When the page at "/2026/gc/spring-open/competitions/block-a/summary" is opened
      Then the fourth column of the summary is headed "Net Hoops"

  Rule: A name and what is known of the player are each kept whole, and wrap only between them

    # A name is never broken, nor is what is known of the player. Where they do not fit
    # on a row together, it is the row that breaks, between the two.

    Scenario: A player's name is never broken, on a phone
      Given a viewport 320 pixels wide
      And "organiser@example.com" has added the player "Bartholomew Featherstonehaugh Wolstenholme" to "Spring Open"
      And "organiser@example.com" has entered the player "Bartholomew Featherstonehaugh Wolstenholme" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Bartholomew Featherstonehaugh Wolstenholme" in the summary has its name on one line

    Scenario: A player's meta-data is never broken, on a phone
      Given a viewport 320 pixels wide
      And the player is to have the handicap "4"
      And the player is to represent "Canterbury Croquet Club of Christchurch"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Bartholomew Featherstonehaugh Wolstenholme" to "Spring Open"
      And "organiser@example.com" has entered the player "Bartholomew Featherstonehaugh Wolstenholme" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Bartholomew Featherstonehaugh Wolstenholme" in the summary has its meta-data on one line

    Scenario: A player's meta-data is on a row beneath their name where there is no room beside it
      Given a viewport 320 pixels wide
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Bartholomew Featherstonehaugh Wolstenholme" to "Spring Open"
      And "organiser@example.com" has entered the player "Bartholomew Featherstonehaugh Wolstenholme" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Bartholomew Featherstonehaugh Wolstenholme" in the summary has its meta-data below its name

    Scenario: A player's meta-data is beside their name where there is room
      Given a viewport 1200 pixels wide
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary has its meta-data beside its name

    Scenario: A player's meta-data is always on a row beneath their name on a phone
      Given a viewport 375 pixels wide
      And the player is to have the handicap "4"
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary has its meta-data below its name

    Scenario: A player's meta-data is always on a row beneath their name on a tablet held upright
      Given a viewport 800 pixels wide and 1000 pixels high
      And the player is to have the handicap "4"
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary has its meta-data below its name

    Scenario: A player's meta-data is always on a row beneath their name on a tablet held sideways
      Given a viewport 1024 pixels wide and 768 pixels high
      And the player is to have the handicap "4"
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary has its meta-data below its name

    Scenario: A withdrawn player's mark is on the row of their name on a phone
      Given a viewport 375 pixels wide
      And the player is to have the handicap "4"
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Chris Third" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary has the mark that they have withdrawn above its meta-data

    Scenario: A withdrawn player's meta-data is struck through
      Given the player is to have the handicap "4"
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Chris Third" from "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary has its meta-data struck through

    Scenario: A player who has not withdrawn has no line through their meta-data
      Given the player is to have the handicap "4"
      And the player is to represent "Canterbury"
      And the player is to fly the flag "nz"
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/summary" is opened
      Then the row of "Chris Third" in the summary does not have its meta-data struck through
