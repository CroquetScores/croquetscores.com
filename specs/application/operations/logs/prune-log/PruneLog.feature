@postgres
Feature: An administrator removes the recent log early

  The log kept in the database is removed after seven days of itself
  (`PostgresServerLog.feature`). An administrator can remove it sooner when
  what is there is noise they have finished with, such as the lines written
  while they were looking for something. Pruning removes every entry written
  more than an hour ago, and leaves the last hour, which is what is still
  being written and what a reader who has only just met an error is about to
  be looked up by.

  The hour is counted back from the moment the administrator asks, by the
  site's clock, and an entry of exactly an hour old is kept.

  The answer says how many entries were removed, so that the page can say so,
  and nothing was lost without being told of.

  Only an administrator can ask: anybody else is refused with
  `Account.NotAnAdministrator`, and nothing is removed.

  Background:
    Given the application's server log
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"

  Rule: Entries written more than an hour ago are removed

    Scenario: An entry from before the hour is removed
      Given an entry written at "2026-10-09T08:59:00Z" saying "Old"
      When the reader signed in to the account for "admin@example.com" prunes the log
      Then no entry says "Old"

    Scenario: An entry of exactly an hour old is kept
      Given an entry written at "2026-10-09T09:00:00Z" saying "Edge"
      When the reader signed in to the account for "admin@example.com" prunes the log
      Then an entry says "Edge"

    Scenario: An entry from within the hour is kept
      Given an entry written at "2026-10-09T09:30:00Z" saying "Recent"
      When the reader signed in to the account for "admin@example.com" prunes the log
      Then an entry says "Recent"

    Scenario: The number removed is answered
      Given an entry written at "2026-10-09T07:00:00Z" saying "Old"
      And an entry written at "2026-10-09T08:00:00Z" saying "Older"
      And an entry written at "2026-10-09T09:30:00Z" saying "Recent"
      When the reader signed in to the account for "admin@example.com" prunes the log
      Then 2 entries are answered as removed

    Scenario: Pruning a log with nothing to remove answers none
      Given an entry written at "2026-10-09T09:30:00Z" saying "Recent"
      When the reader signed in to the account for "admin@example.com" prunes the log
      Then 0 entries are answered as removed

  Rule: Only an administrator can prune

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" prunes the log
      Then pruning the log is refused with "Account.NotAnAdministrator"

    Scenario: A reader who is refused removes nothing
      Given an entry written at "2026-10-09T08:00:00Z" saying "Old"
      When the reader signed in to the account for "someone@example.com" prunes the log
      Then an entry says "Old"
