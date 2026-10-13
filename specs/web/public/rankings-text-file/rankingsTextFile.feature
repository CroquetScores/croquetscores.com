@postgres
Feature: Association Croquet's rankings are a text file of who beat whom

  The text file is what the Association Croquet world rankings are sent
  (`rankings.feature`), in the format their software reads, as the old site
  wrote it. It is in English whatever language the manager reading the site
  chose, and it is plain text of letters, digits and punctuation, since that
  is all the software reads.

  For each competition that has a result, in the tournament's order, it has a
  block of lines: "Event" and the competition's name, "Date" and the days it
  was played, "Winner" and who won it, "Type" and whether it was matches or
  single games, "Order firstname", a blank line, then a numbered line for
  each result, and "End". A blank line comes between one competition's block
  and the next.

  The event is the tournament's name alone where it has one competition, and
  the tournament's name and the competition's where it has several, so that
  the rankings can tell its blocks apart.

  A result's line says the winner beat the loser and then the scores. A
  game's score is the winner's hoops less the loser's, with "+" in front
  where the winner scored more, then the winner's peels and the loser's, as
  the officers have always had them: "26 to 17" is "+9", "26tp to 17" is
  "+9tp", and "17 to 17tp" is "0tp", a game won on equal hoops by the peels.
  A result of several games, a knockout's match, has each game's score in
  turn, separated by commas.

  Whether a competition's results are "single" or "match" depends on whether
  any of its results has more than one game, which only a knockout's can.
  Who won the competition is a guess the site can only half make, as the
  old site's own code said, and the manager's help tells them to correct it:
  in a competition of matches it is the winner of the last
  match, the final, and in a competition of single games it is the player
  with the most wins where one has strictly more than any other, and nobody
  where two or more have the most. A line with nobody says "Winner" and no
  name, for the manager to fill in, and a space left after the word is not
  significant.

  The file's names are padded so that each result's "beat" and scores line
  up down the block, by the longest winner's name and the longest loser's
  name in that competition.

  Where a scenario says nothing else, the tournament "Spring Open" is for
  the sport "ac" and starts and finishes on 3 October 2026, and has a block
  "Block A", the best of 1, with "Sam Someone", "Alex Another" and "Chris
  Third" entered in it.

  Background:
    Given a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-03"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And the block is to be the best of 1
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: A competition's block says what it is before its results

    Scenario: The event is the tournament's name where it has one competition
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the first line is "Event Spring Open"

    Scenario: The event has the competition's name where it has several
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the first line is "Event Spring Open Block A"

    Scenario: The date is one day where the tournament was played in one
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the second line is "Date 3-3.10.26"

    Scenario: The date is the days in one month said with the month once
      Given "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-05"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the second line is "Date 3-5.10.26"

    Scenario: The date is the days in two months said with each month
      Given "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-09-30" and finish on "2026-10-02"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the second line is "Date 30.9-2.10.26"

    Scenario: The date is the days in two years said with each year
      Given "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-12-30" and finish on "2027-01-02"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the second line is "Date 30.12.26-2.1.27"

    Scenario: The order is by first name
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the fifth line is "Order firstname"

    Scenario: A blank line comes before the results
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the sixth line is blank

    Scenario: The block ends with End
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the eighth line is "End"

    Scenario: A competition with no result has no block
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the file has no line "Event Spring Open Block B"

    Scenario: A blank line comes between one competition's block and the next
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the ninth line is blank

    Scenario: The next competition's block follows
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the tenth line is "Event Spring Open Block B"

  Rule: A result's line says who beat whom, and the scores

    Scenario: The line is numbered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line starts " 1 Sam Someone beat Alex Another"

    Scenario: The line ends with the score
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line ends "+9"

    Scenario: A score carries the winner's peels
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line ends "+9tp"

    Scenario: A score carries the loser's peels after the winner's
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17tp in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line ends "+9tptp"

    Scenario: A game won on equal hoops has no plus
      Given "Sam Someone" has beaten "Alex Another" 17w to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line ends "0w"

    Scenario: The results are in the order the games were added
      Given "Alex Another" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the eighth line starts " 2 Sam Someone  beat Alex Another"

    Scenario: The numbers start again in each competition
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the sixteenth line starts " 1 Alex Another beat Sam Someone"

    Scenario: Names are padded so that the lines line up
      Given "Sam Someone" has beaten "Chris Third" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line is " 1 Sam Someone  beat Chris Third +9"

    Scenario: A name with an accent is written without it
      Given "organiser@example.com" has added the player "José Ñandú" to "Spring Open"
      And "organiser@example.com" has entered the player "José Ñandú" in "Block A" of "Spring Open"
      And "José Ñandú" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line starts " 1 Jose Nandu beat Alex Another"

  Rule: A knockout's match is a line of its own with each game's score

    Background:
      Given the knockout's first round is to be the best of 3
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"

    Scenario: A match is one line
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line is " 1 Sam Someone beat Alex Another +9, +23"

    Scenario: A game the match's winner lost is its score from the winner's side
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 20 in "Finals" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line is " 1 Sam Someone beat Alex Another -9, +23, +6"

    Scenario: A match decided by a bye has no line
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the file is empty

  Rule: A competition's type says whether it was matches or single games

    Scenario: A block is single games
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the fourth line is "Type single"

    Scenario: A knockout of matches of more than one game is matches
      Given the knockout's first round is to be the best of 3
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the fourth line is "Type match"

  Rule: The winner is a guess the manager is to correct

    Scenario: Where one player has the most wins they are the winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 26 to 20 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the third line is "Winner Sam Someone"

    Scenario: Where two players have the most wins nobody is
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the third line is "Winner"

    Scenario: Where only one player has won they are the winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the third line is "Winner Sam Someone"

    Scenario: A knockout's winner is the winner of its last match
      Given the knockout's first round is to be the best of 3
      And the knockout's second round is to be the best of 3
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 17 in "Finals" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 3 in "Finals" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 17 in "Finals" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Finals" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the third line is "Winner Chris Third"

  Rule: Every game but an archived one is in it

    Scenario: An archived game has no line
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the file is empty

    Scenario: A withdrawn game has a line
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line starts " 1 Sam Someone beat Alex Another"

    Scenario: A game of a player who has withdrawn has a line
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the text file at "/2026/ac/spring-open/rankings" is read
      Then the seventh line starts " 1 Sam Someone beat Alex Another"
