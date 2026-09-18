Feature: Knowing each kind of event by a name that lasts

  An event is kept as data, under a name, and read back by code that will have
  changed many times by then. The registry is what joins the two ends. It says
  which name each kind of event is kept under, and which kind a kept name is read
  back as. It is what the event store is given when it is told how to read back
  each kind it keeps.

  Two rules keep an event readable for as long as it is kept. A name is never
  given to a second kind, because every event ever kept under it would be read
  back as something it was not. And a kind only ever gains fields, and only ones
  it can do without, because an event kept before a field existed does not have
  it. Both are finally the business of whoever writes a kind: a registry knows
  only the kinds there are today, and cannot see a name that was given to
  something else five years ago. What it can hold, it does. A name is taken once
  within what it knows, and what the second rule looks like is shown here with an
  example kind that gained a field.

  Who caused an event and when it happened are written down and read back the
  same way for every kind, so the registry does both, and a kind reads only what
  is its own.

  This feature is written with two example kinds of event, the example kind and
  the other kind, which exist only to exercise the registry.

  Rule: An event written down and read back is the event it was

    Scenario: An event is read back as the kind it was written down as
      Given a registry that knows the example kind as "example"
      And an event called "opened"
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is of the example kind

    Scenario: An event read back says what it said
      Given a registry that knows the example kind as "example"
      And an event called "opened"
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is called "opened"

    Scenario: An event read back says who caused it and when it happened
      Given a registry that knows the example kind as "example"
      And an event called "opened"
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back was caused by the account the event was created with
      And what was read back happened at the moment the event was created with

    Scenario: Events of each kind are read back as their own kind
      Given a registry that knows the example kind as "example"
      And the registry knows the other kind as "other"
      And an event of the other kind called "moved"
      When the event is written down through the registry
      And what was kept is read back through the registry
      Then what was read back is of the other kind

  Rule: Each kind is kept under a name of its own

    A name with two kinds would read back every event kept under it as whichever
    was named last. A kind with two names would be written under one and have to
    be read back under both, with nothing to say which was meant. Either is a
    mistake in how the application was put together, and is refused where it is
    made — when the application starts — rather than when the first event is
    read back wrongly.

    Scenario: An event is written down under its kind's name
      Given a registry that knows the example kind as "example"
      And an event called "opened"
      When the event is written down through the registry
      Then it was written down under the name "example"

    Scenario: A name already given to one kind cannot be given to another
      Given a registry that knows the example kind as "example"
      When the other kind is named "example"
      Then naming it is refused with "EventRegistry.NameTaken"

    Scenario: A kind that already has a name cannot be given a second one
      Given a registry that knows the example kind as "example"
      When the example kind is named "example-again"
      Then naming it is refused with "EventRegistry.AlreadyNamed"

  Rule: What the registry does not know is refused

    An event the registry cannot name could be written down but never read back,
    and a name it does not know could only be read back as a guess. Each is
    refused, so that the mistake is found where it was made.

    Scenario: An event of a kind nobody named cannot be written down
      Given a registry that knows the example kind as "example"
      And an event of the other kind called "moved"
      When the event is written down through the registry
      Then writing it down is refused with "EventRegistry.UnknownKind"

    Scenario: What was kept under a name nobody gave cannot be read back
      Given a registry that knows the example kind as "example"
      And something kept under the name "vanished"
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.UnknownName"

  Rule: A kind only ever gains fields, so what was kept before still reads back

    The example kind can say where something happened, which it could not
    always do. Events kept before it could are kept as they were, and are read
    back as saying nothing about where rather than refused for leaving it out.

    Scenario: An event kept before its kind gained a field reads back without it
      Given a registry that knows the example kind as "example"
      And an event of the example kind kept before the kind could say where it happened
      When what was kept is read back through the registry
      Then what was read back is of the example kind
      And what was read back does not say where it happened

  Rule: What was kept is refused if it cannot say who caused it or when

    What is kept comes back from a table that something other than the registry
    could have written to. Kept data whose cause is not an account, or whose
    moment is not a moment, is refused rather than made into an event that says
    something untrue about who did what and when.

    Scenario: What was kept whose moment cannot be read is refused
      Given a registry that knows the example kind as "example"
      And something kept under the name "example" whose moment cannot be read
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"

    Scenario: What was kept whose cause is not an account is refused
      Given a registry that knows the example kind as "example"
      And something kept under the name "example" whose cause is not an account
      When what was kept is read back through the registry
      Then reading it back is refused with "EventRegistry.Unreadable"
