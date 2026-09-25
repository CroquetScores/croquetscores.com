Feature: Changing what a tournament's player is

  A player's name, what they represent and the flag they fly can each be
  corrected. Updating a player says all three again, and the player keeps
  their id and their place in the list of players. What is asked of each is
  asked of a new player (`addPlayer.feature`), and a name another player has,
  archived or not, is refused as it is when a player is added. A player's own
  name, written with other capitals, is theirs, and not another player's.

  The player is found by their id. An id that is no player's in the tournament
  is refused rather than taken as a new player, since adding a player is a
  thing of its own.

  An archived player can only be restored (`restorePlayer.feature`), and an
  archived tournament only restored (`restore.feature`), so updating a player
  who is archived, or a player in a tournament that is, is refused.

  An update that changes nothing records nothing, because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Updating a player is recorded, and is what the player is

    Scenario: Updating a player records it
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a player being updated

    Scenario: An updated player has their new name
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" is updated
      Then the tournament has the player "Samantha Someone"

    Scenario: An updated player no longer has their old name
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" is updated
      Then the tournament has no player "Sam Someone"

    Scenario: An updated player represents what they were updated to
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update has the player represent "Canterbury Croquet Club"
      When the player "Sam Someone" is updated
      Then the tournament's player "Sam Someone" represents "Canterbury Croquet Club"

    Scenario: An updated player flies the flag they were updated to
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update has the player fly the flag "au"
      When the player "Sam Someone" is updated
      Then the tournament's player "Sam Someone" flies the flag "au"

    Scenario: An updated player keeps their place in the list
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" is updated
      Then the tournament's first player is "Samantha Someone"

    Scenario: A tournament rebuilt after a player was updated has the player as updated
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was updated to be called "Samantha Someone"
      When the tournament is rebuilt from the stream
      Then the tournament has the player "Samantha Someone"

  Rule: What is asked of a player added is asked of a player updated

    Scenario: A name that could not be a person's is refused as a person's is
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Sa"
      When the player "Sam Someone" is updated
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A name another player has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "alex another"
      When the player "Sam Someone" is updated
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: A name an archived player has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Alex Another"
      When the player "Sam Someone" is updated
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: A player's own name in other capitals is theirs
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Sam Someone"
      When the player "Sam someone" is updated
      Then the tournament has the player "Sam Someone"

  Rule: Only a player there is can be updated

    Scenario: Updating a player the tournament does not have is refused
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "tournament-player/123e4567-e89b-42d3-a456-426614174000" is updated by their id
      Then it is refused with "Tournament.NoSuchPlayer"

  Rule: An update that changes nothing records nothing

    Scenario: Updating a player to what they already are records nothing
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Sam Someone"
      When the player "Sam Someone" is updated
      Then it has recorded 0 events

    Scenario: Updating a player to what they already are is not refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      And the update calls the player "Sam Someone"
      When the player "Sam Someone" is updated
      Then it is not refused

  Rule: An archived player, or a player in an archived tournament, cannot be updated

    Scenario: Updating an archived player is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" is updated
      Then it is refused with "Tournament.PlayerArchived"

    Scenario: Updating a player in an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And it was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" is updated
      Then it is refused with "Tournament.Archived"
