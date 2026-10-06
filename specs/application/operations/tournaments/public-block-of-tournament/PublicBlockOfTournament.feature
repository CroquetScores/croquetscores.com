@postgres
Feature: A block of a tournament, for anybody to read

  A block's pages show its results three ways: as a grid (`block.feature`),
  as a summary (`blockSummary.feature`) and in order of play
  (`orderOfPlay.feature`). The application answers all three: the
  block, found by its slug, with its name; every player entered in it, in the
  block's order, which is the order its managers gave them; the same players
  ranked; how many games each match between two of them is the best of; every
  game of the block in use; and, for each player, the matches they have won
  and lost, the games they have won, their net games and their net hoops.

  Each player is answered with their name, what they represent and the flag
  they fly, as the tournament's other pages show a player, where their own
  page is found, and whether they have withdrawn. A withdrawn player is still
  answered, since the games they played still stand. A player removed from
  the block is not.

  Each game is answered with its winner, the winner's score, its loser, the
  loser's score, whether it was drawn and when it was added, the scores as
  they were typed, in the order the games were added. An archived game is not answered, and
  counts for nothing, as everywhere games are counted.

  A player has won a match when they have won more than half the games it is
  the best of, so two of a best of 3, and two of a best of 2. A match not yet
  decided, or shared one each in a best of 2, is won by neither. A player
  has lost a match when their opponent has won it. A player's
  games are the games they have won, and a drawn game is won by neither.
  Their net games are the games they have won less the games they have lost.
  Their net hoops are the points they have scored less the points scored
  against them, the points being the number a score starts with, so that
  "26tp" is 26.

  Whatever a player brings into the block from play not scored in it
  (`ChangeCarryForward.feature`) is counted with what was: their match wins
  with the matches they have won, their match losses with the matches they
  have lost, their game wins with their games and their net games, their
  game losses against their net games, and their hoops for less their hoops
  against with their net hoops.

  The players are ranked as the old site's summary ranked them: by the share
  of their decided matches they have won, highest first, then by their net
  hoops, most first, and where both are the same, in the block's order. A
  share rather than a count, so that a player who has played fewer matches
  is not ranked below one who has simply played more. A player who has
  decided no match has a share of nothing. Whether this is how a tournament
  places its players is for its regulations to say, and the summary says so.

  The page is a section of the tournament's, so the tournament is answered
  with it as its players are (`PublicPlayersOfTournament.feature`): its name,
  where it is found now, and its competitions in use with where each is
  found, for the page's section bar.

  Only a block is answered here. A knockout and a Swiss are shown otherwise,
  and asking for one is refused as `PublicBlockOfTournament.NotABlock`, until
  the features that show them land. A slug no competition of the tournament
  has, or an archived competition's, is refused as
  `PublicBlockOfTournament.NoSuchCompetition`. An address no tournament of the
  website has been found at, or an archived tournament's, is refused as
  `PublicBlockOfTournament.NoSuchTournament`. An address the tournament has
  moved on from still finds it, and it is answered with where it is found now.

  A block is for anybody to read, so nobody need be signed in to ask, and
  every scenario here asks with nobody signed in.

  Where a scenario says nothing else, the tournament allows drawn games, so
  that a game on equal points is drawn, and its block is the best of 3, so
  that two players can meet more than once.

  The tournament's subtitle is answered with it, in Markdown as it is kept
  (`TournamentSubtitle.feature`), since every page of a tournament shows it
  beneath its name in the header (`layout.feature`). A tournament with no
  subtitle is answered with none.

  So are its manager's notes, each by its id with when it last changed
  (`PublicManagerNotesOfTournament.feature`), since every page of a
  tournament marks its Notes section while a reader has a note there they
  have not read as it is now (`notes.feature`).

  So are its commentaries, each by its id with when it last changed
  (`CommentariesByTournament.feature`), since every page of a tournament
  marks its Commentary section the same way (`commentaries.feature`).

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open" allowing drawn games
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: The block is answered by its slug

    Scenario: The block's name is answered
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the block answered is called "Block A"

    Scenario: What the block's matches are the best of is answered
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the block answered is the best of 3

    Scenario: The tournament is answered with the block
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The tournament's subtitle is answered
      Given the tournament "Spring Open" has the subtitle "Lunch is at **noon**"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered has the subtitle "Lunch is at **noon**"

    Scenario: A tournament with no subtitle is answered with none
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered has no subtitle

    Scenario: The tournament's manager notes are answered with when each last changed
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first manager note of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: The tournament's commentaries are answered with when each last changed
      Given "organiser@example.com" has started the commentary "Day one" on "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the comment "Sam is two hoops up" to "Day one" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first commentary of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: Every player entered in the block is answered, in the block's order

    Scenario: The players are answered in the block's order
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block answered is "Sam Someone"
      And the second player of the block answered is "Alex Another"
      And the third player of the block answered is "Chris Third"

    Scenario: A player moved in the block is answered where they were moved to
      Given "organiser@example.com" has moved the player "Chris Third" in "Block A" of "Spring Open" up
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the second player of the block answered is "Chris Third"
      And the third player of the block answered is "Alex Another"

    Scenario: A player of the tournament not entered in the block is not answered
      Given "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then 3 players of the block are answered

    Scenario: A player removed from the block is not answered
      Given "organiser@example.com" has removed the player "Chris Third" from "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then 2 players of the block are answered

    Scenario: A withdrawn player is answered
      Given "organiser@example.com" has withdrawn the player "Chris Third" from "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the third player of the block answered is "Chris Third"

    Scenario: A withdrawn player is answered as withdrawn
      Given "organiser@example.com" has withdrawn the player "Chris Third" from "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Chris Third" is answered as withdrawn

    Scenario: A player who has not withdrawn is not answered as withdrawn
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is not answered as withdrawn

    Scenario: A player is answered with where their page is found
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered as found at "2026/ac/spring-open/players/alex-another"

  Rule: Every game of the block in use is answered, in the order they were added

    Scenario: A game is answered with its winner
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the block answered was won by "Sam Someone"

    Scenario: A game is answered with its loser
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the block answered was lost by "Alex Another"

    Scenario: A game's scores are answered as they were typed
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the block answered was played to "26tp" against "17"

    Scenario: A game is answered with when it was added
      Given the moment "2026-10-03T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the block answered was added at "2026-10-03T10:00:00Z"

    Scenario: A drawn game is answered as drawn
      Given "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the block answered was drawn

    Scenario: The games are answered in the order they were added
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first game of the block answered was won by "Sam Someone"
      And the second game of the block answered was won by "Chris Third"

    Scenario: An archived game is not answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 games of the block are answered

    Scenario: A game of another competition is not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then 0 games of the block are answered

  Rule: A player's matches are the matches they have won

    Scenario: Two games won of a best of 3 is a match won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 1 match won

    Scenario: A match won two games to one is a match won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 20 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 1 match won

    Scenario: A match lost is not a match won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered with 0 matches won

    Scenario: A match not yet decided is won by neither player
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 0 matches won

    Scenario: A match shared one each in a best of 2 is won by neither player
      Given the block is to be the best of 2
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block B" of "Spring Open"
      When the block "block-b" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 0 matches won

    Scenario: A single game won in a best of 1 is a match won
      Given the block is to be the best of 1
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the block "block-b" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 1 match won

    Scenario: A match won with an archived game is not won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 0 matches won

  Rule: A player's matches lost are the matches their opponents have won

    Scenario: A match lost is a match lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered with 1 match lost

    Scenario: A match won is not a match lost
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 0 matches lost

    Scenario: A match not yet decided is lost by neither player
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered with 0 matches lost

  Rule: A player's games are the games they have won

    Scenario: A game won is a game
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 1 game won

    Scenario: A game lost is not a game won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered with 0 games won

    Scenario: Each game won against the same opponent is counted
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 2 games won

    Scenario: A drawn game is won by neither player
      Given "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 0 games won

    Scenario: An archived game is not a game won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 0 games won

  Rule: A player's net games are the games they have won less the games they have lost

    Scenario: A game won adds one
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net games of 1

    Scenario: A game lost takes one away
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered with net games of -1

    Scenario: Every game a player played is counted in net games
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net games of 1

    Scenario: A drawn game counts for nothing in net games
      Given "Sam Someone" has beaten "Alex Another" 17 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net games of 0

  Rule: A player's net hoops are the points they scored less the points scored against them

    Scenario: A game won adds its margin
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of 9

    Scenario: A game lost takes its margin away
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Alex Another" is answered with net hoops of -9

    Scenario: Every game a player played is counted
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of 3

    Scenario: A score's points are the number it starts with
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of 9

    Scenario: A player with no games has net hoops of 0
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of 0

    Scenario: An archived game counts for nothing in net hoops
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of 0

  Rule: What a player carries forward is counted with what they played

    Scenario: Match wins carried forward are matches won
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match wins of 2
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 2 matches won

    Scenario: Game wins carried forward are games won
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of game wins of 2
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 3 games won

    Scenario: Game wins carried forward add to net games
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of game wins of 2
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net games of 3

    Scenario: Game losses carried forward take away from net games
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of game losses of 3
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net games of -2

    Scenario: Match losses carried forward are matches lost
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of match losses of 2
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with 2 matches lost

    Scenario: Hoops for carried forward add to net hoops
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of hoops for of 40
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of 49

    Scenario: Hoops against carried forward take away from net hoops
      Given "organiser@example.com" has given the player "Sam Someone" in "Block A" of "Spring Open" a carry forward of hoops against of 30
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the player of the block "Sam Someone" is answered with net hoops of -21

  Rule: The players are ranked by the share of their matches they have won, then by their net hoops

    Scenario: A player with a greater share of their matches won is ranked higher
      Given "Alex Another" has beaten "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block ranked is "Alex Another"

    Scenario: A share is ranked rather than a count
      Given the block is to be the best of 1
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Player" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 17 in "Block B" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Chris Third" has beaten "Pat Player" 26 to 17 in "Block B" of "Spring Open"
      When the block "block-b" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block ranked is "Sam Someone"
      And the second player of the block ranked is "Chris Third"

    Scenario: Players with the same share are ranked by their net hoops
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Alex Another" 26 to 3 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block ranked is "Chris Third"
      And the second player of the block ranked is "Sam Someone"

    Scenario: Players alike in both are ranked in the block's order
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block ranked is "Sam Someone"
      And the second player of the block ranked is "Alex Another"
      And the third player of the block ranked is "Chris Third"

    Scenario: A player who has decided no match is ranked below one who has won a match
      Given "Alex Another" has beaten "Chris Third" 26 to 17 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Chris Third" 26 to 17 in "Block A" of "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block ranked is "Alex Another"
      And the second player of the block ranked is "Sam Someone"

    Scenario: Matches carried forward count towards the share
      Given "organiser@example.com" has given the player "Chris Third" in "Block A" of "Spring Open" a carry forward of match wins of 1
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first player of the block ranked is "Chris Third"

  Rule: Only a block of a tournament a reader is sent to is answered

    Scenario: A slug no competition has is refused
      When the block "block-z" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicBlockOfTournament.NoSuchCompetition"

    Scenario: An archived block is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicBlockOfTournament.NoSuchCompetition"

    Scenario: A knockout is refused
      Given "organiser@example.com" has added the knockout "Knockout" to "Spring Open"
      When the block "knockout" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicBlockOfTournament.NotABlock"

    Scenario: A Swiss is refused
      Given "organiser@example.com" has added the Swiss "Swiss" to "Spring Open"
      When the block "swiss" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicBlockOfTournament.NotABlock"

    Scenario: An address no tournament has been found at is refused
      When the block "block-a" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicBlockOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the block "block-a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicBlockOfTournament.NoSuchTournament"
