Feature: Keeping what happened, in the order it happened

  Everything that changes is recorded as events, and the event store is where
  they are kept. Each thing that lasts has a stream of its own, named by the
  thing's id, holding every event that ever happened to it in the order it
  happened. That stream is how the thing is rebuilt: read it back, apply each
  event in turn, and it is what it was when the last one was recorded.

  A stream is only ever added to. Nothing in it is changed or removed, because
  it is the record of what happened rather than a description of what is. What
  reading hands back belongs to whoever asked for it: a caller that sorts or
  trims the events it was given is doing so to its own copy, and a store that
  handed out the stream itself would be changed by anything careless.

  This feature describes what the application wants of a store rather than any
  one way of keeping events, and every implementation is held to these
  scenarios. The step definitions decide what is behind them.

  Rule: A stream reads back what was appended to it, in the order it was appended

    Scenario: A stream nobody has written to holds nothing
      Given an event store
      And a stream nobody has written to
      When the stream is read back
      Then it holds no events

    Scenario: Events appended to a new stream read back in the order they were appended
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      And an event called "recorded"
      When the events are appended expecting version 0
      And the stream is read back
      Then the first event is "opened"
      And the second event is "recorded"
      And there are no more events

    Scenario: Events appended later come after those already there
      Given an event store
      And a stream holding 2 events
      And an event called "later"
      When the events are appended expecting version 2
      And the stream is read back
      Then the third event is "later"
      And there are no more events

    Scenario: An event reads back saying what it said when it was appended
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      And the stream is read back
      Then the first event is "opened"
      And it was caused by the account the event was created with
      And it happened at the moment the event was created with

    Scenario: Changing what a stream handed back changes nothing in the stream
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      And the stream is read back
      And what was read back is added to
      And the stream is read back
      Then the first event is "opened"
      And there are no more events

  Rule: An append says which version of the stream it expected, and is refused if that is not the version there

    A stream's version is how many events it holds; a stream nobody has
    written to is at version 0. Whoever appends has read the stream, decided
    what happens next from what was there, and says so by naming the version
    they read. If somebody else has appended in between, that decision was made
    from a stream that no longer exists, and recording it would be recording a
    decision nobody would have made.

    Expecting a version later than the stream's is refused for the same reason:
    it is not what the stream is at, and the safe thing is to refuse rather
    than guess which of them is wrong.

    Nothing is appended when an append is refused.

    Scenario: An append expecting an earlier version than the stream's is refused
      Given an event store
      And a stream holding 2 events
      And an event called "late"
      When the events are appended expecting version 1
      Then appending is refused with "EventStore.Concurrency"

    Scenario: An append expecting a later version than the stream's is refused
      Given an event store
      And a stream holding 2 events
      And an event called "early"
      When the events are appended expecting version 3
      Then appending is refused with "EventStore.Concurrency"

    Scenario: An append to a new stream expecting it to have events is refused
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 1
      Then appending is refused with "EventStore.Concurrency"

    Scenario: A refused append leaves the stream as it was
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      And an event called "recorded"
      And the events are appended expecting version 0
      And an event called "late"
      When the events are appended expecting version 1
      And the stream is read back
      Then the first event is "opened"
      And the second event is "recorded"
      And there are no more events

  Rule: The version an append expects is a count

    A version is how many events the stream holds, so it is a whole number and
    never below zero. Anything else is not a version the stream could be at,
    and is a mistake in whatever asked for the append rather than a sign that
    somebody else got there first. It is refused with its own code, so that
    the caller fixes its code instead of retrying forever.

    Scenario: A version below zero is refused
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version -1
      Then appending is refused with "EventStore.VersionNotACount"

    Scenario: A version that is not a whole number is refused
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting a version of 1.5
      Then appending is refused with "EventStore.VersionNotACount"

    Scenario: A version that is not a number is refused
      Given an event store
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting a version that is not a number
      Then appending is refused with "EventStore.VersionNotACount"

  Rule: An append records something

    An append of no events is a mistake in whatever asked for it: a thing with
    nothing to record has no business being saved. It is refused rather than
    quietly doing nothing, so that the mistake is found.

    Scenario: Appending no events is refused
      Given an event store
      And a stream nobody has written to
      When no events are appended expecting version 0
      Then appending is refused with "EventStore.NothingToAppend"

  Rule: Streams are kept apart

    Scenario: What is appended to one stream is not in another
      Given an event store
      And a stream nobody has written to
      And another stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      And the other stream is read back
      Then it holds no events

    Scenario: A stream's version counts only its own events
      Given an event store
      And a stream holding 2 events
      And another stream nobody has written to
      And an event called "opened"
      When the events are appended to the other stream expecting version 0
      Then appending is accepted
