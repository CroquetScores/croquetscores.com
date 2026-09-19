@postgres
Feature: Keeping every read model in step with the events, as they are appended

  A query never replays events to answer. It reads a read model — a table kept
  for the question it answers, such as which account an email address belongs
  to — and a projection is what keeps that table: it is given events as they
  are appended, and writes what they mean for its table.

  A projection is not a separate process catching up with the log. Every event
  appended is given to every projection as part of the append, in the same
  transaction, so a command either records what happened and brings every
  read model up to date with it, or does neither. A read model is never behind
  the events it was made from, and there is no half-done middle to reason
  about, no worker to supervise and no checkpoint to drift. What that costs is
  that every append waits for every projection, which is worth paying here.

  An append the store refuses gives nothing to any projection, since nothing
  happened. A projection that fails fails the append, and the transaction it
  runs in takes everything back with it: the events and whatever any
  projection wrote.

  A projection is given the stream the events were appended to, and where in
  it they begin, as well as the events, so that it can tell a stream it has
  seen before from one it has not, and so that projecting the same events a
  second time — as rebuilding a read model from the beginning does — changes
  nothing. What each projection writes, and that it can be run twice, are
  specified with each read model.

  This feature describes what appending through projections does for any
  store, and every store is held to it. These scenarios run against Postgres,
  because what is worth knowing about a transaction is whether anything was
  written. They use example events, a place to keep notes, and example
  projections, none of which mean anything.

  Background:
    Given an event store with projections
    And a place to keep notes
    And a stream nobody has written to

  Rule: Every event appended is given to every projection, in the order appended

    Scenario: A projection is given the events appended
      Given an example projection
      And an event called "opened"
      And an event called "recorded"
      When the events are appended expecting version 0
      Then the first event the projection was given is "opened"
      And the second event the projection was given is "recorded"
      And the projection was given no other event

    Scenario: Every projection is given them
      Given an example projection
      And another example projection
      And an event called "opened"
      When the events are appended expecting version 0
      Then the first event the other projection was given is "opened"

    Scenario: Events appended in two appends are each given once
      Given an example projection
      And an event called "opened"
      And the events are appended expecting version 0
      And an event called "recorded"
      When the events are appended expecting version 1
      Then the first event the projection was given is "opened"
      And the second event the projection was given is "recorded"
      And the projection was given no other event

  Rule: A projection is told the stream, and where in it the events begin

    Scenario: A projection is told the stream the events were appended to
      Given an example projection
      And an event called "opened"
      When the events are appended expecting version 0
      Then the projection was told the stream

    Scenario: Events appended to a new stream begin at its first event
      Given an example projection
      And an event called "opened"
      When the events are appended expecting version 0
      Then the projection was told they begin at event 1 of the stream

    Scenario: Events appended later begin after those already there
      Given an example projection
      And an event called "opened"
      And an event called "recorded"
      And the events are appended expecting version 0
      And an event called "later"
      When the events are appended expecting version 2
      Then the projection was told they begin at event 3 of the stream

  Rule: What a projection writes is kept with the events, or neither is

    Scenario: What a projection wrote is there once the append is kept
      Given a projection that writes the note "projected"
      And an event called "opened"
      When the events are appended expecting version 0
      Then the note "projected" is there

    Scenario: What a projection wrote goes if what appended the events fails afterwards
      Given a projection that writes the note "projected"
      And an event called "opened"
      And whatever appends the events fails once they are appended
      When the events are appended expecting version 0
      Then no notes are there
      And the stream holds no events

  Rule: An append that is refused gives nothing to any projection

    Scenario: A projection is given nothing from an append refused for coming too late
      Given an example projection
      And an event called "opened"
      When the events are appended expecting version 1
      Then appending is refused with "EventStore.Concurrency"
      And the projection was given nothing

  Rule: A projection that fails fails the append, and nothing is kept

    Scenario: The projection's failure reaches whatever appended the events
      Given a projection that fails
      And an event called "opened"
      When the events are appended expecting version 0
      Then appending fails with the projection's own failure

    Scenario: The events are not kept when a projection fails
      Given a projection that fails
      And an event called "opened"
      When the events are appended expecting version 0
      Then the stream holds no events

    Scenario: What another projection wrote is not kept when a projection fails
      Given a projection that writes the note "projected"
      And a projection that fails
      And an event called "opened"
      When the events are appended expecting version 0
      Then no notes are there
