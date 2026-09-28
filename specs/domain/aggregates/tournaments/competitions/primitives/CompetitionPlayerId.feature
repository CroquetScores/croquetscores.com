Feature: Knowing which player in a competition is which

  A player in a competition is known by a competition player id. It is an id
  like any other — what every id does is specified with the id — and this says
  only what is its own: it names a player in a competition, and nothing that
  names anything else can be read as one.

  Rule: A competition player id names a player in a competition

    A tournament player id names the same person in the tournament, and is
    still not a competition player id: the one is who they are in the
    tournament, the other is their place in one of its competitions.

    Scenario: A new competition player id begins with "competition-player/"
      Given the competition player kind of id
      When a new id is minted
      Then it begins with "competition-player/"

    Scenario: A competition player id read from its writing is written the same way
      Given the competition player kind of id
      When an id is read from "competition-player/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "competition-player/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A tournament player id cannot be read as a competition player id
      Given the competition player kind of id
      When an id is read from "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
