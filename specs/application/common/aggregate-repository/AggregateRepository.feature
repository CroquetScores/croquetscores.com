@postgres
Feature: Loading a thing by its id, and saving what happened to it

  A command acts on things that last — an account, a tournament. It loads the
  thing it acts on by its id, has something done to it, and saves it, and what
  was done is kept as the events the thing recorded. A aggregate repository does both,
  over the event store, for every kind of thing alike: each kind says only how
  it is rebuilt from its events, and everything else is shared.

  Loading reads the thing's stream and rebuilds the thing from it. A thing
  nobody has saved has no stream, and is not found; what that means — an
  account that does not exist, a tournament somebody mistyped — is the
  command's to say, not the aggregate repository's.

  Saving keeps what the thing recorded since it was loaded, and nothing it was
  loaded from, expecting its stream to be where it was when it was loaded. So
  two commands that each loaded a thing and decided what to do from the same
  history cannot both be kept: the second to save is refused, nothing it
  recorded is kept, and it is for the command to load the thing again and
  decide again from what it now finds. A thing that recorded nothing is saved
  by keeping nothing, and is not refused for it.

  A thing hands over what it recorded only once it has been kept. A save that
  is refused leaves the thing holding it, so nothing it recorded is thrown away
  unseen.

  These scenarios run against Postgres, because the event store the
  application keeps its events in is there. They use an example thing, which
  can be opened and renamed and exists only to exercise what every aggregate repository
  shares.

  Background:
    Given a aggregate repository of example things
    And the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-18T10:00:00Z"

  Rule: A thing saved loads back as it was

    Scenario: A new thing saved loads back as it was opened
      Given a new example thing is opened as "Lawn One"
      When it is saved
      And the example thing is loaded
      Then it is called "Lawn One"

    Scenario: A thing loaded, changed and saved loads back changed
      Given a new example thing is opened as "Lawn One"
      And it is saved
      And the example thing is loaded
      And it is renamed "Lawn Two"
      When it is saved
      And the example thing is loaded
      Then it is called "Lawn Two"

    Scenario: A thing loaded is known by the id it was loaded by
      Given a new example thing is opened as "Lawn One"
      When it is saved
      And the example thing is loaded
      Then it is known by the example thing's id

    Scenario: A thing loaded expects its stream to be where it was saved to
      Given a new example thing is opened as "Lawn One"
      And it is saved
      And the example thing is loaded
      And it is renamed "Lawn Two"
      When it is saved
      And the example thing is loaded
      Then it expects its stream to be at version 2

  Rule: A thing nobody saved is not found

    Scenario: Loading a thing nobody saved finds nothing
      When an example thing nobody saved is loaded
      Then nothing is found

  Rule: Saving keeps what was recorded since loading, and keeps it once

    Scenario: A thing saved has nothing left to hand over
      Given a new example thing is opened as "Lawn One"
      When it is saved
      Then it has recorded nothing

    Scenario: A thing saved twice is kept once
      Given a new example thing is opened as "Lawn One"
      When it is saved
      And it is saved
      Then the example thing's stream holds 1 event

    Scenario: A thing loaded and saved unchanged keeps nothing more
      Given a new example thing is opened as "Lawn One"
      And it is saved
      And the example thing is loaded
      When it is saved
      Then the example thing's stream holds 1 event

  Rule: Of two saves from the same history, the second is refused

    Scenario: The second save is refused
      Given a new example thing is opened as "Lawn One"
      And it is saved
      And the example thing is loaded as the first copy
      And the example thing is loaded as the second copy
      And the first copy is renamed "Lawn Two"
      And the first copy is saved
      And the second copy is renamed "Lawn Three"
      When the second copy is saved
      Then saving is refused with "EventStore.Concurrency"

    Scenario: Nothing the second recorded is kept
      Given a new example thing is opened as "Lawn One"
      And it is saved
      And the example thing is loaded as the first copy
      And the example thing is loaded as the second copy
      And the first copy is renamed "Lawn Two"
      And the first copy is saved
      And the second copy is renamed "Lawn Three"
      When the second copy is saved
      And the example thing is loaded
      Then it is called "Lawn Two"

    Scenario: The copy refused still holds what it recorded
      Given a new example thing is opened as "Lawn One"
      And it is saved
      And the example thing is loaded as the first copy
      And the example thing is loaded as the second copy
      And the first copy is renamed "Lawn Two"
      And the first copy is saved
      And the second copy is renamed "Lawn Three"
      When the second copy is saved
      Then the second copy has recorded 1 event
