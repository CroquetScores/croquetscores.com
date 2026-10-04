@browser @postgres
Feature: A competition's order of play lists its games, oldest first

  A block is shown three ways (`block.feature`), and so is a knockout
  (`knockout.feature`), and a Swiss will be when the feature that shows one
  lands. Of the three, the order of play is the same whatever the
  competition: at the competition's address followed by "order-of-play", as
  "/2026/ac/spring-open/competitions/block-a/order-of-play", it lists every
  game of the competition in use, in the order it was played, the oldest
  first, so that the competition reads as it unfolded. A reader who wants
  what has happened lately has the tournament's page, which lists the most
  recent first.

  A game is shown as the tournament's page shows one (`tournament.feature`):
  the winner on one line, with what they represent, their flag, their score
  and "beat", or "drew with" where the game was drawn; the loser on the
  next, with their score; and how long ago the game was added, said as the
  tournament's page says it. The competition each game was played in is not
  shown, since every game here was played in the competition, so how long ago
  takes its place, beside the winner, where a reader's eye starts on a game.

  Like the grid, it is headed by the competition's name, offers the three
  views with Order of Play marked as the one being read, and its sections are
  the tournament's, with the competition marked. It is not a page wherever
  the grid is not, and an address the tournament has moved on from leads to
  the order of play where the tournament is now.

  The scenarios are a block's, but for the last rule's, which shows a
  knockout's order of play is the same.

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

  Rule: The page is the block's order of play, for anybody

    Scenario: The page is headed by the block's name
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the page is headed "Block A"

    Scenario: A reader not signed in is shown the games
      Given nobody is signed in
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first game is of "Sam Someone" beating "Alex Another"

  Rule: Every game of the block in use is listed, the oldest first

    Scenario: The game added first is first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first game is of "Sam Someone" beating "Alex Another"
      And the second game is of "Alex Another" beating "Sam Someone"

    Scenario: An archived game is not listed
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the page says there are no games

    Scenario: A game of another competition is not listed
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the page says there are no games

    Scenario: A block with games does not say it has none
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the page does not say there are no games

  Rule: A game is the winner on one line and the loser on the next, as on the tournament's page

    Background:
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

    Scenario: The first line names the winner
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first line of the first game names "Sam Someone"

    Scenario: The first line has the winner's score
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first line of the first game scores "26"

    Scenario: The first line ends with "beat"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first line of the first game ends with "beat"

    Scenario: The second line names the loser
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the second line of the first game names "Alex Another"

    Scenario: The second line has the loser's score
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the second line of the first game scores "17"

    Scenario: How long ago the game was added is beside the winner
      Given the server's clock reads "2026-10-03T10:12:00Z"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first line of the first game is beside "12 min"

    Scenario: The competition is not shown
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the first game names no competition

  Rule: A drawn game says "drew with"

    Scenario: A drawn game says "drew with"
      Given "organiser@example.com" has created the tournament "Autumn Open" allowing drawn games
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Autumn Open"
      When the page at "/2026/ac/autumn-open/competitions/block-a/order-of-play" is opened
      Then the first line of the first game ends with "drew with"

  Rule: On a phone the page fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the page is no wider than the window

  Rule: The block's three views are offered, the order of play marked

    Scenario: The order of play is marked as the view being read
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the view "Order of Play" is marked as the one being read

    Scenario: The grid is not marked
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the view "Grid" is not marked as the one being read

  Rule: Its sections are the tournament's, with the block marked

    Scenario: The block is marked as the section being read
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the section "Block A" is marked as current

  Rule: An address with no block a reader is sent to is not a page

    Scenario: A slug no competition has is not found
      When the page at "/2026/ac/spring-open/competitions/block-z/order-of-play" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A knockout has no order of play here
      Given "organiser@example.com" has added the knockout "Knockout" to "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/knockout/order-of-play" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament's blocks are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the order of play where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then the address is "/2026/gc/spring-open/competitions/block-a/order-of-play"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out, as on the tournament's page: the players' names and what they
    represent, the scores and the day a game was added.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then every word in the page's content but the tournament's own is in the test locale

    Scenario: A block with no games says so in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/2026/ac/spring-open/competitions/block-a/order-of-play" is opened
      Then every word in the page's content but the tournament's own is in the test locale

  Rule: A knockout's order of play is the same as a block's

    Background:
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"

    Scenario: A knockout's order of play is headed by its name
      When the page at "/2026/ac/spring-open/competitions/finals/order-of-play" is opened
      Then the page is headed "Finals"

    Scenario: A knockout's game added first is first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "Pat Fourth" has beaten "Chris Third" 26 to 20 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/order-of-play" is opened
      Then the first game is of "Sam Someone" beating "Alex Another"
      And the second game is of "Pat Fourth" beating "Chris Third"

    Scenario: How long ago a knockout's game was added is beside the winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And the server's clock reads "2026-10-03T10:12:00Z"
      When the page at "/2026/ac/spring-open/competitions/finals/order-of-play" is opened
      Then the first line of the first game is beside "12 min"

    Scenario: A knockout's order of play marks it as the view being read
      When the page at "/2026/ac/spring-open/competitions/finals/order-of-play" is opened
      Then the view "Order of Play" is marked as the one being read

    Scenario: A knockout is marked as the section being read
      When the page at "/2026/ac/spring-open/competitions/finals/order-of-play" is opened
      Then the section "Finals" is marked as current

    Scenario: A knockout's order of play is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/order-of-play" is opened
      Then every word in the page's content but the tournament's own is in the test locale
