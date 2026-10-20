@postgres
Feature: The server's log, as an administrator reads it

  An administrator reads the server's log (`logs.feature`) to find out what
  went wrong, usually for a reader who was shown a reference on an error
  page. The application answers with the entries kept (`PostgresServerLog.feature`),
  newest first, the newest 200 at most, so that a log of a busy week is not
  sent whole to a phone.

  The entries can be narrowed in two ways, which apply together: to those at
  a severity or more severe, and to those that mention some text, wherever
  they do, in what they say or in what else they carried. Asked for no
  severity, every entry is answered, and asked for no text, none is left
  out for lacking it.

  A severity that is not one the log writes in is refused as
  `LogEntries.UnknownSeverity`, rather than answered as though nothing had
  been asked for, which would quietly show more than was meant.

  Only an administrator can ask: anybody else is refused with
  `Account.NotAnAdministrator`.

  Background:
    Given the application's server log
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"

  Rule: The entries are answered newest first

    Scenario: The newest entry is answered first
      Given an entry written at "2026-10-09T09:00:00Z" saying "Earlier"
      And an entry written at "2026-10-09T09:30:00Z" saying "Later"
      When the reader signed in to the account for "admin@example.com" reads the log
      Then the first entry answered says "Later"

    Scenario: An entry is answered with when it was written
      Given an entry written at "2026-10-09T09:00:00Z" saying "Earlier"
      When the reader signed in to the account for "admin@example.com" reads the log
      Then the first entry answered was written at "2026-10-09T09:00:00Z"

    Scenario: An entry is answered with how severe it was
      Given an entry written at "2026-10-09T09:00:00Z" saying "Broken" at the severity Error
      When the reader signed in to the account for "admin@example.com" reads the log
      Then the first entry answered has the severity Error

    Scenario: Nothing kept answers no entries
      When the reader signed in to the account for "admin@example.com" reads the log
      Then 0 entries are answered

    Scenario: No more than 200 entries are answered
      Given 201 entries written at "2026-10-09T09:00:00Z"
      When the reader signed in to the account for "admin@example.com" reads the log
      Then 200 entries are answered

  Rule: The entries can be narrowed to a severity and more severe

    Scenario: An entry less severe is left out
      Given an entry written at "2026-10-09T09:00:00Z" saying "Chatter" at the severity Debug
      When the reader signed in to the account for "admin@example.com" reads the log from the severity Info
      Then 0 entries are answered

    Scenario: An entry of that severity is answered
      Given an entry written at "2026-10-09T09:00:00Z" saying "Notice" at the severity Info
      When the reader signed in to the account for "admin@example.com" reads the log from the severity Info
      Then 1 entry is answered

    Scenario: An entry more severe is answered
      Given an entry written at "2026-10-09T09:00:00Z" saying "Broken" at the severity Fatal
      When the reader signed in to the account for "admin@example.com" reads the log from the severity Error
      Then 1 entry is answered

    Scenario: Asked for no severity, every entry is answered
      Given an entry written at "2026-10-09T09:00:00Z" saying "Chatter" at the severity Trace
      When the reader signed in to the account for "admin@example.com" reads the log
      Then 1 entry is answered

    Scenario: A severity the log does not write in is refused
      When the reader signed in to the account for "admin@example.com" reads the log from the severity "Loud"
      Then reading the log is refused with "LogEntries.UnknownSeverity"

  Rule: The entries can be narrowed to those that mention some text

    Scenario: An entry that mentions the text is answered
      Given an entry written at "2026-10-09T09:00:00Z" saying "Payment refused"
      And an entry written at "2026-10-09T09:01:00Z" saying "Server listening"
      When the reader signed in to the account for "admin@example.com" reads the log mentioning "refused"
      Then 1 entry is answered

    Scenario: An entry that carried a reference is answered for it
      Given an entry written at "2026-10-09T09:00:00Z" saying "Unhandled error" with the reference "9f1c"
      When the reader signed in to the account for "admin@example.com" reads the log mentioning "9f1c"
      Then 1 entry is answered

    Scenario: Asked for no text, every entry is answered
      Given an entry written at "2026-10-09T09:00:00Z" saying "Server listening"
      When the reader signed in to the account for "admin@example.com" reads the log mentioning ""
      Then 1 entry is answered

    Scenario: Text of only spaces asks for none
      Given an entry written at "2026-10-09T09:00:00Z" saying "Server listening"
      When the reader signed in to the account for "admin@example.com" reads the log mentioning "   "
      Then 1 entry is answered

    Scenario: Spaces round the text are not looked for
      Given an entry written at "2026-10-09T09:00:00Z" saying "Payment refused"
      When the reader signed in to the account for "admin@example.com" reads the log mentioning "  refused  "
      Then 1 entry is answered

  Rule: Only an administrator can ask

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" reads the log
      Then reading the log is refused with "Account.NotAnAdministrator"
