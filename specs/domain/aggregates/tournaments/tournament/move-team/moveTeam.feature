Feature: Moving a tournament's team up or down

  A tournament lists its teams lowest order first (`addTeam.feature`), and a
  manager puts them in the order that suits the tournament, as they put its
  players (`movePlayer.feature`), by moving one up or down a place at a time.

  A team is moved as a player is, and everything said there of how is said
  here: it is given the order halfway between the orders of the two it now
  comes between, rounded down, so that nothing else moves; put first, it is
  given half the order of the one it comes before; put last, 10,000 more than
  the highest order there is. Where there is no whole number left between
  two orders, the tournament first spaces its teams out again, 10,000 apart
  in the order they are in, and records that, and then moves the team.

  An archived team is out of the way (`archiveTeam.feature`), so moving a place
  passes over it, and one lying between two teams in use is where the room
  between them ends. An archived team can only be restored (`Team.feature`),
  so moving one is refused.

  Moving the first team up, or the last down, records nothing, because there
  is nowhere for it to go.

  An archived tournament can only be restored (`restore.feature`), so moving a
  team in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Moving a team up puts it just before the team above

    Scenario: A team moved up comes before the team that was above
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is moved up
      Then the tournament's first team is "England"
      And the tournament's second team is "Australia"

    Scenario: A team moved up between two others is given the order halfway between them
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Scotland" was added to it
      And the tournament is rebuilt from the stream
      When the team "Scotland" is moved up
      Then the tournament's team "Scotland" has the order 15000

    Scenario: A team moved up to the top is given half the order of the one it comes before
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is moved up
      Then the tournament's team "England" has the order 5000

    Scenario: Moving a team up records it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is moved up
      Then it has recorded 1 event
      And the first thing it recorded is a team being moved

  Rule: Moving a team down puts it just after the team below

    Scenario: A team moved down comes after the team that was below
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is moved down
      Then the tournament's first team is "England"
      And the tournament's second team is "Australia"

    Scenario: A team moved down to the bottom is given 10,000 more than the highest order
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is moved down
      Then the tournament's team "Australia" has the order 30000

  Rule: A tournament rebuilt after a team was moved has it where it was moved to

    Scenario: A tournament rebuilt after a team was moved keeps the order it was given
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "England" was moved to the order 5000
      When the tournament is rebuilt from the stream
      Then the tournament's first team is "England"

  Rule: Where there is no room between two orders, the teams are spaced out first

    Scenario: Moving into a place with no room spaces the teams out and then moves
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Scotland" was added to it
      And the team "England" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the team "Scotland" is moved up
      Then it has recorded 2 events
      And the first thing it recorded is the teams being spaced out
      And the second thing it recorded is a team being moved

    Scenario: The teams are spaced out 10,000 apart in the order they were in
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Scotland" was added to it
      And the team "England" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the team "Scotland" is moved up
      Then the tournament's team "England" has the order 20000

    Scenario: The team moved is then given the order halfway into its place
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Scotland" was added to it
      And the team "England" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the team "Scotland" is moved up
      Then the tournament's team "Scotland" has the order 15000

    Scenario: A tournament rebuilt after its teams were spaced out has them spaced out
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "England" was moved to the order 10001
      And the teams were spaced out
      When the tournament is rebuilt from the stream
      Then the tournament's team "England" has the order 20000

  Rule: An archived team is passed over

    Scenario: A team moved up passes over an archived one above
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "England" was archived
      And the team "Scotland" was added to it
      And the tournament is rebuilt from the stream
      When the team "Scotland" is moved up
      Then the tournament's team "Scotland" has the order 5000

    Scenario: A team with only archived ones above it is already first
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is moved up
      Then it has recorded 0 events

  Rule: The first cannot go up, nor the last down, and trying records nothing

    Scenario: Moving the first team up records nothing
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is moved up
      Then it has recorded 0 events

    Scenario: Moving the last team down records nothing
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is moved down
      Then it has recorded 0 events

    Scenario: Moving the last team down is not refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is moved down
      Then it is not refused

  Rule: Only a team there is, and one not archived, can be moved

    Scenario: Moving a team the tournament does not have is refused
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "team/123e4567-e89b-42d3-a456-426614174000" is moved up by its id
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Moving an archived team is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "England" was archived
      And the tournament is rebuilt from the stream
      When the team "England" is moved up
      Then it is refused for breaking "Team.Archived"

  Rule: A team in an archived tournament cannot be moved

    Scenario: Moving a team in an archived tournament is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      When the team "England" is moved up
      Then it is refused with "Tournament.Archived"
