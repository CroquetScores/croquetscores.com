Feature: Adding a player to a tournament's team

  A team keeps its own players (`Team.feature`), and a player is added to a
  team through its tournament, with an id of their own, given by whatever adds
  them, and a person's name. A player in a team represents their team and
  flies no flag of their own (`TeamPlayer.feature`), so neither is asked for.
  What a player in a team is, and what is asked of each of those, is specified
  with the player (`TeamPlayer.feature`); this says what the tournament and
  the team ask.

  The team is found by its id, and an id that is no team's in the tournament
  is refused. An archived team can only be restored (`Team.feature`), so
  adding a player to one is refused.

  No two players in a tournament's teams have the same id, whichever team
  each is in, since a game in a test names its players by their ids
  (`gamesInATest.feature`) and a test is between two teams. No two players in
  the one team have the same name, since a reader choosing a player from the
  team could not tell them apart; a name is the same name however it is
  capitalised, and an archived player keeps theirs. Two teams can each have a
  player of the same name, since a player is always chosen from their team.

  A player in a team is found within their tournament by a slug made from
  their name, as a tournament's player is (`addPlayer.feature`), so that
  their own page is at "2026/ac/spring-tests/players/sam-someone"
  (`player.feature`). Since two teams can each have a player of the same name,
  and every team's players are found at the one address, a slug another
  player in any of the tournament's teams has, archived or not, is followed
  by "-01", then "-02", up to "-99", and should all of them be taken, by the
  player id's own characters. A player keeps their slug when their name is
  corrected (`updateTeamPlayer.feature`), and an archived player keeps theirs.

  A player is given an order within their team, and the team lists its
  players lowest first, given as a tournament's players are
  (`addPlayer.feature`): the first player added to a team is given 10,000,
  and each after them 10,000 more than the highest order in that team, so
  that a player can later be put between two others without either of them
  moving (`moveTeamPlayer.feature`). An archived player keeps an order and it
  still counts. Each team's orders are its own, so the first player of every
  team is given 10,000.

  An archived tournament can only be restored (`restore.feature`), so adding a
  player to a team in one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where a tournament was created in the format "Teams"
    And the team "Australia" was added to it
    And the team "England" was added to it

  Rule: Adding a player to a team is recorded, and the player is the team's

    Scenario: Adding a player to a team records it
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then it has recorded 1 event
      And the first thing it recorded is a player being added to a team

    Scenario: A player added to a team is one of the team's players
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia" has the player "Sam Someone"

    Scenario: A player added to a team is not one of another team's players
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "England" has no player "Sam Someone"

    Scenario: A player added to a team is not one of the tournament's players
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the tournament has no player "Sam Someone"

    Scenario: A player added to a team is known by the id they were added with
      Given the tournament is rebuilt from the stream
      And the team player id "team-player/123e4567-e89b-42d3-a456-426614174000"
      When the player "Sam Someone" is added to the team "Australia"
      Then the player "Sam Someone" of the team "Australia" is known by "team-player/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A player added to a team has the world ranking name they were added with
      Given the tournament is rebuilt from the stream
      And the player is to have the world ranking name "Samuel Someone"
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

    Scenario: A player added to a team with no world ranking name has their name as it
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Sam Someone"

    Scenario: A player added to a team is not archived
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia"'s player "Sam Someone" is not archived

    Scenario: A tournament rebuilt after a player was added to a team has the player in the team
      Given the player "Sam Someone" was added to the team "Australia"
      When the tournament is rebuilt from the stream
      Then the team "Australia" has the player "Sam Someone"

    Scenario: A tournament rebuilt after a player was added to a team has their world ranking name
      Given the player is to have the world ranking name "Samuel Someone"
      And the player "Sam Someone" was added to the team "Australia"
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"

  Rule: A player in a team is found by a slug of their name that no other player in the tournament's teams has

    Scenario: A player's slug is made from their name
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the player "Sam Someone" of the team "Australia" has the slug "sam-someone"

    Scenario: A slug a player in another team has is followed by "-01"
      Given the player "Sam Someone" was added to the team "England"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the player "Sam Someone" of the team "Australia" has the slug "sam-someone-01"

    Scenario: A slug another player in the same team has is followed by "-01"
      Given the player "Sam Someone" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the player "Sam Someoné" is added to the team "Australia"
      Then the player "Sam Someoné" of the team "Australia" has the slug "sam-someone-01"

    Scenario: A slug an archived player has is followed by "-01"
      Given the player "Sam Someone" was added to the team "England"
      And the player "Sam Someone" of the team "England" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the player "Sam Someone" of the team "Australia" has the slug "sam-someone-01"

    Scenario: A slug "-01" follows is followed by "-02" when "-01" is taken too
      Given the player "Sam Someone" was added to the team "England"
      And the player "Sam Someoné" was added to the team "England"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the player "Sam Someone" of the team "Australia" has the slug "sam-someone-02"

    Scenario: A tournament rebuilt after a player was added to a team keeps the player's slug
      Given the player "Sam Someoné" was added to the team "Australia"
      When the tournament is rebuilt from the stream
      Then the player "Sam Someoné" of the team "Australia" has the slug "sam-someone"

  Rule: Each player added to a team is given 10,000 more than the highest order in the team

    Scenario: The first player added to a team is given 10,000
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the player "Sam Someone" of the team "Australia" has the order 10000

    Scenario: The next player is given 10,000 more than the highest order in the team
      Given the player "Sam Someone" was added to the team "Australia"
      And the player "Alex Another" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is added to the team "Australia"
      Then the player "Pat Player" of the team "Australia" has the order 30000

    Scenario: An archived player's order still counts
      Given the player "Sam Someone" was added to the team "Australia"
      And the player "Alex Another" was added to the team "Australia"
      And the player "Alex Another" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is added to the team "Australia"
      Then the player "Pat Player" of the team "Australia" has the order 40000

    Scenario: Another team's orders do not count
      Given the player "Sam Someone" was added to the team "England"
      And the player "Alex Another" was added to the team "England"
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is added to the team "Australia"
      Then the player "Pat Player" of the team "Australia" has the order 10000

    Scenario: A team's players are listed lowest order first
      Given the player "Sam Someone" was added to the team "Australia"
      And the player "Alex Another" was added to the team "Australia"
      When the tournament is rebuilt from the stream
      Then the team "Australia"'s first player is "Sam Someone"
      And the team "Australia"'s second player is "Alex Another"

  Rule: What a player in a team must be is refused as it is for a player in a team

    Scenario: A name that could not be a person's is refused as a person's is
      Given the tournament is rebuilt from the stream
      When the player "Sa" is added to the team "Australia"
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A name as a bye is refused as it is for a player in a team
      Given the tournament is rebuilt from the stream
      When the player "Bye" is added to the team "Australia"
      Then it is refused for breaking "TeamPlayer.NamedBye"

  Rule: No two players in a tournament's teams have the same id

    Scenario: A player with an id a player in the same team has is refused
      Given the player "Sam Someone" was added to the team "Australia" as "team-player/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the team player id "team-player/123e4567-e89b-42d3-a456-426614174000"
      When the player "Alex Another" is added to the team "Australia"
      Then it is refused with "Tournament.TeamPlayerAlreadyAdded"

    Scenario: A player with an id a player in another team has is refused
      Given the player "Sam Someone" was added to the team "England" as "team-player/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the team player id "team-player/123e4567-e89b-42d3-a456-426614174000"
      When the player "Alex Another" is added to the team "Australia"
      Then it is refused with "Tournament.TeamPlayerAlreadyAdded"

  Rule: No two players in a team have the same name

    Scenario: A player with a name another player in the team has is refused
      Given the player "Sam Someone" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: A name is the same name however it is capitalised
      Given the player "Sam Someone" was added to the team "Australia"
      And the tournament is rebuilt from the stream
      When the player "SAM SOMEONE" is added to the team "Australia"
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: A name an archived player in the team has is refused
      Given the player "Sam Someone" was added to the team "Australia"
      And the player "Sam Someone" of the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then it is refused with "Team.PlayerNameTaken"

    Scenario: A name a player in another team has is accepted
      Given the player "Sam Someone" was added to the team "England"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia" has the player "Sam Someone"

  Rule: Only a team there is, and one not archived, can have a player added

    Scenario: Adding a player to a team the tournament does not have is refused
      Given the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "team/123e4567-e89b-42d3-a456-426614174000" by its id
      Then it is refused with "Tournament.NoSuchTeam"

    Scenario: Adding a player to an archived team is refused
      Given the team "Australia" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then it is refused for breaking "Team.Archived"

  Rule: A player cannot be added to a team in an archived tournament

    Scenario: Adding a player to a team in an archived tournament is refused
      Given it was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then it is refused with "Tournament.Archived"

  Rule: Where the sport has no world rankings a team player's world ranking name is the one given, or their name where none is

    A player in a team is known to the world rankings there by their own name
    unless another is given, as a tournament's player is
    (`addPlayer.feature`), so a world ranking name they are added with is
    kept, and where none is given it is their name.

    Scenario: A player added to a team in American 6 Wicket has their name as their world ranking name
      Given it was updated with the sport "a6w"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Sam Someone"

    Scenario: A player added to a team in a sport that is not ranked has their name as their world ranking name
      Given it was updated with the sport "rc"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Sam Someone"

    Scenario: The world ranking name a team player is added with is kept
      Given it was updated with the sport "a6w"
      And the tournament is rebuilt from the stream
      And the player is to have the world ranking name "Samuel Someone"
      When the player "Sam Someone" is added to the team "Australia"
      Then the team "Australia"'s player "Sam Someone" has the world ranking name "Samuel Someone"
