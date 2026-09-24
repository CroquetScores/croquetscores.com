@browser @postgres
Feature: A reader who is signed in can change what their account is called

  The change name page, /account/change-name, asks a reader who is signed in
  for a name, holding the one the account has now so that a small correction
  is a small edit. A name is held to the rules it was held to when the account
  was confirmed (`ConfirmEmailAddress.feature`), and trimmed where it is typed.

  A name that breaks a rule is said beneath the field, and what was typed is
  put back. A sound one is kept, and the reader is taken to their profile,
  which shows it. Nothing is emailed: what an account is called says nothing
  about who can reach it, and an email for every correction would teach its
  owner to ignore the ones that matter. That is said where the email would be
  sent from (`ChangeName.feature`), since a page emails nothing itself.

  Only a reader who is signed in can change it; one who is not is sent to sign
  in first. So is one whose account is forgotten while the page is open: its
  sessions are ended after it is forgotten, not with it, so the form can be
  sent in between, and the reader is by then signed in to nothing. Changing it
  needs no scripting.

  Each scenario has a database and an application of its own. What one
  scenario registers, and whom it signs in, must not be there for the next to
  find.

  Rule: Only a reader signed in can change the name

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the change name page is opened
      Then the sign in page is shown

    Scenario: A reader signed in is asked for a name
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change name page is opened
      Then the dialog asks for a name

    Scenario: A reader whose account is forgotten while the page is open is sent to sign in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the account for "someone@example.com" has been forgotten
      And the name "Samantha Someone" is typed
      When the dialog is submitted
      Then the sign in page is shown

  Rule: The form holds the name the account has now

    Scenario: The name field holds the account's name
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change name page is opened
      Then the name field holds "Sam Someone"

  Rule: A sound name is kept, and the reader is taken to their profile

    Scenario: The account is called the name that was typed
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "Samantha Someone" is typed
      When the dialog is submitted
      Then the account for the email address "someone@example.com" is called "Samantha Someone"

    Scenario: A name typed with spaces around it is kept without them
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "  Samantha Someone  " is typed
      When the dialog is submitted
      Then the account for the email address "someone@example.com" is called "Samantha Someone"

    Scenario: The reader is taken to their profile
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "Samantha Someone" is typed
      When the dialog is submitted
      Then the profile page is shown

    Scenario: The profile shows the new name
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "Samantha Someone" is typed
      When the dialog is submitted
      Then the profile shows the name "Samantha Someone"

  Rule: A name that breaks a rule is said beneath the field, and changes nothing

    Scenario Outline: A name that breaks a rule is said beneath the field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "<name>" is typed
      When the dialog is submitted
      Then the name field says the message for "<code>"

      Examples:
        | name | code                |
        |      | PersonName.Missing  |
        | Sa   | PersonName.TooShort |

    Scenario: What was typed is put back
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "Sa" is typed
      When the dialog is submitted
      Then the name field holds "Sa"

    Scenario: A name that breaks a rule changes nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the change name page is open
      And the name "Sa" is typed
      When the dialog is submitted
      Then the account for the email address "someone@example.com" is called "Sam Someone"

  Rule: The page needs no scripting

    Scenario: The change name page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change name page is opened with scripting off
      Then the change name page is shown

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog but the account's name is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the change name page is opened
      Then every word in the dialog but the account's name is in the test locale
