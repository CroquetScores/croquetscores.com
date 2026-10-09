@postgres
Feature: Importing one of the old sites' competitions

  The old sites kept each block, knockout and Swiss as a document of its own,
  in a collection for each kind, naming the tournament it belongs to and
  holding its players and its games. What is brought over the same way
  whatever the kind is said here, with a block standing for all three; what
  each kind brings over besides is said with it (`ImportBlocks.feature`,
  `ImportKnockouts.feature`, `ImportSwisses.feature`). A team match is
  brought over otherwise, since the site plays it between teams
  (`ImportTeamMatches.feature`).

  A competition is added to the tournament its document names, once that
  tournament has been brought over (`ImportTournaments.feature`), as created
  by whoever the tournament was created by and at the moment it was. Its
  players are entered, as the tournament players the old site's players
  became (`ImportTournamentPlayers.feature`), and its games added, each at
  the moment the old site kept it at.

  A competition is brought over a player and a game at a time. A player or a
  game the site refuses is kept as an error against the competition's
  document, naming which, and the rest are brought over all the same: one
  game the site cannot take would otherwise leave every other game in the
  competition behind.

  An archived competition is not brought over: the old sites archived one to
  be rid of it, and took it out of its tournament's list. That is not an
  error, since nothing went wrong. Which tournament a competition is brought
  over with, and where among its competitions, is said with the tournament
  (`ImportWholeTournaments.feature`). Which competition each document became
  is kept, by the website and the document, for whoever is working out what
  became of one, and goes when importing is finished.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the tournament players are imported
    And the blocks are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported
    And player 7 of "tournaments/12" on "croquetscores.com" is imported as "Sam Someone"
    And player 3 of "tournaments/12" on "croquetscores.com" is imported as "Alex Other"

  Rule: A competition is added to its tournament as it was called

    Scenario: A competition becomes a competition of its tournament
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the competition "A Block"

    Scenario: Which competition the document became is kept
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      When the competition is imported
      Then "blocks/30" on "croquetscores.com" is kept as the competition "A Block"


    Scenario: A competition the site refuses is refused, naming why
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called ""
      When the competition is imported
      Then importing the competition is refused with "CompetitionName.Missing"

    Scenario: A competition refused is not kept as any competition
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called ""
      When the competition is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

  Rule: Two competitions of a tournament with the same name are told apart by a number

    The site tells a tournament's competitions apart by their names, in any
    case, and the old sites did not. A competition named as one of its
    tournament's others already is, in any case, is named with the first
    number from 2 that makes it a name none of them has, as "A Block (2)", as a
    tournament player and a commentary are.

    Scenario: The second competition with a name is numbered
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      And the competition is imported
      And the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the competition "A Block (2)"

    Scenario: The first competition with a name keeps it
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      And the competition is imported
      And the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the competition "A Block"

    Scenario: A name the same in another case is numbered
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      And the competition is imported
      And the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And the competition is called "a block"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the competition "a block (2)"

    Scenario: The third competition with a name is numbered past the second
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      And the competition is imported
      And the block "blocks/31" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      And the competition is imported
      And the block "blocks/32" of "tournaments/12" on "croquetscores.com"
      And the competition is called "A Block"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the competition "A Block (3)"

  Rule: An archived competition is left behind

    Scenario: An archived competition is not kept as any competition
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition was archived
      When the competition is imported
      Then "blocks/30" on "croquetscores.com" is not kept as any competition

    Scenario: Leaving an archived competition behind is not refused
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And the competition was archived
      When the competition is imported
      Then importing the competition is not refused

  Rule: A competition's players are entered in the order the old site listed them

    Scenario: A player of the competition is entered in it
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      When the competition is imported
      Then "Sam Someone" is in the competition kept for "blocks/30" on "croquetscores.com"

    Scenario: The players are in the order the old site listed them
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      When the competition is imported
      Then the first player of the competition kept for "blocks/30" on "croquetscores.com" is "Sam Someone"

    Scenario: A player who was no tournament player brought over is kept as an error
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 9 is in the competition
      When the competition is imported
      Then the error kept for "croquetscores.com/blocks/30" says "player 9"

    Scenario: The players after one refused are entered
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 9 is in the competition
      And player 7 is in the competition
      When the competition is imported
      Then "Sam Someone" is in the competition kept for "blocks/30" on "croquetscores.com"

  Rule: A bye is left out of a block or a Swiss

    The old sites let a manager list their bye in any competition, and some
    did in a Swiss of an odd number of players. The site has byes only in a
    knockout (`enterPlayer.feature`), where the draw needs them, and a block
    or a Swiss is played the same without one. So a bye listed in one is left
    out, without an error, and the players around it are entered as they were.

    Scenario: A bye listed in a Swiss is not entered
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      And player 3 is in the competition
      When the competition is imported
      Then the competition kept for "swisses/30" on "croquetscores.com" has 2 players

    Scenario: The players after a bye in a Swiss are entered
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the Swiss "swisses/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      And player 3 is in the competition
      When the competition is imported
      Then "Alex Other" is in the competition kept for "swisses/30" on "croquetscores.com"

    Scenario: Leaving a bye out of a block is not refused
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      When the competition is imported
      Then importing the competition is not refused

  Rule: A game against a bye is left out, and said as accepted

    The old sites kept a game against their bye where a manager entered one,
    won or lost by a player who had nobody to play. It is no game that was
    played, and the site has no player for a bye to have played it: a block
    or a Swiss has no bye, and a knockout's bye puts the player drawn
    against it through without a game. So a game against a bye is left out,
    whichever kind of competition it is in, and said as accepted, with the
    tournament it is of (`AcceptedImportErrors.feature`), rather than kept as
    an error. The other games are added as they were.

    Scenario: A game against a bye in a block is not added
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      And game 2 was won by player 7
      And game 2 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" has 1 game

    Scenario: A game a bye won is not added
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      And game 1 was won by player 9
      And game 1 was lost by player 7
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" has 0 games

    Scenario: Leaving a game against a bye out is not an error
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      When the competition is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A game against a bye left out is said as accepted
      Given player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 9 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      When the competition is imported
      Then "game 1" of "croquetscores.com/blocks/30" is accepted as "ImportCompetition.AgainstABye"

    Scenario: A game against a bye in a knockout is not added
      Given the knockouts are imported
      And player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 7 is in the competition
      And player 9 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      When the competition is imported
      Then the competition kept for "knockouts/30" on "croquetscores.com" has 0 games

    Scenario: Leaving a game against a bye out of a knockout is not an error
      Given the knockouts are imported
      And player 9 of "tournaments/12" on "croquetscores.com" was the old site's bye
      And the knockout "knockouts/30" of "tournaments/12" on "croquetscores.com"
      And the knockout's size is 2
      And player 7 is in the competition
      And player 9 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      When the competition is imported
      Then no error is kept for "croquetscores.com/knockouts/30"

    Scenario: A game between two players is not said as accepted
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then nothing is accepted of "croquetscores.com/blocks/30"

  Rule: A competition's games are added in the order the old site numbered them

    Scenario: A game becomes a game of the competition
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" has 1 game

    Scenario: The game's winner is the player who won it
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then the first game of the competition kept for "blocks/30" on "croquetscores.com" was won by "Sam Someone"

    Scenario: The game's winner scored what the old site kept
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1's winner scored "26tp"
      And game 1 was lost by player 3
      When the competition is imported
      Then the first game of the competition kept for "blocks/30" on "croquetscores.com" has the winner's score "26tp"

    Scenario: The game's loser scored what the old site kept
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1's loser scored "3"
      When the competition is imported
      Then the first game of the competition kept for "blocks/30" on "croquetscores.com" has the loser's score "3"

    Scenario: A game won on equal points keeps the winner's mark
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1's winner scored "7w"
      And game 1 was lost by player 3
      And game 1's loser scored "7"
      When the competition is imported
      Then the first game of the competition kept for "blocks/30" on "croquetscores.com" has the winner's score "7w"

    Scenario: A gateball game won on equal points by "so" keeps the winner's mark
      Given a tournament "tournaments/20" on "gateballscores.com" is imported
      And player 1 of "tournaments/20" on "gateballscores.com" is imported as "Kenji Sato"
      And player 2 of "tournaments/20" on "gateballscores.com" is imported as "Yuki Tanaka"
      And the block "blocks/40" of "tournaments/20" on "gateballscores.com"
      And player 1 is in the competition
      And player 2 is in the competition
      And game 1 was won by player 1
      And game 1's winner scored "5so"
      And game 1 was lost by player 2
      And game 1's loser scored "5"
      When the competition is imported
      Then the first game of the competition kept for "blocks/40" on "gateballscores.com" has the winner's score "5so"

    Scenario: The game was added when the old site kept it
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 3
      And game 1 was kept at "2014-03-01T14:30:00.0000000"
      When the competition is imported
      Then the first game of the competition kept for "blocks/30" on "croquetscores.com" was added at "2014-03-01T14:30:00Z"

    Scenario: The games are added in the order the old site numbered them
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 2 was won by player 3
      And game 2 was lost by player 7
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then the first game of the competition kept for "blocks/30" on "croquetscores.com" was won by "Sam Someone"

  Rule: A game the site refuses is kept as an error, and the other games are added

    Scenario: A game won with fewer points is kept as an error
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1's winner scored "3"
      And game 1 was lost by player 3
      And game 1's loser scored "26"
      When the competition is imported
      Then the error kept for "croquetscores.com/blocks/30" says "Game.WinnerNotAhead"

    Scenario: The error kept names the game refused
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1's winner scored "3"
      And game 1 was lost by player 3
      And game 1's loser scored "26"
      When the competition is imported
      Then the error kept for "croquetscores.com/blocks/30" says "game 1"

    Scenario: A game of a player not entered is kept as an error
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      When the competition is imported
      Then the error kept for "croquetscores.com/blocks/30" says "game 1"

    Scenario: The games after one refused are added
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And game 1 was won by player 7
      And game 1 was lost by player 9
      And game 2 was won by player 3
      And game 2 was lost by player 7
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" has 1 game

  Rule: A player who withdrew is withdrawn once their games are added

    The old sites marked a player withdrawn whatever they had played, and a
    knockout gave their opponent the match from then on. Their games are
    added first, so that what they played before withdrawing counts, as it
    did there.

    Scenario: A player who withdrew has withdrawn
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 7 withdrew
      When the competition is imported
      Then "Sam Someone" has withdrawn from the competition kept for "blocks/30" on "croquetscores.com"

    Scenario: The games of a player who withdrew are added
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      And player 3 is in the competition
      And player 7 withdrew
      And game 1 was won by player 7
      And game 1 was lost by player 3
      When the competition is imported
      Then the competition kept for "blocks/30" on "croquetscores.com" has 1 game

    Scenario: A player who did not withdraw has not
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is in the competition
      When the competition is imported
      Then "Sam Someone" has not withdrawn from the competition kept for "blocks/30" on "croquetscores.com"
