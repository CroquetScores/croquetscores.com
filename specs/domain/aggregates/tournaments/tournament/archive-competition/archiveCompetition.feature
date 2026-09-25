Feature: Archiving a tournament's competition

  A competition can be archived: kept, with everything it is, but set aside,
  so that one added by mistake is out of the way. Archiving is the same for a
  block, a knockout and a Swiss, since what is set aside is the competition
  and not anything about its kind, so there is one way to archive any of them
  rather than one for each.

  An archived competition keeps its name, its slug and its order, so that no
  other competition can be given any of them (`addBlock.feature`), and it can
  be restored (`restoreCompetition.feature`), which is all that can be done
  to it until it is.

  Archiving a competition that is already archived records nothing, because
  nothing happened.

  An archived tournament can only be restored (`restore.feature`), so
  archiving a competition in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Archiving a competition is recorded, and the competition is archived

    Scenario: Archiving a competition records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then it has recorded 1 event
      And the first thing it recorded is a competition being archived

    Scenario Outline: A competition of any kind that is archived is archived
      Given a stream where a tournament was created as "Spring Open"
      And the <kind> "Final Stage" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Final Stage" is archived
      Then the tournament's competition "Final Stage" is archived

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

    Scenario: An archived competition is still one of the tournament's competitions
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then the tournament has the competition "Block A"

    Scenario: An archived competition keeps its slug
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then the tournament's competition "Block A" has the slug "block-a"

    Scenario: A tournament rebuilt after a competition was archived has it archived
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" is archived

  Rule: Only a competition there is can be archived

    Scenario: Archiving a competition the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the competition "competition/123e4567-e89b-42d3-a456-426614174000" is archived by its id
      Then it is refused with "Tournament.NoSuchCompetition"

  Rule: Archiving an archived competition records nothing

    Scenario: Archiving an archived competition records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then it has recorded 0 events

    Scenario: Archiving an archived competition is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then it is not refused

  Rule: A competition in an archived tournament cannot be archived

    Scenario: Archiving a competition in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then it is refused with "Tournament.Archived"
