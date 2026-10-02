Feature: Changing what a tournament's team is

  A team's name, its short name and the flag it flies can each be corrected.
  Updating a team says all three again, and the team keeps its id, its
  players, its place in the list of teams and its slug, so that a link to its
  page still finds it. What is asked of each is asked of a new team
  (`addTeam.feature`), and a name or a short name another team has, archived
  or not, is refused as it is when a team is added. A team's own name or
  short name, written with other capitals, is its own, and not another's.

  A test is called by the short names of its teams (`addTest.feature`), so a
  team given a new short name gives every test it is in a new name with it.
  The tests keep their slugs, as a competition renamed keeps its own.

  The team is found by its id. An id that is no team's in the tournament is
  refused rather than taken as a new team, since adding a team is a thing of
  its own.

  An archived team can only be restored (`restoreTeam.feature`), and an
  archived tournament only restored (`restore.feature`), so updating a team
  that is archived, or a team in a tournament that is, is refused.

  An update that changes nothing records nothing, because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Updating a team is recorded, and is what the team is

    Scenario: Updating a team records it
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a team being updated

    Scenario: An updated team has its new name
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then the tournament has the team "Australia A"

    Scenario: An updated team no longer has its old name
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then the tournament has no team "Australia"

    Scenario: An updated team has its new short name
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "Oz"
      When the team "Australia" is updated
      Then the tournament's team "Australia" is known for short as "Oz"

    Scenario: An updated team flies the flag it was updated to
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team fly the flag "au"
      When the team "Australia" is updated
      Then the tournament's team "Australia" flies the flag "au"

    Scenario: An updated team keeps its place in the list
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then the tournament's first team is "Australia A"

    Scenario: An updated team keeps its slug
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "Oz"
      When the team "Australia" is updated
      Then the tournament's team "Australia" has the slug "aus"

    Scenario: An updated team keeps its players
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the player "Sam Someone" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then the tournament's team "Australia A" has the player "Sam Someone"

    Scenario: A tournament rebuilt after a team was updated has the team as updated
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was updated to be called "Australia A"
      When the tournament is rebuilt from the stream
      Then the tournament has the team "Australia A"

  Rule: A test is called by its teams' short names as they are now

    Scenario: A test is called by a team's new short name
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "Oz"
      When the team "Australia" is updated
      Then the tournament has the competition "Oz v ENG"

    Scenario: A test keeps its slug when a team's short name changes
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "Oz"
      When the team "Australia" is updated
      Then the tournament's competition "Oz v ENG" has the slug "aus-v-eng"

    Scenario: Renaming a team's short name records only the team being updated
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the test between "Australia" and "England" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "Oz"
      When the team "Australia" is updated
      Then it has recorded 1 event

  Rule: What is asked of a team added is asked of a team updated

    Scenario: A name that could not be a team's is refused as a team name is
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team ""
      When the team "Australia" is updated
      Then it is refused for breaking "TeamName.Missing"

    Scenario: A short name longer than the name is refused as it is for a team
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Oz"
      When the team "Australia" is updated
      Then it is refused for breaking "Team.ShortNameLongerThanName"

    Scenario: A name another team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "england"
      When the team "Australia" is updated
      Then it is refused with "Tournament.TeamNameTaken"

    Scenario: A short name another team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "eng"
      When the team "Australia" is updated
      Then it is refused with "Tournament.TeamShortNameTaken"

    Scenario: A short name an archived team has is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "England" was added to it
      And the team "England" was archived
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "ENG"
      When the team "Australia" is updated
      Then it is refused with "Tournament.TeamShortNameTaken"

    Scenario: A team's own name in other capitals is its own
      Given a stream where a tournament was created in the format "Teams"
      And the team "australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia"
      When the team "australia" is updated
      Then the tournament has the team "Australia"

    Scenario: A team's own short name in other capitals is its own
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update has the team known for short as "Aus"
      When the team "Australia" is updated
      Then the tournament's team "Australia" is known for short as "Aus"

  Rule: Only a team there is can be updated

    Scenario: Updating a team the tournament does not have is refused
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "team/123e4567-e89b-42d3-a456-426614174000" is updated by its id
      Then it is refused with "Tournament.NoSuchTeam"

  Rule: An update that changes nothing records nothing

    Scenario: Updating a team to what it already is records nothing
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia"
      When the team "Australia" is updated
      Then it has recorded 0 events

    Scenario: Updating a team to what it already is is not refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia"
      When the team "Australia" is updated
      Then it is not refused

  Rule: An archived team, or a team in an archived tournament, cannot be updated

    Scenario: Updating an archived team is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then it is refused for breaking "Team.Archived"

    Scenario: Updating a team in an archived tournament is refused
      Given a stream where a tournament was created in the format "Teams"
      And the team "Australia" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      And the update calls the team "Australia A"
      When the team "Australia" is updated
      Then it is refused with "Tournament.Archived"
