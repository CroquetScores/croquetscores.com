@browser @postgres
Feature: A reader who is signed in can have their account forgotten

  A reader can ask for their account to be forgotten: its name and email
  address made unreadable for good, by deleting the account's own key, with
  every one of its events left where it was. It cannot be undone, so it is
  asked for twice over.

  Only somebody signed in to the account can ask, from /accounts/forget; a
  reader who is not signed in is sent to sign in first. Asking sends an email
  to the account's email address with a link to confirm it, and the page says
  to check their email. That is the second asking: whoever asked has to be
  able to read the account's email as well as be signed in to it.

  The link works once, and for 15 minutes. It is short because what it does
  cannot be undone, and a link that sat in an inbox for days would be a way to
  forget the account for whoever came across it. It works only for the account
  it was sent for, signed in: following it signed in as somebody else, or as
  nobody, does not forget anything.

  Following the link does not forget the account by itself. It opens a page
  that says what forgetting means, with a button that does it. Mail systems
  follow the links in an email to check them before anybody reads it, and a
  link that forgot an account when it was followed would forget it before its
  owner had seen the email.

  Once forgotten, the account is called "Account Forgotten" and the uuid in its
  id, and is reached at a matching address on the site's own domain, which is
  never written to; that is specified with the account keys. The reader is
  signed out and told it is done. The account cannot be signed in to, and
  cannot be found by its old email address, which is free to be registered
  again as a new account.

  These scenarios sign in, send and follow links by the emails the email
  queue holds, and move the clock as each needs.

  Rule: Only a reader signed in to the account can ask

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the forget account page is opened
      Then the sign in page is shown

    Scenario: A reader signed in can ask
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      When the forget account page is opened
      Then the forget account page is shown

  Rule: Asking emails a link to confirm, and forgets nothing yet

    Scenario: Asking sends a link to the account's email address
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And the forget account page is open
      When forgetting the account is asked for
      Then the email "Email.ConfirmForgetting" is queued for "someone@example.com"

    Scenario: Asking tells the reader to check their email
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And the forget account page is open
      When forgetting the account is asked for
      Then the reader is told to check their email

    Scenario: Asking forgets nothing yet
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And the forget account page is open
      When forgetting the account is asked for
      Then the account for "someone@example.com" is not forgotten

  Rule: Following the link asks once more, and forgets only when the reader says so

    Scenario: Following the link forgets nothing by itself
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      When the link is followed
      Then the account for "someone@example.com" is not forgotten

    Scenario: Following the link shows what forgetting means
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      When the link is followed
      Then the reader is told what forgetting the account means

    Scenario: Saying so forgets the account
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      And the link is followed
      When forgetting is confirmed
      Then the account for "someone@example.com" is forgotten

  Rule: The link works once, for 15 minutes, and for its own account signed in

    Scenario: A link followed after 14 minutes still works
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      And 14 minutes have passed
      When the link is followed
      Then the reader is told what forgetting the account means

    Scenario: A link followed after 16 minutes does not work
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      And 16 minutes have passed
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A link does not work twice
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      And the link is followed
      And forgetting is confirmed
      And an account for "someone@example.com" is registered again and signed in to
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A link followed signed in as somebody else forgets nothing
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And an account for "other@example.com", confirmed
      And a link to confirm forgetting has been sent for "someone@example.com"
      And the reader is signed in to the account for "other@example.com"
      When the link is followed
      Then the reader is told the link no longer works
      And the account for "someone@example.com" is not forgotten
      And the account for "other@example.com" is not forgotten

    Scenario: A link followed signed in as nobody forgets nothing
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a link to confirm forgetting has been sent for "someone@example.com"
      And the reader is signed out
      When the link is followed
      Then the sign in page is shown
      And the account for "someone@example.com" is not forgotten

  Rule: A forgotten account is signed out of, and its email address is free again

    Scenario: The reader is signed out and told it is done
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      And a link to confirm forgetting has been sent for "someone@example.com"
      And the link is followed
      When forgetting is confirmed
      Then the reader is told their account has been forgotten
      And the reader is signed out

    Scenario: A forgotten account's email address can be registered again
      Given a viewport 1200 pixels wide
      And the account for "someone@example.com" has been forgotten
      When a new account for "someone@example.com" is registered
      Then there is an account for "someone@example.com"
      And the email "Email.ConfirmAddress" is queued for "someone@example.com"

  Rule: The pages are in the reader's language

    Scenario: Every word on the forget account page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And an account for "someone@example.com", confirmed
      And the reader is signed in to the account for "someone@example.com"
      When the forget account page is opened
      Then every word in the page's content is in the test locale
