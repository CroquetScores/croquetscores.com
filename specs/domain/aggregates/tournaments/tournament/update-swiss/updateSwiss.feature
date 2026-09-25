Feature: Changing what a tournament's Swiss is

  A Swiss's name, and what each match in it is the best of, can each be
  corrected. Updating a Swiss says both again, and everything asked of an
  update is asked of a Swiss as it is of a block, and is specified with
  updating a block (`updateBlock.feature`). This says it again only enough to
  show that it holds for a Swiss too.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Updating a Swiss is recorded, and is what the Swiss is

    Scenario: Updating a Swiss records it
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss Stage"
      When the Swiss "Swiss" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a Swiss being updated

    Scenario: An updated Swiss has its new name
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss Stage"
      When the Swiss "Swiss" is updated
      Then the tournament has the competition "Swiss Stage"

    Scenario: An updated Swiss is the best of what it was updated to
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it as the best of 1
      And the tournament is rebuilt from the stream
      And the update makes the competition the best of 2
      When the Swiss "Swiss" is updated
      Then the tournament's competition "Swiss" is the best of 2

    Scenario: A renamed Swiss keeps its slug
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss Stage"
      When the Swiss "Swiss" is updated
      Then the tournament's competition "Swiss Stage" has the slug "swiss"

  Rule: A Swiss is updated as every competition is

    Scenario: Updating a block as a Swiss is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the Swiss "Block A" is updated
      Then it is refused with "Tournament.NotASwiss"

    Scenario: A name another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block A"
      When the Swiss "Swiss" is updated
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: Updating a Swiss to what it already is records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss"
      When the Swiss "Swiss" is updated
      Then it has recorded 0 events

    Scenario: Updating an archived Swiss is refused
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the competition "Swiss" was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss Stage"
      When the Swiss "Swiss" is updated
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: Updating a Swiss in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss Stage"
      When the Swiss "Swiss" is updated
      Then it is refused with "Tournament.Archived"
