Feature: Database access is switched in a file the site can read without the database

  Whether the site may use its database cannot be kept in the database: it is
  the one thing that must be known when the database is not to be asked. It is
  kept in a file, whose path is configured (`DATABASE_ACCESS_FILE`, `.database-
  access` beside the site where nobody has said otherwise), so that a script
  can write it and a running site can read it with no more than the
  filesystem between them.

  A path that is not absolute is the site's own folder's, whichever folder the
  site and the script are run from, since a site started by a service manager
  and a script run by a person are not run from the same one, and a switch each
  wrote to its own would never be seen by the other.

  The file holds when access was turned off and when it is expected back, and
  does not exist while access is on. It is the moment that is kept and not the
  minutes it was said in, so that the expected return can be moved from now,
  as often as it is found to be wrong, without anyone adding up what was said
  before. Reading is asked of every request, so it is
  made cheap: the file is read at most once in a second, and the second is the
  most a reader can be told a stale answer for.

  A file that cannot be read as what it should be is access on. A switch that
  failed shut would take the site down for a typing mistake in a file nobody
  is watching, and a site that is down on purpose is one somebody is watching:
  they will see it is still answering and fix the file. Whatever the file said
  is logged as a fault, so that it is seen.

  The file may also hold words for readers, which the site says in place of
  its usual sentence that it is down for maintenance (`maintenance.feature`).
  They are kept with the moments and not apart from them, so that they are
  replaced whole with the rest when access is turned off again, and are kept
  as they were when only the return is moved. They are optional, and are kept
  to 500 characters because they are put on every page the site answers.

  Turning access off writes the file whole and then moves it into place, so
  that a site reading it while it is written reads the old one or the new one
  and never half of either.

  Background:
    Given a database access file that does not exist

  Rule: Access is on where there is no file

    Scenario: No file is access on
      When database access is read
      Then database access is on

  Rule: Turning access off keeps the moment it was turned off and when it is expected back

    Scenario: Access is off once turned off
      Given the moment "2026-10-13T10:00:00Z"
      When database access is turned off for 30 minutes
      And database access is read
      Then database access is off

    Scenario: The return is the minutes from the moment it was turned off
      Given the moment "2026-10-13T10:00:00Z"
      When database access is turned off for 30 minutes
      And database access is read
      Then access is expected back at "2026-10-13T10:30:00Z"

    Scenario: The moment it was turned off is kept
      Given the moment "2026-10-13T10:00:00Z"
      When database access is turned off for 30 minutes
      And database access is read
      Then access was turned off at "2026-10-13T10:00:00Z"

    Scenario: Turning it off again replaces the return
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      When database access is turned off for 90 minutes
      And database access is read
      Then access is expected back at "2026-10-13T11:30:00Z"

    Scenario: Turning it off again replaces the moment
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      When database access is turned off for 90 minutes
      And database access is read
      Then access was turned off at "2026-10-13T10:20:00Z"

  Rule: The minutes are a whole number from 1 to 1440

    Scenario Outline: Minutes of an allowed number are accepted
      When database access is turned off for <minutes> minutes
      Then it is not refused

      Examples:
        | minutes |
        | 1       |
        | 1440    |

    Scenario Outline: Minutes outside what is allowed are refused
      When database access is turned off for <minutes> minutes
      Then it is refused with "DatabaseAccess.MinutesOutOfRange"

      Examples:
        | minutes |
        | 0       |
        | -5      |
        | 1441    |

    Scenario: Minutes that are not whole are refused
      When database access is turned off for 2.5 minutes
      Then it is refused with "DatabaseAccess.MinutesNotWhole"

    Scenario: Nothing is kept when it is refused
      When database access is turned off for 0 minutes
      And database access is read
      Then database access is on

  Rule: Turning access off can be refused where it is off already

    Somebody else's maintenance is not to be ended by one that began after it
    and finished first, so a stretch of maintenance that is begun asks for
    access to be turned off only where it is on. It is asked of the file and
    not of what was read a moment ago, and decided in one step, so that two
    that begin at once are not both let.

    Scenario: Access is turned off where it is on
      When database access is turned off for 30 minutes unless it is off already
      And database access is read
      Then database access is off

    Scenario: Access is refused where it is off
      Given database access is turned off for 30 minutes
      When database access is turned off for 90 minutes unless it is off already
      Then it is refused with "DatabaseAccess.AlreadyOff"

    Scenario: What was there is left as it was
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      When database access is turned off for 90 minutes unless it is off already
      And database access is read
      Then access is expected back at "2026-10-13T10:30:00Z"

    Scenario: Two that begin at once are not both let
      When database access is turned off for 30 and for 90 minutes at once unless it is off already
      Then one of the two is refused with "DatabaseAccess.AlreadyOff"

    Scenario: Minutes outside what is allowed are refused as they are elsewhere
      When database access is turned off for 0 minutes unless it is off already
      Then it is refused with "DatabaseAccess.MinutesOutOfRange"

  Rule: The expected return can be moved from now, as often as it is wrong

    Moving it is not turning access off again: the moment it was turned off is
    kept. The minutes are counted from the moment it is moved, since that is
    when whoever moves it knows what they know, and moving it again counts
    from then.

    Scenario: The return is moved to the minutes from now
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      When the expected return is moved to 45 minutes from now
      And database access is read
      Then access is expected back at "2026-10-13T11:05:00Z"

    Scenario: The moment it was turned off is kept
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      When the expected return is moved to 45 minutes from now
      And database access is read
      Then access was turned off at "2026-10-13T10:00:00Z"

    Scenario: Access is still off
      Given database access is turned off for 30 minutes
      When the expected return is moved to 45 minutes from now
      And database access is read
      Then database access is off

    Scenario: It can be moved after the first estimate has passed
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:40:00Z"
      When the expected return is moved to 15 minutes from now
      And database access is read
      Then access is expected back at "2026-10-13T10:55:00Z"

    Scenario: It can be moved as often as it is wrong
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      And the expected return is moved to 45 minutes from now
      And the moment "2026-10-13T10:50:00Z"
      When the expected return is moved to 10 minutes from now
      And database access is read
      Then access is expected back at "2026-10-13T11:00:00Z"

    Scenario: Moving it again counts from the moment it is moved, not from the return before
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:20:00Z"
      And the expected return is moved to 45 minutes from now
      And the moment "2026-10-13T11:00:00Z"
      When the expected return is moved to 10 minutes from now
      And database access is read
      Then access is expected back at "2026-10-13T11:10:00Z"

    Scenario: Moving it where access is on is refused
      When the expected return is moved to 45 minutes from now
      Then it is refused with "DatabaseAccess.NotOff"

    Scenario: Moving it where access is on keeps access on
      When the expected return is moved to 45 minutes from now
      And database access is read
      Then database access is on

    Scenario Outline: Minutes outside what is allowed are refused
      Given database access is turned off for 30 minutes
      When the expected return is moved to <minutes> minutes from now
      Then it is refused with "DatabaseAccess.MinutesOutOfRange"

      Examples:
        | minutes |
        | 0       |
        | 1441    |

    Scenario: Refused minutes change nothing
      Given the moment "2026-10-13T10:00:00Z"
      And database access is turned off for 30 minutes
      When the expected return is moved to 0 minutes from now
      And database access is read
      Then access is expected back at "2026-10-13T10:30:00Z"

  Rule: Words for readers are kept with the switch

    Scenario: Words given with the minutes are kept
      When database access is turned off for 30 minutes with the words "Back after the move"
      And database access is read
      Then readers are told "Back after the move"

    Scenario: No words are the usual sentence
      When database access is turned off for 30 minutes
      And database access is read
      Then readers are told the usual sentence

    Scenario: Words of nothing but spaces are the usual sentence
      When database access is turned off for 30 minutes with the words "   "
      And database access is read
      Then readers are told the usual sentence

    Scenario: Words are kept without the spaces around them
      When database access is turned off for 30 minutes with the words "  Back soon  "
      And database access is read
      Then readers are told "Back soon"

    Scenario: Turning access off again replaces the words
      Given database access is turned off for 30 minutes with the words "Back soon"
      When database access is turned off for 30 minutes
      And database access is read
      Then readers are told the usual sentence

    Scenario: Moving the return keeps the words
      Given database access is turned off for 30 minutes with the words "Back soon"
      When the expected return is moved to 45 minutes from now
      And database access is read
      Then readers are told "Back soon"

    Scenario: Moving the return with words replaces them
      Given database access is turned off for 30 minutes with the words "Back soon"
      When the expected return is moved to 45 minutes from now with the words "Back later"
      And database access is read
      Then readers are told "Back later"

    Scenario: Moving the return with empty words takes them away
      Given database access is turned off for 30 minutes with the words "Back soon"
      When the expected return is moved to 45 minutes from now with the words ""
      And database access is read
      Then readers are told the usual sentence

    Scenario: The most words allowed are accepted
      When database access is turned off for 30 minutes with 500 characters of words
      Then it is not refused

    Scenario: More words than allowed are refused
      When database access is turned off for 30 minutes with 501 characters of words
      Then it is refused with "DatabaseAccess.WordsTooLong"

    Scenario: Refused words change nothing
      When database access is turned off for 30 minutes with 501 characters of words
      And database access is read
      Then database access is on

    Scenario: A file whose words are not text is access on
      Given a database access file holding words that are not text
      When database access is read
      Then database access is on

    Scenario: A file whose words are not text is logged as a fault
      Given a database access file holding words that are not text
      When database access is read
      Then a fault is logged

  Rule: Turning access on removes the file

    Scenario: Access is on once turned on
      Given database access is turned off for 30 minutes
      When database access is turned on
      And database access is read
      Then database access is on

    Scenario: Turning on with access on changes nothing
      When database access is turned on
      Then it is not refused

  Rule: A file that cannot be read is access on

    Scenario: A file of nonsense is access on
      Given a database access file holding "not what it should be"
      When database access is read
      Then database access is on

    Scenario: A file of nonsense is logged as a fault
      Given a database access file holding "not what it should be"
      When database access is read
      Then a fault is logged

    Scenario: A file with no minutes is access on
      Given a database access file holding no minutes
      When database access is read
      Then database access is on

    Scenario: An empty file is access on
      Given a database access file holding ""
      When database access is read
      Then database access is on

  Rule: A reading begun before a change does not outlast it

    Scenario: A reading begun before access is turned on does not say it is off
      Given database access is turned off for 30 minutes
      And a reading of the file is held after it has read it
      When database access is turned on through the switch that is reading
      And the held reading is let go
      And database access is read
      Then database access is on

    Scenario: A reading begun before access is turned off does not say it is on
      Given a reading of the file is held after it has read it
      When database access is turned off through the switch that is reading
      And the held reading is let go
      And database access is read
      Then database access is off

  Rule: A fault in the file is logged once and not at every reading

    Scenario: The same fault read again in a later second is logged once
      Given the moment "2026-10-13T10:00:00Z"
      And a database access file holding "not what it should be"
      And database access is read
      And the moment "2026-10-13T10:00:05Z"
      When database access is read
      Then 1 fault is logged

    Scenario: A fault that is mended and happens again is logged again
      Given the moment "2026-10-13T10:00:00Z"
      And a database access file holding "not what it should be"
      And database access is read
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:00:05Z"
      And database access is read
      And the database access file is made to hold "not what it should be again"
      And the moment "2026-10-13T10:00:10Z"
      When database access is read
      Then 2 faults are logged

  Rule: The file is read once in a second at most

    Scenario: A change is seen within a second
      Given the moment "2026-10-13T10:00:00Z"
      And database access is read
      And database access is turned off for 30 minutes
      And the moment "2026-10-13T10:00:01Z"
      When database access is read
      Then database access is off

    Scenario: The file is not read twice in the same second
      Given the moment "2026-10-13T10:00:00Z"
      And database access is read
      When database access is read
      Then the file was read once
