@postgres
Feature: Keeping events in Postgres

  The event store's own feature says what any store has to do, and this one is
  held to every scenario in it. That is what being an event store means, and a
  copy of those scenarios here would be a second thing to drift from the first.

  This feature is what keeping events in Postgres adds, which a store holding
  them in memory never had to face. What is appended outlives the store that
  appended it. An event goes in as data and has to come back out as the event
  it was. An append is one part of a command, and stands or falls with the rest
  of it. And two commands can reach the same stream at the same moment.

  The store is told how to read back each kind of event it keeps. How that is
  organised — the registry of kinds, and the rules that keep a five-year-old
  event readable — is specified with the registry. What is here is what the
  store does with what it has been told.

  These scenarios use two kinds of event, the example kind and the other kind,
  which exist only to exercise the store.

  Rule: What is appended is kept

    A store in memory forgets everything when the process ends. This one is
    where events are kept for as long as there is a site, so what one store
    appends, another reads back — as a store in a process started tomorrow
    would.

    Scenario: Events appended through one store are read back through another
      Given an event store in Postgres
      And a stream nobody has written to
      And an event called "opened"
      And the events are appended expecting version 0
      And another event store in Postgres
      When the stream is read back through the other store
      Then the first event is "opened"
      And there are no more events

  Rule: An event is read back as the kind of event it was, saying what it said

    A store in memory hands back the event it was given. This one hands back an
    event made again from what was kept, and so has to make the right kind, with
    everything the event said. A moment in particular is kept in a database with
    a time zone of its own, which has only to be somewhere other than where the
    event was made for a moment kept carelessly to come back as a different one.

    Scenario: Events of two kinds are read back as the kinds they were
      Given an event store in Postgres
      And a stream nobody has written to
      And an event called "opened"
      And an event of the other kind called "moved"
      When the events are appended expecting version 0
      And the stream is read back
      Then the first event is of the example kind
      And the second event is of the other kind

    Scenario: An event says when it happened, whatever time zone the database keeps
      Given an event store in Postgres
      And the database keeps time in "Pacific/Auckland"
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended expecting version 0
      And the stream is read back
      Then the first event is "opened"
      And it happened at the moment the event was created with

  Rule: An event the store cannot read back is refused, before it is written and when it is read

    An event is kept for good, so one the store would not know how to read back
    is refused before it is written, rather than found years later by whatever
    needs it. An append holding such an event appends none of it.

    A stream holding an event of a kind the store no longer knows is refused
    whole when it is read. A stream is read to rebuild the thing it belongs to,
    and a thing rebuilt from part of its history is a thing that never existed.

    Scenario: An event of a kind the store cannot read back is refused
      Given an event store in Postgres that does not know the other kind
      And a stream nobody has written to
      And an event of the other kind called "moved"
      When the events are appended expecting version 0
      Then appending is refused with "EventStore.UnknownEvent"

    Scenario: An append holding one event the store cannot read back appends none of them
      Given an event store in Postgres that does not know the other kind
      And a stream nobody has written to
      And an event called "opened"
      And an event of the other kind called "moved"
      When the events are appended expecting version 0
      And the stream is read back
      Then it holds no events

    Scenario: A stream holding an event of a kind the store does not know is refused when read
      Given an event store in Postgres
      And a stream nobody has written to
      And an event called "opened"
      And an event of the other kind called "moved"
      And the events are appended expecting version 0
      And another event store in Postgres that does not know the other kind
      When the stream is read back through the other store
      Then reading it back is refused with "EventStore.UnknownEvent"

  Rule: An append is part of the command that made it

    The store has no connection of its own. It asks for the one the command it
    is serving is running on, as everything a command touches does, so what it
    appends is committed with everything else the command did or rolled back
    with it. Otherwise the events could say something happened that the read
    models, rolled back, say did not.

    Scenario: What a command appended is kept once it has answered
      Given an event store in Postgres
      And a mediator whose commands run in a transaction
      And a stream nobody has written to
      And an event called "opened"
      And a handler registered for the example command that appends the events expecting version 0
      When the example command is sent
      And the stream is read back
      Then the first event is "opened"
      And there are no more events

    Scenario: What a command appended is not kept when it fails
      Given an event store in Postgres
      And a mediator whose commands run in a transaction
      And a stream nobody has written to
      And an event called "opened"
      And a handler registered for the example command that appends the events expecting version 0
      And the handler fails after appending the events
      When the example command is sent
      And the stream is read back
      Then it holds no events

    Scenario: Appending when no command is underway is refused
      Given an event store in Postgres
      And a stream nobody has written to
      And an event called "opened"
      When the events are appended with no command underway
      Then appending is refused with "UnitOfWork.NothingUnderway"

  Rule: Of two commands appending to one stream at once, only one succeeds

    In memory, one append always finishes before the next begins. In Postgres,
    two commands can each read a stream at version 2, each decide what happens
    next, and each append expecting 2, at the same moment. Only one of them can
    be right about the stream it decided from.

    The second to arrive waits for the first to finish, finds version 2 already
    taken, and is refused with the same code as any other append expecting a
    version the stream is not at. Not with a database error: a caller retries on
    a concurrency refusal, and would not know to retry on anything else.

    Scenario: The second of two appends expecting the same version is refused
      Given an event store in Postgres
      And a mediator whose commands run in a transaction
      And a stream holding 2 events
      And an event called "raced"
      And a handler registered for the example command that appends the events expecting version 2
      And the handler waits for the other command before appending
      When two example commands are sent at the same time
      Then sending one of them is refused with "EventStore.Concurrency"

    Scenario: The stream holds only what the first append added
      Given an event store in Postgres
      And a mediator whose commands run in a transaction
      And a stream holding 2 events
      And an event called "raced"
      And a handler registered for the example command that appends the events expecting version 2
      And the handler waits for the other command before appending
      When two example commands are sent at the same time
      And the stream is read back
      Then the third event is "raced"
      And there are no more events
