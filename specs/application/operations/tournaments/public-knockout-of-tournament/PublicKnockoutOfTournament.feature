@postgres
Feature: A knockout of a tournament, for anybody to read

  A knockout's pages show it three ways, as a block's do: as a grid, its
  draw drawn out round by round (`knockout.feature`), as a summary
  (`knockoutSummary.feature`) and in order of play
  (`orderOfPlay.feature`). The application answers all three: the
  knockout, found by its slug, with its name; its rounds, first round first,
  each with what its matches are the best of and its matches in the order of
  the draw; and every game of the knockout in use, in the order they were
  added, each with when it was added.

  A knockout's draw is its players in the order they were entered or moved
  to, place 1 meeting place 2, place 3 meeting place 4, and so on, and the
  winners of neighbouring matches meeting in the next round
  (`KnockoutPlay.feature`). A match is answered with its two sides, each a
  player, a bye, or a place not yet known, since who plays in a later round
  is not known until the matches before it are decided. A player is answered
  as the tournament's other pages show one: their name, what they represent,
  the flag they fly, where their own page is found, and whether they have
  withdrawn.

  A match is answered with its games, oldest first, each with which side won
  it and both scores as they were typed, and with its winner once it is
  decided: the side that has won more than half the games it is the best of,
  the player drawn against a bye, or the player whose opponent has
  withdrawn. A match not yet decided has no winner.

  The pages are a section of the tournament's, so the tournament is answered
  with it as with a block (`PublicBlockOfTournament.feature`): its name,
  where it is found now, and its competitions in use with where each is
  found.

  Only a knockout is answered here. A block is answered as a block, and
  asking for one here is refused as `PublicKnockoutOfTournament.NotAKnockout`,
  as is asking for a Swiss, until the feature that shows one lands. A slug no
  competition of the tournament has, or an archived competition's, is
  refused as `PublicKnockoutOfTournament.NoSuchCompetition`, and an address no
  tournament of the website has been found at, or an archived tournament's,
  as `PublicKnockoutOfTournament.NoSuchTournament`. An address the tournament
  has moved on from still finds it, and it is answered with where it is found
  now.

  A knockout is for anybody to read, so nobody need be signed in to ask, and
  every scenario here asks with nobody signed in.

  Where a scenario says nothing else, the knockout has a draw of 4 places,
  its first round the best of 3 and its final the best of 1, and its players
  were entered in the order "Sam Someone", "Alex Another", "Chris Third" and
  "Pat Fourth", so that Sam meets Alex and Chris meets Pat.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
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

  Rule: The knockout is answered by its slug

    Scenario: The knockout's name is answered
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the knockout answered is called "Finals"

    Scenario: The tournament is answered with the knockout
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is called "Spring Open"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: Its rounds are answered, first round first, each with what its matches are the best of

    Scenario: Every round is answered
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then 2 rounds of the knockout are answered

    Scenario: A round is answered with what its matches are the best of
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first round of the knockout answered is the best of 3

    Scenario: The final is answered with what it is the best of
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the second round of the knockout answered is the best of 1

    Scenario: Each round has half the matches of the one before
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then 2 matches of the first round of the knockout are answered
      And 1 match of the second round of the knockout is answered

  Rule: The first round's matches are the draw's places in pairs

    Scenario: The first two places meet in the first match
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side of the first match of the first round answered is "Sam Someone"
      And the second side of the first match of the first round answered is "Alex Another"

    Scenario: The next two places meet in the next match
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side of the second match of the first round answered is "Chris Third"
      And the second side of the second match of the first round answered is "Pat Fourth"

    Scenario: A player moved in the draw meets whoever is beside them now
      Given "organiser@example.com" has moved the player "Chris Third" in "Finals" of "Spring Open" up
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the second side of the first match of the first round answered is "Chris Third"

    Scenario: A bye is answered as a bye
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the knockout "plate" of the tournament at "2026/ac/spring-open" is asked for
      Then the second side of the first match of the first round answered is a bye

    Scenario: A player is answered with where their page is found
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side of the first match of the first round answered is found at "2026/ac/spring-open/players/sam-someone"

    Scenario: A withdrawn player is answered as withdrawn
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the second side of the first match of the first round answered has withdrawn

  Rule: A later round's sides are the winners of the matches before it, or not yet known

    Scenario: A side is not yet known until the match before it is decided
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side of the first match of the second round answered is not yet known

    Scenario: The winner of a match is a side of the next
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side of the first match of the second round answered is "Sam Someone"

    Scenario: The winner of the next match is the other side
      Given "Pat Fourth" has beaten "Chris Third" 26 to 17 in "Finals" of "Spring Open"
      And "Pat Fourth" has beaten "Chris Third" 26 to 3 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the second side of the first match of the second round answered is "Pat Fourth"

    Scenario: A player drawn against a bye is a side of the next round
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the knockout "plate" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side of the first match of the second round answered is "Sam Someone"

  Rule: A match is answered with its games, oldest first, and its winner once decided

    Scenario: A match's game is answered with the side that won it
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the first match of the first round answered was won by the second side

    Scenario: A match's game is answered with each side's score as typed
      Given "Alex Another" has beaten "Sam Someone" 26tp to 17 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first side scored "17" in the first game of the first match of the first round answered
      And the second side scored "26tp" in the first game of the first match of the first round answered

    Scenario: A match's games are oldest first
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the first match of the first round answered was won by the second side
      And the second game of the first match of the first round answered was won by the first side

    Scenario: An archived game is not answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 games of the first match of the first round are answered

    Scenario: A match won more than half its games is won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first match of the first round answered was won by its first side

    Scenario: A match not yet decided has no winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first match of the first round answered is not yet decided

    Scenario: A match against a bye is won by the player
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Plate" of "Spring Open"
      When the knockout "plate" of the tournament at "2026/ac/spring-open" is asked for
      Then the first match of the first round answered was won by its first side

    Scenario: A match against a withdrawn player is won by their opponent
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first match of the first round answered was won by its first side

  Rule: Every game of the knockout in use is answered, in the order they were added

    Scenario: The games are answered in the order they were added
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Pat Fourth" has beaten "Chris Third" 26 to 3 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the knockout answered was won by "Sam Someone"
      And the second game of the knockout answered was won by "Pat Fourth"

    Scenario: A game is answered with when it was added
      Given the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the knockout answered was added at "2026-10-03T10:00:00Z"

    Scenario: An archived game of the knockout is not answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Finals" of "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 games of the knockout are answered

  Rule: Only a knockout of a tournament a reader is sent to is answered

    Scenario: A slug no competition has is refused
      When the knockout "plate" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicKnockoutOfTournament.NoSuchCompetition"

    Scenario: An archived knockout is refused
      Given "organiser@example.com" has archived the competition "Finals" in "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicKnockoutOfTournament.NoSuchCompetition"

    Scenario: A block is refused
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the knockout "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicKnockoutOfTournament.NotAKnockout"

    Scenario: A Swiss is refused
      Given "organiser@example.com" has added the Swiss "Swiss" to "Spring Open"
      When the knockout "swiss" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicKnockoutOfTournament.NotAKnockout"

    Scenario: An address no tournament has been found at is refused
      When the knockout "finals" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicKnockoutOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the knockout "finals" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicKnockoutOfTournament.NoSuchTournament"
