Feature: Knowing which tournament is which

  A tournament is known by a tournament id. It is an id like any other — what
  every id does is specified with the id — and this says only what is its own:
  it names a tournament, and nothing that names anything else can be read as
  one.

  Rule: A tournament id names a tournament

    A tournament player id begins with the same word, and is still not a
    tournament id: the kind is the whole of the word before the slash, not
    however much of it happens to match.

    Scenario: A new tournament id begins with "tournament/"
      Given the tournament kind of id
      When a new id is minted
      Then it begins with "tournament/"

    Scenario: A tournament id read from its writing is written the same way
      Given the tournament kind of id
      When an id is read from "tournament/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "tournament/123e4567-e89b-42d3-a456-426614174000"

    Scenario: An account id cannot be read as a tournament id
      Given the tournament kind of id
      When an id is read from "account/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"

    Scenario: A tournament player id cannot be read as a tournament id
      Given the tournament kind of id
      When an id is read from "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
