@browser @postgres
Feature: A Swiss's summary ranks its players without their results

  A Swiss is shown three ways (`swiss.feature`). Its summary, at the Swiss's
  address followed by "summary", as
  "/2026/gc/spring-open/competitions/zed/summary", is the one for a phone, as
  the old site's was: the grid's table without its results, so that it is
  never wider than a phone. A row for each player, ranked, headed by the
  player as the grid heads them, and beside them their games, their wins and
  their win share, headed "Games", "Wins" and "Win %", as the grid has them.

  Like the grid, it is headed by the Swiss's name, offers the three views
  with Summary marked as the one being read, and its sections are the
  tournament's, with the Swiss marked. It is not a page wherever the grid is
  not, and an address the tournament has moved on from leads to the summary
  where the tournament is now.

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

  Rule: A row for each player, ranked, with their games, wins and win share

    Scenario: The page is headed by the Swiss's name
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the page is headed "Zed"

    Scenario: The players are ranked
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the first row of the Swiss is "Alex Another"

    Scenario: The columns are headed in order
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the first column of the Swiss is headed "Games"
      And the second column of the Swiss is headed "Wins"
      And the third column of the Swiss is headed "Win %"

    Scenario: There are no results
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the Swiss has 3 columns beside its players

    Scenario: A player's win share is shown
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the "Win %" of "Alex Another" in the Swiss are "100.0%"

    Scenario: A player's name leads to their own page
      Given the page at "/2026/gc/spring-open/competitions/zed/summary" is open
      When the name of "Alex Another" in the Swiss is pressed
      Then the address is "/2026/gc/spring-open/players/alex-another"

  Rule: On a phone the summary fits the window

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the page is no wider than the window

  Rule: The Swiss's three views are offered, the summary marked

    Scenario: The summary is marked as the view being read
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the view "Summary" is marked as the one being read

  Rule: Its sections are the tournament's, with the Swiss marked

    Scenario: The Swiss is marked as the section being read
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the section "Zed" is marked as current

  Rule: An address with no Swiss a reader is sent to is not a page

    Scenario: An archived Swiss has no summary
      Given "organiser@example.com" has archived the competition "Zed" in "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the summary where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "ac"
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then the address is "/2026/ac/spring-open/competitions/zed/summary"

  Rule: Every word the page says is in the reader's language

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the page at "/2026/gc/spring-open/competitions/zed/summary" is opened
      Then every word in the page's content but the tournament's own is in the test locale
