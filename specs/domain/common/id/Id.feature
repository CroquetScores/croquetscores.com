Feature: Telling one thing from another

  Everything that lasts — an account, a tournament, a game — is known by an id,
  and an id has to do three things. It has to say what kind of thing it names,
  so that an account's id is never mistaken for a tournament's. It has to be
  unlike every other id ever minted, without anything having to be asked first.
  And it has to be written down and read back, into a database column, a URL
  or a log line, and come back the same.

  So an id is written as the kind of thing, a slash, then a uuid in its plain
  form: thirty-six characters of lowercase hex and hyphens. That form needs no
  quoting or escaping anywhere it goes, sorts and compares as plain text, and
  is what every database and language already knows how to read.

  The uuid is random rather than drawn from the time. Nothing in the domain
  reads a clock, and an id drawn from one would be the first thing that did.

  What each kind of id is called belongs to the thing it names. This feature
  is written with an example kind, which exists only to exercise what every
  kind of id has in common.

  Rule: An id says what kind of thing it names

    Scenario: A new id begins with its kind
      Given the example kind of id
      When a new id is minted
      Then it begins with "example/"

    Scenario: The rest of a new id is a uuid in its plain form
      Given the example kind of id
      When a new id is minted
      Then the rest of it is a uuid written in lowercase with hyphens

  Rule: No two ids minted are alike

    Scenario: Two new ids differ
      Given the example kind of id
      When a new id is minted
      And another new id is minted
      Then the two ids differ

  Rule: An id cannot be altered once it is made

    An id that could be changed after it was made would name nothing in
    particular: whatever held it could point it at some other thing.

    Scenario: Changing an id changes nothing
      Given the example kind of id
      When an id is read from "example/123e4567-e89b-42d3-a456-426614174000"
      And it is changed to "example/123e4567-e89b-42d3-a456-426614174001"
      And it is written down
      Then what was written is "example/123e4567-e89b-42d3-a456-426614174000"

  Rule: An id written down reads back as the same id

    Scenario: An id read from its own writing is the same id
      Given the example kind of id
      And a new id
      When it is written down
      And an id is read from what was written
      Then the two ids are the same

    Scenario: An id read from a writing is written the same way
      Given the example kind of id
      When an id is read from "example/123e4567-e89b-42d3-a456-426614174000"
      And it is written down
      Then what was written is "example/123e4567-e89b-42d3-a456-426614174000"

    Scenario: Two ids read from the same writing are the same
      Given the example kind of id
      When an id is read from "example/123e4567-e89b-42d3-a456-426614174000"
      And another id is read from "example/123e4567-e89b-42d3-a456-426614174000"
      Then the two ids are the same

    Scenario: Two ids read from different writings differ
      Given the example kind of id
      When an id is read from "example/123e4567-e89b-42d3-a456-426614174000"
      And another id is read from "example/123e4567-e89b-42d3-a456-426614174001"
      Then the two ids differ

  Rule: Only a writing of this kind, in this form, is read

    An id is compared as the text it is written in, so anything read back has
    to be written exactly as it would have been minted. A copy in capitals
    would be a different id from the one it was copied from, and is refused
    rather than quietly corrected.

    A writing comes from a database column, a URL or a log line, and what is
    there is not always text: a column can be empty, and a part of a URL can
    be missing. That is a writing of no kind at all rather than something to
    fall over, so it is refused like any other.

    Scenario: A writing of another kind is refused
      Given the example kind of id
      When an id is read from "account/123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"

    Scenario: A writing with no kind is refused
      Given the example kind of id
      When an id is read from "123e4567-e89b-42d3-a456-426614174000"
      Then it is refused for breaking "Id.WrongKind"

    Scenario: A writing whose uuid is not in its plain form is refused
      Given the example kind of id
      When an id is read from "example/not-a-uuid"
      Then it is refused for breaking "Id.Malformed"

    Scenario: A writing whose uuid is in capitals is refused
      Given the example kind of id
      When an id is read from "example/123E4567-E89B-42D3-A456-426614174000"
      Then it is refused for breaking "Id.Malformed"

    Scenario: A writing with nothing after the kind is refused
      Given the example kind of id
      When an id is read from "example/"
      Then it is refused for breaking "Id.Malformed"

    Scenario: A writing that is not text at all is refused
      Given the example kind of id
      When an id is read from nothing at all
      Then it is refused for breaking "Id.WrongKind"

    Scenario: An empty writing is refused
      Given the example kind of id
      When an id is read from ""
      Then it is refused for breaking "Id.WrongKind"
