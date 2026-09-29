Feature: Moving a tournament's player up or down

  A tournament lists its players lowest order first (`addPlayer.feature`), and
  a manager puts them in the order that suits the tournament — by seeding, by
  club, or however the draw is to be made — by moving one up or down a place at
  a time. A player entered in a competition takes their order there from this
  one (`enterPlayer.feature`), so the tournament's order is where every
  competition's starts.

  A player is moved as a competition is (`moveCompetition.feature`): given the
  order halfway between the orders of the two they now come between, rounded
  down, so that nothing else moves, and a player dragged further than a place
  will be put the same way. Moving up is putting them just before the player
  above, and moving down just after the player below. Put first, a player is
  given half the order of the one they come before; put last, 10,000 more than
  the highest order there is, as a player added is. Where there is no whole
  number left between two orders, the tournament first spaces its players out
  again, 10,000 apart in the order they are in, and records that, and then
  moves the player.

  An archived player is out of the way (`archivePlayer.feature`), and a list of
  the players in use does not show them, so moving a place passes over them:
  the player above or below is the nearest one who is not archived. An
  archived player is listed last whatever their order
  (`archivePlayer.feature`), but a player added after them is given a higher
  order, so by order one can lie between two in use. Their order still
  counts, so no order is ever given twice, and one lying between two players
  in use is where the room between them ends. An archived player can only be
  restored (`TournamentPlayer.feature`), so moving one is refused.

  Moving the first player up, or the last down, records nothing, because there
  is nowhere for them to go: a button pressed twice is not a mistake worth
  refusing.

  An archived tournament can only be restored (`restore.feature`), so moving a
  player in one is refused, and only its managers can move one
  (`onlyManagers.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Moving a player up puts them just before the player above

    Scenario: A player moved up comes before the player who was above
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then the tournament's first player is "Alex Another"
      And the tournament's second player is "Sam Someone"

    Scenario: A player moved up between two others is given the order halfway between them
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's player "Pat Player" has the order 15000

    Scenario: A player moved up to the top is given half the order of the one they come before
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then the tournament's player "Alex Another" has the order 5000

    Scenario: Halfway between two is rounded down
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the player "Alex Another" was moved to the order 20001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's player "Pat Player" has the order 15000

    Scenario: Half the order of the first is rounded down
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Sam Someone" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then the tournament's player "Alex Another" has the order 5000

    Scenario: The player who was above keeps their order
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then the tournament's player "Sam Someone" has the order 10000

    Scenario: Moving a player up records it
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then it has recorded 1 event
      And the first thing it recorded is a player being moved

  Rule: Moving a player down puts them just after the player below

    Scenario: A player moved down comes after the player who was below
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved down
      Then the tournament's first player is "Alex Another"
      And the tournament's second player is "Sam Someone"

    Scenario: A player moved down between two others is given the order halfway between them
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved down
      Then the tournament's player "Sam Someone" has the order 25000

    Scenario: A player moved down to the bottom is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved down
      Then the tournament's player "Sam Someone" has the order 30000

    Scenario: Moving a player down records it
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved down
      Then it has recorded 1 event
      And the first thing it recorded is a player being moved

  Rule: A tournament rebuilt after a player was moved has them where they were moved to

    Scenario: A tournament rebuilt after a player was moved up has them first
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was moved to the order 5000
      When the tournament is rebuilt from the stream
      Then the tournament's first player is "Alex Another"

    Scenario: A tournament rebuilt after a player was moved keeps the order they were given
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was moved to the order 5000
      When the tournament is rebuilt from the stream
      Then the tournament's player "Alex Another" has the order 5000

  Rule: Where there is no room between two orders, the players are spaced out first

    Scenario: Moving into a place with no room spaces the players out and then moves
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the player "Alex Another" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then it has recorded 2 events
      And the first thing it recorded is the players being spaced out
      And the second thing it recorded is a player being moved

    Scenario: The players are spaced out 10,000 apart in the order they were in
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the player "Alex Another" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's player "Alex Another" has the order 20000

    Scenario: The player moved is then given the order halfway into their place
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the player "Alex Another" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's player "Pat Player" has the order 15000

    Scenario: The players are in their new order once spaced out and moved
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the player "Alex Another" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's second player is "Pat Player"

    Scenario: Moving to the top with no room below the first spaces them out
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Sam Someone" was moved to the order 1
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then the tournament's player "Alex Another" has the order 5000

    Scenario: Archived players are spaced out with the others
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the player "Pat Player" was added to it
      And the player "Pat Player" was moved to the order 30001
      And the player "Kim Keeper" was added to it
      And the tournament is rebuilt from the stream
      When the player "Kim Keeper" is moved up
      Then the tournament's player "Alex Another" has the order 20000

    Scenario: A tournament rebuilt after its players were spaced out has them spaced out
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was moved to the order 10001
      And the players were spaced out
      When the tournament is rebuilt from the stream
      Then the tournament's player "Alex Another" has the order 20000

  Rule: An archived player is passed over

    Scenario: A player moved up passes over an archived one above
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the player "Pat Player" was added to it
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's player "Pat Player" has the order 5000

    Scenario: The archived player passed over keeps their order
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the player "Pat Player" was added to it
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is moved up
      Then the tournament's player "Alex Another" has the order 30000

    Scenario: A player moved down passes over an archived one below
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the player "Pat Player" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved down
      Then the tournament's player "Sam Someone" has the order 50000

    Scenario: The room between two players ends at an archived one between them
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Pat Player" was added to it
      And the player "Pat Player" was archived
      And the player "Kim Keeper" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved down
      Then the tournament's player "Sam Someone" has the order 30000

    Scenario: A player with only archived ones above them is already first
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then it has recorded 0 events

  Rule: The first cannot go up, nor the last down, and trying records nothing

    Scenario: Moving the first player up records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved up
      Then it has recorded 0 events

    Scenario: Moving the first player up is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is moved up
      Then it is not refused

    Scenario: Moving the last player down records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved down
      Then it has recorded 0 events

    Scenario: Moving the last player down is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved down
      Then it is not refused

  Rule: Only a player there is, and one not archived, can be moved

    Scenario: Moving a player the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "tournament-player/123e4567-e89b-42d3-a456-426614174000" is moved up by their id
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: Moving an archived player is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then it is refused for breaking "TournamentPlayer.Archived"

  Rule: A player in an archived tournament cannot be moved

    Scenario: Moving a player in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      When the player "Alex Another" is moved up
      Then it is refused with "Tournament.Archived"
