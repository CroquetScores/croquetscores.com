Feature: Knowing which competition is which

  A competition — a block, a knockout, a Swiss — is known by a competition id.
  It is an id like any other — what every id does is specified with the id —
  and this says only what is its own: it names a competition, and nothing that
  names anything else can be read as one.

  Rule: A competition id names a competition

    Scenario: A new competition id begins with "competition/"
      Given the competition kind of id
      When a new id is minted
      Then it begins with "competition/"

    Scenario: A competition id read from its writing is written the same way
      Given the competition kind of id
      When an id is read from "competition/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "competition/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A tournament id cannot be read as a competition id
      Given the competition kind of id
      When an id is read from "tournament/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
