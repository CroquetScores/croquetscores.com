@browser @postgres
Feature: The accounts page, where an administrator gives and takes roles

  The accounts page (/admin/administrator/accounts) is one of the
  administrator's pages (`administrator.feature`), under their section bar
  (`AdministratorSections.feature`). It is where an administrator sees who
  holds each role, gives a role to somebody, and takes it away.

  It has two sections, Administrators and World Ranking Officers, one for each
  role, laid out and behaving the same way. Each is headed by its name, on the
  section bar's colours (`STYLE.md`), so that the two read as two parts of the
  page. Under the heading are the accounts holding the role, each by name with
  Remove beside it, then a field for an email address and Add.

  The accounts are listed by name, in alphabetical order
  (`AccountsWithRole.feature`). The reader is not listed among the
  administrators, since they cannot take that role from themselves
  (`RemoveRole.Yourself`); they are listed among the world ranking officers
  where they hold that role.

  Somebody is given a role by their email address, typed into the section's
  field and sent by its Add. An address with no confirmed account is refused
  beneath the field, by its code (`AddRole.feature`). Giving a role to an
  account that already holds it changes nothing. Once somebody is given the
  role, the field is emptied and the reader is back in it, for the next.

  Remove takes the role away. Every Remove asks first, as Remove does on a
  tournament's Managers tab, in a modal dialog that names whose role will be
  taken and offers Remove and Cancel, since taking a role away is gone rather
  than set aside.

  Each section's list is asked for again whenever its role is given or taken,
  so that it says who holds the role now rather than what was pressed.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator", with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"

  Rule: The page has a section for each role, each headed by its name

    Scenario: The page has a section for administrators
      When the accounts page is opened
      Then the section "Administrators" is on the page

    Scenario: The page has a section for world ranking officers
      When the accounts page is opened
      Then the section "World Ranking Officers" is on the page

    Scenario: Administrators comes first
      When the accounts page is opened
      Then the first section on the page is "Administrators"

    Scenario Outline: Each section's heading is on the section bar's colours
      When the accounts page is opened
      Then the heading of "<section>" is on the section bar's colour

      Examples:
        | section                |
        | Administrators         |
        | World Ranking Officers |

  Rule: Each section lists the accounts holding its role, by name

    Scenario Outline: An account holding the role is listed in its section
      Given "someone@example.com" has been given the role "<role>"
      When the accounts page is opened
      Then "Sam Someone" is listed in "<section>"

      Examples:
        | role                  | section                |
        | Administrator         | Administrators         |
        | World Ranking Officer | World Ranking Officers |

    Scenario: An account is not listed in the section of a role it does not hold
      Given "someone@example.com" has been given the role "Administrator"
      When the accounts page is opened
      Then "Sam Someone" is not listed in "World Ranking Officers"

    Scenario: The reader is not listed among the administrators
      When the accounts page is opened
      Then "Ada Administrator" is not listed in "Administrators"

    Scenario: The reader is listed among the world ranking officers
      Given "admin@example.com" has been given the role "World Ranking Officer"
      When the accounts page is opened
      Then "Ada Administrator" is listed in "World Ranking Officers"

    Scenario: The accounts are listed in alphabetical order
      Given "other@example.com" has an account, confirmed, called "Alex Another"
      And "someone@example.com" has been given the role "World Ranking Officer"
      And "other@example.com" has been given the role "World Ranking Officer"
      When the accounts page is opened
      Then the first listed in "World Ranking Officers" is "Alex Another"

    Scenario Outline: Each account listed offers Remove
      Given "someone@example.com" has been given the role "<role>"
      When the accounts page is opened
      Then "Sam Someone" in "<section>" offers "Remove"

      Examples:
        | role                  | section                |
        | Administrator         | Administrators         |
        | World Ranking Officer | World Ranking Officers |

  Rule: Somebody is given a role by their email address

    Scenario Outline: Each section asks for an email address
      When the accounts page is opened
      Then "<section>" asks for "Email address"

      Examples:
        | section                |
        | Administrators         |
        | World Ranking Officers |

    Scenario Outline: Add gives the address's account the section's role
      Given the accounts page is open
      And "someone@example.com" is typed as the "Email address" in "<section>"
      When "Add" is pressed in "<section>"
      Then "Sam Someone" is listed in "<section>"

      Examples:
        | section                |
        | Administrators         |
        | World Ranking Officers |

    Scenario: A role given is kept
      Given the accounts page is open
      And "someone@example.com" is typed as the "Email address" in "World Ranking Officers"
      And "Add" is pressed in "World Ranking Officers"
      When the accounts page is opened
      Then "Sam Someone" is listed in "World Ranking Officers"

    Scenario: Adding in one section gives no other role
      Given the accounts page is open
      And "someone@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Sam Someone" is not listed in "Administrators"

    Scenario: Adding empties the field
      Given the accounts page is open
      And "someone@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Email address" in "World Ranking Officers" is empty

    Scenario: Adding puts the reader back in the field
      Given the accounts page is open
      And "someone@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Email address" in "World Ranking Officers" has the focus

    Scenario: Giving a role to an account that holds it lists them once
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "someone@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Sam Someone" is listed once in "World Ranking Officers"

  Rule: An address that cannot be given a role is refused beneath the field

    Scenario: An address nobody has registered is refused
      Given the accounts page is open
      And "nobody@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Email address" in "World Ranking Officers" is refused with "AddRole.NoSuchAccount"

    Scenario: An address that is not one is refused for it
      Given the accounts page is open
      And "someone" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Email address" in "World Ranking Officers" is refused with "EmailAddress.NoAt"

    Scenario: A refused address stays typed
      Given the accounts page is open
      And "nobody@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then "Email address" in "World Ranking Officers" says "nobody@example.com"

    Scenario: A refusal in one section is not said in the other
      Given the accounts page is open
      And "nobody@example.com" is typed as the "Email address" in "World Ranking Officers"
      When "Add" is pressed in "World Ranking Officers"
      Then nothing is said beneath "Email address" in "Administrators"

    Scenario: The refusal is no longer said once the address is changed
      Given the accounts page is open
      And "nobody@example.com" is typed as the "Email address" in "World Ranking Officers"
      And "Add" is pressed in "World Ranking Officers"
      When "someone@example.com" is typed as the "Email address" in "World Ranking Officers"
      Then nothing is said beneath "Email address" in "World Ranking Officers"

  Rule: Every Remove asks first

    Scenario: Removing asks first
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      When "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      Then the modal dialog titled "Remove World Ranking Officer" is open

    Scenario: Removing an administrator asks under a title of its own
      Given "someone@example.com" has been given the role "Administrator"
      And the accounts page is open
      When "Remove" is pressed on "Sam Someone" in "Administrators"
      Then the modal dialog titled "Remove Administrator" is open

    Scenario: Asking first names whose role will be taken
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      When "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      Then the modal dialog names "Sam Someone"

    Scenario: Asking first offers Remove first
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      When "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      Then the modal dialog's first button is "Remove"

    Scenario: Asking first offers Cancel
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      When "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      Then the modal dialog's second button is "Cancel"

  Rule: Remove in the modal dialog takes the role away

    Scenario Outline: Removing takes the account off the section
      Given "someone@example.com" has been given the role "<role>"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "<section>"
      When "Remove" is pressed in the modal dialog
      Then "Sam Someone" is not listed in "<section>"

      Examples:
        | role                  | section                |
        | Administrator         | Administrators         |
        | World Ranking Officer | World Ranking Officers |

    Scenario: A role taken is kept taken
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      And "Remove" is pressed in the modal dialog
      When the accounts page is opened
      Then "Sam Someone" is not listed in "World Ranking Officers"

    Scenario: Removing from one section leaves the other
      Given "someone@example.com" has been given the role "Administrator"
      And "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      When "Remove" is pressed in the modal dialog
      Then "Sam Someone" is listed in "Administrators"

    Scenario: Removing closes the modal dialog
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      When "Remove" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: Cancel in the modal dialog takes nothing away

    Scenario: Cancelling keeps the account listed
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      When "Cancel" is pressed in the modal dialog
      Then "Sam Someone" is listed in "World Ranking Officers"

    Scenario: Cancelling closes the modal dialog
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

  Rule: A refused Remove is said in its section

    Remove can be refused after the dialog has been answered: the reader's
    own role taken by another administrator while the page was open, or the
    account forgotten. The refusal is said in the section, by its code, in
    place of a list that can no longer be asked for, rather than the list
    going quietly blank. That a refused Remove takes nothing away is the
    command's to say (`RemoveRole.feature`).

    Scenario: Removing once the reader's role has been taken says so
      Given "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      And "Remove" is pressed on "Sam Someone" in "World Ranking Officers"
      And "admin@example.com" has had the role "Administrator" taken away
      When "Remove" is pressed in the modal dialog
      Then the section "World Ranking Officers" says it was refused with "Account.NotAnAdministrator"

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). An account's name is
    theirs, and nobody's language.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      And "someone@example.com" has been given the role "World Ranking Officer"
      When the accounts page is opened
      Then every word in the admin's content but the accounts' names is in the test locale

    Scenario: Asking before removing is in the reader's language
      Given a browser that asks for "en-XA"
      And "someone@example.com" has been given the role "World Ranking Officer"
      And the accounts page is open
      When the way to remove the first world ranking officer is pressed
      Then every word in the modal dialog but the account's name is in the test locale

  Rule: The page is laid out for a phone first

    Scenario: Add can be pressed with a thumb
      When the accounts page is opened
      Then "Add" in "World Ranking Officers" is at least 44 pixels tall

    Scenario: Remove can be pressed with a thumb
      Given "someone@example.com" has been given the role "World Ranking Officer"
      When the accounts page is opened
      Then "Remove" on "Sam Someone" in "World Ranking Officers" is at least 44 pixels tall

    Scenario: The page is no wider than the window
      Given "someone@example.com" has been given the role "World Ranking Officer"
      When the accounts page is opened
      Then the page is no wider than the window
