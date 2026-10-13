@postgres
Feature: A tournament's results, as the world rankings are sent them

  The world rankings are sent a tournament's results as a file, which the
  address "/2026/ac/spring-open/rankings" gives (`rankings.feature`), in the
  shape each sport's rankings officers read (`rankingsWorkbook.feature`,
  `rankingsTextFile.feature`). The application answers what goes into either:
  the tournament, with its name and the days it was played, and its
  competitions, each with its results in the order they happened.

  A result is what one line of the file says somebody beat somebody, and it
  is two things. A game of a block, a Swiss or a test is a result of its own,
  of one game, since those competitions were never reported by the match. A
  match of a knockout is a result of the games it was played in, in the order
  they were played, since a knockout's matches were. The file for Golf
  Croquet and American 6 Wicket takes each game of a result, and the one for
  Association Croquet takes each result, so both are answered the same here
  and each takes what it needs.

  Every game of a knockout in use is in the answer, in the match it was played
  in, whether or not the match is decided: a match with some of its games
  played is a result of those, won by whoever has won more of them, the first
  game's winner where they are level. A knockout not yet finished has all of
  the games it has.

  A result is answered with its winner, its loser, and the score each had in
  each game as it was typed. The winner of a knockout's match is the player
  who won it, who may have lost a game of it, so a game is answered with the
  match's winner first whoever won the game. A player is answered by their
  world ranking name, which is what the rankings know them by and so what the
  file is to say (`changePlayerWorldRankingName.feature`), and is their name
  where none was given.

  Every game played is a result but an archived one, which is set aside and
  counts for nothing anywhere. A withdrawn game, and the games of a player
  who has withdrawn, are results, though they count for nothing in the
  tournament's own standings (`withdrawGame.feature`,
  `withdrawPlayer.feature`): the rankings were sent every game that was
  played, as the old site sent them, and it is the rankings officers who
  decide what a withdrawn game is worth, not this page. A match decided by a
  bye or a walkover was not played, has no game, and so is not a result.

  A competition with no result is not answered, so that a file has no heading
  with nothing beneath it, and neither is one that is archived. The ones that
  are come in the tournament's order. Nobody is asked to sign in: the
  rankings file was always for anybody who knew the address, as the
  tournament's own pages are, and every scenario asks with nobody signed in.

  Only a tournament that counts towards the world rankings has a file, since
  those are the only ones the rankings are ever sent. A drawn game is
  therefore never a result: a tournament allowing them does not count
  (`Tournament.DrawsInWorldRankings`). Neither does one played under
  handicap, one of a sport with no world rankings, or one its manager has
  said is not to. Asked for the rankings of one
  of those, the application does not refuse: it answers the tournament, with
  no competitions however many games it has, and the reason there are none
  for the page that says why (`rankings.feature`). The reason is the first
  that applies of: the sport, handicap, drawn games, its manager's choice,
  the order the tournament refuses them in.

  An address no tournament of the website has been found at, or an archived
  tournament's, is refused as `PublicRankingsOfTournament.NoSuchTournament`.
  An address the tournament has moved on from still finds it, and it is
  answered with where it is found now.

  Where a scenario says nothing else, the tournament is for the sport "ac",
  counts towards the world rankings, starts on 3 October 2026 and finishes on 5 October 2026, and its block "Block
  A" is the best of 1 with "Sam Someone", "Alex Another" and "Chris Third"
  entered in it.

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
    And the block is to be the best of 1
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: The tournament is answered with its name and the days it was played

    Scenario: The tournament's name is answered
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The day the tournament starts is answered
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered starts on "2026-10-03"

    Scenario: The day the tournament finishes is answered
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered finishes on "2026-10-05"

    Scenario: The sport is answered
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is for the sport "ac"

  Rule: A game of a block is a result of its own, in the order they were added

    Scenario: A game is a result
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered is "Block A"
      And the first competition of the rankings answered has 1 result

    Scenario: The result's winner is answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the first result is "Sam Someone"

    Scenario: The result's loser is answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the loser of the first result is "Alex Another"

    Scenario: The winner's score is answered as it was typed
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner's score in the first game of the first result is "26tp"

    Scenario: The loser's score is answered as it was typed
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the loser's score in the first game of the first result is "17"

    Scenario: The results are in the order the games were added
      Given "Alex Another" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the first result is "Alex Another"
      And the winner of the second result is "Sam Someone"

    Scenario: Where matches are the best of 3 each game is still a result of its own
      Given the block is to be the best of 3
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block B" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered has 2 results

  Rule: A game of a Swiss or of a test is a result of its own

    Scenario: A game of a Swiss is a result
      Given "organiser@example.com" has added the Swiss "Zed" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Zed" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Zed" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 7 to 4 in "Zed" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered is "Zed"
      And the first competition of the rankings answered has 1 result

  Rule: A match of a knockout is a result of the games it was played in

    Background:
      Given the knockout's first round is to be the best of 3
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"

    Scenario: A match is a result
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered is "Finals"
      And the first competition of the rankings answered has 1 result

    Scenario: The result has the games the match was played in
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first result has 2 games

    Scenario: The match's winner is the result's winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the first result is "Sam Someone"

    Scenario: A game the match's winner lost is answered with the winner's score first
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 20 in "Finals" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner's score in the first game of the first result is "17"
      And the loser's score in the first game of the first result is "26"

    Scenario: A match not yet decided is a result of the games played
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered has 1 result

    Scenario: A match not yet played is not a result
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no competition is answered

    Scenario: A match decided by a bye is not a result
      Given "organiser@example.com" has added the knockout "Plate" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Plate" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Plate" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no competition is answered

  Rule: A game of a test is answered as a block's is

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"

    Scenario: A game of a test is a result
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the rankings of the tournament at "2026/ac/spring-tests" are asked for
      Then the first competition of the rankings answered is "AUS v ENG"
      And the first competition of the rankings answered has 1 result

  Rule: Only an archived game is not a result

    Scenario: An archived game is not a result
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no competition is answered

    Scenario: A withdrawn game is a result
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered has 1 result

    Scenario: A game of a player who has withdrawn is a result
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered has 1 result

  Rule: A competition with no result is not answered, and the rest are in the tournament's order

    Scenario: A competition no game has been played in is not answered
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no competition is answered

    Scenario: An archived competition is not answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no competition is answered

    Scenario: The competitions are in the tournament's order
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered is "Block A"
      And the second competition of the rankings answered is "Block B"

  Rule: A player is answered by their world ranking name

    Scenario: A player is answered by the world ranking name they were given
      Given "organiser@example.com" has changed the world ranking name of "Sam Someone" in "Spring Open" to "Samuel Someone"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the first result is "Samuel Someone"

    Scenario: A player given none is answered by their name
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the first result is "Sam Someone"

  Rule: Only a tournament that counts towards the world rankings has a file

    Scenario Outline: A tournament of a sport the rankings are sent counts
      Given the tournament is to be for the sport "<sport>"
      And "organiser@example.com" has created the tournament "Sport Open"
      When the rankings of the tournament at "2026/<sport>/sport-open" are asked for
      Then the rankings answered are available

      Examples:
        | sport |
        | ac    |
        | gc    |
        | a6w   |

    Scenario: A tournament its manager has said is not to count has none
      Given the tournament "Spring Open" does not count towards the world rankings
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the rankings answered are not available

    Scenario: The reason is its manager's choice
      Given the tournament "Spring Open" does not count towards the world rankings
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the reason the rankings answered are not available is "its manager's choice"

    Scenario: A tournament with games and no rankings is answered with no competitions
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the tournament "Spring Open" does not count towards the world rankings
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no competition is answered

    Scenario: A tournament played under handicap has none
      Given "organiser@example.com" has created the tournament "Handicap Open"
      And the tournament "Handicap Open" is played under handicap
      When the rankings of the tournament at "2026/ac/handicap-open" are asked for
      Then the reason the rankings answered are not available is "handicap"

    Scenario: A tournament allowing drawn games has none
      Given "organiser@example.com" has created the tournament "Draws Open" allowing drawn games
      When the rankings of the tournament at "2026/ac/draws-open" are asked for
      Then the reason the rankings answered are not available is "drawn games"

    Scenario: Ricochet has none
      Given the tournament is to be for the sport "rc"
      And "organiser@example.com" has created the tournament "Ricochet Open"
      When the rankings of the tournament at "2026/rc/ricochet-open" are asked for
      Then the reason the rankings answered are not available is "the sport"

    Scenario: Where more than one applies the first is the reason
      Given "organiser@example.com" has created the tournament "Both Open" allowing drawn games
      And the tournament "Both Open" is played under handicap
      When the rankings of the tournament at "2026/ac/both-open" are asked for
      Then the reason the rankings answered are not available is "handicap"

  Rule: Only a tournament of the website a reader is sent to is answered

    Scenario: An address no tournament has been found at is refused
      When the rankings of the tournament at "2026/ac/no-such-open" are asked for
      Then it is refused with "PublicRankingsOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicRankingsOfTournament.NoSuchTournament"

    Scenario: A tournament the website never had is refused
      Given "organiser@example.com" has created the tournament "Gateball Open" on "gateballscores.com"
      When the rankings of the tournament at "2026/gb/gateball-open" are asked for
      Then it is refused with "PublicRankingsOfTournament.NoSuchTournament"

    Scenario: An address the tournament has moved on from still finds it
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is found at "2026/gc/spring-open"
