Feature: Handing a request to the one thing that deals with it

  The web layer asks the application to do things and to tell it things, without
  knowing what deals with each request. That is the mediator's job. A command asks
  for something to change; a query asks for something to be read. Each is handed
  to the one handler registered for it, by way of the behaviours every request of
  its kind passes through.

  Commands and queries share the mediator and nothing else. They are handed in
  through separate doors, so that nothing reaches the read side by mistake, and
  each side has its own behaviours: a command is run inside a transaction it
  writes in and has to commit, a query inside a read-only one, so the two cannot
  share one line of them.

  What each behaviour does — what is logged, how a request is validated, what a
  transaction commits — is specified with that behaviour. This feature is how the
  mediator runs them, and it is written with example requests and behaviours that
  exist only to exercise it.

  Rule: A request is answered by the handler registered for it

    Scenario: A command is handled by its handler
      Given a handler registered for the example command
      When the example command is sent
      Then the example command's handler has handled it

    Scenario: What the command's handler answers is what the sender receives
      Given a handler registered for the example command that answers "recorded"
      When the example command is sent
      Then the answer is "recorded"

    Scenario: A query is handled by its handler
      Given a handler registered for the example query that answers "found"
      When the example query is asked
      Then the answer is "found"

    Scenario: A handler for some other request is left alone
      Given a handler registered for the example command
      And a handler registered for the other command
      When the example command is sent
      Then the other command's handler has not been called

  Rule: A request has exactly one handler

    Two handlers for one request would leave which of them answers to the order
    they happened to be registered in. None would leave the request to go nowhere.
    Either is a mistake in how the application was put together, and is refused
    rather than guessed around.

    Scenario: A second handler for the same command is refused
      Given a handler registered for the example command
      When another handler is registered for the example command
      Then registering it is refused with "Mediator.AlreadyHandled"

    Scenario: A second handler for the same query is refused
      Given a handler registered for the example query
      When another handler is registered for the example query
      Then registering it is refused with "Mediator.AlreadyHandled"

    Scenario: A command nobody handles is refused when it is sent
      Given no handler registered for the example command
      When the example command is sent
      Then it is refused with "Mediator.Unhandled"

    Scenario: A query nobody handles is refused when it is asked
      Given no handler registered for the example query
      When the example query is asked
      Then it is refused with "Mediator.Unhandled"

  Rule: A query cannot be sent as a command, nor a command asked as a query

    Which door a request came through is settled before anything else is asked
    of it. A query handed in as a command is the wrong door, not a command that
    has forgotten when it was asked for.

    Scenario: A query handed in as a command is refused
      Given a handler registered for the example query
      When the example query is sent as though it were a command
      Then it is refused with "Mediator.WrongDoor"
      And the example query's handler has not been called

    Scenario: A command handed in as a query is refused
      Given a handler registered for the example command
      When the example command is asked as though it were a query
      Then it is refused with "Mediator.WrongDoor"
      And the example command's handler has not been called

  Rule: A command says when it was asked for

    The time is decided once, at the edge, and handed down with the command.
    Nothing below the web layer reads a clock, and every event a command records
    is stamped with that time. A command that arrives without one has nothing to
    stamp them with, so it is refused before anything else happens to it.

    The time a command carries is a read-only date, which cannot be made from a
    time that cannot be read. So an unreadable time is refused where the date
    is made, before there is a command to send, and that is specified with the
    read-only date. What is left for the mediator to refuse is a command built
    without a time at all.

    A plain date is refused the same way. It is the mistake this invites, from
    anyone writing a command the way commands used to be written, and one that
    anything holding the command could move afterwards — so it says no more
    about when the request was made than no time at all does.

    Scenario: A command that does not say when it was asked for is refused
      Given a handler registered for the example command
      When the example command is sent without saying when it was asked for
      Then it is refused with "Command.RequestedAtMissing"
      And the example command's handler has not been called

    Scenario: A command carrying a plain date rather than a moment is refused
      Given a handler registered for the example command
      When the example command is sent carrying a plain date
      Then it is refused with "Command.RequestedAtMissing"
      And the example command's handler has not been called

  Rule: A request passes through its side's behaviours in order, going in and coming out

    Behaviours wrap the handler like layers: the first registered is the
    outermost, so it is the first to see a request going in and the last to see
    the answer coming out.

    Scenario: Behaviours run in the order they were registered
      Given a command behaviour called "first"
      And a command behaviour called "second"
      And a handler registered for the example command
      When the example command is sent
      Then the first thing to happen is "first, going in"
      And the next thing to happen is "second, going in"
      And the next thing to happen is "the handler"
      And the next thing to happen is "second, coming out"
      And the next thing to happen is "first, coming out"
      And nothing else happens

    Scenario: A behaviour can answer without going any further
      Given a command behaviour that answers "refused" without going further
      And a handler registered for the example command
      When the example command is sent
      Then the answer is "refused"
      And the example command's handler has not been called

    Scenario: A handler's failure reaches the sender unchanged
      Given a handler registered for the example command that fails
      When the example command is sent
      Then sending it fails with the handler's own failure

    Scenario: A behaviour sees a handler's failure on its way out
      Given a command behaviour called "outer"
      And a handler registered for the example command that fails
      When the example command is sent
      Then "outer" saw the failure on its way out

  Rule: Commands and queries have behaviours of their own

    Scenario: A command's behaviours do not run for a query
      Given a command behaviour called "for commands"
      And a handler registered for the example query
      When the example query is asked
      Then nothing called "for commands" happens

    Scenario: A query's behaviours do not run for a command
      Given a query behaviour called "for queries"
      And a handler registered for the example command
      When the example command is sent
      Then nothing called "for queries" happens
