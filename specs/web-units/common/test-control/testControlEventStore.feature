Feature: A site with the control can refuse the API a read of the events

  The API is to answer from the read models and never from the events
  (`readModelsOnly.feature`), and nothing but a scenario keeps it so. A site
  with the test control can be told that a request to the API may not read the
  events, and the read then fails the request that made it.

  Only reads, and only for the API. A command is built from the events by
  design, and the site's own pages ask for them, so each goes on as it did, and
  so does the appending of events by anyone, the API's request included.

  Every request is answered after a hook that waits, as the site's own are, so
  that the mark is held to still being there when the answer is made.

  Background:
    Given a store of events that holds an event

  Rule: A read for the API is refused when the API is told not to read

    Scenario: A read for a request to the API is refused
      Given the API may not read the events
      When the stream is read for a request to "/api/v0/tournaments"
      Then the read is refused

    Scenario: A read for a request to the API is allowed until it is told not to
      When the stream is read for a request to "/api/v0/tournaments"
      Then the request is answered with the events

    Scenario: A read for a request to the API is allowed again once it is told it may
      Given the API may not read the events
      And the API may read the events again
      When the stream is read for a request to "/api/v0/tournaments"
      Then the request is answered with the events

    Scenario: A read for a request to the API with a query is refused
      Given the API may not read the events
      When the stream is read for a request to "/api/v0/tournaments?year=2026"
      Then the read is refused

  Rule: Nothing else is held to it

    Scenario: A read for a request to an address that only begins like the API is allowed
      Given the API may not read the events
      When the stream is read for a request to "/api/v0-notes"
      Then the request is answered with the events

    Scenario: A read for a request to a page of the site is allowed
      Given the API may not read the events
      When the stream is read for a request to "/tournament/spring"
      Then the request is answered with the events

    Scenario: A read for a request to the site's own API is allowed
      Given the API may not read the events
      When the stream is read for a request to "/api/site/help"
      Then the request is answered with the events

    Scenario: An append for a request to the API is allowed
      Given the API may not read the events
      When an event is appended for a request to "/api/v0/tournaments"
      Then the event is kept
