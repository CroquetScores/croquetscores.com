@browser @postgres
Feature: A competition's page can be printed

  A block's page, a knockout's, a Swiss's and a test's each offer a print
  button, a printer drawn beside the views on the line of the competition's
  name, named "Print" for whatever reads the page aloud. Pressing it opens the
  browser's own print dialogue. The button needs scripting to do that, so
  where there is none it is not shown rather than shown and dead.

  What is printed is the tournament's name above the competition's name, and
  the results beneath, and nothing else: not the site's bars, the section
  bar, the views, the print button or the footer, which are for finding the
  page and mean nothing on paper.

  The page is printed across the paper for a block and a knockout, since a
  block's grid is as wide as it has players and a knockout is as wide as it
  has rounds, and up the paper for a Swiss and a test, whose tables are
  narrow and long.

  Where a scenario says nothing else, the tournament starts on 3 October
  2026.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
    And the tournament is to be for the sport "gc"
    And "organiser@example.com" has created the tournament "Swiss Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Swiss Open"
    And "organiser@example.com" has added the player "Alex Another" to "Swiss Open"
    And "organiser@example.com" has added the Swiss "Zed" to "Swiss Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Zed" of "Swiss Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Zed" of "Swiss Open"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"
    And the team is to be known for short as "AUS"
    And "organiser@example.com" has added the team "Australia" to "Spring Tests"
    And the team is to be known for short as "ENG"
    And "organiser@example.com" has added the team "England" to "Spring Tests"
    And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

  Rule: Each kind of competition offers a print button

    Scenario Outline: A competition's page offers printing
      When the page at "<page>" is opened
      Then the print button is offered

      Examples:
        | page                                            |
        | /2026/ac/spring-open/competitions/block-a       |
        | /2026/ac/spring-open/competitions/finals        |
        | /2026/gc/swiss-open/competitions/zed            |
        | /2026/ac/spring-tests/tests/aus-v-eng           |

    Scenario: A reader with no scripting is not offered one
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting off
      Then the print button is not offered

  Rule: What is printed is the tournament, the competition and its results

    Scenario: The tournament's name is printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the printed tournament name is "Spring Open"

    Scenario: The competition's name is printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the printed competition name is "Block A"

    Scenario: The results are printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the results are printed

    Scenario: The site's bars are not printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the site's bar is not printed
      And the section bar is not printed
      And the footer is not printed

    Scenario: The views and the print button are not printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the views are not printed
      And the print button is not printed

    Scenario: The tournament's name is not shown on the screen twice
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the printed tournament name is not shown

  Rule: A block and a knockout are printed across the paper, a Swiss and a test up it

    Scenario Outline: A competition is printed on paper of its shape
      When the page at "<page>" is opened
      And the page is laid out for the printer
      Then the paper is <shape>

      Examples:
        | page                                            | shape     |
        | /2026/ac/spring-open/competitions/block-a       | landscape |
        | /2026/ac/spring-open/competitions/finals        | landscape |
        | /2026/gc/swiss-open/competitions/zed            | portrait  |
        | /2026/ac/spring-tests/tests/aus-v-eng           | portrait  |
