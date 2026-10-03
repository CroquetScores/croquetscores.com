Feature: Adding a player to a tournament

  A tournament has players, and a player is added to it with an id of their
  own, given by whatever adds them, a person's name, and what they represent
  and the flag they fly if they have either. What a player is, and what is
  asked of each of those, is specified with the player
  (`TournamentPlayer.feature`); this says what the tournament asks.

  No two players in a tournament have the same id, since the id is how
  everything else in the tournament says which player it means. No two have
  the same name either, since a reader choosing a player from a list could not
  tell them apart. A name is the same name however it is capitalised, as a
  reader would take it to be. A player who is archived still has their name,
  so a player added with it is refused: the two could not be told apart if
  the archived one were restored.

  A player is given an order, and the tournament lists its players lowest
  first. The first player added is given 10,000, and each after them 10,000
  more than the highest order there is, so that a player can later be put
  between two others without either of them moving (`movePlayer.feature`). An
  archived player keeps an order and it still counts, so no order is given
  twice. A player entered in a competition takes their order there from this
  one (`enterPlayer.feature`), so that a competition's players start in the
  order the tournament has them in.

  A player is found within their tournament by a slug made from their name,
  as "2026/ac/spring-open/players/sam-someone" (`players.feature`). Two names
  that are not the same can still make the same slug, as "Sam Someoné" and
  "Sam Someone" do, and a slug another player has, archived or not, is
  followed by "-01", then "-02", up to "-99", as a team's is
  (`addTeam.feature`); should all of them be taken, the slug is followed by
  the player id's own characters. A player keeps their slug when their name is
  corrected (`updatePlayer.feature`), so that a link to them still finds them,
  and an archived player keeps theirs.

  An archived tournament can only be restored (`restore.feature`), so adding a
  player to one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Adding a player is recorded, and the player is the tournament's

    Scenario: Adding a player records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then it has recorded 1 event
      And the first thing it recorded is a player being added

    Scenario: A player added is one of the tournament's players
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then the tournament has the player "Sam Someone"

    Scenario: A player added is known by the id they were added with
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the tournament player id "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      When the player "Sam Someone" is added
      Then the tournament's player "Sam Someone" is known by "tournament-player/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A player added represents what they were added representing
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the player is to represent "Canterbury Croquet Club"
      When the player "Sam Someone" is added
      Then the tournament's player "Sam Someone" represents "Canterbury Croquet Club"

    Scenario: A player added flies the flag they were added flying
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the player is to fly the flag "nz"
      When the player "Sam Someone" is added
      Then the tournament's player "Sam Someone" flies the flag "nz"

    Scenario: A player added is not archived
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then the tournament's player "Sam Someone" is not archived

    Scenario: A tournament rebuilt after a player was added has the player
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament has the player "Sam Someone"

  Rule: A player is found by a slug of their name that no other player in the tournament has

    Scenario: A player's slug is made from their name
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then the tournament's player "Sam Someone" has the slug "sam-someone"

    Scenario: A slug another player has is followed by "-01"
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someoné" is added
      Then the tournament's player "Sam Someoné" has the slug "sam-someone-01"

    Scenario: A slug an archived player has is followed by "-01"
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someoné" is added
      Then the tournament's player "Sam Someoné" has the slug "sam-someone-01"

    Scenario: A slug "-01" follows is followed by "-02" when "-01" is taken too
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someoné" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Sómeone" is added
      Then the tournament's player "Sam Sómeone" has the slug "sam-someone-02"

    Scenario: A tournament rebuilt after a player was added keeps the player's slug
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someoné" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's player "Sam Someoné" has the slug "sam-someone"

  Rule: Each player added is given 10,000 more than the highest order there is

    Scenario: The first player added is given 10,000
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then the tournament's player "Sam Someone" has the order 10000

    Scenario: The next player is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is added
      Then the tournament's player "Pat Player" has the order 30000

    Scenario: An archived player's order still counts
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      And the player "Alex Another" was archived
      And the tournament is rebuilt from the stream
      When the player "Pat Player" is added
      Then the tournament's player "Pat Player" has the order 40000

    Scenario: Players are listed lowest order first
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Alex Another" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's first player is "Sam Someone"
      And the tournament's second player is "Alex Another"

  Rule: What a player must be is refused as it is for a player

    Scenario: A name that could not be a person's is refused as a person's is
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the player "Sa" is added
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A flag there is not is refused as it is for a player
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the player is to fly the flag "zz"
      When the player "Sam Someone" is added
      Then it is refused for breaking "TournamentPlayer.NoSuchFlag"

  Rule: No two players in a tournament have the same id

    Scenario: A player with an id another player has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it as "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the tournament player id "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      When the player "Alex Another" is added
      Then it is refused with "Tournament.PlayerAlreadyAdded"

  Rule: No two players in a tournament have the same name

    Scenario: A player with a name another player has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: A name is the same name however it is capitalised
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When the player "SAM SOMEONE" is added
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: A name is the same name with spaces around it
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the tournament is rebuilt from the stream
      When the player "  Sam Someone  " is added
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: A name an archived player has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the player "Sam Someone" was added to it
      And the player "Sam Someone" was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then it is refused with "Tournament.PlayerNameTaken"

  Rule: A player cannot be added to an archived tournament

    Scenario: Adding a player to an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then it is refused with "Tournament.Archived"

  Rule: A player cannot be added to a tournament played by teams

    A tournament played by teams is played between its teams' players
    (`addTeamPlayer.feature`), and a player of the tournament's own would play
    for nobody in it.

    Scenario: Adding a player to a tournament played by teams is refused
      Given a stream where a tournament was created in the format "Teams"
      And the tournament is rebuilt from the stream
      When the player "Sam Someone" is added
      Then it is refused with "Tournament.PlayedByTeams"
