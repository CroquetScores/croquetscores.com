Feature: Changing what a player in a tournament's team is

  A player in a team has their name corrected as a tournament's player does
  (`updatePlayer.feature`). Updating says it again, and the player keeps their
  id, their team, their place in the team's list and their slug, so that a
  link to them still finds them. What is asked of it is
  asked of a new player in a team (`addTeamPlayer.feature`), and a name
  another player in the same team has, archived or not, is refused as it is
  when a player is added. A player's own name, written with other capitals, is
  theirs.

  The team and the player are each found by their id, and an id that is no
  team's, or no player's in that team, is refused.

  An archived player can only be restored (`restoreTeamPlayer.feature`), an
  archived team only restored (`restoreTeam.feature`) and an archived
  tournament only restored (`restore.feature`), so updating a player who is
  archived, or one in a team or a tournament that is, is refused.

  An update that changes nothing records nothing, because nothing happened.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the team "England" was added to it
    And the player "Sam Someone" was added to the team "Australia"

  Rule: Updating a player in a team is recorded, and is what the player is

    Scenario: Updating a player in a team records it
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it has recorded 1 event
      And the first thing it recorded is a player in a team being updated

    Scenario: An updated player has their new name
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia" has the player "Samantha Someone"

    Scenario: An updated player no longer has their old name
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia" has no player "Sam Someone"

    Scenario: An updated player has the world ranking name they were updated to
      Given the tournament is rebuilt from the stream
      And the update gives the player the world ranking name "Samuel Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: An update that gives no world ranking name makes it the name
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      And the update gives the player the world ranking name "   "
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia"'s player "Samantha Someone" has the world ranking name "Samantha Someone"

    Scenario: An update of the world ranking name alone records it
      Given the tournament is rebuilt from the stream
      And the update gives the player the world ranking name "Samuel Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it has recorded 1 event

    Scenario: An update to a world ranking name that reads as no world ranking name records it
      Given the tournament is rebuilt from the stream
      And the update gives the player the world ranking name "undefined"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it has recorded 1 event

    Scenario: A tournament rebuilt after a player in a team was updated has their world ranking name as updated
      Given the player "Sam Someone" of the team "Australia" was updated to be known in the world rankings as "Samuel Someone"
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: An updated player keeps their place in the team's list
      Given the player "Alex Another" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia"'s first player is "Samantha Someone"

    Scenario: A tournament rebuilt after a player in a team was updated has the player as updated
      Given the player "Sam Someone" of the team "Australia" was updated to be called "Samantha Someone"
      When the tournament is rebuilt from the stream
      Then the team "Australia" has the player "Samantha Someone"

  Rule: A player in a team keeps their slug when their name is corrected

    Scenario: A player renamed keeps their slug
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the player "Samantha Someone" of the team "Australia" has the slug "sam-someone"

  Rule: What is asked of a player added to a team is asked of a player updated

    Scenario: A name that could not be a person's is refused as a person's is
      Given the tournament is rebuilt from the stream
      And the update calls the player "Sa"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A name as a bye is refused as it is for a player in a team
      Given the tournament is rebuilt from the stream
      And the update calls the player "Bye 2"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused for breaking "TeamPlayer.NamedBye"

    Scenario: A name another player in the team has is refused
      Given the player "Alex Another" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      And the update calls the player "alex another"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: A name an archived player in the team has is refused
      Given the player "Alex Another" was added to the team "Australia"
      And the player "Alex Another" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Alex Another"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: A name a player in another team has is accepted
      Given the player "Alex Another" was added to the team "England"
      And the tournament is rebuilt from the stream
      And the update calls the player "Alex Another"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia" has the player "Alex Another"

    Scenario: A player's own name in other capitals is theirs
      Given the tournament is rebuilt from the stream
      And the update calls the player "Sam someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia" has the player "Sam someone"

  Rule: Only a player there is, in a team there is, can be updated

    Scenario: Updating a player in a team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "team/123e4567-e89b-42d3-a456-426614174000" is updated by their ids
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Updating a player the team does not have is refused
      Given the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "team-player/123e4567-e89b-42d3-a456-426614174000" of the team "Australia" is updated by their id
      Then it is refused with "Team.NoSuchPlayer"

    Scenario: Updating another team's player as this team's is refused
      Given the player "Alex Another" was added to the team "England"
      And the tournament is rebuilt from the stream
      And the update calls the player "Alexander Another"
      When the player "Alex Another" of the team "England" is updated as a player of the team "Australia"
      Then it is refused with "Team.NoSuchPlayer"

  Rule: An update that changes nothing records nothing

    Scenario: Updating a player to what they already are records nothing
      Given the tournament is rebuilt from the stream
      And the update calls the player "Sam Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it has recorded 0 events

    Scenario: Updating a player to what they already are is not refused
      Given the tournament is rebuilt from the stream
      And the update calls the player "Sam Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is not refused

  Rule: An archived player, or one in an archived team or tournament, cannot be updated

    Scenario: Updating an archived player is refused
      Given the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: Updating a player in an archived team is refused
      Given the team "Australia" was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused for breaking "Team.Archived"

    Scenario: Updating a player in an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then it is refused with "Tournament.Archived"

  Rule: Where the sport has no world rankings a team player's world ranking name is the one given, or their name where none is

    A player in a team is known to the world rankings there by their own name
    unless another is given (`addTeamPlayer.feature`), so a world ranking name
    an update gives is kept, the one the player already has among them, and
    correcting the name corrects it only where the update gives none.

    Scenario: A corrected name leaves the world ranking name the update carries
      Given it was updated with the sport "a6w"
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia"'s player "Samantha Someone" has the world ranking name "Sam Someone"

    Scenario: A corrected name is the world ranking name where the update gives none
      Given it was updated with the sport "a6w"
      And the tournament is rebuilt from the stream
      And the update calls the player "Samantha Someone"
      And the update gives the player the world ranking name "   "
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia"'s player "Samantha Someone" has the world ranking name "Samantha Someone"

    Scenario: A world ranking name an update gives is kept
      Given it was updated with the sport "a6w"
      And the tournament is rebuilt from the stream
      And the update gives the player the world ranking name "Samuel Someone"
      When the player "Sam Someone" of the team "Australia" is updated
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"
