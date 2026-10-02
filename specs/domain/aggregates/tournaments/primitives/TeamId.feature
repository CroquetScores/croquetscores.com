Feature: Knowing which team in a tournament is which

  A team in a tournament played by teams is known by a team id. It is an id
  like any other — what every id does is specified with the id — and this says
  only what is its own: it names a team, and nothing that names anything else
  can be read as one.

  Rule: A team id names a team

    Scenario: A new team id begins with "team/"
      Given the team kind of id
      When a new id is minted
      Then it begins with "team/"

    Scenario: A team id read from its writing is written the same way
      Given the team kind of id
      When an id is read from "team/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "team/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A tournament player id cannot be read as a team id
      Given the team kind of id
      When an id is read from "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
