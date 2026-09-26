Feature: Adding a knockout to a tournament

  A knockout is a kind of competition in which whoever loses a match is out,
  and whoever wins goes through to the next round, until one player is left.
  A knockout is added with an id of its own, a competition name, and the
  shape of its draw: how many places it has, and what each of its rounds is
  the best of. What a draw's shape must be is the draw's to say
  (`KnockoutDraw.feature`).

  Everything else asked of a competition added is asked of a knockout, and is
  specified with adding a block (`addBlock.feature`). This says it again only
  enough to show that it holds for a knockout too.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Adding a knockout is recorded, and the knockout is one of the tournament's competitions

    Scenario: Adding a knockout records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the knockout "Main Event" is added
      Then it has recorded 1 event
      And the first thing it recorded is a knockout being added

    Scenario: A knockout added is a knockout
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" is a knockout

    Scenario: A knockout added has the places it was added with
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the knockout is to have a draw of 4 places
      And its first round is to be the best of 1
      And its second round is to be the best of 3
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" has a draw of 4 places

    Scenario: A knockout added has each round as it was added
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the knockout is to have a draw of 4 places
      And its first round is to be the best of 1
      And its second round is to be the best of 3
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" has its first round the best of 1
      And the tournament's competition "Main Event" has its second round the best of 3

    Scenario: A tournament rebuilt after a knockout was added has the knockout
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Main Event" is a knockout

  Rule: A knockout is added as every competition is

    Scenario: A knockout's slug is made from its name
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" has the slug "main-event"

    Scenario: A knockout is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the knockout "Main Event" is added
      Then the tournament's competition "Main Event" has the order 20000

    Scenario: A knockout with a name another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Main Event" was added to it
      And the tournament is rebuilt from the stream
      When the knockout "Main Event" is added
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Adding a knockout to an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the knockout "Main Event" is added
      Then it is refused with "Tournament.Archived"
