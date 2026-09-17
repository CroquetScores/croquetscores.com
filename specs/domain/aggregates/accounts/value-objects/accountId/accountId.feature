Feature: Knowing which account is which

  An account is known by an account id. It is an id like any other — what
  every id does is specified with the id — and this says only what is its own:
  it names an account, and nothing that names anything else can be read as one.

  Rule: An account id names an account

    Scenario: A new account id begins with "account/"
      Given the account kind of id
      When a new id is minted
      Then it begins with "account/"

    Scenario: An account id read from its writing is written the same way
      Given the account kind of id
      When an id is read from "account/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A writing of another kind cannot be read as an account id
      Given the account kind of id
      When an id is read from "example/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"
