@browser @postgres
Feature: A tournament's rankings are a file to send to the world rankings

  A tournament's results are sent to the world rankings as a file, which is
  found at the tournament's address followed by "rankings", as
  "/2026/ac/spring-open/rankings", the address the old site gave it, so that
  a link a manager kept goes on working. It is not a page: opening it saves a
  file, and which kind depends on the sport, since each sport's rankings
  officers read their own. Association Croquet's is a text file
  (`rankingsTextFile.feature`), Golf Croquet's and American 6
  Wicket's a spreadsheet (`rankingsWorkbook.feature`). What goes into either is the application's
  (`PublicRankingsOfTournament.feature`).

  Anybody who knows the address may have it, signed in or not, as the old
  site allowed: it holds only what the tournament's pages already show.

  Only a tournament that counts towards the world rankings has a file, since
  those are the only ones the rankings are ever sent. Not one of a sport with
  no world rankings, as Ricochet and Gateball have none, nor one played under
  handicap or allowing drawn games, which cannot count
  (`Tournament.NoWorldRankings`, `Tournament.HandicapInWorldRankings`,
  `Tournament.DrawsInWorldRankings`), nor one its manager has said is not to.
  The old site gave a file for every tournament and left it to the officers
  to throw out what they could not use. Here a tournament that does not count
  has a page at the address instead, which says that there are no rankings
  for it and why, so that a manager who follows a link they kept, or an
  officer who is sent it, is told what is the matter rather than shown an
  error or handed a file that would be refused.

  The file is called after the tournament, so that what a reader saves says
  what it is: the tournament's name, with every character a file name
  cannot have written as "-", then ".txt" or ".xlsx".

  A tournament that is archived, one the website never had and an address no
  tournament has been found at are not files, nor the page that says why; they
  are the page the site says nothing is found with. An address the tournament
  has moved on from leads to where the tournament is now, file or page.

  Where a scenario says nothing else, the tournament "Spring Open" is for
  the sport "ac" and starts on 3 October 2026, counts towards the world
  rankings, as a tournament of its sport does unless it is said not to, and
  "Sam Someone" has beaten "Alex Another" 26 to 17 in its block "Block A".

  Background:
    Given a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And the block is to be the best of 1
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

  Rule: The address gives a file, for anybody

    Scenario: The address gives a file
      When the address "/2026/ac/spring-open/rankings" is requested
      Then a file is given

    Scenario: A reader not signed in is given the file
      Given nobody is signed in
      When the address "/2026/ac/spring-open/rankings" is requested
      Then a file is given

    Scenario: A tournament with no results is given a file
      Given "organiser@example.com" has created the tournament "Quiet Open"
      When the address "/2026/ac/quiet-open/rankings" is requested
      Then a file is given

  Rule: The sport says which kind of file

    Scenario: Association Croquet's is a text file
      When the address "/2026/ac/spring-open/rankings" is requested
      Then the file given is a text file

    Scenario Outline: Golf Croquet's and American 6 Wicket's are spreadsheets
      Given the tournament is to be for the sport "<sport>"
      And "organiser@example.com" has created the tournament "Sport Open"
      When the address "/2026/<sport>/sport-open/rankings" is requested
      Then the file given is a spreadsheet

      Examples:
        | sport |
        | gc    |
        | a6w   |

  Rule: The file is called after the tournament

    Scenario: A text file is called by the tournament's name
      When the address "/2026/ac/spring-open/rankings" is requested
      Then the file given is called "Spring Open.txt"

    Scenario: A spreadsheet is called by the tournament's name
      Given the tournament is to be for the sport "gc"
      And "organiser@example.com" has created the tournament "Golf Open"
      When the address "/2026/gc/golf-open/rankings" is requested
      Then the file given is called "Golf Open.xlsx"

    Scenario: A character a file name cannot have is written as a hyphen
      Given "organiser@example.com" has created the tournament "Spring: Open/Plate"
      When the address "/2026/ac/spring-open-plate/rankings" is requested
      Then the file given is called "Spring- Open-Plate.txt"

  Rule: A tournament that does not count towards the world rankings is a page that says why

    The page is headed as the rankings are not available, names the tournament,
    gives the one reason that applies, and leads back to the tournament. Where
    more than one would apply it gives the first of: the sport has none,
    it is played under handicap, it allows drawn games, its manager has said
    it is not to count; the same order the tournament refuses them in.

    Scenario: The page says the rankings are not available
      Given the tournament "Spring Open" does not count towards the world rankings
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable"

    Scenario: The page is not a file
      Given the tournament "Spring Open" does not count towards the world rankings
      When the address "/2026/ac/spring-open/rankings" is requested
      Then no file is given

    Scenario: The page names the tournament
      Given the tournament "Spring Open" does not count towards the world rankings
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then the page names the tournament "Spring Open"

    Scenario: A reader not signed in is shown the page
      Given the tournament "Spring Open" does not count towards the world rankings
      And nobody is signed in
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable"

    Scenario: A tournament its manager has said is not to count says so
      Given the tournament "Spring Open" does not count towards the world rankings
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable.notCounted"

    Scenario: A tournament played under handicap says so
      Given "organiser@example.com" has created the tournament "Handicap Open"
      And the tournament "Handicap Open" is played under handicap
      When the page at "/2026/ac/handicap-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable.handicap"

    Scenario: A tournament allowing drawn games says so
      Given "organiser@example.com" has created the tournament "Draws Open" allowing drawn games
      When the page at "/2026/ac/draws-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable.drawnGames"

    Scenario: A tournament of a sport with no world rankings says so
      Given the tournament is to be for the sport "rc"
      And "organiser@example.com" has created the tournament "Ricochet Open"
      When the page at "/2026/rc/ricochet-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable.sport"

    Scenario: Only the reason that applies is said
      Given "organiser@example.com" has created the tournament "Draws Open" allowing drawn games
      When the page at "/2026/ac/draws-open/rankings" is opened
      Then the page does not say the words for "rankings.notAvailable.handicap"

    Scenario: A tournament played under handicap that also allows drawn games gives the first reason
      Given "organiser@example.com" has created the tournament "Both Open" allowing drawn games
      And the tournament "Both Open" is played under handicap
      When the page at "/2026/ac/both-open/rankings" is opened
      Then the page says the words for "rankings.notAvailable.handicap"

    Scenario: The page leads back to the tournament
      Given the tournament "Spring Open" does not count towards the world rankings
      And the page at "/2026/ac/spring-open/rankings" is open
      When the link "Spring Open" is pressed
      Then the address is "/2026/ac/spring-open"

    Scenario: A tournament put back to counting is given the file again
      Given the tournament "Spring Open" does not count towards the world rankings
      And the tournament "Spring Open" counts towards the world rankings
      When the address "/2026/ac/spring-open/rankings" is requested
      Then a file is given

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And the tournament "Spring Open" does not count towards the world rankings
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then every word in the page's content but the tournament's own is in the test locale

  Rule: An address with no tournament a reader is sent to is not a file or a page of reasons

    Scenario: A slug no tournament has is not found
      When the page at "/2026/ac/no-such-open/rankings" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament is not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament that did not count is not found either
      Given the tournament "Spring Open" does not count towards the world rankings
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/rankings" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An old address leads to the file where the tournament is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the address "/2026/ac/spring-open/rankings" is requested
      Then the address given is "/2026/gc/spring-open/rankings"
