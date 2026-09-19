Feature: Rebuilding a thing from everything that happened to it

  A thing that lasts — an account, a tournament — is not kept as it is now. It is
  kept as everything that happened to it, a stream of events in the order they
  happened, and when it is needed it is rebuilt by applying each in turn. What
  happens to it next is recorded the same way: as new events, which change it as
  they are recorded and are kept once the command that caused them is done.

  The aggregate root is what every such thing shares: being known by an id,
  which is also the name of its stream, being made new, being rebuilt,
  recording what happens next, handing over what it recorded to be kept, and
  knowing which version of its stream it expects to add to. What each
  thing can have done to it, and the events that records, are specified with
  the thing.

  This feature is written with an example thing, which can be opened and renamed
  and exists only to exercise what every such thing shares.

  Rule: A new thing is made by what begins it

    Scenario: Opening a new thing records its opening
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      When a new example thing is opened as "Lawn One"
      Then it has recorded 1 event
      And the first thing it recorded is its opening as "Lawn One"

    Scenario: A new thing expects its stream to be empty
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      When a new example thing is opened as "Lawn One"
      Then it expects its stream to be at version 0

  Rule: A thing is known by its id, which names its stream

    A thing is given its id when it is made, by whatever makes it, and keeps it
    for good. Its stream is named by that id, so whatever keeps the thing knows
    where to put what happens to it without being told a second time.

    Scenario: A new thing is known by the id it was opened with
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      When a new example thing is opened as "Lawn One" with the id "thing/7c9e6679-7425-40de-944b-e07fc1f90ae7"
      Then it is known by "thing/7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: A thing rebuilt is known by the id of the stream it was rebuilt from
      Given a stream where the example thing was opened as "Lawn One"
      When the example thing is rebuilt from the stream "thing/7c9e6679-7425-40de-944b-e07fc1f90ae7"
      Then it is known by "thing/7c9e6679-7425-40de-944b-e07fc1f90ae7"

  Rule: A thing is rebuilt from its stream, as the last of its events left it

    Scenario: A thing rebuilt from its stream is as its last event left it
      Given a stream where the example thing was opened as "Lawn One"
      And the example thing was then renamed "Lawn Two"
      When the example thing is rebuilt from the stream
      Then it is called "Lawn Two"

    Scenario: A thing rebuilt from its stream expects to add to it after its last event
      Given a stream where the example thing was opened as "Lawn One"
      And the example thing was then renamed "Lawn Two"
      When the example thing is rebuilt from the stream
      Then it expects its stream to be at version 2

    Scenario: Rebuilding a thing records nothing
      Given a stream where the example thing was opened as "Lawn One"
      And the example thing was then renamed "Lawn Two"
      When the example thing is rebuilt from the stream
      Then it has recorded nothing

  Rule: What happens to a thing next is recorded as an event

    Scenario: Something done to a thing is recorded
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      When it is renamed "Lawn Two"
      Then it has recorded 1 event
      And the first thing it recorded is its renaming to "Lawn Two"

    Scenario: A thing is changed by what it records
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      When it is renamed "Lawn Two"
      Then it is called "Lawn Two"

    Scenario: What a thing records says who did it and when
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      When it is renamed "Lawn Two"
      Then what it recorded was caused by "account/123e4567-e89b-42d3-a456-426614174000"
      And what it recorded happened at "2026-09-18T10:00:00.000Z"

    Scenario: What a thing records is held in the order it happened
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      When it is renamed "Lawn Two"
      And it is renamed "Lawn Three"
      Then the first thing it recorded is its renaming to "Lawn Two"
      And the second thing it recorded is its renaming to "Lawn Three"

  Rule: A thing expects its stream to be where it was rebuilt from until what it recorded is handed over

    What a thing records is appended expecting its stream to be where it was
    when the thing was rebuilt. That is what lets the store refuse the append if
    somebody else has added to the stream since, so recording does not move it.
    Handing over what it recorded does, because by then it is on its way to
    being kept.

    What is handed over is handed over once. A thing that still held it
    afterwards would hand it over again the next time it was asked, and it would
    be kept twice.

    Scenario: Recording does not change where a thing expects its stream to be
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      When it is renamed "Lawn Two"
      Then it expects its stream to be at version 1

    Scenario: Handing over what a thing recorded moves where it expects its stream to be
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      And it is renamed "Lawn Two"
      And it is renamed "Lawn Three"
      When what it recorded is handed over
      Then it expects its stream to be at version 3

    Scenario: What a thing recorded is handed over once
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And a stream where the example thing was opened as "Lawn One"
      And the example thing is rebuilt from the stream
      And it is renamed "Lawn Two"
      When what it recorded is handed over
      Then it has recorded nothing
