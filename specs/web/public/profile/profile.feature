@browser @postgres
Feature: A reader who is signed in sees their account's profile

  The profile page, /account/profile, shows a reader who is signed in the
  account they are signed in to: what it is called, and its email address. It
  is where the account's own pages lead from, so it links to changing the
  name, the email address and the password, each a page of its own. It changes
  nothing itself, and it is not a form, so it is read on the panel rather than
  in a dialog.

  An account with no password, because its reader has only ever signed in with
  Google, has no password to change and none to give for moving to another
  email address, so the profile links to neither
  (`changePassword.feature`, `changeEmailAddress.feature`).

  Only a reader who is signed in sees it. One who is not is sent to sign in
  first, and brought back here once they have, as every page of an account's
  own does (`forgetAccount.feature`).

  The account's name and email address are the account's own, not words of the
  reader's language, so they are shown as they are, whatever language the page
  is in.

  Nobody needs scripting to see it.

  Each scenario has a database and an application of its own. What one
  scenario registers, and whom it signs in, must not be there for the next to
  find.

  Rule: Only a reader signed in sees the profile

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the profile page is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the profile
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the profile page is open
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the profile page is shown

    Scenario: A reader signed in sees the profile
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the profile page is shown

  Rule: The profile says who the account is

    Scenario: The profile shows the account's name
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, called "Sam Someone", with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the profile shows the name "Sam Someone"

    Scenario: The profile shows the account's email address
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the profile shows the email address "someone@example.com"

  Rule: Each label is bold, ends with a colon, and has its value beside it

    A label is told from its value by being bold, and says it is a label by
    ending with a colon. The colon is in the label's words rather than put there
    by the stylesheet, because languages set it differently — French puts a
    space before it — and a colon drawn by a stylesheet is not always read out.
    Each value sits on the same row as its label, so the two are read together.

    Scenario Outline: Each label ends with a colon
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the label for the <value> says "<label>"

      Examples:
        | value         | label          |
        | name          | Name:          |
        | email address | Email address: |

    Scenario Outline: Each label is bold
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the label for the <value> is bold

      Examples:
        | value         |
        | name          |
        | email address |

    Scenario Outline: Each value is on the same row as its label
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the <value> is on the same row as its label

      Examples:
        | value         |
        | name          |
        | email address |

    Scenario Outline: Each value is beside its label, not beneath it, on a narrow screen
      Given a viewport 375 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the <value> is on the same row as its label

      Examples:
        | value         |
        | name          |
        | email address |

  Rule: The profile leads to the pages that change the account

    Scenario Outline: The profile links to each
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the profile links to "<page>" at "<path>"

      Examples:
        | page                 | path                          |
        | Change Name          | /account/change-name          |
        | Change Email Address | /account/change-email-address |
        | Change Password      | /account/change-password      |

    Scenario Outline: The profile of an account with no password does not link to what asks for one
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      When the profile page is opened
      Then the profile does not link to "<page>"

      Examples:
        | page                 |
        | Change Email Address |
        | Change Password      |

  Rule: The page needs no scripting

    Scenario: The profile page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened with scripting off
      Then the profile page is shown

  Rule: The page is in the reader's language

    Scenario: Every word on the profile page but the account's own is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then every word on the profile page but the account's own is in the test locale
