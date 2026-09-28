Feature: Knowing which game is which

  A game played in a competition is known by a game id. It is an id like any
  other — what every id does is specified with the id — and this says only
  what is its own: it names a game, and nothing that names anything else can
  be read as one.

  Rule: A game id names a game

    Two games between the same players with the same scores are still two
    games, so a game is known by its id and not by what it says.

    Scenario: A new game id begins with "game/"
      Given the game kind of id
      When a new id is minted
      Then it begins with "game/"

    Scenario: A game id read from its writing is written the same way
      Given the game kind of id
      When an id is read from "game/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "game/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A competition player id cannot be read as a game id
      Given the game kind of id
      When an id is read from "competition-player/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
