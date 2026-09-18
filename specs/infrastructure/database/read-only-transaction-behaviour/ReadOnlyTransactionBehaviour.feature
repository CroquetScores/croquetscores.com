@postgres
Feature: Running a query inside a read-only transaction

  A query is run inside a transaction so that it reads one database rather than
  several. A query that reads more than once — a page of rows and the count of
  what it was drawn from, a row and the rows it points at — would otherwise see
  each read as of the moment that read happened, and could answer with a count
  that matched no page it ever returned. Inside one transaction every read is as
  of the same moment, so the answer describes a database that existed.

  The transaction is read-only, which is the other half of it. Nothing answering
  a query has any business writing, and saying so to Postgres means a write is
  refused by the database rather than by a rule somebody has to remember. A
  projection filling a read model writes inside the command that produced the
  events, which is the transaction behaviour's business and not this one's.

  Whatever answers the query — a read model, a table a projection filled in —
  asks for the connection the query is running on rather than taking one of its
  own. One query is one connection however many things it asks, because two
  connections would be two transactions and two moments, and the reason for
  having a transaction at all would be lost.

  This is the query side. A command gets a transaction it can write in, and one
  that has to commit, and that is specified with the transaction behaviour.

  These scenarios run against Postgres, because whether a second read saw what
  the first did is not a thing a fake has an opinion about. They use an example
  query, an example reader the handler asks, and a place to keep notes, none of
  which mean anything.

  Background:
    Given a mediator whose queries run in a read-only transaction

  Rule: A query runs on one connection, and so does whatever answers it

    Scenario: What the query answered reaches the sender
      Given a handler registered for the example query that answers "found"
      When the example query is asked
      Then the answer is "found"

    Scenario: The reader runs on the connection the query is running on
      Given a handler registered for the example query that answers "found"
      And an example reader the handler asks
      When the example query is asked
      Then the handler and the reader ran on the same connection

  Rule: A query reads one database, however many times it reads

    Scenario: What changed after the query started is not seen by the query
      Given a place to keep notes
      And a handler registered for the example query that reads the notes twice
      And the note "added" is written on another connection between the two reads
      When the example query is asked
      Then the query did not find the note "added"
      And the note "added" is there

  Rule: A query cannot write

    Scenario: A query that tries to write is refused
      Given a place to keep notes
      And a handler registered for the example query that writes the note "read"
      When the example query is asked
      Then asking fails because the transaction is read-only
      And no notes are there

  Rule: A query asked while a command is underway joins the command

    A command's handler may well ask a query: to decide what happens next from
    what is already recorded, or to check something before recording anything. A
    query that took a transaction of its own would be reading the database as it
    was before the command began, because nothing outside the command's
    transaction can see inside it. It would answer from what the command has
    already made out of date, and the command would record a decision made on
    it.

    So a query asked while a command is underway joins that command: its
    connection, and its transaction as it stands, which is one the command can
    write in rather than a read-only one of the query's. It gives nothing back
    and commits nothing when it answers, because the command is not finished.

    Scenario: A query asked inside a command runs on the command's connection
      Given the mediator's commands run in a transaction
      And a handler registered for the example command that asks the example query
      And a handler registered for the example query that answers "found"
      When the example command is sent
      Then the command and the query ran on the same connection

    Scenario: A query asked inside a command sees what the command has written
      Given the mediator's commands run in a transaction
      And a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the command's handler asks the example query once it has written the note
      And a handler registered for the example query that looks for the note
      When the example command is sent
      Then the query found the note

    Scenario: The command carries on once the query it asked has answered
      Given the mediator's commands run in a transaction
      And a place to keep notes
      And a handler registered for the example command that asks the example query
      And a handler registered for the example query that answers "found"
      And the command's handler writes the note "opened" once the query has answered
      When the example command is sent
      Then the note "opened" is there

    Scenario: A query answering inside a command commits nothing
      Given the mediator's commands run in a transaction
      And a place to keep notes
      And a handler registered for the example command that writes the note "opened"
      And the command's handler asks the example query once it has written the note
      And a handler registered for the example query that answers "found"
      And the command's handler fails once the query has answered
      When the example command is sent
      Then no notes are there

  Rule: The transaction is ended and the connection given back when the query has finished

    A connection still held after the query that borrowed it has answered is one
    the next request cannot have. A connection given back with a transaction
    still open on it is worse: it is handed to the next request holding a
    snapshot from somebody else's, and Postgres keeps everything that snapshot
    can see for as long as it is there.

    Scenario: The connection is given back when the query answers
      Given a handler registered for the example query that answers "found"
      When the example query is asked
      Then every connection has been given back

    Scenario: The connection is given back when the query fails
      Given a handler registered for the example query that fails
      When the example query is asked
      Then every connection has been given back

    Scenario: No transaction is left open on a connection that was given back
      Given a handler registered for the example query that answers "found"
      When the example query is asked
      Then no connection is left in a transaction

    Scenario: Asking for a connection once the query has answered is refused
      Given a handler registered for the example query that answers "found"
      When the example query is asked
      And the connection is asked for
      Then asking is refused with "UnitOfWork.NothingUnderway"

  Rule: Two queries at once are two transactions

    Scenario: Two queries asked at the same time run on connections of their own
      Given a handler registered for the example query that waits until both queries have a connection
      When two example queries are asked at the same time
      Then the two queries ran on different connections
