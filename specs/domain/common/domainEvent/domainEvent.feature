Feature: What every event says about itself

  An event is a record that something happened: an account was registered, a
  game was scored. Whatever else it says, every event says which account
  caused it and when it happened, so that anyone reading the record later can
  tell who did what and when, without the event having to be asked.

  Neither can be changed once the event exists. An event is a record of the
  past, and a record that could be amended afterwards would be a record of
  nothing in particular.

  The moment is not read from a clock. It arrives with the request that caused
  the event, decided once at the edge, so that everything one request records
  is stamped with one time and a replay says what it said the first time.

  What each kind of event says besides is specified with the thing it happens
  to. This feature is written with an example event, which exists only to
  exercise what every event has in common.

  Rule: An event says which account caused it and when it happened

    Scenario: An event says which account caused it
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-17T09:00:00Z"
      When the example event is created
      Then it was caused by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: An event says when it happened
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-17T09:00:00Z"
      When the example event is created
      Then it happened at "2026-09-17T09:00:00.000Z"

  Rule: An event written out as data still says both

    An event is written out to be kept, and to be read in a log by whoever is
    working out what happened. Both are held where nothing outside the event
    can reach them, which is what stops them being changed and would also stop
    them being written: a store that wrote an event out as data would keep an
    event that said nothing about who or when, and nobody would notice until
    it was read back.

    Scenario: An event written as data says which account caused it
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-17T09:00:00Z"
      And the example event
      When it is written down as data
      Then what was written says it was caused by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: An event written as data says when it happened
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-17T09:00:00Z"
      And the example event
      When it is written down as data
      Then what was written says it happened at "2026-09-17T09:00:00.000Z"

  Rule: Who caused an event and when it happened cannot change once it exists

    Scenario: Who caused an event cannot be changed afterwards
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-17T09:00:00Z"
      And the example event
      When its cause is changed to "account/123e4567-e89b-42d3-a456-426614174001"
      Then it was still caused by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: When an event happened cannot be changed afterwards
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-17T09:00:00Z"
      And the example event
      When its moment is changed to "2027-01-01T00:00:00Z"
      Then it still happened at "2026-09-17T09:00:00.000Z"
