Feature: Knowing which player in a team is which

  A player in a team is known by a team player id. It is an id like any other
  — what every id does is specified with the id — and this says only what is
  its own: it names a player in a team, and nothing that names anything else
  can be read as one, a tournament player among them. A team's players are
  its own (`TeamPlayer.feature`), and a game in a test names them by this id
  (`gamesInATest.feature`), so a tournament player's id read as one would
  name somebody the test could never have.

  Rule: A team player id names a player in a team

    Scenario: A new team player id begins with "team-player/"
      Given the team player kind of id
      When a new id is minted
      Then it begins with "team-player/"

    Scenario: A team player id read from its writing is written the same way
      Given the team player kind of id
      When an id is read from "team-player/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "team-player/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A tournament player id cannot be read as a team player id
      Given the team player kind of id
      When an id is read from "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
