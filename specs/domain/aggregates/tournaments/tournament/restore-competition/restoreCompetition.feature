Feature: Restoring a tournament's archived competition

  An archived competition (`archiveCompetition.feature`) can be restored, of
  whatever kind it is, and is then in use again, with its name and its slug,
  which were kept for it while it was archived, so nothing else can have them.
  It keeps the order it was given when it was archived, so it comes back after
  the competitions that stayed in use rather than in the place it had, which
  something else may have been moved into since.

  A test is between two teams (`addTest.feature`), and a team whose only tests
  are archived can itself be archived (`archiveTeam.feature`). A test restored
  while one of its teams is archived would be against a team that is out of
  the way, so it is refused: the team is restored first.

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

    Scenario: A restored competition keeps the order it was given when archived
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then the tournament's competition "Block A" has the order 30000

    Scenario: A restored competition comes after those that stayed in use
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the competition "Block A" is restored
      Then the tournament's first competition is "Block B"

    Scenario: A tournament rebuilt after a competition was restored has it not archived
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the competition "Block A" was restored
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" is not archived

  Rule: A test cannot be restored while one of its teams is archived

    Scenario: Restoring a test whose team is archived is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the competition "AUS v ENG" was archived
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the competition "AUS v ENG" is restored
      Then it is refused for breaking "Team.Archived"

    Scenario: Restoring a test whose teams are in use restores it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the competition "AUS v ENG" was archived
      And the tournament is rebuilt from the stream
      When the competition "AUS v ENG" is restored
      Then the tournament's competition "AUS v ENG" is not archived

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
