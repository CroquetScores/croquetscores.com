@postgres
Feature: The server's log, kept in the database for an administrator to read

  The server writes a log, and it goes on being written where it always has
  been, a file that whoever looks after the machine reads. This is a second
  copy of it, kept in the database so that an administrator can read it at
  /admin/administrator/logs (`logs.feature`) without being on the machine.
  The file is the log and this is a convenience, so nothing here may change
  what the file holds, or stop the server when the database cannot be
  written to.

  An entry is kept with when it was written, how severe it is, what it says,
  and everything else the line carried, such as the request it was written
  for and the reference a reader was shown on an error page. The severities
  are the ones the log writes in: Trace, Debug, Info, Warn, Error and Fatal,
  in that order, each more severe than the one before.

  Entries are kept for seven days and then removed (`PruneLog.feature` is how
  an administrator removes them sooner). They are removed as entries are
  written, at most once an hour, so that nothing has to be running only to
  remove them and a server that writes nothing has nothing to remove.

  Background:
    Given a migrated database
    And a server log kept in the database
    And the moment "2026-10-09T10:00:00Z"

  Rule: A line of the log is kept as an entry

    Scenario: A line is kept
      When the server logs "Server listening" at the severity Info
      And the log is flushed
      Then 1 entry is kept

    Scenario: An entry keeps what the line said
      When the server logs "Server listening" at the severity Info
      And the log is flushed
      Then the newest entry says "Server listening"

    Scenario: An entry keeps how severe the line was
      When the server logs "Disk nearly full" at the severity Warn
      And the log is flushed
      Then the newest entry has the severity Warn

    Scenario: An entry keeps when the line was written
      When the server logs "Server listening" at the severity Info
      And the log is flushed
      Then the newest entry was written at "2026-10-09T10:00:00Z"

    Scenario: An entry keeps the rest of what the line carried
      When the server logs "Unhandled error" at the severity Error with the reference "9f1c"
      And the log is flushed
      Then the newest entry carries the reference "9f1c"

    Scenario: Lines are kept in the order they were written
      When the server logs "First" at the severity Info
      And the server logs "Second" at the severity Info
      And the log is flushed
      Then the newest entry says "Second"

    Scenario: A backslash and the characters u0000 in a line are kept as written
      When the server logs "Path" at the severity Info with the reference "C:\u0000"
      And the log is flushed
      Then the newest entry carries the reference "C:\u0000"

    Scenario: A null character in a line is left out, and the line is kept
      When the server logs "Path" at the severity Info with a null character in its reference
      And the log is flushed
      Then the newest entry carries the reference "ab"

    Scenario: A line that is not a log line is kept as it is
      When the server writes "not a log line at all" to its log
      And the log is flushed
      Then the newest entry says "not a log line at all"

  Rule: A link a reader was sent is not kept

    A link in an email carries a signature that lets whoever holds it set a
    password or confirm an address. The log file already holds the addresses
    requests were made to, but the file is read on the machine, and this copy
    is read on a page, so what in an address would let somebody act as a reader
    is left out of it. The rest of the address is kept, so that a request is
    still found by what else it carried.

    Scenario: The link in an address is left out
      When the server logs "incoming request" at the severity Info for the address "/set-new-password?link=abc.def&request=r1"
      And the log is flushed
      Then the newest entry's address is "/set-new-password?link=[removed]&request=r1"

    Scenario: The link is left out when it is the last thing in the address
      When the server logs "incoming request" at the severity Info for the address "/confirm?request=r1&link=abc.def"
      And the log is flushed
      Then the newest entry's address is "/confirm?request=r1&link=[removed]"

    Scenario: An address with no link is kept as it is
      When the server logs "incoming request" at the severity Info for the address "/search?q=croquet"
      And the log is flushed
      Then the newest entry's address is "/search?q=croquet"

  Rule: The file is written as it always was

    The log is a stream of lines. This copies it in passing, so what the file
    receives is the stream exactly as it was written, whether or not the
    database is there.

    Scenario: The file receives the line
      When the server logs "Server listening" at the severity Info
      Then the file has received the line as it was written

    Scenario: The file receives the line when the database cannot be written to
      Given the database cannot be written to
      When the server logs "Server listening" at the severity Info
      Then the file has received the line as it was written

  Rule: The database failing does not stop the server

    Scenario: A line that cannot be kept does not raise an error
      Given the database cannot be written to
      When the server logs "Server listening" at the severity Info
      And the log is flushed
      Then no error was raised

    Scenario: A line that cannot be kept is said on standard error
      Given the database cannot be written to
      When the server logs "Server listening" at the severity Info
      And the log is flushed
      Then standard error says the log could not be kept

    Scenario: Writing carries on once the database can be written to again
      Given the database cannot be written to
      And the server logs "Lost" at the severity Info
      And the log is flushed
      And the database can be written to again
      When the server logs "Kept" at the severity Info
      And the log is flushed
      Then the newest entry says "Kept"

  Rule: Many lines waiting are not kept without limit

    A burst of lines, or a database slow to answer, would otherwise grow what
    is waiting without limit. Up to ten thousand lines wait; a line that
    arrives after that is let go, and said once on standard error. It is still
    in the file.

    Scenario: Ten thousand lines are kept
      When the server logs 10000 lines at the severity Info
      And the log is flushed
      Then 10000 entries are kept

    Scenario: A line beyond ten thousand is let go
      When the server logs 10001 lines at the severity Info
      And the log is flushed
      Then 10000 entries are kept

    Scenario: Letting go is said once, however many are let go
      When the server logs 10003 lines at the severity Info
      And the log is flushed
      Then standard error says the log could not be kept

  Rule: An entry is removed after seven days

    Scenario: An entry older than seven days is removed when a line is written
      Given an entry written at "2026-10-02T09:59:00Z" saying "Old"
      And the moment "2026-10-09T10:00:00Z"
      When the server logs "New" at the severity Info
      And the log is flushed
      Then no entry says "Old"

    Scenario: An entry of exactly seven days is kept
      Given an entry written at "2026-10-02T10:00:00Z" saying "Edge"
      And the moment "2026-10-09T10:00:00Z"
      When the server logs "New" at the severity Info
      And the log is flushed
      Then an entry says "Edge"

    Scenario: An entry of less than seven days is kept
      Given an entry written at "2026-10-03T10:00:00Z" saying "Recent"
      And the moment "2026-10-09T10:00:00Z"
      When the server logs "New" at the severity Info
      And the log is flushed
      Then an entry says "Recent"

    Scenario: Entries are removed at most once an hour
      Given an entry written at "2026-10-01T10:00:00Z" saying "Old"
      And the moment "2026-10-09T10:00:00Z"
      And the server logs "First" at the severity Info
      And the log is flushed
      And an entry written at "2026-10-01T10:00:00Z" saying "Older again"
      And the moment "2026-10-09T10:30:00Z"
      When the server logs "Second" at the severity Info
      And the log is flushed
      Then an entry says "Older again"

    Scenario: Entries are removed again after an hour
      Given an entry written at "2026-10-01T10:00:00Z" saying "Old"
      And the moment "2026-10-09T10:00:00Z"
      And the server logs "First" at the severity Info
      And the log is flushed
      And an entry written at "2026-10-01T10:00:00Z" saying "Older again"
      And the moment "2026-10-09T11:00:00Z"
      When the server logs "Second" at the severity Info
      And the log is flushed
      Then no entry says "Older again"

  Rule: Removing old entries that fails is tried again

    Scenario: A line is kept when removing old entries fails
      Given the database cannot remove entries
      When the server logs "First" at the severity Info
      And the log is flushed
      Then an entry says "First"

    Scenario: Removing old entries is tried again at the next line, not an hour later
      Given an entry written at "2026-10-01T10:00:00Z" saying "Old"
      And the database cannot remove entries
      And the server logs "First" at the severity Info
      And the log is flushed
      And the database can be written to again
      And the moment "2026-10-09T10:05:00Z"
      When the server logs "Second" at the severity Info
      And the log is flushed
      Then no entry says "Old"

  Rule: Entries are read back newest first

    Scenario: The newest entry is first
      Given an entry written at "2026-10-09T09:00:00Z" saying "Earlier"
      And an entry written at "2026-10-09T09:30:00Z" saying "Later"
      When the entries are read
      Then the first entry read says "Later"

    Scenario: Entries written at the same moment are read in the order they were kept, newest first
      Given an entry written at "2026-10-09T09:00:00Z" saying "Kept first"
      And an entry written at "2026-10-09T09:00:00Z" saying "Kept second"
      When the entries are read
      Then the first entry read says "Kept second"

    Scenario: No more than the number asked for are read
      Given 5 entries written at "2026-10-09T09:00:00Z"
      When at most 3 entries are read
      Then 3 entries are read

  Rule: Entries are read from a severity upwards

    Scenario: An entry less severe than asked for is not read
      Given an entry written at "2026-10-09T09:00:00Z" saying "Chatter" at the severity Debug
      When the entries are read from the severity Info
      Then no entry is read

    Scenario: An entry of exactly the severity asked for is read
      Given an entry written at "2026-10-09T09:00:00Z" saying "Notice" at the severity Info
      When the entries are read from the severity Info
      Then the first entry read says "Notice"

    Scenario: An entry more severe than asked for is read
      Given an entry written at "2026-10-09T09:00:00Z" saying "Broken" at the severity Error
      When the entries are read from the severity Warn
      Then the first entry read says "Broken"

  Rule: Entries are looked up by text

    The text is looked for in what the entry says and in everything else it
    carried, which is where a reference from an error page is, and the case it
    is written in does not matter.

    Scenario: An entry is found by what it says
      Given an entry written at "2026-10-09T09:00:00Z" saying "Payment refused"
      And an entry written at "2026-10-09T09:01:00Z" saying "Server listening"
      When the entries are looked up for "refused"
      Then 1 entry is read

    Scenario: An entry is found by a reference it carried
      Given an entry written at "2026-10-09T09:00:00Z" saying "Unhandled error" with the reference "9f1c"
      And an entry written at "2026-10-09T09:01:00Z" saying "Unhandled error" with the reference "77aa"
      When the entries are looked up for "9f1c"
      Then 1 entry is read

    Scenario: The case of the text does not matter
      Given an entry written at "2026-10-09T09:00:00Z" saying "Payment Refused"
      When the entries are looked up for "payment refused"
      Then 1 entry is read

    Scenario: Text that finds nothing reads nothing
      Given an entry written at "2026-10-09T09:00:00Z" saying "Server listening"
      When the entries are looked up for "nothing like this"
      Then no entry is read

    Scenario: A percent sign or an underscore in the text is looked for as itself
      Given an entry written at "2026-10-09T09:00:00Z" saying "Disk 90% full"
      And an entry written at "2026-10-09T09:01:00Z" saying "Disk 905 full"
      When the entries are looked up for "90%"
      Then 1 entry is read

    Scenario: Looking up and a severity apply together
      Given an entry written at "2026-10-09T09:00:00Z" saying "Payment refused" at the severity Debug
      And an entry written at "2026-10-09T09:01:00Z" saying "Payment refused" at the severity Error
      When the entries are looked up for "refused" from the severity Warn
      Then 1 entry is read

  Rule: Entries older than a moment are removed on request

    Scenario: An entry older than the moment is removed
      Given an entry written at "2026-10-09T08:00:00Z" saying "Old"
      When the entries older than "2026-10-09T09:00:00Z" are removed
      Then no entry says "Old"

    Scenario: An entry newer than the moment is kept
      Given an entry written at "2026-10-09T09:30:00Z" saying "Recent"
      When the entries older than "2026-10-09T09:00:00Z" are removed
      Then an entry says "Recent"

    Scenario: The number removed is counted
      Given an entry written at "2026-10-09T08:00:00Z" saying "Old"
      And an entry written at "2026-10-09T08:30:00Z" saying "Older"
      And an entry written at "2026-10-09T09:30:00Z" saying "Recent"
      When the entries older than "2026-10-09T09:00:00Z" are removed
      Then 2 entries were removed
