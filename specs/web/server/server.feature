@postgres
Feature: The application puts one mediator together, and every route sends through it

  A route knows nothing of the application but the mediator. It sends a command
  or asks a query, and never knows which handler deals with it, what validates
  it, or what transaction it runs in. So all of that is decided once, where the
  application is put together, rather than by each route for itself: a route
  that built its own mediator, or reached past the one it was given, could leave
  out the validation or the transaction and nothing would notice until a
  half-written command was found in the database.

  What each behaviour does is specified with it: validation with the validation
  behaviour, the command's transaction with the transaction behaviour, and the
  query's with the read-only transaction behaviour. What is here is that the
  application has them, in the right order, on the right side, and that a route
  can reach them. A command is validated and then run in a transaction it can
  write in. A query is validated and then run in a transaction it cannot write
  in. Validation comes first on both sides, so that a request that was never
  going to be carried out does not cost a connection.

  On the command's side one more thing stands between them: whether the
  password a command sets has been breached, asked of an outside service and
  so asked in front of the transaction, where it holds no connection while
  another site takes its time. That it is in front of the transaction is
  specified with the check itself. What is here is the other half of where it
  stands — that validation is in front of it in turn, so that a command
  breaking its own rules is refused without a request being made about its
  password. Only the application knows that order, because only the
  application puts the line together, and the two lines that decide it can be
  swapped without a single other scenario noticing.

  The application also puts its event store together once: Postgres, on the
  same unit of work the mediator's transactions use, with the application's
  projections in front of it. So every event a command's handler appends is
  kept in the command's transaction, and every read model is brought up to
  date in that same transaction.

  These scenarios run against Postgres, because whether the application's
  transactions write is not a thing a fake has an opinion about. They use the
  mediator's example command and example query, the validator's example range,
  example events and example projections, a place to keep notes, and an
  example route, none of which mean anything.

  Background:
    Given the application is built

  Rule: A command is validated, then run in a transaction it can write in

    Scenario: What a command wrote is there once it has answered
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      When the example command is sent
      Then the note "opened" is there

    Scenario: A command that fails leaves nothing behind
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the handler fails after writing the note
      When the example command is sent
      Then no notes are there

    Scenario: A command that breaks a rule is refused
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 1
      When the example command is sent for the example range
      Then it is refused with "Request.Invalid"

    Scenario: A command that breaks a rule takes no connection
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 1
      When the example command is sent for the example range
      Then no connection was taken for it

    Scenario: A command that breaks a rule has its password left unasked about
      Given a validator registered for the example command
      And a handler registered for the example command
      And an example range
      And it starts at 1
      And it sets the password "password123456"
      When the example command is sent for the example range
      Then nothing was asked of the breached password check

  Rule: A query is validated, then run in a transaction it cannot write in

    Scenario: What a query answered reaches the sender
      Given a handler registered for the example query that answers "found"
      When the example query is asked
      Then the answer is "found"

    Scenario: A query that tries to write is refused
      Given a place to keep notes
      And a handler registered for the example query that writes the note "read"
      When the example query is asked
      Then asking fails because the transaction is read-only

    Scenario: A query that breaks a rule is refused
      Given a validator registered for the example query
      And a handler registered for the example query
      And an example range
      And it starts at 1
      When the example query is asked for the example range
      Then it is refused with "Request.Invalid"

    Scenario: A query that breaks a rule takes no connection
      Given a validator registered for the example query
      And a handler registered for the example query
      And an example range
      And it starts at 1
      When the example query is asked for the example range
      Then no connection was taken for it

  Rule: Every route sends through the application's mediator

    Scenario: A route can send a command
      Given a handler registered for the example command that answers "recorded"
      And an example route that sends the example command
      When the example route is requested
      Then the route answers "recorded"

    Scenario: A route can ask a query
      Given a handler registered for the example query that answers "found"
      And an example route that asks the example query
      When the example route is requested
      Then the route answers "found"

  Rule: The application keeps its events in Postgres, and projects them as they are appended

    Scenario: An event appended through the application reads back
      Given a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      And the stream is read back
      Then the first event is "opened"

    Scenario: An event appended through the application is given to its projections
      Given an example projection
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      Then the first event the projection was given is "opened"

    Scenario: What the application's projections write is kept with the events
      Given a place to keep notes
      And a projection that writes the note "projected"
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      Then the note "projected" is there
