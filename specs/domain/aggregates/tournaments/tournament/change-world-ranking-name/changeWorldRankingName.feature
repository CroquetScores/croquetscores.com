Feature: Changing a player's world ranking name alone

  A player's world ranking name is the name the world rankings know them by
  (`WorldRankingName.feature`). A tournament's managers change it with
  everything else about a player (`updatePlayer.feature`). An account that
  holds the World Ranking Officer role, and asks as a world ranking officer
  (`asker.feature`), looks after the names the rankings know players by in
  every tournament, so it may change a player's world ranking name, and that
  alone, whether or not it has any part in the tournament. The tournament's
  managers may change it this way too, since they may change all of it.
  Anybody else, a scorer among them, is refused with
  `Tournament.NotAManagerOrRankingOfficer`, asked before anything else.

  Changing it changes nothing else about the player: their name, what they
  represent and their flag stay as they were. It is recorded as the player
  being updated, as changing a player is, so that what the player is reads
  back the same whichever way it was changed. A world ranking name left
  blank is none, and one that breaks a rule is refused as it is anywhere.
  Changing it to what it already is records nothing.

  The player is found by their id, and one the tournament does not have is
  refused with `Tournament.NoSuchPlayer`. An archived player and an archived
  tournament can only be restored, so changing either's is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created as "Spring Open"
    And the player "Sam Someone" was added to it
    And the account "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f" was made a scorer of it

  Rule: A world ranking officer may change any player's world ranking name

    Scenario: A world ranking officer changes a player's world ranking name
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then the tournament's player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: What a world ranking officer changes is recorded as theirs
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then what it recorded was caused by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: A manager changes a player's world ranking name
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then the tournament's player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: A world ranking officer does not manage the tournament for having changed it
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then the account "account/7c9e6679-7425-40de-944b-e07fc1f90ae7" does not manage the tournament

  Rule: Nobody else may change it

    Scenario: A scorer is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/5f0c7a2e-3b1d-4c8e-9f6a-2d4b8e1c7a3f"
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

    Scenario: Somebody the tournament does not know is refused
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then it is refused with "Tournament.NotAManagerOrRankingOfficer"

    Scenario: A world ranking officer may do nothing else to the tournament
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the update calls the player "Samantha Someone"
      And the player "Sam Someone" is updated
      Then it is refused with "Tournament.NotAManager"

  Rule: Nothing else about the player changes

    Scenario: The player keeps their name
      Given the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then the tournament has the player "Sam Someone"

    Scenario: The player keeps what they represent
      Given the player is to represent "Canterbury Croquet Club"
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      And it is asked for by "account/7c9e6679-7425-40de-944b-e07fc1f90ae7", who is a world ranking officer
      When the world ranking name of the player "Alex Another" is changed to "Alexander Another"
      Then the tournament's player "Alex Another" represents "Canterbury Croquet Club"

    Scenario: Changing it is recorded as the player being updated
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then it has recorded 1 event
      And the first thing it recorded is a player being updated

    Scenario: A world ranking name left blank is none
      Given the player "Sam Someone" was updated to be known in the world rankings as "Samuel Someone"
      And the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "   "
      Then the tournament's player "Sam Someone" has no world ranking name

    Scenario: A world ranking name that breaks a rule is refused
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "Sa"
      Then it is refused for breaking "WorldRankingName.TooShort"

    Scenario: Changing it to what it is records nothing
      Given the player "Sam Someone" was updated to be known in the world rankings as "Samuel Someone"
      And the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then it has recorded 0 events

  Rule: Only a player there is, and not archived, in a tournament not archived

    Scenario: A player the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the world ranking name of the player "Nobody Here" is changed to "Samuel Someone"
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: An archived player is refused
      Given the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then it is refused for breaking "TournamentPlayer.Archived"

    Scenario: A player in an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When the world ranking name of the player "Sam Someone" is changed to "Samuel Someone"
      Then it is refused with "Tournament.Archived"
