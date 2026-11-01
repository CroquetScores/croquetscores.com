Feature: Changing what a tournament's block is

  A block's name, what each match in it is the best of, and the rounds it is
  played in (`Rounds.feature`) can each be corrected. Updating a block says
  all three again, and the block keeps its id,
  its order and its slug: a name corrected is still found where it was, as a
  tournament is (`update.feature`). A name another competition has, archived
  or not and of whatever kind, is refused as it is when a competition is
  added (`addBlock.feature`), and a block's own name, written with other
  capitals, is its own.

  The block is found by its id. An id that is no competition's in the
  tournament is refused, and so is one that is a competition of another kind:
  a knockout is not a block, and is updated as a knockout
  (`updateKnockout.feature`).

  An archived competition can only be restored (`restoreCompetition.feature`)
  and an archived tournament only restored (`restore.feature`), so updating
  an archived block, or a block in an archived tournament, is refused.

  An update that changes nothing records nothing, because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Updating a block is recorded, and is what the block is

    Scenario: Updating a block records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a block being updated

    Scenario: An updated block has its new name
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament has the competition "Block One"

    Scenario: An updated block is the best of what it was updated to
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it as the best of 1
      And the tournament is rebuilt from the stream
      And the update makes the competition the best of 2
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is the best of 2

    Scenario: An updated block is played in the rounds it was updated to
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update makes the competition played in 3 rounds
      When the block "Block A" is updated
      Then the tournament's competition "Block A" is played in 3 rounds

    Scenario: A renamed block keeps its slug
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament's competition "Block One" has the slug "block-a"

    Scenario: A renamed block keeps its order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament's competition "Block One" has the order 10000

    Scenario: A tournament rebuilt after a block was updated has the block as updated
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block A" was updated to be called "Block One"
      When the tournament is rebuilt from the stream
      Then the tournament has the competition "Block One"

  Rule: Updating a block can change the tie break it goes by

    An update that says none leaves the block going by what it went by, as an
    update that says nothing of a block's rules does (`competitionRules.feature`).

    Scenario: An updated block goes by the tie break it was updated to
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update makes the block go by the tie break "other"
      When the block "Block A" is updated
      Then the tournament's competition "Block A" goes by the tie break "other"

    Scenario: An update that says no tie break leaves the block going by its own
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it to go by the tie break "who-beat-who"
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then the tournament's competition "Block One" goes by the tie break "who-beat-who"

    Scenario: A tie break that is none of them is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update makes the block go by the tie break "net-hoops"
      When the block "Block A" is updated
      Then it is refused for breaking "TieBreak.Unknown"

    Scenario: A tournament rebuilt after a block was updated has the block going by the tie break it was updated to
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the update makes the block go by the tie break "other"
      And the block "Block A" was updated
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" goes by the tie break "other"

  Rule: No two competitions in a tournament have the same name

    Scenario: A name another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "block b"
      When the block "Block A" is updated
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: A name an archived competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block B"
      When the block "Block A" is updated
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: A block's own name in other capitals is its own
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block a" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block A"
      When the block "Block a" is updated
      Then the tournament has the competition "Block A"

  Rule: Only a block there is can be updated as a block

    Scenario: Updating a competition the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "competition/123e4567-e89b-42d3-a456-426614174000" is updated by its id
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: Updating a knockout as a block is refused
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Main Draw"
      When the block "Main Event" is updated
      Then it is refused with "Tournament.NotABlock"

    Scenario: Updating a Swiss as a block is refused
      Given a stream where a tournament was created as "Spring Open"
      And the Swiss "Swiss" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Swiss Stage"
      When the block "Swiss" is updated
      Then it is refused with "Tournament.NotABlock"

  Rule: An update that changes nothing records nothing

    Scenario: Updating a block to the rounds it is already played in records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it to be played in 2 rounds
      And the tournament is rebuilt from the stream
      And the update makes the competition played in 2 rounds
      When the block "Block A" is updated
      Then it has recorded 0 events

    Scenario: Updating only the rounds of a block records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update makes the competition played in 2 rounds
      When the block "Block A" is updated
      Then it has recorded 1 event

    Scenario: Updating a block to the tie break it already goes by records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it to go by the tie break "who-beat-who"
      And the tournament is rebuilt from the stream
      And the update makes the block go by the tie break "who-beat-who"
      When the block "Block A" is updated
      Then it has recorded 0 events

    Scenario: Updating only the tie break of a block records it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update makes the block go by the tie break "other"
      When the block "Block A" is updated
      Then it has recorded 1 event

    Scenario: Updating a block to what it already is records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block A"
      When the block "Block A" is updated
      Then it has recorded 0 events

    Scenario: Updating a block to what it already is is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block A"
      When the block "Block A" is updated
      Then it is not refused

  Rule: An archived block, or a block in an archived tournament, cannot be updated

    Scenario: Updating an archived block is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: Updating a block in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      And the update calls the competition "Block One"
      When the block "Block A" is updated
      Then it is refused with "Tournament.Archived"
