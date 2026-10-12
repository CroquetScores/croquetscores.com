@browser @postgres
Feature: A knockout's summary lists its matches round by round

  A knockout is shown three ways (`knockout.feature`). Its summary, at the
  knockout's address followed by "summary", as
  "/2026/ac/spring-open/competitions/finals/summary", is the one for a phone,
  as the old site's was: where the grid draws the rounds side by side, the
  summary lists them one beneath another, each headed by the round's name as
  the grid heads it, so that it is never wider than a phone.

  A round lists its matches in the order of the draw, each its two sides one
  beneath the other, and each side, as in the grid, a player shown as the
  tournament's other pages show one, or a bye, said as "Bye", with a cell for
  each game the match is the best of, holding the side's score in that game,
  oldest first, marked as won or lost. A withdrawn player says they have
  withdrawn.

  A match whose sides are not yet known is not listed, since there is
  nothing yet to say of it, and a round none of whose matches has both sides
  known is not listed at all; the grid shows where they will be.

  Like the grid, it is headed by the knockout's name, offers the three views
  with Summary marked as the one being read, and its sections are the
  tournament's, with the knockout marked. It is not a page wherever the grid
  is not, and an address the tournament has moved on from leads to the
  summary where the tournament is now.

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

  Rule: The page is the knockout's summary, for anybody

    Scenario: The page is headed by the knockout's name
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the page is headed "Finals"

    Scenario: A reader not signed in is shown the summary
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first side of the first match of the first round in the summary is "Sam Someone"

  Rule: The rounds are listed one beneath another, each headed by its name

    Scenario: A round with its sides known is headed by its name
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first round in the summary is headed "Semi Finals"

    Scenario: A round none of whose sides are known is not listed
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then 1 round is listed in the summary

    Scenario: A round is listed once both sides of a match in it are known
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      And "Pat Fourth" has beaten "Chris Third" 26 to 17 in "Finals" of "Spring Open"
      And "Pat Fourth" has beaten "Chris Third" 26 to 3 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the second round in the summary is headed "Final"

    Scenario: A later round is beneath an earlier one
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      And "Pat Fourth" has beaten "Chris Third" 26 to 17 in "Finals" of "Spring Open"
      And "Pat Fourth" has beaten "Chris Third" 26 to 3 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the second round in the summary is beneath the first

  Rule: A round lists its matches in the order of the draw, each its two sides

    Scenario: The first match is the first two places
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first side of the first match of the first round in the summary is "Sam Someone"
      And the second side of the first match of the first round in the summary is "Alex Another"

    Scenario: The next match is the next two places
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first side of the second match of the first round in the summary is "Chris Third"

    Scenario: A player's name leads to their own page
      Given the page at "/2026/ac/spring-open/competitions/finals/summary" is open
      When the name of "Alex Another" in the summary is pressed
      Then the address is "/2026/ac/spring-open/players/alex-another"

    Scenario: A withdrawn player says they have withdrawn
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the second side of the first match of the first round in the summary says they have withdrawn

    Scenario: A withdrawn player's name is struck through
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the second side of the first match of the first round in the summary has its name struck through

    Scenario: A bye is said as a bye
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/plate/summary" is opened
      Then the second side of the first match of the first round in the summary is a bye

    Scenario: A match whose sides are not yet known is not listed
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then 1 round is listed in the summary

  Rule: Beside each side is a cell for each game of the match, holding the side's score

    Scenario: A side has a cell for each game the match is the best of
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first side of the first match of the first round in the summary has room for 3 scores

    Scenario: A side's score is in the cell of its game
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first score of the first side of the first match of the first round in the summary is "26"

    Scenario: The other side's score is in the cell of the same game
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first score of the second side of the first match of the first round in the summary is "17"

    Scenario: A score won is marked as won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first score of the first side of the first match of the first round in the summary is marked as won

    Scenario: A score lost is marked as lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the first score of the second side of the first match of the first round in the summary is marked as lost

  Rule: On a phone the summary fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the page is no wider than the window

  Rule: The knockout's three views are offered, the summary marked

    Scenario: The summary is marked as the view being read
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the view "Summary" is marked as the one being read

    Scenario: Grid leads to the grid
      Given the page at "/2026/ac/spring-open/competitions/finals/summary" is open
      When the view "Grid" is pressed
      Then the address is "/2026/ac/spring-open/competitions/finals/grid"

  Rule: Its sections are the tournament's, with the knockout marked

    Scenario: The knockout is marked as the section being read
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the section "Finals" is marked as current

  Rule: An address with no knockout a reader is sent to is not a page

    Scenario: An archived knockout has no summary
      Given "organiser@example.com" has archived the competition "Finals" in "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the summary where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then the address is "/2026/gc/spring-open/competitions/finals/summary"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the knockout's name, the players' names and what they
    represent, and the scores.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Pat Fourth" from "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals/summary" is opened
      Then every word in the page's content but the tournament's own is in the test locale
