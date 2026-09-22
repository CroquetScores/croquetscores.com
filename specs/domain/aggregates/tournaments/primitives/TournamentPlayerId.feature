Feature: Knowing which player in a tournament is which

  A player in a tournament is known by a tournament player id. It is an id
  like any other — what every id does is specified with the id — and this says
  only what is its own: it names a player in a tournament, and nothing that
  names anything else can be read as one.

  Rule: A tournament player id names a player in a tournament

    Scenario: A new tournament player id begins with "tournament-player/"
      Given the tournament player kind of id
      When a new id is minted
      Then it begins with "tournament-player/"

    Scenario: A tournament player id read from its writing is written the same way
      Given the tournament player kind of id
      When an id is read from "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "tournament-player/123e4567-e89b-42d3-a456-426614174000"

    Scenario: An account id cannot be read as a tournament player id
      Given the tournament player kind of id
      When an id is read from "account/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
