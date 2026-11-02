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
      When the page at "<page>" is opened with scripting on
      Then the print button is offered

      Examples:
        | page                                            |
        | /2026/ac/spring-open/competitions/block-a       |
        | /2026/ac/spring-open/competitions/finals        |
        | /2026/gc/swiss-open/competitions/zed            |
        | /2026/gc/spring-tests/tests/aus-v-eng           |

    Scenario: A reader with no scripting is not offered one
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting off
      Then the print button is in the page
      And the print button is not offered

  Rule: The views are kept next to the print button

    The views and the printer are both for doing something with the page, as
    the competition's name is not, so they are kept together against the
    right edge, with the name alone at the left, rather than spread across the
    line with the views stranded between the two.

    Scenario Outline: The views are next to the print button
      When the page at "<page>" is opened with scripting on
      Then the views are next to the print button

      Examples:
        | page                                            |
        | /2026/ac/spring-open/competitions/block-a       |
        | /2026/ac/spring-open/competitions/finals        |
        | /2026/gc/swiss-open/competitions/zed            |
        | /2026/gc/spring-tests/tests/aus-v-eng           |

  Rule: The tournament's name is the page's first-level heading and the competition's the second-level

    The tournament's name is said to whatever reads the page aloud as well as
    printed, so that the page has a heading above the competition's whether
    or not it is on paper, and the competition's name stands beneath it.

    Scenario: The tournament's name is the first-level heading
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the first-level heading is "Spring Open"

    Scenario: The competition's name is the second-level heading
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the second-level heading is "Block A"

  Rule: What is printed is the tournament, the competition and its results

    Scenario: The tournament's name is printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the printed tournament name is "Spring Open"

    Scenario: The tournament's name is printed above the competition's
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the printed tournament name is above the printed competition name

    Scenario: The tournament's name is printed larger than the competition's
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the printed tournament name is larger than the printed competition name

    Scenario: The competition's name is printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the printed competition name is "Block A"

    Scenario: The results are printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the results are printed

    Scenario: A block's places are printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the page is laid out for the printer
      Then the block's place column is printed

    Scenario: The words beneath a block's grid about its tie break are printed
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the page is laid out for the printer
      Then the words beneath the block's grid about its tie break are printed

    Scenario: Links are not underlined
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then no link is underlined

    Scenario: The site's bars are not printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      And the page is laid out for the printer
      Then the site's bar is not printed
      And the section bar is not printed
      And the footer is not printed

    Scenario: The views and the print button are not printed
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      Then the print button is offered
      When the page is laid out for the printer
      Then the views are not printed
      And the print button is not printed

    Scenario: The tournament's name is not seen on the screen twice
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened
      Then the tournament name is not seen

  Rule: What is wider than the paper is printed on pages after the first

    A browser cuts off what runs past the edge of the paper and never goes on
    with it beside, so a block with many players, or a knockout with many
    rounds, would lose its right-hand side. Just before the page is printed it
    is cut into pieces that each fit the paper, one after another on pages of
    their own. A block's grid has the players' names again at the left of each
    piece, so that a score is never printed with no one to say whose it is; a
    knockout's rounds are cut between one round and the next. It takes
    scripting to do, so with none a wide page is cut off at the edge as before.

    What fits is printed whole, and once the page is printed it is as it was.

    Scenario: A grid that fits the paper is printed whole
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the page is laid out for the printer
      Then the block's grid is printed in one piece

    Scenario: A grid wider than the paper is printed in pieces
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      Then the block's grid is printed in more than one piece

    Scenario: No piece of a grid is wider than the paper
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      Then no piece of the block's grid is wider than the paper

    Scenario: Each piece of a grid says whose scores they are
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      Then each piece of the block's grid names the player "Sam Someone"
      And each piece of the block's grid names the player "Alex Another"

    Scenario: The pieces of a grid have every column once
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      Then the pieces of the block's grid have every column once

    Scenario: The words beneath a grid cut in pieces are printed after its last piece
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      Then the words beneath the block's grid about its tie break are printed after its last piece

    Scenario: Once the page is printed the grid is whole again
      When the page at "/2026/ac/spring-open/competitions/block-a" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      And the printing is done
      Then the block's grid is in one piece

    Scenario: A knockout that fits the paper is printed whole
      When the page at "/2026/ac/spring-open/competitions/finals" is opened with scripting on
      And the page is laid out for the printer
      Then the knockout's draw is printed in one piece

    Scenario: A knockout wider than the paper is printed in pieces
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Player" in "Finals" of "Spring Open"
      When the page at "/2026/ac/spring-open/competitions/finals" is opened with scripting on
      And the paper is 300 pixels wide
      And the page is laid out for the printer
      Then the knockout's draw is printed in more than one piece
      And no piece of the knockout's draw is wider than the paper
      And the pieces of the knockout's draw have every round once

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
        | /2026/gc/spring-tests/tests/aus-v-eng           | portrait  |
