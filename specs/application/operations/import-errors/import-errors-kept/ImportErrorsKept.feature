@postgres
Feature: The documents the import refused, as an administrator lists them

  The import from the old sites keeps a document it refused, with why
  (`ImportDatabase.feature`). An administrator lists them to see what was
  left behind (`importErrors.feature`), so the application answers with a row
  for each error kept, which is the document's id and the first line of the
  error's message. The whole message is for the page of the one document
  (`ImportErrorKept.feature`): a message runs to many lines, and a list of
  them would be read down for its first.

  The rows are answered in alphabetical order of that first line, so that
  documents refused for the same reason are together. Rows with the same first
  line are answered by their document ids, so that the order is the same every
  time it is asked for.

  The errors are kept in a table of Postgres's own, which the site makes with
  its other tables, so that a site the import has never run on answers none
  rather than failing.

  Only an administrator can ask: anybody else is refused with
  `Account.NotAnAdministrator`.

  Background:
    Given the application's import errors
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"

  Rule: A row is answered for each error kept

    Scenario: An error kept is answered with its document's id
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered is for the document "users/1-A"

    Scenario: An error kept is answered with its message
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered has the first line "No email address"

    Scenario: Two errors kept are two rows
      Given the import refused the document "users/1-A" with "No email address"
      And the import refused the document "users/2-A" with "No name"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then 2 rows are answered

    Scenario: Nothing kept answers no rows
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then 0 rows are answered

  Rule: Only the first line of a message is answered

    Scenario: A message of many lines is answered by its first
      Given the import refused the document "users/1-A" with "No email address" then "at line 4" then "at line 9"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered has the first line "No email address"

    Scenario: A message of one line is answered whole
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered has the first line "No email address"

    Scenario: A message that begins with a line break is answered by its first line, which is empty
      Given the import refused the document "users/1-A" with "" then "at line 4"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered has the first line ""

    Scenario: A message written with Windows line endings is answered without the carriage return
      Given the import refused the document "users/1-A" with "No email address" then "at line 4" written with Windows line endings
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered has the first line "No email address"

  Rule: The rows are answered in alphabetical order of the first line

    Scenario: The rows are answered by their first lines
      Given the import refused the document "users/1-A" with "No name"
      And the import refused the document "users/2-A" with "Bad date"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered is for the document "users/2-A"

    Scenario: A second line does not change the order
      Given the import refused the document "users/1-A" with "Bad date" then "zzz"
      And the import refused the document "users/2-A" with "Bad date" then "aaa"
      And the import refused the document "users/3-A" with "A different reason"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered is for the document "users/3-A"

    Scenario: Rows with the same first line are answered by their document ids
      Given the import refused the document "users/2-A" with "Bad date"
      And the import refused the document "users/1-A" with "Bad date"
      When the reader signed in to the account for "admin@example.com" lists the import errors
      Then the first row answered is for the document "users/1-A"

  Rule: Only an administrator can ask

    Scenario: A reader who is not an administrator is refused
      When the reader signed in to the account for "someone@example.com" lists the import errors
      Then listing the import errors is refused with "Account.NotAnAdministrator"
