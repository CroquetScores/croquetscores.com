Feature: Archiving a player in a tournament's team

  A player in a team can be archived as a tournament's player can
  (`archivePlayer.feature`): kept, with everything they are, but set aside, so
  that a player entered by mistake is out of the way. They keep their name, so
  no other player in the team can be given it (`addTeamPlayer.feature`), and
  can be restored (`restoreTeamPlayer.feature`), which is all that can be done
  to them until they are. They are put last in their team: listed after every
  player in the team still in use, whatever their order, and given 10,000 more
  than the highest order in the team, so that the team's archived players are
  listed in the order they were archived.

  A player who has played any games in use in a test cannot be archived,
  since the games would then be against somebody who is no longer there. The
  games are not the tournament's to know: they are kept by its tests, which
  are its competitions (`gamesInATest.feature`), archived ones among them. So
  whatever asks for a player to be archived says whether the player has
  played any, as it says which player. A player in a team is in no
  competition (`TeamPlayer.feature`), so there is nothing to take them out
  of.

  Archiving a player who is already archived records nothing, because nothing
  happened.

  An archived team or tournament can only be restored, so archiving a player
  in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the player "Sam Someone" was added to the team "Australia"

  Rule: A player in a team who has played no games can be archived

    Scenario: Archiving a player in a team records it
      Given the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then it has recorded 1 event
      And the first thing it recorded is a player in a team being archived

    Scenario: An archived player in a team is archived
      Given the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then the team "Australia"'s player "Sam Someone" is archived

    Scenario: An archived player is still one of the team's players
      Given the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then the team "Australia" has the player "Sam Someone"

    Scenario: A tournament rebuilt after a player in a team was archived has the player archived
      Given the player "Sam Someone" of the team "Australia" was archived
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s player "Sam Someone" is archived

  Rule: An archived player is put last in their team

    Scenario: An archived player is given 10,000 more than the highest order in the team
      Given the player "Alex Another" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then the player "Sam Someone" of the team "Australia" has the order 30000

    Scenario: An archived player comes after those in use
      Given the player "Alex Another" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then the team "Australia"'s first player is "Alex Another"

    Scenario: A player added after an archived one comes before them
      Given the player "Sam Someone" of the team "Australia" was archived
      And the player "Alex Another" was added to the team "Australia"
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s first player is "Alex Another"
      And the team "Australia"'s second player is "Sam Someone"

  Rule: A player in a team who has played games cannot be archived

    Scenario: Archiving a player who has played games is refused
      Given the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played games
      When the player "Sam Someone" of the team "Australia" is archived
      Then it is refused for breaking "TeamPlayer.HasGames"

  Rule: Only a player there is, in a team there is, can be archived

    Scenario: Archiving a player in a team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "team/123e4567-e89b-42d3-a456-426614174000" is archived by their ids
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Archiving a player the team does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "Australia" is archived by their id
      Then it is refused with "Team.NoSuchPlayer"

  Rule: Archiving an archived player records nothing

    Scenario: Archiving an archived player in a team records nothing
      Given the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then it has recorded 0 events

    Scenario: Archiving an archived player in a team is not refused
      Given the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then it is not refused

  Rule: A player in an archived team or tournament cannot be archived

    Scenario: Archiving a player in an archived team is refused
      Given the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then it is refused for breaking "Team.Archived"

    Scenario: Archiving a player in a team in an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      And the player "Sam Someone" of the team "Australia" has played no games
      When the player "Sam Someone" of the team "Australia" is archived
      Then it is refused with "Tournament.Archived"
