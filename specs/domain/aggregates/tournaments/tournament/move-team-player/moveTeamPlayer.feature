Feature: Moving a player in a tournament's team up or down

  A team lists its players lowest order first (`addTeamPlayer.feature`), and a
  manager puts them in the order that suits the team — by ranking, or however
  the team is to be read — by moving one up or down a place at a time.

  A player in a team is moved as a tournament's player is
  (`movePlayer.feature`), and everything said there of how is said here,
  within the team: they are given the order halfway between the orders of the
  two players of the team they now come between, rounded down; put first,
  half the order of the one they come before; put last, 10,000 more than the
  highest order in the team. Where there is no whole number left between two
  orders, the team's players are first spaced out again, 10,000 apart in the
  order they are in, and that is recorded before the player is moved. Another
  team's players are no part of it: they are neither passed over nor spaced
  out.

  An archived player is passed over, and one lying between two players in use
  is where the room between them ends. An archived player can only be restored
  (`TeamPlayer.feature`), so moving one is refused.

  Moving the first player up, or the last down, records nothing, because there
  is nowhere for them to go.

  An archived team or tournament can only be restored, so moving a player in
  one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the team "England" was added to it
    And the player "Sam Someone" was added to the team "Australia"
    And the player "Alex Another" was added to the team "Australia"

  Rule: Moving a player up puts them just before the player above in the team

    Scenario: A player moved up comes before the player who was above
      Given the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved up
      Then the team "Australia"'s first player is "Alex Another"
      And the team "Australia"'s second player is "Sam Someone"

    Scenario: A player moved up between two others is given the order halfway between them
      Given the player "Pat Player" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the player "Pat Player" of the team "Australia" is moved up
      Then the player "Pat Player" of the team "Australia" has the order 15000

    Scenario: A player moved up to the top is given half the order of the one they come before
      Given the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved up
      Then the player "Alex Another" of the team "Australia" has the order 5000

    Scenario: Moving a player in a team up records it
      Given the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved up
      Then it has recorded 1 event
      And the first thing it recorded is a player in a team being moved

  Rule: Moving a player down puts them just after the player below in the team

    Scenario: A player moved down comes after the player who was below
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is moved down
      Then the team "Australia"'s first player is "Alex Another"

    Scenario: A player moved down to the bottom is given 10,000 more than the highest order in the team
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is moved down
      Then the player "Sam Someone" of the team "Australia" has the order 30000

  Rule: A tournament rebuilt after a player in a team was moved has them where they were moved to

    Scenario: A tournament rebuilt after a player in a team was moved keeps the order they were given
      Given the player "Alex Another" of the team "Australia" was moved to the order 5000
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s first player is "Alex Another"

  Rule: Where there is no room between two orders, the team's players are spaced out first

    Scenario: Moving into a place with no room spaces the team's players out and then moves
      Given the player "Pat Player" was added to the team "Australia"
      And the player "Alex Another" of the team "Australia" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" of the team "Australia" is moved up
      Then it has recorded 2 events
      And the first thing it recorded is a team's players being spaced out
      And the second thing it recorded is a player in a team being moved

    Scenario: The team's players are spaced out 10,000 apart in the order they were in
      Given the player "Pat Player" was added to the team "Australia"
      And the player "Alex Another" of the team "Australia" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" of the team "Australia" is moved up
      Then the player "Alex Another" of the team "Australia" has the order 20000

    Scenario: Another team's players are not spaced out
      Given the player "Chris Third" was added to the team "England"
      And the player "Chris Third" of the team "England" was moved to the order 7
      And the player "Pat Player" was added to the team "Australia"
      And the player "Alex Another" of the team "Australia" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" of the team "Australia" is moved up
      Then the player "Chris Third" of the team "England" has the order 7

    Scenario: A tournament rebuilt after a team's players were spaced out has them spaced out
      Given the player "Alex Another" of the team "Australia" was moved to the order 10001
      And the players of the team "Australia" were spaced out
      When the tournament is rebuilt from the stream
      Then the player "Alex Another" of the team "Australia" has the order 20000

  Rule: An archived player is passed over

    Scenario: A player moved up passes over an archived one above
      Given the player "Alex Another" of the team "Australia" was archived
      And the player "Pat Player" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the player "Pat Player" of the team "Australia" is moved up
      Then the player "Pat Player" of the team "Australia" has the order 5000

  Rule: The first cannot go up, nor the last down, and trying records nothing

    Scenario: Moving the first player in a team up records nothing
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" of the team "Australia" is moved up
      Then it has recorded 0 events

    Scenario: Moving the last player in a team down records nothing
      Given the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved down
      Then it has recorded 0 events

    Scenario: Moving the last player in a team down is not refused
      Given the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved down
      Then it is not refused

  Rule: Only a player there is, and one not archived, can be moved

    Scenario: Moving a player the team does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "Australia" is moved up by their id
      Then it is refused with "Team.NoSuchPlayer"

    Scenario: Moving a player in a team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "team/123e4567-e89b-42d3-a456-426614174000" is moved up by their ids
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Moving an archived player is refused
      Given the player "Alex Another" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved up
      Then it is refused for breaking "TeamPlayer.Archived"

  Rule: A player in an archived team or tournament cannot be moved

    Scenario: Moving a player in an archived team is refused
      Given the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved up
      Then it is refused for breaking "Team.Archived"

    Scenario: Moving a player in a team in an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When the player "Alex Another" of the team "Australia" is moved up
      Then it is refused with "Tournament.Archived"
