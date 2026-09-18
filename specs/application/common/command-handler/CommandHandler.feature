Feature: A command's handler names the command it handles

  A command handler is the one thing that deals with a kind of command. What it
  does with one is its own business, specified with the command it handles.
  What every handler shares is that it names the kind of command it is for, so
  registering it needs nothing but the handler: it cannot be registered under a
  command it was not written for, because it is never registered under anything
  but what it says.

  That a command has exactly one handler, and is refused when it has none, is
  the mediator's to say, and is specified with the mediator.

  This feature is written with the mediator's example requests and handlers
  that exist only to exercise what every handler shares.

  Rule: A handler is registered by the command it names, and handles only that

    Scenario: A handler registered on its own handles the command it names
      Given a handler that handles the example command and answers "recorded"
      When the handler is registered
      And the example command is sent
      Then the answer is "recorded"

    Scenario: A handler is not handed a command other than the one it names
      Given a handler that handles the example command
      And the handler is registered
      When the other command is sent
      Then it is refused with "Mediator.Unhandled"
      And the example command's handler has not been called

  Rule: A handler naming a query cannot be registered as a command's

    Which door a request comes in by is settled before anything else is asked
    of it: a command is sent and a query is asked. A handler naming a query,
    registered among the commands', would open the command door to that query,
    so it is refused when it is registered rather than found when the query
    comes through the wrong way.

    Scenario: A handler naming a query rather than a command is refused
      Given a handler that handles the example query rather than a command
      When the handler is registered
      Then registering it is refused with "Mediator.WrongDoor"
