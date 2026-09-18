Feature: A query's handler names the query it handles

  A query handler is the one thing that answers a kind of query. What it
  answers with is its own business, specified with the query it answers. What
  every handler shares is that it names the kind of query it is for, so
  registering it needs nothing but the handler: it cannot be registered under a
  query it was not written for, because it is never registered under anything
  but what it says.

  That a query has exactly one handler, and is refused when it has none, is the
  mediator's to say, and is specified with the mediator.

  This feature is written with the mediator's example requests and handlers
  that exist only to exercise what every handler shares.

  Rule: A handler is registered by the query it names, and answers only that

    Scenario: A handler registered on its own answers the query it names
      Given a handler that handles the example query and answers "found"
      When the handler is registered
      And the example query is asked
      Then the answer is "found"

    Scenario: A handler is not handed a query other than the one it names
      Given a handler that handles the example query
      And the handler is registered
      When the other query is asked
      Then it is refused with "Mediator.Unhandled"
      And the example query's handler has not been called

  Rule: A handler naming anything but a query cannot be registered as a query's

    Which door a request comes in by is settled before anything else is asked
    of it: a command is sent and a query is asked. A handler naming a command,
    registered among the queries', would let that command in by the query's
    door — where it would pass the command's validation by and run in a
    transaction that cannot write. So it is refused when it is registered,
    rather than found when the command comes through the wrong way. So is one
    naming something that is no request at all: what a query's handler names
    has to be a query, not merely something other than a command.

    Scenario: A handler naming a command rather than a query is refused
      Given a handler that handles the example command rather than a query
      When the handler is registered
      Then registering it is refused with "Mediator.WrongDoor"

    Scenario: A handler naming something that is not a request at all is refused
      Given a handler for queries that handles something that is not a request
      When the handler is registered
      Then registering it is refused with "Mediator.WrongDoor"
