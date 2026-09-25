Feature: Restoring a tournament's archived competition

  An archived competition (`archiveCompetition.feature`) can be restored, of
  whatever kind it is, and is then as it was before it was archived, with its
  name, its slug and its order. Those were kept for it while it was archived,
  so nothing else can have them.

  Restoring a competition that is not archived records nothing, because
  nothing happened.

  An archived tournament can only be restored (`restore.feature`), so
  restoring a competition in one is refused: the tournament is restored
  first.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Restoring a competition is recorded, and the competition is no longer archived

    Scenario: Restoring a competition records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then it has recorded 1 event
      And the first thing it recorded is a competition being restored

    Scenario Outline: A competition of any kind that is restored is not archived
      Given a stream where a tournament was created as "Spring Open"
      And the <kind> "Final Stage" was added to it
      And the competition "Final Stage" was archived
      And the tournament is rebuilt from the stream
      When the competition "Final Stage" is restored
      Then the tournament's competition "Final Stage" is not archived

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

    Scenario: A restored competition keeps its order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then the tournament's competition "Block A" has the order 10000

    Scenario: A tournament rebuilt after a competition was restored has it not archived
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the competition "Block A" was restored
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" is not archived

  Rule: Only a competition there is can be restored

    Scenario: Restoring a competition the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the competition "competition/123e4567-e89b-42d3-a456-426614174000" is restored by its id
      Then it is refused with "Tournament.NoSuchCompetition"

  Rule: Restoring a competition that is not archived records nothing

    Scenario: Restoring a competition that is not archived records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then it has recorded 0 events

    Scenario: Restoring a competition that is not archived is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then it is not refused

  Rule: A competition in an archived tournament cannot be restored

    Scenario: Restoring a competition in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And it was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then it is refused with "Tournament.Archived"
