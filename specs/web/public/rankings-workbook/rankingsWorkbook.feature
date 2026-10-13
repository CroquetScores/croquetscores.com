@postgres
Feature: Golf Croquet's rankings are a spreadsheet of who beat whom

  The spreadsheet is what the rankings officers of Golf Croquet and American
  6 Wicket are sent (`rankings.feature`), laid out as the old site laid it
  out, since their own software reads it by its position and not by what it
  says. It is in English whatever language the manager reading the site
  chose, since the people who read it do not choose it.

  Its first three lines say what the tournament is: its name, the days it was
  played, and how many games are in it, each in bold. Then, with nothing
  between, a line for each game. Where the tournament has more than one
  competition each one's games are headed by its name, in bold, and are
  those games only; where it has one, nothing heads them. Each game is
  numbered, from 1, and the numbers run on through the competitions rather
  than starting again in each, so that a game can be pointed to by its number
  alone. After the last, one line is left blank and the next says
  "Tournament winner:", which is for the manager to fill in, since the
  tournament has no winner the site could know (`PublicRankingsOfTournament.feature`).

  A game is a line of the winner's family name, their first name, "beat", the
  loser's family name and first name, then the winner's score and the
  loser's. A player's name is cut at its first space: what comes before is
  their first name, and the rest, in capitals, their family name. So "Sam
  Someone" is "Sam" and "SOMEONE", and "Mary Anne Smith" is "Mary" and "ANNE
  SMITH", which is how the old site cut it and so how the officers have
  always had it. A name with no space is the family name in capitals with
  "Unknown" for a first name.

  A knockout's match is not a line of its own: each game it was played in is,
  won by whoever won that game, which is not always the match's winner.

  Where a scenario says nothing else, the tournament "Spring Open" is for the
  sport "gc" and started on 3 October 2026, and has a block "Block A" with
  "Sam Someone" and "Alex Another" entered in it.

  Background:
    Given a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And the tournament is to be for the sport "gc"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-03"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And the block is to be the best of 1
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: The first three lines say what the tournament is

    Scenario: The first line is the tournament's name
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the first line is "Spring Open"

    Scenario: The first line is in bold
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the first line is in bold

    Scenario: The second line is the day the tournament was played
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the second line is "3 October 2026"

    Scenario: The second line is in bold
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the second line is in bold

    Scenario: Days in one month are said with the month once
      Given "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-05"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the second line is "3-5 October 2026"

    Scenario: Days in two months are said with each month
      Given "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-09-30" and finish on "2026-10-02"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the second line is "30 September-2 October 2026"

    Scenario: Days in two years are said with each year
      Given "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-12-30" and finish on "2027-01-02"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the second line is "30 December 2026 - 2 January 2027"

    Scenario: The third line counts the games
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 7 to 6 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is "2 Games"

    Scenario: The third line is in bold
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is in bold

    @browser
    Scenario: The language the reader chose does not change it
      Given a browser that asks for "en-XA"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the second line is "3 October 2026"

  Rule: A line for each game, numbered from 1

    Scenario: The game's line is numbered
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the number of the first game is "1"

    Scenario: The winner's family name is in capitals
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's family name in the first game is "SOMEONE"

    Scenario: The winner's first name follows it
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's first name in the first game is "Sam"

    Scenario: The game says the winner beat the loser
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the first game says "beat"

    Scenario: The loser's family name is in capitals
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the loser's family name in the first game is "ANOTHER"

    Scenario: The loser's first name follows it
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the loser's first name in the first game is "Alex"

    Scenario: The winner's score is as it was typed
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's score in the first game is "7"

    Scenario: The loser's score is as it was typed
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the loser's score in the first game is "4"

    Scenario: The first game follows the third line with nothing between
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fourth line is the first game

    Scenario: The games are in the order they were added
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 6 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's family name in the first game is "ANOTHER"
      And the winner's family name in the second game is "SOMEONE"

  Rule: Every game but an archived one is a line

    Scenario: An archived game has no line
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is "0 Games"

    Scenario: A withdrawn game has a line
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is "1 Games"

    Scenario: A game of a player who has withdrawn has a line
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is "1 Games"

  Rule: A name is cut at its first space

    Scenario: A name of three words keeps the last two as the family name
      Given "organiser@example.com" has added the player "Mary Anne Smith" to "Spring Open"
      And "organiser@example.com" has entered the player "Mary Anne Smith" in "Block A" of "Spring Open"
      And "Mary Anne Smith" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's family name in the first game is "ANNE SMITH"

    Scenario: A name of three words keeps the first as the first name
      Given "organiser@example.com" has added the player "Mary Anne Smith" to "Spring Open"
      And "organiser@example.com" has entered the player "Mary Anne Smith" in "Block A" of "Spring Open"
      And "Mary Anne Smith" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's first name in the first game is "Mary"

    Scenario: A name of one word is the family name
      Given "organiser@example.com" has added the player "Cher" to "Spring Open"
      And "organiser@example.com" has entered the player "Cher" in "Block A" of "Spring Open"
      And "Cher" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's family name in the first game is "CHER"

    Scenario: A name of one word has Unknown for a first name
      Given "organiser@example.com" has added the player "Cher" to "Spring Open"
      And "organiser@example.com" has entered the player "Cher" in "Block A" of "Spring Open"
      And "Cher" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's first name in the first game is "Unknown"

    Scenario: The world ranking name is the one cut
      Given "organiser@example.com" has changed the world ranking name of "Sam Someone" in "Spring Open" to "Samuel Someone"
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's first name in the first game is "Samuel"

  Rule: Where there are several competitions each one's games are headed by its name

    Background:
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"

    Scenario: A competition's name heads its games
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fourth line is "Block A"

    Scenario: A competition's name is in bold
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fourth line is in bold

    Scenario: The games follow the heading
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fifth line is the first game

    Scenario: The second competition is headed after the first one's games
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 7 to 3 in "Block B" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the sixth line is "Block B"

    Scenario: The numbers run on through the competitions
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 7 to 3 in "Block B" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the number of the second game is "2"

    Scenario: A competition with no games is not headed
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block B" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fourth line is "Block B"

    Scenario: Where only one competition has games nothing heads them
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fourth line is the first game

  Rule: Each game of a knockout's match is a line of its own

    Background:
      Given the knockout's first round is to be the best of 3
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"

    Scenario: A match won two games to one is three lines
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 3 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 5 in "Finals" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is "3 Games"

    Scenario: A game is won by whoever won the game
      Given "Alex Another" has beaten "Sam Someone" 7 to 4 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 3 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 5 in "Finals" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the winner's family name in the first game is "ANOTHER"

    Scenario: A match decided by a bye has no line
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the third line is "0 Games"

  Rule: The winner is left for the manager to fill in

    Scenario: A line says where the winner goes
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the sixth line is "Tournament winner:"

    Scenario: A line is left blank before it
      Given "Sam Someone" has beaten "Alex Another" 7 to 4 in "Block A" of "Spring Open"
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the fifth line is blank

  Rule: The spreadsheet's sheet is named for the tournament

    Scenario: The sheet is named by the tournament
      When the spreadsheet at "/2026/gc/spring-open/rankings" is read
      Then the sheet is called "spring-open"

    Scenario: A sheet's name is no longer than a spreadsheet allows
      Given "organiser@example.com" has created the tournament with a name of 60 letters
      When the spreadsheet of that tournament's rankings is read
      Then the sheet is called by 31 characters
