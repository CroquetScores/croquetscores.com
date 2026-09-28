Feature: Adding a game to a competition

  The games of a competition are its own, as its players are
  (`enterPlayer.feature`): many are played, and scorers enter them at once,
  so they are kept with the competition rather than the tournament. A game is
  added with an id of its own, given by whatever adds it, between two of the
  competition's players, and says who won and the score (`Game.feature`). The
  competition lists its games in the order they were added, archived ones
  among them, which is the order they were played in.

  Both players have to be in the competition, so a player it does not have is
  refused. A withdrawn player plays no more of it (`withdrawPlayer.feature`),
  so a game with one is refused as the player refuses it. No two games have
  the same id, since the id is how a game is archived and restored.

  What kind of competition it is, and a knockout's draw, are the tournament's
  (`addBlock.feature`, `addKnockout.feature`, `addSwiss.feature`), and so is
  whether drawn games are allowed (`create.feature`), so whatever adds a game
  says them, as it says who may add one. A knockout has to send somebody
  through, so a game in one on equal points has to say who won it
  (`Game.feature`) even where the tournament allows drawn games. The scenarios
  here are about a block, each match the best of 1, in a tournament that does
  not allow drawn games, unless they say otherwise.

  In a block, every player plays every other, and the two of them play a
  match of the block's best-of. A match is decided once one of them has won
  more games than the other could still win, or every game of it has been
  played, so a game between two players whose match is decided is refused. A
  Swiss pairs its players round by round, and two players can meet in more
  than one round, so a game in a Swiss is refused only for what any game is.

  A knockout is drawn in the competition's order (`movePlayer.feature`): the
  first player meets the second in the first round, the third meets the
  fourth, and so on, each match the best of that round's best-of. The winner
  of a match goes through to the next round, where they meet the winner of
  the match drawn next to theirs, until one player is left. So a game in a
  knockout is refused unless its two players are the two drawn to meet in a
  match not yet decided, the match being decided once one of them has won
  more than half its games. A draw has more places than there are players
  when not every place is filled (`KnockoutDraw.feature`): the players fill
  the places in the competition's order, and a player whose opponent's place
  is empty has a bye, going through without playing. A player beyond the
  draw's last place has no place in it, and plays in none of its matches.

  A withdrawn player keeps their place in a knockout's draw
  (`withdrawPlayer.feature`), and loses every match of theirs not already
  decided, so that their opponent goes through without playing, as with a
  bye.

  Every one of a knockout's games depends on where its players are drawn, so
  once it has a game, archived or not, its draw is fixed: entering, moving or
  removing a player in it is refused (`enterPlayer.feature`,
  `movePlayer.feature`, `removePlayer.feature`).

  An archived game no longer counts (`archiveGame.feature`): it decides no
  match and sends nobody through.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it
    And the tournament player "Alex Another" was entered in it
    And the tournament player "Chris Third" was entered in it

  Rule: A game added is recorded, and is the competition's

    Scenario: Adding a game records it
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then it has recorded 1 event
      And the first thing it recorded is a game being added

    Scenario: A game added is one of the competition's games
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: A game added is known by the id it was added with
      Given the competition is rebuilt from its stream
      And the game id "game/123e4567-e89b-42d3-a456-426614174000"
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is known by "game/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A game added is not archived
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 is not archived

    Scenario: A competition rebuilt after a game was added has the game
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      When the competition is rebuilt from its stream
      Then the competition has the game of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: Games are listed in the order they were added
      Given the game of "Chris Third" beating "Sam Someone" 26 to 3 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      When the competition is rebuilt from its stream
      Then the competition's first game is of "Chris Third" beating "Sam Someone"

  Rule: What a game must be is refused as it is for a game

    Scenario: The same player as winner and loser is refused as a game refuses it
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Sam Someone" 26 to 17 is added
      Then it is refused for breaking "Game.SamePlayer"

    Scenario: A winner not ahead is refused as a game refuses it
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 17 to 26 is added
      Then it is refused for breaking "Game.WinnerNotAhead"

  Rule: A game on equal points is kept where the tournament allows drawn games, but for a knockout

    Scenario: A game on equal points with no mark is refused where drawn games are not allowed
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 6 to 6 is added
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A game on equal points with no mark is kept where the tournament allows drawn games
      Given drawn games are allowed
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 6 to 6 is added
      Then the competition has the game of "Sam Someone" beating "Alex Another" 6 to 6

    Scenario: A game on equal points with no mark in a knockout is refused where the tournament allows drawn games
      Given drawn games are allowed
      And the competition is a knockout of 4 places, each round the best of 1
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 6 to 6 is added
      Then it is refused for breaking "Game.WinnerNotAhead"

    Scenario: A game on equal points with the winner's score marked in a knockout is kept
      Given the competition is a knockout of 4 places, each round the best of 1
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 6w to 6 is added
      Then the competition has the game of "Sam Someone" beating "Alex Another" 6w to 6

  Rule: Both players are the competition's, and playing

    Scenario: A winner the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game of "Pat Fourth" beating "Alex Another" 26 to 17 is added
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: A loser the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Pat Fourth" 26 to 17 is added
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: A player removed is no longer one to play
      Given the player "Chris Third" was removed from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is added
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: A withdrawn winner is refused
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A withdrawn loser is refused
      Given the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A refused game is not added
      Given the player "Alex Another" withdrew from it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then the competition has 0 games

  Rule: No two games have the same id

    Scenario: A game with an id another game has is refused
      Given the game id "game/123e4567-e89b-42d3-a456-426614174000"
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 3 is added
      Then it is refused with "Competition.GameAlreadyAdded"

  Rule: In a block, two players play one match of the block's best-of

    Scenario: A second game between two players whose match is the best of 1 is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A game between two other players of the block is added
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 3 is added
      Then the competition has 2 games

    Scenario: A second game of a match the best of 3 is added
      Given the competition is a block, each match the best of 3
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

    Scenario: A game of a match the best of 3 already won 2 to 0 is refused
      Given the competition is a block, each match the best of 3
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 10 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A game of a match the best of 2 shared 1 each is refused
      Given the competition is a block, each match the best of 2
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 5 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A match whose only game is archived is not decided
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

  Rule: In a Swiss, two players can meet more than once

    Scenario: A second game between the same two players of a Swiss is added
      Given the competition is a Swiss
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

  Rule: In a knockout, a game is between the two drawn to meet in a match not yet decided

    The knockout has four places, each round the best of 1, and Pat Fourth is
    entered as well, so Sam Someone meets Alex Another and Chris Third meets
    Pat Fourth in the first round.

    Background:
      Given the tournament player "Pat Fourth" was entered in it
      And the competition is a knockout of 4 places, each round the best of 1

    Scenario: A game between two players drawn to meet in the first round is added
      Given the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 17 is added
      Then the competition has 1 game

    Scenario: A game between two players not drawn to meet is refused
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is added
      Then it is refused with "Competition.NotDrawnToMeet"

    Scenario: The knockout is drawn in the competition's order
      Given the player "Chris Third" was moved to the order 15000
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is added
      Then the competition has 1 game

    Scenario: A second game of a match the best of 1 is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: The winners of the first round meet in the second
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Pat Fourth" beating "Chris Third" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Pat Fourth" beating "Sam Someone" 26 to 3 is added
      Then the competition has 3 games

    Scenario: A loser of the first round plays no more
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Pat Fourth" beating "Chris Third" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 3 is added
      Then it is refused with "Competition.NotDrawnToMeet"

    Scenario: A player whose next opponent is not yet known has nobody to meet
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Pat Fourth" 26 to 3 is added
      Then it is refused with "Competition.NotDrawnToMeet"

    Scenario: The final once played leaves nobody to meet
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Pat Fourth" beating "Chris Third" 26 to 20 was added to it
      And the game of "Pat Fourth" beating "Sam Someone" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Pat Fourth" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A match whose game is archived is not decided
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

  Rule: In a knockout, a match is the best of its round's best-of

    The knockout has four places, its first round the best of 3 and its
    second the best of 1, and Pat Fourth is entered as well.

    Background:
      Given the tournament player "Pat Fourth" was entered in it
      And the competition is a knockout of 4 places, its first round the best of 3 and its second the best of 1

    Scenario: A second game of a match the best of 3 is added
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

    Scenario: A third game of a match at 1 each is added
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Alex Another" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 5 is added
      Then the competition has 3 games

    Scenario: A game of a match won 2 to 0 is refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 10 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: The winner of a match the best of 3 goes through
      Given the game of "Alex Another" beating "Sam Someone" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Alex Another" 26 to 20 was added to it
      And the game of "Alex Another" beating "Sam Someone" 26 to 5 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 1 was added to it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 2 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Chris Third" 26 to 3 is added
      Then the competition has 6 games

  Rule: In a knockout, a player whose opponent's place is empty has a bye

    The knockout has four places, each round the best of 1, and only three
    players, so the fourth place is empty and Chris Third has a bye.

    Background:
      Given the competition is a knockout of 4 places, each round the best of 1

    Scenario: A player with a bye has nobody to meet in the first round
      Given the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 3 is added
      Then it is refused with "Competition.NotDrawnToMeet"

    Scenario: A player with a bye meets the winner of the match drawn next to theirs
      Given the game of "Alex Another" beating "Sam Someone" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Alex Another" 26 to 3 is added
      Then the competition has 2 games

  Rule: In a knockout, a player beyond the draw's last place plays in none of its matches

    Background:
      Given the tournament player "Pat Fourth" was entered in it
      And the competition is a knockout of 2 places, each round the best of 1

    Scenario: A player beyond the last place is refused a game
      Given the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Pat Fourth" 26 to 3 is added
      Then it is refused with "Competition.NotDrawnToMeet"

    Scenario: The players in the draw's places meet
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 3 is added
      Then the competition has 1 game

  Rule: In a knockout, a withdrawn player's opponent goes through without playing

    The knockout has four places, each round the best of 1, and Pat Fourth is
    entered as well, so Sam Someone meets Alex Another and Chris Third meets
    Pat Fourth in the first round.

    Background:
      Given the tournament player "Pat Fourth" was entered in it
      And the competition is a knockout of 4 places, each round the best of 1

    Scenario: A withdrawn player's opponent meets the winner of the match drawn next to theirs
      Given the player "Alex Another" withdrew from it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 20 is added
      Then the competition has 2 games

    Scenario: A player withdrawn after winning their match plays no more
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the player "Sam Someone" withdrew from it
      And the game of "Chris Third" beating "Pat Fourth" 26 to 3 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "CompetitionPlayer.Withdrawn"
