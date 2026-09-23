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
  transaction commits — is specified with that behaviour. What every command
  says about itself — when it was asked for, and who asked if anybody did — is
  specified with the command: one that cannot say when is refused where it is
  made, and never reaches the mediator. This feature is how the mediator runs them, and it is
  written with example requests and behaviours that exist only to exercise it.

  A command is given to its handler twice: once to be considered, and once to be
  carried out. Considering is a first look with nothing held open — no
  transaction, and nothing yet asked of anybody outside — in which a handler
  may answer the command outright from what it can read. A command already
  carried out, or one whose link was never any good, is settled there, and the
  expensive half never runs. A handler that has nothing to say while
  considering says nothing, and its command is carried out as it always was.

  So a command has two lines of behaviours rather than one, with the
  considering between them: those in front of it, which see every command that
  arrives, and those behind it, which see only the commands that are going to
  be carried out. What belongs in front is whatever must hold for a command to
  be considered at all — its own rules, since a handler should not be asked to
  consider a command that makes no sense. What belongs behind is whatever costs
  something a command settled by considering should never spend: a connection,
  or a question put to another site. A query has one line, because a query is
  read-only throughout and has nothing to settle early.

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
    of it, so a query handed in as a command is told it came in the wrong way
    rather than anything else about it.

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

  Rule: A command is considered before it is carried out

    A handler that has nothing to say while considering says nothing, and every
    handler written before there was anything to say says nothing without being
    asked to. So considering is something a handler opts into, and a command
    whose handler does not is carried out exactly as it was.

    Scenario: A command is considered before it is carried out
      Given a handler registered for the example command that considers it
      When the example command is sent
      Then the first thing to happen is "the considering"
      And the next thing to happen is "the handler"
      And nothing else happens

    Scenario: A command whose handler considers nothing is carried out
      Given a handler registered for the example command that answers "recorded"
      When the example command is sent
      Then the answer is "recorded"

    Scenario: A command whose handler considers nothing is not considered
      Given a handler registered for the example command
      When the example command is sent
      Then nothing called "the considering" happens

  Rule: A command the handler answers while considering is not carried out

    This is what considering is for. The handler has read enough to answer, and
    what is left would only cost something to reach the same answer by: the
    point is not that it is faster but that nothing behind the considering runs
    at all.

    Scenario: What the handler answers while considering is what the sender receives
      Given a handler registered for the example command that answers "already done" while considering it
      When the example command is sent
      Then the answer is "already done"

    Scenario: A command answered while considering is not carried out
      Given a handler registered for the example command that answers "already done" while considering it
      When the example command is sent
      Then the example command's handler has not been called

    Scenario: A handler's failure while considering reaches the sender unchanged
      Given a handler registered for the example command that fails while considering it
      When the example command is sent
      Then sending it fails with the handler's own failure

    Scenario: A command refused while considering is not carried out
      Given a handler registered for the example command that fails while considering it
      When the example command is sent
      Then the example command's handler has not been called

  Rule: A command's behaviours are in two lines, one either side of the considering

    A behaviour in front of the considering sees every command that arrives. One
    behind it sees only the commands that are going to be carried out, which is
    the whole reason for having two: a behaviour that costs something — a
    connection borrowed, another site asked — belongs where a command settled by
    considering never reaches it.

    Scenario: A behaviour in front of the considering runs before it
      Given a command behaviour called "in front" that runs before the considering
      And a handler registered for the example command that considers it
      When the example command is sent
      Then the first thing to happen is "in front, going in"
      And the next thing to happen is "the considering"
      And the next thing to happen is "the handler"
      And the next thing to happen is "in front, coming out"
      And nothing else happens

    Scenario: A behaviour behind the considering runs after it
      Given a command behaviour called "behind"
      And a handler registered for the example command that considers it
      When the example command is sent
      Then the first thing to happen is "the considering"
      And the next thing to happen is "behind, going in"
      And the next thing to happen is "the handler"
      And the next thing to happen is "behind, coming out"
      And nothing else happens

    Scenario: A behaviour in front of the considering sees a command answered while considering
      Given a command behaviour called "in front" that runs before the considering
      And a handler registered for the example command that answers "already done" while considering it
      When the example command is sent
      Then the first thing to happen is "in front, going in"
      And the next thing to happen is "the considering"
      And the next thing to happen is "in front, coming out"
      And nothing else happens

    Scenario: A behaviour behind the considering does not see a command answered while considering
      Given a command behaviour called "behind"
      And a handler registered for the example command that answers "already done" while considering it
      When the example command is sent
      Then nothing called "behind" happens

    Scenario: A query has no considering line
      Given a query behaviour called "for queries"
      And a handler registered for the example query
      When the example query is asked
      Then nothing called "the considering" happens

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
