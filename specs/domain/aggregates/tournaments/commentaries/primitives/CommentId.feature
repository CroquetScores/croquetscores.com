Feature: Knowing which comment is which

  A comment written in a commentary is known by a comment id. It is an id
  like any other — what every id does is specified with the id — and this
  says only what is its own: it names a comment, and nothing that names
  anything else can be read as one.

  Rule: A comment id names a comment

    Two comments by the same writer saying the same thing are still two
    comments, so a comment is known by its id and not by what it says.

    Scenario: A new comment id begins with "comment/"
      Given the comment kind of id
      When a new id is minted
      Then it begins with "comment/"

    Scenario: A comment id read from its writing is written the same way
      Given the comment kind of id
      When an id is read from "comment/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "comment/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A commentary id cannot be read as a comment id
      Given the comment kind of id
      When an id is read from "commentary/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
