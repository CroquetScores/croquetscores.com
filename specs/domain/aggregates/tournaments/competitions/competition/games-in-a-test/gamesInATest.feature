Feature: The games of a test

  A test is one of a tournament's competitions (`addTest.feature`), and its
  games are kept with it, as a block's are (`addGame.feature`): added,
  corrected, archived and restored as any competition's are, and listed in
  the order they were added. This says only what is a test's own, and what
  is said of games there is not said again here.

  A test is between two teams, and its games are between their players: each
  game is between a player of one team and a player of the other, and either
  may win it. A test has no players entered in it, as a block does. Its
  players are its teams' (`TeamPlayer.feature`), who are the tournament's to
  know, so whatever adds a game says which team each of its players plays
  for, and whether either is archived, as it says what kind of competition
  it is. A game between two players of the same team is refused, since it is
  not a game between the teams. A game with a player who plays for neither
  is refused as a game with a player a competition does not have is. An
  archived player is out of the way (`archiveTeamPlayer.feature`), so a game
  with one is refused as the player refuses it.

  A test has no draw, but it has matches, as a block does
  (`addGame.feature`): two players who meet play a match of the test's
  best-of (`addTest.feature`), and a game between two players whose match is
  decided — one of them has won more games than the other could still win,
  or every game of it has been played — is refused with
  `Competition.MatchDecided`. A drawn game is one of the match's games
  played, won by neither, and drawn games are the tournament's to allow, as
  anywhere (`Game.feature`). A best-of may be even, so a match can be shared.
  How many matches a test is expected to have is not a limit
  (`ExpectedMatches.feature`), so a game is never refused for it.

  Correcting a game can change who played it (`correctGame.feature`), and a
  correction in a test asks of its players what adding asks. Restoring an
  archived game asks it too, of the test as it now is, so a game whose
  player has since been archived is not restored until they are, and one
  whose player's team is no longer in the test, since the test was changed
  (`updateTest.feature`), is not restored at all.

  A scenario that does not say what a test's matches are the best of has
  them each the best of 1.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a test between the teams "Australia" and "England"
    And "Sam Someone" plays for "Australia"
    And "Alex Another" plays for "Australia"
    And "Chris Third" plays for "England"
    And "Pat Fourth" plays for "England"

  Rule: A game in a test is between a player of each of its teams

    Scenario: Adding a game to a test records it
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is added
      Then it has recorded 1 event
      And the first thing it recorded is a game being added

    Scenario: A game added is one of the test's games
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is added
      Then the competition has the game of "Sam Someone" beating "Chris Third" 26 to 17

    Scenario: A player of the second team can win
      Given the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 17 is added
      Then the competition has the game of "Chris Third" beating "Sam Someone" 26 to 17

    Scenario: A game between two players of the first team is refused
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then it is refused with "Competition.SameTeam"

    Scenario: A game between two players of the second team is refused
      Given the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Pat Fourth" 26 to 17 is added
      Then it is refused with "Competition.SameTeam"

    Scenario: A game with a player of neither team is refused
      Given "Kim Keeper" plays for "Scotland"
      And the competition is rebuilt from its stream
      When the game of "Kim Keeper" beating "Chris Third" 26 to 17 is added
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: A game with an archived player is refused
      Given "Chris Third" has been archived from "England"
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is added
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: A refused game is not kept
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then the competition has 0 games

  Rule: Two players play a match of the test's best-of

    Scenario: A second game of a match not yet decided is added
      Given the test's matches are each the best of 3
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

    Scenario: A game of a match already decided is refused
      Given the test's matches are each the best of 3
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 3 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A match the best of 1 is decided by its one game
      Given the test's matches are each the best of 1
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 20 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: A match the best of 2 shared one each is decided
      Given the test's matches are each the best of 2
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the game of "Chris Third" beating "Sam Someone" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 3 is added
      Then it is refused with "Competition.MatchDecided"

    Scenario: Another pair's match is a match of its own
      Given the test's matches are each the best of 1
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Pat Fourth" 26 to 20 is added
      Then the competition has 2 games

    Scenario: An archived game does not decide a match
      Given the test's matches are each the best of 1
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Chris Third" beating "Sam Someone" 26 to 20 is added
      Then the competition has 2 games

    Scenario: Games beyond the matches a test was expected to have are added
      Given the test is expected to have 1 match
      And the test's matches are each the best of 1
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Alex Another" beating "Pat Fourth" 26 to 20 is added
      Then the competition has 2 games

  Rule: What any game asks is asked of a game in a test

    Scenario: A game whose winner made fewer points is refused as a game refuses it
      Given the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 17 to 26 is added
      Then it is refused for breaking "Game.WinnerNotAhead"

  Rule: A correction in a test asks of its players what adding asks

    Scenario: A game corrected to be between two players of one team is refused
      Given the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is corrected to "Sam Someone" beating "Alex Another" 26 to 17
      Then it is refused with "Competition.SameTeam"

    Scenario: A game corrected to other players of each team is kept
      Given the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is corrected to "Alex Another" beating "Pat Fourth" 26 to 17
      Then the competition has the game of "Alex Another" beating "Pat Fourth" 26 to 17

  Rule: A game restored in a test asks of its players what adding asks

    Scenario: A game whose player has since been archived is not restored
      Given the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was archived
      And "Chris Third" has been archived from "England"
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is restored
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: A game whose players are in use is restored
      Given the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was archived
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is restored
      Then the competition's game of "Sam Someone" beating "Chris Third" 26 to 17 is not archived

    Scenario: A game whose player's team is no longer in the test is not restored
      Given "Kim Keeper" plays for "Scotland"
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was added to it
      And the game of "Sam Someone" beating "Chris Third" 26 to 17 was archived
      And the test is now between the teams "Australia" and "Scotland"
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Chris Third" 26 to 17 is restored
      Then it is refused with "Competition.NoSuchPlayer"
