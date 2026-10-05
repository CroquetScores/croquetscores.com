Feature: Knowing which commentary on a tournament is which

  A commentary on a tournament is known by a commentary id. It is an id like
  any other — what every id does is specified with the id — and this says
  only what is its own: it names a commentary, and nothing that names
  anything else can be read as one.

  Rule: A commentary id names a commentary

    Scenario: A new commentary id begins with "commentary/"
      Given the commentary kind of id
      When a new id is minted
      Then it begins with "commentary/"

    Scenario: A commentary id read from its writing is written the same way
      Given the commentary kind of id
      When an id is read from "commentary/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "commentary/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A competition id cannot be read as a commentary id
      Given the commentary kind of id
      When an id is read from "competition/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
