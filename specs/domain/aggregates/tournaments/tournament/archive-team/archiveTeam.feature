Feature: Archiving a tournament's team

  A team can be archived: kept, with everything it is and every one of its
  players, but set aside, so that a team added by mistake is out of the way.
  An archived team keeps its name and its short name, so no other team can be
  given either (`addTeam.feature`), and can be restored
  (`restoreTeam.feature`), which is all that can be done to it until it is.
  It is out of the way, so it is put last, as an archived player is
  (`archivePlayer.feature`): listed after every team still in use, whatever
  its order, and given 10,000 more than the highest order in the tournament,
  so that archived teams are listed in the order they were archived.

  A team playing in a test cannot be archived, since the test would then be
  against a team that is no longer there. A test is one of the tournament's
  competitions (`addTest.feature`), and the tournament knows which teams each
  is between, so it asks itself rather than being told. An archived test is
  out of the way, so a team whose only tests are archived can be archived;
  such a test cannot then be restored until the team is
  (`restoreCompetition.feature`).

  Archiving a team that is already archived records nothing, because nothing
  happened.

  An archived tournament can only be restored (`restore.feature`), so
  archiving a team in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: A team in no test can be archived

    Scenario: Archiving a team records it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then it has recorded 1 event
      And the first thing it recorded is a team being archived

    Scenario: An archived team is archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then the tournament's team "Australia" is archived

    Scenario: An archived team is still one of the tournament's teams
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then the tournament has the team "Australia"

    Scenario: An archived team keeps its players
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the player "Sam Someone" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then the tournament's team "Australia" has the player "Sam Someone"

    Scenario: A tournament rebuilt after a team was archived has the team archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      When the tournament is rebuilt from the stream
      Then the tournament's team "Australia" is archived

  Rule: An archived team is put last

    Scenario: An archived team is given 10,000 more than the highest order
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then the tournament's team "Australia" has the order 30000

    Scenario: An archived team comes after those in use
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then the tournament's first team is "England"

    Scenario: A team added after an archived one comes before it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the team "England" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's first team is "England"
      And the tournament's second team is "Australia"

  Rule: A team in a test in use cannot be archived

    Scenario: Archiving a team in a test is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then it is refused for breaking "Team.InATest"

    Scenario: Archiving the second team of a test is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "England" is archived
      Then it is refused for breaking "Team.InATest"

    Scenario: A team whose only test is archived can be archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the competition "AUS v ENG" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then the tournament's team "Australia" is archived

    Scenario: A team not in the test can be archived
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "Scotland" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      When the team "Scotland" is archived
      Then the tournament's team "Scotland" is archived

  Rule: Only a team there is can be archived

    Scenario: Archiving a team the tournament does not have is refused
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the team "team/123e4567-e89b-42d3-a456-426614174000" is archived by its id
      Then it is refused with "Tournament.NoSuchTeam"

  Rule: Archiving an archived team records nothing

    Scenario: Archiving an archived team records nothing
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then it has recorded 0 events

    Scenario: Archiving an archived team is not refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then it is not refused

  Rule: A team in an archived tournament cannot be archived

    Scenario: Archiving a team in an archived tournament is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      When the team "Australia" is archived
      Then it is refused with "Tournament.Archived"
