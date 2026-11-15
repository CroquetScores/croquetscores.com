@browser @postgres
Feature: The page where an administrator sees and sets the site's database access

  The page at /admin/administrator/database-status is one of the
  administrator's pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`). It does what `npm run db:access` does
  (`databaseAccess.feature`) from the browser: it says whether the site may
  use its database, turns that off for maintenance with the words readers are
  to be told and the minutes expected, moves the expected return, and turns it
  on again.

  The words are what a reader of the site is told while access is off, in
  place of the usual sentence that the site is down for maintenance
  (`maintenance.feature`). They are optional: with none, readers are told the
  usual sentence. They are kept with the switch and not in the database
  (`FileDatabaseAccess.feature`), since the database is what is not being
  used. The minutes are as the script takes them, a whole number from 1 to
  1440, counted from the moment they are given.

  While access is off the site answers every page and every request with the
  page that says so, because nothing is to ask the database. This page is the
  one exception, and so is the answer it asks of the site: an administrator
  who is signed in is let through to them, because otherwise the only way to
  turn access on again would be the script on the machine. Who is signed in
  is the database's to say, so this is the one thing done with the database
  while access is off, and it is done only for these two addresses. Where the
  database cannot say, the page is not let through and the administrator uses
  the script, as they would have to anyway (`maintenance.feature`).

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page says whether database access is on or off

    Scenario: The page is headed by its name
      When the page at "/admin/administrator/database-status" is opened
      Then the page's heading is "Database Access"

    Scenario: The page says access is on
      Given database access is turned on
      When the page at "/admin/administrator/database-status" is opened
      Then the page says database access is on

    Scenario: The page says access is off
      Given database access is turned off for 30 minutes
      When the page at "/admin/administrator/database-status" is opened
      Then the page says database access is off

    Scenario: The page says the minutes expected
      Given database access is turned off for 30 minutes
      When the page at "/admin/administrator/database-status" is opened
      Then the page says 30 minutes are expected

    Scenario: The page says the words readers are told
      Given database access is turned off for 30 minutes with the words "Back after the move to the new server"
      When the page at "/admin/administrator/database-status" is opened
      Then the page says readers are told "Back after the move to the new server"

    Scenario: The page says readers are told the usual sentence where there are no words
      Given database access is turned off for 30 minutes
      When the page at "/admin/administrator/database-status" is opened
      Then the page says readers are told the usual sentence

  Rule: Access is turned off with the minutes expected, and words if wanted

    Scenario: Turning access off needs the minutes
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      When Turn off is pressed
      Then the minutes field says the minutes are needed

    Scenario: Minutes that are not whole are refused beside the field
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "2.5" is typed in the minutes field
      When Turn off is pressed
      Then the minutes field says "DatabaseAccess.MinutesNotWhole"

    Scenario: Minutes beyond the most are refused beside the field
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "1441" is typed in the minutes field
      When Turn off is pressed
      Then the minutes field says "DatabaseAccess.MinutesOutOfRange"

    Scenario: A refusal changes nothing
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "1441" is typed in the minutes field
      And Turn off is pressed
      Then database access is on

    Scenario: Turning access off with the minutes turns it off
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "30" is typed in the minutes field
      When Turn off is pressed
      Then database access is off

    Scenario: The page then says access is off
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "30" is typed in the minutes field
      When Turn off is pressed
      Then the page says database access is off

    Scenario: The minutes are counted from when they are given
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "30" is typed in the minutes field
      When Turn off is pressed
      Then the page says 30 minutes are expected

    Scenario: The words are kept with the switch
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "30" is typed in the minutes field
      And "Back after the move" is typed in the words field
      When Turn off is pressed
      Then readers are told "Back after the move"

    Scenario: Words left empty are not kept
      Given database access is turned on
      And the page at "/admin/administrator/database-status" is opened
      And "30" is typed in the minutes field
      When Turn off is pressed
      Then readers are told the usual sentence

  Rule: The page still works while access is off

    Scenario: An administrator who is signed in is let through
      Given database access is turned off for 30 minutes
      When the page at "/admin/administrator/database-status" is opened
      Then the page's heading is "Database Access"

    Scenario: The expected return is moved to minutes from now
      Given database access is turned off for 30 minutes
      And the page at "/admin/administrator/database-status" is opened
      And "45" is typed in the minutes field
      When Change is pressed
      Then the page says 45 minutes are expected

    Scenario: The words readers are told are changed
      Given database access is turned off for 30 minutes with the words "Back soon"
      And the page at "/admin/administrator/database-status" is opened
      And "Back after the move" is typed in the words field
      When Change is pressed
      Then readers are told "Back after the move"

    Scenario: Changing only the words keeps the minutes expected
      Given database access is turned off for 30 minutes with the words "Back soon"
      And the page at "/admin/administrator/database-status" is opened
      And "Back after the move" is typed in the words field
      When Change is pressed
      Then the page says 30 minutes are expected

    Scenario: Turning access on turns it on
      Given database access is turned off for 30 minutes
      And the page at "/admin/administrator/database-status" is opened
      When Turn on is pressed
      Then database access is on

    Scenario: The page then says access is on
      Given database access is turned off for 30 minutes
      And the page at "/admin/administrator/database-status" is opened
      When Turn on is pressed
      Then the page says database access is on

    Scenario: Turn on is not offered while access is on
      Given database access is turned on
      When the page at "/admin/administrator/database-status" is opened
      Then Turn on is not offered

    Scenario: Change is not offered while access is on
      Given database access is turned on
      When the page at "/admin/administrator/database-status" is opened
      Then Change is not offered

  Rule: Only an administrator is let through while access is off

    Scenario: Somebody who is not an administrator is told the site is down
      Given "someone@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "another horse battery staple"
      And database access is turned off for 30 minutes
      When the page at "/admin/administrator/database-status" is opened
      Then the maintenance page is shown

    Scenario: Somebody who is not signed in is told the site is down
      Given the reader has signed out
      And database access is turned off for 30 minutes
      When the page at "/admin/administrator/database-status" is opened
      Then the maintenance page is shown

    Scenario: An administrator is not let through to any other page
      Given database access is turned off for 30 minutes
      When the page at "/admin/administrator/accounts" is opened
      Then the maintenance page is shown

  Rule: Only an administrator can use the page's answers

    Scenario: Somebody who is not an administrator is refused
      Given "someone@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "another horse battery staple"
      When the database access status is asked for
      Then the answer is refused

    Scenario: Somebody who is not signed in is refused
      Given the reader has signed out
      When the database access status is asked for
      Then the answer is refused

    Scenario: Somebody who is not an administrator cannot turn access off
      Given "someone@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "another horse battery staple"
      When database access is asked to be turned off for 30 minutes
      Then database access is on
