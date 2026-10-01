Feature: Archiving a tournament's competition

  A competition can be archived: kept, with everything it is, but set aside,
  so that one added by mistake is out of the way. Archiving is the same for a
  block, a knockout and a Swiss, since what is set aside is the competition
  and not anything about its kind, so there is one way to archive any of them
  rather than one for each.

  An archived competition keeps its name and its slug, so that no other
  competition can be given either (`addBlock.feature`), and it can be
  restored (`restoreCompetition.feature`), which is all that can be done to it
  until it is. It is out of the way, so it is put last, and stays last: it is
  listed after every competition still in use, whatever order it has, among
  them competitions added after it was archived. It is also given 10,000 more
  than the highest order in the tournament, as a competition added is, so
  that archived competitions are listed in the order they were archived, and
  one restored comes back after the competitions in use when it was archived
  (`restoreCompetition.feature`). Its new order still counts, so no order is
  given twice.

  A block, a knockout or a Swiss can be archived whether or not it has games.
  Archiving sets it aside rather than taking anything away, so its games are
  kept with it, and come back with it when it is restored. So whether it has
  any is not asked.

  A test is different: it is a meeting of two teams, and once its players
  have games in use it has been played, so it is not set aside as though it
  were a mistake. Archiving a test with any match started is refused with
  `Tournament.TestHasGamesInUse`; its games are archived first, should it
  really be one added by mistake. An archived game counts for nothing, here as
  anywhere games are counted (`archiveGame.feature`). What has been played in
  a test is not the tournament's to know, so whatever asks says, as it does
  when a test is updated (`updateTest.feature`).

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

  Rule: An archived competition is put last

    Scenario: An archived competition is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then the tournament's competition "Block A" has the order 30000

    Scenario: An archived competition comes after those in use
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the competition "Block A" is archived
      Then the tournament's first competition is "Block B"

    Scenario: A tournament rebuilt after a competition was archived has it last
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block A" was archived
      When the tournament is rebuilt from the stream
      Then the tournament's competition "Block A" has the order 30000

    Scenario: A competition added after an archived one comes before it
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the block "Block B" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's first competition is "Block B"
      And the tournament's second competition is "Block A"

    Scenario: Archived competitions are listed in the order they were archived
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was archived
      And the competition "Block A" was archived
      And the block "Block C" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's first competition is "Block C"
      And the tournament's second competition is "Block B"
      And the tournament's third competition is "Block A"

  Rule: A test with games in use cannot be archived

    Scenario: Archiving a test with a match started is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      When the competition "AUS v ENG" is archived
      Then it is refused with "Tournament.TestHasGamesInUse"

    Scenario: A test refused for its games is not archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has 1 match started
      When the competition "AUS v ENG" is archived
      Then the tournament's competition "AUS v ENG" is not archived

    Scenario: Archiving a test with no games archives it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the test "AUS v ENG" has no games
      When the competition "AUS v ENG" is archived
      Then the tournament's competition "AUS v ENG" is archived

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
