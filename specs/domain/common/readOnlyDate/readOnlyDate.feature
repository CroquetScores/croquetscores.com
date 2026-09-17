Feature: A moment that cannot be moved once it is known

  The language's own date can be moved after it is made: anything holding one
  can set it to another time, and everything else holding the same one sees
  the change. An event stamped with such a date could be re-stamped by
  whatever happened to hold it, and there would be nothing to say it had been.

  A read-only date is a moment and nothing more. It is made from a date, and
  from then on nothing can move it: not the date it was made from, and not
  anything it hands back.

  It is written in UTC and to the millisecond, as 2026-09-17T09:00:00.000Z, so
  the same moment is written the same way wherever it was made and whatever the
  machine's clock is set to.

  Rule: A read-only date is the moment it was made from

    Scenario: It says the moment it was made from
      Given the moment "2026-09-17T09:00:00Z"
      When a read-only date is made from it
      Then the read-only date says "2026-09-17T09:00:00.000Z"

    Scenario: It says the moment in UTC whatever offset it was given in
      Given the moment "2026-09-17T19:00:00+10:00"
      When a read-only date is made from it
      Then the read-only date says "2026-09-17T09:00:00.000Z"

    Scenario: A moment that cannot be read is refused
      Given a moment that cannot be read
      When a read-only date is made from it
      Then it is refused for breaking "ReadOnlyDate.Unreadable"

  Rule: Nothing moves a read-only date once it is made

    Scenario: Moving the date it was made from moves nothing
      Given the moment "2026-09-17T09:00:00Z"
      And a read-only date made from it
      When the moment is moved to "2027-01-01T00:00:00Z"
      Then the read-only date still says "2026-09-17T09:00:00.000Z"

    Scenario: Moving the date it hands back moves nothing
      Given the moment "2026-09-17T09:00:00Z"
      And a read-only date made from it
      When the date it hands back is moved to "2027-01-01T00:00:00Z"
      Then the read-only date still says "2026-09-17T09:00:00.000Z"

  Rule: A moment written out as data is still the moment

    The instant is held where nothing outside can reach it, which is what stops
    it being moved and would also stop it being written: anything writing one
    out as data would keep an empty object where a moment was, and nothing
    would say so until something tried to read it back. So it says what to
    write, as the language's own date does.

    Scenario: A moment written as data is the moment in UTC
      Given the moment "2026-09-17T19:00:00+10:00"
      And a read-only date made from it
      When the read-only date is written down as data
      Then what was written as data is "2026-09-17T09:00:00.000Z"

  Rule: Two read-only dates of the same moment are the same

    Scenario: Two read-only dates of one moment are the same
      Given the moment "2026-09-17T09:00:00Z"
      And a read-only date made from it
      And another read-only date made from it
      Then the two read-only dates are the same

    Scenario: Two read-only dates of different moments differ
      Given the moment "2026-09-17T09:00:00Z"
      And a read-only date made from it
      And another read-only date made from "2026-09-17T09:00:01Z"
      Then the two read-only dates differ
