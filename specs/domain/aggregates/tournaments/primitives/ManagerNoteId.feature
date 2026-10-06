Feature: Knowing which of a tournament's notes is which

  A note a tournament's managers write is known by a manager note id. It is
  an id like any other — what every id does is specified with the id — and
  this says only what is its own: it names a manager's note, and nothing that
  names anything else can be read as one.

  Rule: A manager note id names a manager's note

    Scenario: A new manager note id begins with "manager-note/"
      Given the manager note kind of id
      When a new id is minted
      Then it begins with "manager-note/"

    Scenario: A manager note id read from its writing is written the same way
      Given the manager note kind of id
      When an id is read from "manager-note/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "manager-note/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary id cannot be read as a manager note id
      Given the manager note kind of id
      When an id is read from "commentary/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
