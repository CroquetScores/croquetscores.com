Feature: Adding a Swiss to a tournament

  A Swiss is a kind of competition played in rounds, in which each player is
  drawn in each round against somebody who has done about as well as they
  have, so that nobody need play everybody. A Swiss is added with an id of its
  own, a competition name, and how many games each match in it is the best of.
  A Swiss's best-of may be even, as a block's may, because its players are
  ranked by what they win.

  Everything else asked of a competition added is asked of a Swiss, and is
  specified with adding a block (`addBlock.feature`). This says it again only
  enough to show that it holds for a Swiss too.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Adding a Swiss is recorded, and the Swiss is one of the tournament's competitions

    Scenario: Adding a Swiss records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the Swiss "Swiss" is added
      Then it has recorded 1 event
      And the first thing it recorded is a Swiss being added

    Scenario: A Swiss added is a Swiss
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" is a Swiss

    Scenario Outline: A Swiss added is the best of what it was added as
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the Swiss is to be the best of <games>
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" is the best of <games>

      Examples:
        | games |
        | 1     |
        | 2     |

    Scenario: A tournament rebuilt after a Swiss was added has the Swiss
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Swiss" is a Swiss

  Rule: A Swiss is added as every competition is

    Scenario: A Swiss's slug is made from its name
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the Swiss "Swiss Stage" is added
      Then the tournament's competition "Swiss Stage" has the slug "swiss-stage"

    Scenario: A Swiss is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the Swiss "Swiss" is added
      Then the tournament's competition "Swiss" has the order 20000

    Scenario: A Swiss with a name another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Swiss" was added to it
      And the tournament is rebuilt from the stream
      When the Swiss "Swiss" is added
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Adding a Swiss to an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the Swiss "Swiss" is added
      Then it is refused with "Tournament.Archived"
