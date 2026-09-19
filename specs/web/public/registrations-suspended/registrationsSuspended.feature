@browser @postgres
Feature: Registering and resetting a password wait while a service they need is down

  Registering asks two services outside the site: reCAPTCHA, whether the
  reader is a person, and Have I Been Pwned, whether the password is among
  those known to have been breached. Setting a new password asks only the
  second, since that page needs no scripting and reCAPTCHA runs in the
  browser. Neither can be skipped when it does not answer — a registration
  nobody judged, or a password nobody checked, is the very thing each is there
  to stop — so when one that is asked cannot be reached, nothing is recorded.
  A reader registering is sent to /accounts/registrations-suspended, which
  says registering is suspended for now and to try again later. A reader
  setting a new password is not, since that page would tell them about
  something they were not doing: the new password page is shown again,
  saying above the fields that the password cannot be checked just now and to
  try again later, with `BreachedPasswords.Unreachable`. Their link is not
  used up by it, so that trying again later needs no new one, for as long as
  the link's hour lasts.

  The administrator is emailed, so that the site is not quietly turning people
  away. That email is the web layer's to queue, in a transaction of its own,
  since the registering it is about records nothing. At most once an hour for
  each service, so that an outage does not bury them in email, and each email
  says which service it was.

  Nothing stays suspended. Each attempt asks the services afresh, so the page
  stops being shown the moment they answer again, without anybody having to
  lift anything.

  These scenarios register and reset with scripting on, since registering
  needs it, and stand in for each service with one the scenario can take down.

  Each scenario has a database and an application of its own. What one
  scenario registers, and how often it has asked from this browser's IP
  address, must not be there for the next to find.

  Rule: A service that cannot be reached suspends registering

    Scenario: Registering while the breached password check is down is suspended
      Given a viewport 1200 pixels wide
      And Have I Been Pwned cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the registrations suspended page is shown

    Scenario: Registering while reCAPTCHA is down is suspended
      Given a viewport 1200 pixels wide
      And reCAPTCHA cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the registrations suspended page is shown

    Scenario: Nothing is recorded of a suspended registration
      Given a viewport 1200 pixels wide
      And Have I Been Pwned cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then there is no account for "someone@example.com"

  Rule: A service that cannot be reached holds up setting a new password, and keeps the link

    Scenario: Setting a new password while the breached password check is down says it cannot be checked
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the dialog says the message for "BreachedPasswords.Unreachable"

    Scenario: Setting a new password while the breached password check is down is not sent to the registrations suspended page
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the new password page is shown

    Scenario: The link still works once the check answers again
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com"
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      And the new password "correct horse battery staple" is set
      And Have I Been Pwned answers again
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then the reader is told their password has been changed

    Scenario: The password is not changed
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com" with the password "the old password here"
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      When the new password "correct horse battery staple" is set
      Then "the old password here" is the password of the account for "someone@example.com"

  Rule: The administrator is told, once an hour for each service

    Scenario: The administrator is emailed when a service cannot be reached
      Given a viewport 1200 pixels wide
      And Have I Been Pwned cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the administrator is emailed that Have I Been Pwned cannot be reached

    Scenario: The administrator is not emailed again within the hour
      Given a viewport 1200 pixels wide
      And Have I Been Pwned cannot be reached
      And the administrator was emailed about Have I Been Pwned 59 minutes ago
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the administrator is not emailed again

    Scenario: The administrator is emailed again once the hour is up
      Given a viewport 1200 pixels wide
      And Have I Been Pwned cannot be reached
      And the administrator was emailed about Have I Been Pwned 61 minutes ago
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the administrator is emailed that Have I Been Pwned cannot be reached

    Scenario: The administrator is emailed about each service on its own
      Given a viewport 1200 pixels wide
      And reCAPTCHA cannot be reached
      And the administrator was emailed about Have I Been Pwned 59 minutes ago
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the administrator is emailed that reCAPTCHA cannot be reached

  Rule: Registering works again the moment the services answer

    Scenario: A registration once the service is back is not suspended
      Given a viewport 1200 pixels wide
      And Have I Been Pwned cannot be reached
      And a registration for "someone@example.com" has been suspended
      And Have I Been Pwned can be reached again
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the welcome page is shown

  Rule: The page says why, in the reader's language

    Scenario: The page says registering is suspended for now
      Given a viewport 1200 pixels wide
      When the registrations suspended page is opened
      Then the reader is told registering is suspended
      And the reader is told to try again later

    Scenario: Every word on the page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the registrations suspended page is opened
      Then every word in the page's content is in the test locale
