@postgres
Feature: A request is stamped with the moment it arrived

  Every command says when it was asked for, and every event it records is
  stamped with that moment. Nothing below the web layer reads a clock, so that a
  scenario can set the time to whatever it needs and get the same answer every
  run, and a command replayed for diagnosis behaves as it did the first time. So
  the moment is decided here, once, as the request arrives, by the server's
  clock, and whatever the request sends is handed that moment.

  Once means once. A request that sends two commands sends two that were asked
  for at the same moment, however long the first took, because they were asked
  for by one request. And each request is stamped as it arrives, not when the
  application started.

  The moment is an instant, held and written in UTC. The time zone the server
  happens to be in has no bearing on it: a server in Auckland and one in London,
  reading their clocks at the same instant, stamp a request with the same moment.

  Every scenario here names the zone the server is in, and runs in UTC unless
  it says otherwise, so that none of them passes or fails according to where
  the machine running it happens to be.

  These scenarios run the application against Postgres, because a command sent
  by a route runs in the application's transaction. They use the server's
  clock, set to whatever each scenario needs, the mediator's example command,
  and an example route, none of which mean anything.

  Background:
    Given the application is built
    And the server is in the time zone "UTC"

  Rule: A command a route sends says when the request arrived

    Scenario: The command says the moment the server's clock read
      Given the server's clock reads "2026-09-18T09:00:00Z"
      And a handler registered for the example command
      And an example route that sends the example command
      When the example route is requested
      Then the example command was asked for at "2026-09-18T09:00:00.000Z"

  Rule: The moment is decided once, as the request arrives

    Scenario: Everything one request sends was asked for at the same moment
      Given the server's clock reads "2026-09-18T09:00:00Z"
      And a handler registered for the example command
      And the server's clock moves on a minute whenever the example command is handled
      And an example route that sends the example command twice
      When the example route is requested
      Then the first example command was asked for at "2026-09-18T09:00:00.000Z"
      And the second example command was asked for at "2026-09-18T09:00:00.000Z"

    Scenario: Each request is stamped as it arrives
      Given the server's clock reads "2026-09-18T09:00:00Z"
      And a handler registered for the example command
      And an example route that sends the example command
      And the example route is requested
      And the server's clock reads "2026-09-18T09:05:00Z"
      When the example route is requested
      Then the second example command was asked for at "2026-09-18T09:05:00.000Z"

  Rule: The moment is in UTC, whatever time zone the server is in

    Scenario Outline: A server in any time zone stamps the same moment
      Given the server is in the time zone "<zone>"
      And the server's clock reads "2026-09-18T09:00:00Z"
      And a handler registered for the example command
      And an example route that sends the example command
      When the example route is requested
      Then the example command was asked for at "2026-09-18T09:00:00.000Z"

      Examples:
        | zone             |
        | UTC              |
        | Europe/London    |
        | Pacific/Auckland |
        | America/New_York |
