@browser @postgres
Feature: The page where an administrator reads the documents the import refused

  The page at /admin/administrator/import-errors is one of the
  administrator's pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`). It lists the documents the import from
  the old sites refused (`ImportErrorsKept.feature`), so that an administrator
  can see what was left behind and why.

  It is headed Import Errors, and lists a row for each document refused: the
  document's id, what went wrong said for a person where the import said it
  so, and the first line of its first error's message. The rows are in the
  order they are answered in, by the documents' ids. A row leads
  to the page of its document (`importError.feature`). Where nothing was kept,
  the page says there are no import errors rather than showing an empty list.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page lists the documents the import refused

    Scenario: The page is headed by its name
      When the page at "/admin/administrator/import-errors" is opened
      Then the page's heading is "Import Errors"

    Scenario: A row has its document's id
      Given the import refused the document "users/1-A" with "No email address"
      When the page at "/admin/administrator/import-errors" is opened
      Then the first row's document id is "users/1-A"

    Scenario: A row has the first line of its message
      Given the import refused the document "users/1-A" with "No email address" then "at line 4"
      When the page at "/admin/administrator/import-errors" is opened
      Then the first row's message is "No email address"

    Scenario: A row has what went wrong said for a person
      Given the import refused the document "croquetscores.com/blocks/30" with "Refused"
      And the import error of "croquetscores.com/blocks/30" is said for a person as "Game Tim 26 beat Trev 0"
      When the page at "/admin/administrator/import-errors" is opened
      Then the first row is said for a person as "Game Tim 26 beat Trev 0"

    Scenario: A row does not have the later lines of its message
      Given the import refused the document "users/1-A" with "No email address" then "at line 4"
      When the page at "/admin/administrator/import-errors" is opened
      Then the first row's message does not include "at line 4"

    Scenario: The rows are in order of the documents' ids
      Given the import refused the document "users/2-A" with "Bad date"
      And the import refused the document "users/1-A" with "No name"
      When the page at "/admin/administrator/import-errors" is opened
      Then the first row's document id is "users/1-A"

    Scenario: A document refused more than once is one row
      Given the import refused the document "users/1-A" with "No name"
      And the import refused the document "users/1-A" with "Bad date"
      And the import refused the document "users/2-A" with "Bad date"
      When the page at "/admin/administrator/import-errors" is opened
      Then the second row's document id is "users/2-A"

    Scenario: The second row follows the first
      Given the import refused the document "users/2-A" with "Bad date"
      And the import refused the document "users/1-A" with "No name"
      When the page at "/admin/administrator/import-errors" is opened
      Then the second row's document id is "users/2-A"

    Scenario: The page says so where nothing was kept
      When the page at "/admin/administrator/import-errors" is opened
      Then the page says there are no import errors

    Scenario: The page does not say so where something was kept
      Given the import refused the document "users/1-A" with "No email address"
      When the page at "/admin/administrator/import-errors" is opened
      Then the page does not say there are no import errors

  Rule: A row leads to the page of its document

    A document's id has slashes in it, so the address names it with them
    written as the address writes any slash that is part of a name.

    Scenario: A row leads to the page of its document
      Given the import refused the document "users/1-A" with "No email address"
      When the page at "/admin/administrator/import-errors" is opened
      Then the first row leads to "/admin/administrator/import-errors/users%2F1-A"

    Scenario: Pressing a row opens the page of its document
      Given the import refused the document "users/1-A" with "No email address"
      And the page at "/admin/administrator/import-errors" is open
      When the first row is pressed
      Then the address is "/admin/administrator/import-errors/users%2F1-A"

  Rule: The page is in the reader's language

    Scenario: The heading is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/admin/administrator/import-errors" is opened
      Then the page's heading is in the test locale
