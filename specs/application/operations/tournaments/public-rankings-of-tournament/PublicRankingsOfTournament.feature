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

  A block is answered with its winner too, which is the player the block places
  first (`placingsOfBlock.feature`) where only one is placed first, and nobody
  where players cannot be told apart for first. It is worked out as the block's
  own page works out its places, so that the file and the page do not disagree
  about who won, and a withdrawn game or player counts for nothing in it
  though the game is still a result. A competition that does not place its
  players, a knockout, a Swiss or a test, is answered with no winner of its
  own, and the file guesses.

  A competition with no result is not answered, so that a file has no heading
  with nothing beneath it, and neither is one that is archived. The ones that
  are come in the tournament's order. Nobody is asked to sign in: the
  rankings file was always for anybody who knew the address, as the
  tournament's own pages are, and every scenario asks with nobody signed in.

  Only a competition that counts towards the world rankings is in the answer,
  since those are the only results the rankings are ever sent. Each says for
  itself whether it does (`competitionRules.feature`): a drawn game is
  therefore never a result, as a competition allowing them does not count
  (`Tournament.DrawsInWorldRankings`), and neither does one played under
  handicap, one of a sport with no world rankings, or one its manager has said
  is not to. Asked for the rankings of a tournament of a sport with none, or
  none of whose competitions in use counts, the application does not refuse:
  it answers the tournament, with no competitions however many games it has,
  and the reason there are none for the page that says why
  (`rankings.feature`). The reason is the sport where the sport has none, and
  otherwise that none of its competitions counts. A tournament with no
  competition yet has none to leave out, so its rankings are available and
  empty.

  An address no tournament of the website has been found at, or an archived
  tournament's, is refused as `PublicRankingsOfTournament.NoSuchTournament`.
  An address the tournament has moved on from still finds it, and it is
  answered with where it is found now.

  Where a scenario says nothing else, the tournament is for the sport "ac",
  starts on 3 October 2026 and finishes on 5 October 2026, and its block "Block
  A" counts towards the world rankings and is the best of 1 with "Sam Someone", "Alex Another" and "Chris Third"
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

    Scenario: A tournament played by players is answered as not played by teams
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is not played by teams

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

  Rule: A block is answered with the player it places first

    Scenario: The player with the greatest share of their matches won is the winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 26 to 20 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the competition "Block A" is answered as "Sam Someone"

    Scenario: Players level on the share are told apart by the block's tie break
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the competition "Block A" is answered as "Chris Third"

    Scenario: Players the block's tie break cannot tell apart have no winner
      Given the block is to go by the tie break "who-beat-who"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 26 to 3 in "Block B" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then nobody is answered as the winner of the competition "Block B"

    Scenario: Players who beat one another in a ring have no winner
      Given the block is to go by the tie break "who-beat-who"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 26 to 3 in "Block B" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block B" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then nobody is answered as the winner of the competition "Block B"

    Scenario: A game of a player who has withdrawn counts for nothing towards the winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the winner of the competition "Block A" is answered as "Alex Another"

    Scenario: A game of a player who has withdrawn is still a result
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered has 1 result

    Scenario: A knockout is answered with no winner of its own
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then no winner is answered for the competition "Finals"

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

    Scenario: A tournament played by teams is answered as played by teams
      Given "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the rankings of the tournament at "2026/ac/spring-tests" are asked for
      Then the tournament answered is played by teams

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

  Rule: Only a competition that counts towards the world rankings is in the answer

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

    Scenario: A tournament with no competition yet has rankings, with nothing in them
      Given "organiser@example.com" has created the tournament "New Open"
      When the rankings of the tournament at "2026/ac/new-open" are asked for
      Then the rankings answered are available

    Scenario: A competition its manager has said is not to count is not answered
      Given the competition is said not to count towards the world rankings
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then the first competition of the rankings answered is "Block A"
      And there is no second competition in the rankings answered

    Scenario: A competition played under handicap is not answered
      Given the competition is to be played under handicap
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then there is no second competition in the rankings answered

    Scenario: The competitions that count are counted for the file
      Given the competition is said not to count towards the world rankings
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the rankings of the tournament at "2026/ac/spring-open" are asked for
      Then 1 competition is counted in the rankings answered

    Scenario: A tournament none of whose competitions counts has none
      Given the competition is said not to count towards the world rankings
      And "organiser@example.com" has created the tournament "None Open"
      And "organiser@example.com" has added the block "Block A" to "None Open"
      When the rankings of the tournament at "2026/ac/none-open" are asked for
      Then the rankings answered are not available

    Scenario: The reason is that none of its competitions counts
      Given the competition is said not to count towards the world rankings
      And "organiser@example.com" has created the tournament "None Open"
      And "organiser@example.com" has added the block "Block A" to "None Open"
      When the rankings of the tournament at "2026/ac/none-open" are asked for
      Then the reason the rankings answered are not available is "none of its competitions counts"

    Scenario: A tournament of games none of which counts is answered with no competitions
      Given the competition is to be played under handicap
      And "organiser@example.com" has created the tournament "Handicap Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Handicap Open"
      And "organiser@example.com" has added the player "Alex Another" to "Handicap Open"
      And "organiser@example.com" has added the block "Block A" to "Handicap Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Handicap Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Handicap Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Handicap Open"
      When the rankings of the tournament at "2026/ac/handicap-open" are asked for
      Then no competition is answered

    Scenario: A tournament whose only competition allows drawn results has none
      Given the competition is to allow drawn results
      And "organiser@example.com" has created the tournament "Draws Open"
      And "organiser@example.com" has added the block "Block A" to "Draws Open"
      When the rankings of the tournament at "2026/ac/draws-open" are asked for
      Then the reason the rankings answered are not available is "none of its competitions counts"

    Scenario: Ricochet has none
      Given the tournament is to be for the sport "rc"
      And "organiser@example.com" has created the tournament "Ricochet Open"
      When the rankings of the tournament at "2026/rc/ricochet-open" are asked for
      Then the reason the rankings answered are not available is "the sport"

    Scenario: Where the sport has none the sport is the reason, whatever its competitions say
      Given the tournament is to be for the sport "rc"
      And "organiser@example.com" has created the tournament "Ricochet Open"
      And the competition is to be played under handicap
      And "organiser@example.com" has added the block "Block A" to "Ricochet Open"
      When the rankings of the tournament at "2026/rc/ricochet-open" are asked for
      Then the reason the rankings answered are not available is "the sport"

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
