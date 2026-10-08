@browser @postgres
Feature: The page where an administrator reads what the import said of one document

  The page at /admin/administrator/import-errors/{document id} is one of the
  administrator's pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`), with Import Errors marked as the section
  being read. It is where a row of the list of documents the import refused
  leads (`importErrors.feature`).

  It shows the document's id, and the full message the import kept against it
  (`ImportErrorKept.feature`), every line as it was kept and with the lines
  kept apart, since a message is often a stack of them. Where more than one
  message was kept against the document, each is shown, in the order they were
  kept. A message is shown as text and never as a page: it was written by the
  code that failed, and may well hold what looks like markup.

  A document id nothing was kept against says the document is not found,
  rather than showing an empty page.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page shows the document's id and its whole message

    Scenario: The page shows the document's id
      Given the import refused the document "users/1-A" with "No email address"
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the document id shown is "users/1-A"

    Scenario: The page shows the first line of the message
      Given the import refused the document "users/1-A" with "No email address" then "at line 4"
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the message's first line is "No email address"

    Scenario: The page shows the later lines of the message
      Given the import refused the document "users/1-A" with "No email address" then "at line 4"
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the message's second line is "at line 4"

    Scenario: A message that looks like markup is shown as it was written
      Given the import refused the document "users/1-A" with "<b>No</b> email address"
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the message's first line is "<b>No</b> email address"

    Scenario: A second message kept against the document is shown
      Given the import refused the document "users/1-A" with "No email address"
      And the import refused the document "users/1-A" with "Bad date"
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the second message's first line is "Bad date"

  Rule: A document nothing was kept against is not found

    Scenario: The page says the document is not found
      When the page at "/admin/administrator/import-errors/users%2F9-A" is opened
      Then the page says the document is not found

  Rule: The page is in the reader's language

    Scenario: The heading is in the reader's language
      Given the import refused the document "users/1-A" with "No email address"
      And a browser that asks for "en-XA"
      When the page at "/admin/administrator/import-errors/users%2F1-A" is opened
      Then the page's heading is in the test locale
