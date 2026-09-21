@browser @postgres
Feature: A reader who has forgotten their password is sent a way back in

  A reader who cannot sign in gives the email address they registered with,
  and is told to check their email. That is all the page ever says, whether or
  not the address has an account, so that the page cannot be used to find out
  which addresses do.

  What is sent depends on the address, and only its owner reads it: a link to
  set a new password, the link to confirm an address that was never confirmed,
  or a link to register. Which of the three, and why, is
  `ResetPassword.feature`; this page asks for it and shows the answer, which
  is the same answer whichever it sent.

  The link to set a new password opens /account/set-new-password. It works
  once, and for an hour: a link is only as safe as the inbox it sits in, and
  one that worked for ever would be a key left under the mat. It is made for
  setting a new password and nothing else, and says so where it cannot be
  changed: a link the site made for anything else, such as confirming an email
  address, which works for a day, does not set a password, however it is sent.
  The new password follows the same rules as the one given when an address is
  confirmed — trimmed, at least 12 characters, not among those known to have
  been breached, and the same twice — because it is the same password. Setting
  it replaces whatever hash the account had, including one brought over from
  the old site, which is how an account whose old password began or ended with
  a space gets back in.

  Setting a new password ends every session the account has, on every device.
  A reader may be setting one because somebody else got in, and somebody else
  would otherwise stay in; the reader who set it is signed out with the rest,
  and signs in with what they have just chosen.

  Every link this page sends is on the site's own address, whatever host the
  request that asked for it came with. A request's host is whatever its
  sender wrote, and a link made from it could be pointed at anybody's site:
  asking for a way back in to somebody else's account with another host would
  send its owner a genuine email whose link handed the asker the way in. The
  site's address comes from how the site is configured, and is specified with
  the email writer (`emailWriter.feature`).

  Asking is limited, so that the page cannot be used to fill somebody's inbox
  or to try address after address. How often an address is written to is
  asking's own limit, counted with the emails registering and the new
  confirmation link page send; past it nothing more is sent, and the page still
  says what it always says, so the limit gives nothing away either. What this
  page adds is a limit on the asking itself: an IP address may ask at most 10
  times an hour, and past that whoever is asking from it is told to try again
  later. The address a request came from is the one its connection came from,
  unless the application is told it is behind something that forwards
  requests, in which case it is the one those headers name.

  Pressing the button twice — or going back and pressing it again — asks once:
  the form carries an id made when it was shown, and the same id asked for
  twice sends one email, which is asked for once and counted once towards the
  address's limit.

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
      And "someone@example.com" has an account, confirmed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then the reader is told to check their email

    Scenario: An address with no account is told the same
      Given a viewport 1200 pixels wide
      And the forgot password page is open
      When the reader asks for a way back in for "nobody@example.com"
      Then the reader is told to check their email

  Rule: What is sent depends on the address

    Scenario: An address with an account is sent a link to set a new password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then "someone@example.com" is sent a link to set a new password

    Scenario: An address with no account is sent a link to register
      Given a viewport 1200 pixels wide
      And the forgot password page is open
      When the reader asks for a way back in for "nobody@example.com"
      Then "nobody@example.com" is sent a link to register

  Rule: An address that has never been confirmed is sent the link to confirm it

    Scenario: An unconfirmed address is sent the link to confirm it again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then "someone@example.com" is sent the link to confirm the email address

    Scenario: An unconfirmed address is told the same as everybody else
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then the reader is told to check their email

  Rule: Pressing the button twice asks once

    Scenario: Pressing the button twice sends one link
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the forgot password page is open
      And the reader asks for a way back in for "someone@example.com"
      When the reader goes back and asks again
      Then one link to set a new password has been sent to "someone@example.com"

  Rule: Setting a new password ends every session the account has

    Scenario: Setting a new password signs the account out on every browser
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in on another browser as "someone@example.com" with the password "correct horse battery staple"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "a different long password" is set
      Then the other browser is signed out

    Scenario: Setting a new password leaves no session for the account
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in on another browser as "someone@example.com" with the password "correct horse battery staple"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "a different long password" is set
      Then the account for "someone@example.com" has 0 sessions

    Scenario: Setting a new password signs out the reader who set it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "a different long password" is set
      Then the reader is signed out

  Rule: A link is on the site's own address, whatever host it was asked for with

    Scenario: A link to set a new password asked for with another host is on the site's address
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com", with the host "elsewhere.example"
      Then the link sent to "someone@example.com" is on the site's own address

    Scenario: A link to register asked for with another host is on the site's address
      Given a viewport 1200 pixels wide
      And the forgot password page is open
      When the reader asks for a way back in for "nobody@example.com", with the host "elsewhere.example"
      Then the link sent to "nobody@example.com" is on the site's own address

  Rule: The link sets a new password once, and for an hour

    Scenario: Following the link lets a new password be set
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed

    Scenario: A link used once does not work again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      And the new password "correct horse battery staple" is set
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A link not yet an hour old still works
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And 59 minutes have passed
      When the link is followed
      And the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed

    Scenario: A link older than an hour does not work
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And an hour and a minute have passed
      When the link is followed
      Then the reader is told the link no longer works

    Scenario: A new password that breaks a rule is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "too short" is set
      Then the password field says the message for "Password.TooShort"

    Scenario: A new password typed differently the second time is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      And "correct horse battery staple" is typed as the new password
      And "correct horse battery stapler" is typed as the confirm password
      When the new password is sent
      Then the confirm password field says the message for "Password.ConfirmationDiffers"

    Scenario: An account brought over from the old site gets a new password of today's kind
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account brought over from the old site, with the password "the old password here"
      And a link to set a new password has been sent to "someone@example.com"
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the account for the email address "someone@example.com" has a password of today's kind

    Scenario: A link to confirm an email address does not set a new password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      When the link to confirm the email address is followed as a link to set a new password
      Then the reader is told the link no longer works

  Rule: Asking is limited, by address and by IP address, and the limit gives nothing away

    Scenario: An address is sent no more than 3 emails an hour
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And "someone@example.com" has been emailed 3 times in the last hour
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then nothing more is sent to "someone@example.com"

    Scenario: An address written another way counts toward the same limit
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And "someone@example.com" has been emailed 3 times in the last hour
      And the forgot password page is open
      When the reader asks for a way back in for "  SOMEONE@Example.com  "
      Then nothing more is sent to "someone@example.com"

    Scenario: The page says the same past an address's limit
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And "someone@example.com" has been emailed 3 times in the last hour
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then the reader is told to check their email

    Scenario: An IP address that asks more than 10 times an hour is told to try later
      Given a viewport 1200 pixels wide
      And this IP address has asked for a way back in 10 times in the last hour
      And the forgot password page is open
      When the reader asks for a way back in for "nobody@example.com"
      Then the reader is told to try again later

    Scenario: An hour later, an address can be sent a link again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And "someone@example.com" has been emailed 3 times in the last hour
      And an hour and a minute have passed
      And the forgot password page is open
      When the reader asks for a way back in for "someone@example.com"
      Then "someone@example.com" is sent a link to set a new password

    Scenario: Another IP address is not held to this one's limit
      Given a viewport 1200 pixels wide
      And this IP address has asked for a way back in 10 times in the last hour
      And the forgot password page is open from another IP address
      When the reader asks for a way back in for "nobody@example.com"
      Then the reader is told to check their email

    Scenario: An hour later, an IP address can ask again
      Given a viewport 1200 pixels wide
      And this IP address has asked for a way back in 10 times in the last hour
      And an hour and a minute have passed
      And the forgot password page is open
      When the reader asks for a way back in for "nobody@example.com"
      Then the reader is told to check their email

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the forgot password page is opened
      Then every word in the dialog is in the test locale
