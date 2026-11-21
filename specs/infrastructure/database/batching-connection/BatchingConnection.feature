@postgres
Feature: Writes made while batching are sent together

  Making the read models again is millions of writes, one after another, and
  what each costs is not the writing but the asking: a round trip to the
  database for every statement, when the database has nothing to wait for. So
  while a unit of work is told to batch, a write that has nothing to say in
  answer is kept back and sent with the writes that follow it as one message,
  and the work goes on as if each had been sent.

  Nothing is reordered for it. A statement that reads, or that answers with
  rows, sends everything kept back first, so it finds what was written before
  it as it would have if each write had been sent when it was made. What was
  kept back is sent before the work is finished, and so before it is committed;
  a write that fails fails the work, which is rolled back as any is, though it
  is said later than the call that made it.

  A write is sent with what it was given written into it, since the message is
  one string and carries no values beside it. So what a value says is written
  as what it is: a quotation mark, a backslash and a dollar sign in a name are
  a name, and not part of the statement.

  These scenarios run against Postgres, since what is sent and what is found
  is the whole of what is worth knowing here.

  Background:
    Given a place to keep values
    And a unit of work that counts what it sends

  Rule: Writes are kept back and sent together

    Scenario: Ten writes are sent as one
      When 10 values are written while batching
      Then 1 statement was sent for them

    Scenario: Writes that are not batched are sent one at a time
      When 10 values are written without batching
      Then 10 statements were sent for them

    Scenario: A great many are sent in several, not held without end
      When 2500 values are written while batching
      Then 3 statements were sent for them

    Scenario: What was kept back is there once the work is done
      When 10 values are written while batching
      Then 10 values are kept

  Rule: A read finds what was written before it

    Scenario: A read sends what was kept back first
      When the value "first" is written while batching
      And the values are read while batching
      Then the values read are "first"

    Scenario: A write that answers with rows is answered at once
      When the value "first" is written, answering with its place, while batching
      Then the place answered is 1

    Scenario: An update finds the row an insert before it made
      When the value "first" is written while batching
      And the value "first" is changed to "second" while batching
      Then the values kept are "second"

    Scenario: Whatever order it is written in is the order it is kept in
      When the value "first" is written while batching
      And the value "first" is deleted while batching
      And the value "first" is written while batching
      Then the values kept are "first"

  Rule: What is written is as it was given

    Scenario: Text with a quotation mark
      When the text "it's" is written while batching
      Then the text kept is "it's"

    Scenario: Text with a backslash
      When the text "a\b" is written while batching
      Then the text kept is "a\b"

    Scenario: Text that looks like a place for a value
      When the text "costs $1 or $2" is written while batching
      Then the text kept is "costs $1 or $2"

    Scenario: Text with a line break
      When the text with a line break is written while batching
      Then the text kept has a line break

    Scenario: Nothing
      When no text is written while batching
      Then no text is kept

    Scenario: A number
      When the number 42 is written while batching
      Then the number kept is 42

    Scenario: A moment
      When the moment "2026-09-26T10:00:00.123Z" is written while batching
      Then the moment kept is "2026-09-26T10:00:00.123Z"

    Scenario: A list
      When the list 1, 2, 3 is written while batching
      Then the list kept is 1, 2, 3

    Scenario: A list of text with a quotation mark and a comma
      When the list of text "a, b" and "c\"d" is written while batching
      Then the list of text kept is "a, b" and "c\"d"

    Scenario: Something with parts
      When the object with the part "x" being 7 is written while batching
      Then the object kept has the part "x" being 7

    Scenario: A value used twice in a statement
      When the value "twice" is written as both its name and its text while batching
      Then the values kept are "twice"

  Rule: A write that fails fails the work

    Scenario: A write that breaks a rule fails the work
      When the value "first" is written while batching
      And the value "first" is written again while batching
      Then the work failed

    Scenario: What the work did is rolled back
      When the value "first" is written while batching
      And the value "first" is written again while batching
      Then no value is kept

  Rule: A write that must change one row says when it does not

    Scenario: A write that changes one row is let by
      When the value "first" is written while batching
      And the value "first" is changed to "second" expecting one row while batching
      Then the work did not fail

    Scenario: A write that changes none fails the work
      When the value "first" is changed to "second" expecting one row while batching
      Then the work failed with "there was no row"

    Scenario: A write that changes none fails at once when it is not batched
      When the value "first" is changed to "second" expecting one row without batching
      Then the work failed with "there was no row"
