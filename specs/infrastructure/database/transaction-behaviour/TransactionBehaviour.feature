@postgres
Feature: Running a command inside one transaction

  Everything a command changes stands or falls together. The events it
  recorded, the read models those events drive, whatever a repository wrote on
  the way through: all of it, or none of it. So a command is run inside a
  transaction on one connection, opened before the handler is given the command
  and finished once the handler has answered — committed when it answered,
  rolled back when it failed. A command that failed left nothing behind.

  Whoever needs that connection asks for it rather than being handed it. A
  repository, the event store and a projection all ask, and all get the
  connection belonging to the request being served, because a second connection
  would be a second transaction: half of the command could then commit while
  the other half rolled back, and the events would say one thing while the read
  models said another.

  This is the command side. A query is run inside a transaction too, a read-only
  one it does not write in, and that is specified with the read-only transaction
  behaviour.

  These scenarios run against Postgres. A fake that reports it committed says
  nothing about whether anything was written, and whether anything was written
  is the whole of what is worth knowing here. They use an example command, an
  example projection the handler runs, and a place to keep notes, none of which
  mean anything: they exist only to exercise the behaviour.

  Background:
    Given a mediator whose commands run in a transaction

  Rule: A command that answers is committed

    Scenario: What the command wrote is there once it has answered
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      When the example command is sent
      Then the note "opened" is there

    Scenario: What the command answered reaches the sender
      Given a handler registered for the example command that answers "recorded"
      When the example command is sent
      Then the answer is "recorded"

  Rule: A command that fails is rolled back

    Scenario: What the command wrote before it failed is not there afterwards
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the handler fails after writing the note
      When the example command is sent
      Then no notes are there

    Scenario: The handler's failure reaches the sender unchanged
      Given a handler registered for the example command that fails
      When the example command is sent
      Then sending it fails with the handler's own failure

    Scenario: A rollback that fails does not hide the failure that caused it
      Given a handler registered for the example command that fails
      And the rollback will fail
      When the example command is sent
      Then sending it fails with the handler's own failure

  Rule: Nothing sees what a command has written until it commits

    The transaction is what makes this true, so it is also how these scenarios
    know there is one. A note written inside the command and looked for from
    another connection while the command is still running is not there to find;
    the same note looked for once the command has answered is.

    Scenario: What the command has written is not there on another connection while it runs
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the handler looks for the note on another connection before it answers
      When the example command is sent
      Then the handler did not find the note
      And the note "opened" is there

  Rule: Everything the command touches runs on the command's connection

    Scenario: A projection runs on the connection the handler ran on
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And an example projection that writes the note "projected"
      When the example command is sent
      Then the handler and the projection ran on the same connection

    Scenario: What a projection wrote is rolled back with the command
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And an example projection that writes the note "projected"
      And the handler fails once the projection has run
      When the example command is sent
      Then no notes are there

  Rule: A command whose commit fails did not happen

    A commit can fail on its own account — a connection lost, or a constraint
    held back until the end — and when it does, nothing the command wrote is
    there. So the sender is told it failed rather than given the answer the
    handler gave, because an answer would say the change was recorded when
    nothing was.

    Scenario: A commit that fails reaches the sender
      Given a handler registered for the example command that answers "recorded"
      And the commit will fail
      When the example command is sent
      Then sending it fails with the commit's own failure

    Scenario: Nothing the command wrote is there when the commit failed
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the commit will fail
      When the example command is sent
      Then no notes are there

  Rule: The connection is given back however the command ends

    A connection still held after the command that borrowed it has finished is
    one the next request cannot have, and enough of them is a site that has
    stopped answering. It is given back whether the command answered, failed,
    or failed on the way out.

    Scenario: The connection is given back when the command answers
      Given a handler registered for the example command
      When the example command is sent
      Then every connection has been given back

    Scenario: The connection is given back when the command fails
      Given a handler registered for the example command that fails
      When the example command is sent
      Then every connection has been given back

    Scenario: The connection is given back when the commit fails
      Given a handler registered for the example command
      And the commit will fail
      When the example command is sent
      Then every connection has been given back

  Rule: A connection belongs to the request being served, and there is none outside one

    Asking for a connection where no request is being served is a mistake in
    whatever asked — a maintenance script, or something started during a request
    and left running after it. Handing one out would be handing out a connection
    nobody is going to commit or give back, so it is refused instead.

    Scenario: Asking for a connection when nothing is being served is refused
      When the connection is asked for
      Then asking is refused with "UnitOfWork.NothingUnderway"

    Scenario: Asking for a connection once the command has answered is refused
      Given a handler registered for the example command
      When the example command is sent
      And the connection is asked for
      Then asking is refused with "UnitOfWork.NothingUnderway"

  Rule: A command may not send a command

    One command is one unit of work. A second command sent from inside the first
    would be a second unit of work sharing the first's transaction: it would
    commit only if the outer command did, and an outer rollback would undo work
    whoever sent the inner one had been told was recorded. Giving it a
    transaction of its own is no better, because the outer command could then
    fail and leave the inner one's work standing on its own.

    Where a handler wants what another command does, that work belongs
    somewhere both can reach — the domain, or a service the application names —
    rather than behind a second trip through the mediator. So it is refused
    where it is attempted, rather than quietly joined.

    Scenario: A command sent while a command is underway is refused
      Given a handler registered for the example command that sends the other command
      And a handler registered for the other command
      When the example command is sent
      Then sending it is refused with "UnitOfWork.AlreadyUnderway"
      And the other command's handler has not been called

    Scenario: The command that sent it is rolled back
      Given a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the handler sends the other command once it has written the note
      And a handler registered for the other command
      When the example command is sent
      Then no notes are there

  Rule: Two commands at once are two transactions

    Two commands being served at the same time have nothing to do with one
    another, and neither is in a position to commit the other's work. Each has
    a connection of its own for as long as it runs.

    Scenario: Two commands sent at the same time run on connections of their own
      Given a handler registered for the example command that waits until both commands have a connection
      When two example commands are sent at the same time
      Then the two commands ran on different connections
