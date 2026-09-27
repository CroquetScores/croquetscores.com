Feature: Moving a tournament's competition up or down

  A tournament lists its competitions lowest order first (`addBlock.feature`),
  and a manager puts them in the order that suits the tournament by moving
  one up or down a place at a time. Moving is the same for a block, a
  knockout and a Swiss, since what moves is the competition's place in the
  list and not anything about its kind.

  A competition moved is given an order halfway between the orders of the two
  it now comes between, rounded down, and nothing else moves. That is what the
  orders are spaced 10,000 apart for, and it is how a competition will be put
  anywhere in the list, more than a place at a time, when it can be dragged
  there: moving up or down a place is putting it just before the one above it,
  or just after the one below. A competition put first is given half the
  order of the one it comes before, and one put last is given 10,000 more
  than the highest order there is, as a competition added is.

  Halving the room between two orders each time runs out: after about
  thirteen moves into the same place, two orders are next to each other and
  there is no whole number between them. When that happens the tournament
  first spaces its competitions out again, 10,000 apart in the order they are
  in, and then makes the move. Spacing them out is recorded, since every
  competition's order changes, and the move is recorded after it.

  An archived competition is out of the way (`archiveCompetition.feature`),
  and a list of the ones in use does not show it, so moving a place passes
  over it: the competition above or below is the nearest one that is not
  archived. An archived competition keeps its order and still counts, so no
  order is ever given twice, and one lying between two competitions in use
  is where the room between them ends. An archived competition can only be
  restored, so moving one is refused.

  Moving the first competition up, or the last one down, records nothing,
  because there is nowhere for it to go: a button pressed twice is not a
  mistake worth refusing.

  An archived tournament can only be restored (`restore.feature`), so moving a
  competition in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Moving a competition up puts it just before the one above it

    Scenario: A competition moved up comes before the one that was above it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then the tournament's first competition is "Block B"
      And the tournament's second competition is "Block A"

    Scenario: A competition moved up between two others is given the order halfway between them
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's competition "Block C" has the order 15000

    Scenario: A competition moved up to the top is given half the order of the one it comes before
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then the tournament's competition "Block B" has the order 5000

    Scenario: Halfway is rounded down
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then the tournament's competition "Block B" has the order 5000

    Scenario: The competition that was above keeps its order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then the tournament's competition "Block A" has the order 10000

    Scenario: Moving a competition up records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then it has recorded 1 event
      And the first thing it recorded is a competition being moved

    Scenario Outline: A competition of any kind can be moved up
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the <kind> "Final Stage" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Final Stage" is moved up
      Then the tournament's first competition is "Final Stage"

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

  Rule: Moving a competition down puts it just after the one below it

    Scenario: A competition moved down comes after the one that was below it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved down
      Then the tournament's first competition is "Block B"
      And the tournament's second competition is "Block A"

    Scenario: A competition moved down between two others is given the order halfway between them
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved down
      Then the tournament's competition "Block A" has the order 25000

    Scenario: A competition moved down to the bottom is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved down
      Then the tournament's competition "Block A" has the order 30000

    Scenario: Moving a competition down records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved down
      Then it has recorded 1 event
      And the first thing it recorded is a competition being moved

  Rule: A tournament rebuilt after a competition was moved has it where it was moved to

    Scenario: A tournament rebuilt after a competition was moved up has it first
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was moved to the order 5000
      When the tournament is rebuilt from the stream
      Then the tournament's first competition is "Block B"

    Scenario: A tournament rebuilt after a competition was moved keeps the order it was given
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was moved to the order 5000
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block B" has the order 5000

  Rule: Where there is no room between two orders, the competitions are spaced out first

    Scenario: Moving into a place with no room spaces the competitions out and then moves
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then it has recorded 2 events
      And the first thing it recorded is the competitions being spaced out
      And the second thing it recorded is a competition being moved

    Scenario: The competitions are spaced out 10,000 apart in the order they were in
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's competition "Block B" has the order 20000

    Scenario: The competition moved is then given the order halfway into its place
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's competition "Block C" has the order 15000

    Scenario: The competitions are in their new order once spaced out and moved
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was moved to the order 10001
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's second competition is "Block C"

    Scenario: Moving to the top with no room below the first spaces them out
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was moved to the order 1
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then the tournament's competition "Block B" has the order 5000

    Scenario: Archived competitions are spaced out with the others
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was moved to the order 10001
      And the competition "Block B" was archived
      And the block "Block D" was added to it
      And the competition "Block D" was moved to the order 10002
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's competition "Block B" has the order 20000

    Scenario: A tournament rebuilt after its competitions were spaced out has them spaced out
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was moved to the order 10001
      And the competitions were spaced out
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block B" has the order 20000

  Rule: An archived competition is passed over

    Scenario: A competition moved up passes over an archived one above it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's competition "Block C" has the order 5000

    Scenario: The archived competition passed over keeps its order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block C" is moved up
      Then the tournament's competition "Block B" has the order 20000

    Scenario: A competition moved down passes over an archived one below it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the competition "Block B" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved down
      Then the tournament's competition "Block A" has the order 40000

    Scenario: The room between two competitions ends at an archived one between them
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the block "Block C" was added to it
      And the block "Block D" was added to it
      And the competition "Block C" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved down
      Then the tournament's competition "Block A" has the order 25000

    Scenario: A competition with only archived ones above it is already first
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then it has recorded 0 events

  Rule: The first cannot go up, nor the last down, and trying records nothing

    Scenario: Moving the first competition up records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved up
      Then it has recorded 0 events

    Scenario: Moving the first competition up is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is moved up
      Then it is not refused

    Scenario: Moving the last competition down records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved down
      Then it has recorded 0 events

    Scenario: Moving the last competition down is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved down
      Then it is not refused

  Rule: Only a competition there is, and one not archived, can be moved

    Scenario: Moving a competition the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the competition "competition/123e4567-e89b-42d3-a456-426614174000" is moved up by its id
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: Moving an archived competition is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then it is refused with "Tournament.CompetitionArchived"

  Rule: A competition in an archived tournament cannot be moved

    Scenario: Moving a competition in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      When the competition "Block B" is moved up
      Then it is refused with "Tournament.Archived"
