Feature: What every command says about itself

  A command is something the application is asked to change: open a
  tournament, record a game, register an account. Whatever else it asks, every
  command says when it was asked for, and who asked if anybody signed in did.
  Both are decided once, at the edge, and handed down with it. Nothing below the
  web layer reads a clock or wonders who is signed in.

  Every event says which account caused it, whether or not anybody signed in
  asked for the command that recorded it. So a command asked for by nobody
  leaves the account to its handler, which is the one in a position to know:
  registering an account makes the account, and uses its new id; signing in
  finds the account by its email address, and uses that one's.

  A command that cannot say when it was asked for is refused where it is made,
  before there is a command to send. That is why the mediator does not ask: by
  the time a command reaches it, it can say when.

  When it was asked for is a read-only date. A plain date is refused as though
  there were none: it is the mistake this invites, from anyone writing a command
  the way commands used to be written, and one that anything holding the command
  could move afterwards, so it says no more about when than nothing does. Who
  asked, when anybody did, is an account's id, read as one. An id written as
  text is refused for the same reason: text says nothing about whether it names
  an account.

  This feature is written with an example command, which exists only to exercise
  what every command has in common.

  Rule: A command says when it was asked for, and who asked if anybody did

    Scenario: A command says when it was asked for
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      When the example command is made
      Then it was asked for at "2026-09-18T10:00:00.000Z"

    Scenario: A command says who asked for it
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      When the example command is made
      Then it was asked for by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A command may be asked for by nobody signed in
      Given the moment "2026-09-18T10:00:00Z"
      When the example command is made without saying who asked for it
      Then it was asked for by nobody

  Rule: A command that cannot say when it was asked for is refused where it is made

    Scenario: A command that does not say when it was asked for is refused
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      When the example command is made without saying when it was asked for
      Then making it is refused with "Command.RequestedAtMissing"

    Scenario: A command given a plain date rather than a moment is refused
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      When the example command is made with a plain date rather than a moment
      Then making it is refused with "Command.RequestedAtMissing"

  Rule: A command that names who asked names an account

    Scenario: A command given an account's id written as text rather than read as one is refused
      Given the moment "2026-09-18T10:00:00Z"
      When the example command is made with an account's id written as text rather than read as one
      Then making it is refused with "Command.RequestedByNotAnAccount"

  Rule: Who asked for a command and when cannot change once it exists

    A command passes through every behaviour in its line before its handler
    sees it. One that moved either, between the command being checked and its
    events being stamped, would leave one request recorded as two — asked for
    by one account and caused by another, or asked for at one time and recorded
    at another.

    Scenario: Who asked for a command cannot be changed afterwards
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And the example command is made
      When who asked for it is changed to "account/123e4567-e89b-42d3-a456-426614174001"
      Then it was still asked for by "account/123e4567-e89b-42d3-a456-426614174000"

    Scenario: When a command was asked for cannot be changed afterwards
      Given the account "account/123e4567-e89b-42d3-a456-426614174000"
      And the moment "2026-09-18T10:00:00Z"
      And the example command is made
      When the time it was asked for is changed to "2027-01-01T00:00:00Z"
      Then it was still asked for at "2026-09-18T10:00:00.000Z"
