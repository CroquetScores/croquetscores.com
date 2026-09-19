@browser @postgres
Feature: A reader who has forgotten their password is sent a way back in

  A reader who cannot sign in gives the email address they registered with,
  and is told to check their email. That is all the page ever says, whether or
  not the address has an account, so that the page cannot be used to find out
  which addresses do.

  What is sent depends on the address, and only its owner reads it. An address
  with an account is sent a link to set a new password. An address with none is
  sent a link to register instead, since whoever asked has no account to get
  back into and may have meant to make one.

  The link to set a new password opens /accounts/reset-password. It works once,
  and for an hour: a link is only as safe as the inbox it sits in, and one that
  worked for ever would be a key left under the mat. It is made for setting a
  new password and nothing else, and says so where it cannot be changed: a link
  the site made for anything else, such as confirming an email address, which
  works for a day, does not set a password, however it is sent. The new
  password follows the same rules as one given when registering — trimmed, at
  least 12 characters, not among those known to have been breached, and the
  same twice. Setting it replaces whatever hash the account had, including one
  imported from the old site, which is how an imported account whose old
  password began or ended with a space gets back in.

  Asking is limited, so that the page cannot be used to fill somebody's inbox
  or to try address after address. An address is sent at most 3 emails an hour;
  past that, nothing more is sent, and the page still says what it always says,
  so the limit gives nothing away either. An address is counted as it is
  found — trimmed and in lower case — and not as it was typed, so that
  writing it another way does not count afresh. An IP address may ask at most 10
  times an hour; past that, whoever is asking from it is told to try again
  later. Behind a proxy, the IP address is the one the proxy says the request
  came from, and is believed only from the proxy: a header anybody can send is
  a limit anybody can step round.

  Nobody needs to be signed in, and none of it needs scripting.

  Each scenario has a database and an application of its own. What one
  scenario registers, and how often it has asked from this browser's IP
  address, must not be there for the next to find.

  Rule: The page needs no scripting

    Scenario: The forgot password page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      When the forgot password page is opened
      Then the forgot password page is shown

  Rule: The page says the same whether or not the address has an account

    Scenario: An address with an account is told to check their email
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And the forgot password page is open
      When a way back in is asked for "someone@example.com"
      Then the reader is told to check their email

    Scenario: An address with no account is told the same
      Given a viewport 1200 pixels wide
      And the forgot password page is open
      When a way back in is asked for "nobody@example.com"
      Then the reader is told to check their email

  Rule: What is sent depends on the address

    Scenario: An address with an account is sent a link to set a new password
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And the forgot password page is open
      When a way back in is asked for "someone@example.com"
      Then "someone@example.com" is sent a link to set a new password

    Scenario: An address with no account is sent a link to register
      Given a viewport 1200 pixels wide
      And the forgot password page is open
      When a way back in is asked for "nobody@example.com"
      Then "nobody@example.com" is sent a link to register

  Rule: The link sets a new password once, and for an hour

    Scenario: Following the link lets a new password be set
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed
      And "correct horse battery staple" is the password of the account for "someone@example.com"

    Scenario: A link used once does not work again
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      And the new password "correct horse battery staple" is set
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A link not yet an hour old still works
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And 59 minutes have passed
      When the link is followed
      And the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed

    Scenario: A link older than an hour does not work
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And an hour and a minute have passed
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A new password that breaks a rule is refused
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "too short" is set
      Then the password field says the message for "Password.TooShort"

    Scenario: A new password typed differently the second time is refused
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      And "correct horse battery staple" is typed as the new password
      And "correct horse battery stapler" is typed as its confirmation
      When the new password is sent
      Then the confirm password field says the message for "Password.ConfirmationDiffers"

    Scenario: An account imported from the old site gets a new password of today's kind
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com" imported from the old site
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the account for "someone@example.com" no longer has an imported password

    Scenario: A link to confirm an email address does not set a new password
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link to confirm the email address is followed as a link to set a new password
      Then the reader is told the link no longer works

  Rule: Asking is limited, by address and by IP address, and the limit gives nothing away

    Scenario: An address is sent no more than 3 emails an hour
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a way back in has been asked for "someone@example.com" 3 times in the last hour
      And the forgot password page is open
      When a way back in is asked for "someone@example.com"
      Then nothing more is sent to "someone@example.com"

    Scenario: An address written another way counts toward the same limit
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a way back in has been asked for "someone@example.com" 3 times in the last hour
      And the forgot password page is open
      When a way back in is asked for "  SOMEONE@Example.com  "
      Then nothing more is sent to "someone@example.com"

    Scenario: The page says the same past an address's limit
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a way back in has been asked for "someone@example.com" 3 times in the last hour
      And the forgot password page is open
      When a way back in is asked for "someone@example.com"
      Then the reader is told to check their email

    Scenario: An IP address that asks more than 10 times an hour is told to try later
      Given a viewport 1200 pixels wide
      And this IP address has asked for a way back in 10 times in the last hour
      And the forgot password page is open
      When a way back in is asked for "nobody@example.com"
      Then the reader is told to try again later

    Scenario: An hour later, an address can be sent a link again
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a way back in has been asked for "someone@example.com" 3 times in the last hour
      And an hour and a minute have passed
      And the forgot password page is open
      When a way back in is asked for "someone@example.com"
      Then "someone@example.com" is sent a link to set a new password

    Scenario: Another IP address is not held to this one's limit
      Given a viewport 1200 pixels wide
      And this IP address has asked for a way back in 10 times in the last hour
      And the forgot password page is open from another IP address
      When a way back in is asked for "nobody@example.com"
      Then the reader is told to check their email

    Scenario: An hour later, an IP address can ask again
      Given a viewport 1200 pixels wide
      And this IP address has asked for a way back in 10 times in the last hour
      And an hour and a minute have passed
      And the forgot password page is open
      When a way back in is asked for "nobody@example.com"
      Then the reader is told to check their email

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the forgot password page is opened
      Then every word in the dialog is in the test locale
