Feature: Changing a player in a team's world ranking name alone

  A player in a team may have a world ranking name, as a tournament's player
  may (`TeamPlayer.feature`), and it is changed alone as theirs is
  (`changeWorldRankingName.feature`): by the tournament's managers, or by an
  account asking as a world ranking officer, whatever part it has in the
  tournament, where its sport is ranked across the world; anybody else, a scorer among them, is refused with
  `Tournament.NotAManagerOrRankingOfficer`. Changing it changes nothing else
  about the player, is recorded as the player in a team being updated, and
  records nothing where it changes nothing.

  The team and the player are found by their ids: a team the tournament does
  not have is refused with `Tournament.NoSuchTeam`, and a player the team
  does not have with `Team.NoSuchPlayer`. An archived player, team or
  tournament can only be restored, so changing any of theirs is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the player "Sam Someone" was added to the team "Australia"
    And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it

  Rule: A world ranking officer may change any player's world ranking name

    Scenario: A world ranking officer changes a team player's world ranking name
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: A manager changes a team player's world ranking name
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

  Rule: Nobody else may change it

    Scenario: A scorer is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f"
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

    Scenario: A world ranking officer is refused in a sport the world does not rank
      Given it was updated with the sport "rc"
      And the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

  Rule: Nothing else about the player changes

    Scenario: The player keeps their name
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then the team "Australia" has the player "Sam Someone"

    Scenario: Changing it is recorded as the player in a team being updated
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then it has recorded 1 event
      And the first thing it recorded is a player in a team being updated

    Scenario: Changing it to a name that reads as no world ranking name records it
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "undefined"
      Then it has recorded 1 event

    Scenario: Changing it to what it is records nothing
      Given the player "Sam Someone" of the team "Australia" was updated to be known in the world rankings as "Samuel Someone"
      And the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then it has recorded 0 events

  Rule: Only a player there is, in a team there is, none of them archived

    Scenario: A team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" of the team "England" is changed to "Samuel Someone"
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: A player the team does not have is refused
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Nobody Here" of the team "Australia" is changed to "Samuel Someone"
      Then it is refused with "Team.NoSuchPlayer"

    Scenario: An archived player is refused
      Given the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" of the team "Australia" is changed to "Samuel Someone"
      Then it is refused for breaking "TeamPlayer.Archived"
