@browser @postgres
Feature: Only an administrator may open the administrator's pages

  The pages under /admin/administrator are for whoever runs the site, not for
  whoever runs a tournament. The rest of the admin is open to any reader who
  is signed in, since what it shows them is only ever their own; these pages
  are not anybody's own, so being signed in is not enough. The reader has to
  hold the Administrator role.

  A reader who is not signed in is sent to sign in first, as they are from
  every other page of the admin, since they may be an administrator who has
  not yet said so. A reader who is signed in and holds no such role is told
  the page is not found rather than that it is refused, so that the pages do
  not announce themselves to those who may not open them.

  Whether the reader holds the role is asked on every request rather than once
  as they sign in, so that a role taken away is taken away at once and not when
  the session ends.

  Background:
    Given "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"

  Rule: A reader not signed in is sent to sign in first

    Scenario: The administrator's pages send a reader not signed in to sign in
      When the page at "/admin/administrator" is opened
      Then the sign in page is shown

    Scenario: A page beneath them sends a reader not signed in to sign in
      When the page at "/admin/administrator/accounts" is opened
      Then the sign in page is shown

  Rule: A reader who is not an administrator is told the page is not found

    Scenario: The administrator's pages are not found by a manager
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/admin/administrator" is opened
      Then the page is not found

    Scenario: A page beneath them is not found by a manager
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/admin/administrator/accounts" is opened
      Then the page is not found

    Scenario: The administrator's pages are not found once the role is taken away
      Given the reader has signed in as "admin@example.com" with the password "another horse battery staple"
      And "admin@example.com" has had the role "Administrator" taken away
      When the page at "/admin/administrator" is opened
      Then the page is not found

    Scenario: A page whose address only begins the same way is not held back
      Given the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
      When the page at "/admin/administrators" is opened
      Then the page opens

  Rule: An administrator opens them

    Scenario: An administrator opens the administrator's pages
      Given the reader has signed in as "admin@example.com" with the password "another horse battery staple"
      When the page at "/admin/administrator" is opened
      Then the page opens

    Scenario: An administrator opens a page beneath them
      Given the reader has signed in as "admin@example.com" with the password "another horse battery staple"
      When the page at "/admin/administrator/accounts" is opened
      Then the page opens
