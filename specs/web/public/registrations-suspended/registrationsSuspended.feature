@browser @postgres
Feature: Registering, confirming and setting a password wait while a service they need is down

  Three pages ask a service outside the site. Registering asks reCAPTCHA
  whether whoever is registering is a person. Confirming an address and
  setting a new password ask Have I Been Pwned whether the password is among
  those known to have been breached. None of them can go on when its service
  does not answer — a registration nobody judged, or a password nobody
  checked, is the very thing each is there to stop — so nothing is recorded,
  and the reader is told to try again later.

  A reader registering is sent to /account/registrations-suspended, which says
  registering is suspended for now. A reader confirming or setting a password
  is not: that page would tell them about something they were not doing. Their
  form is shown again, saying above the fields that the password cannot be
  checked just now, with `BreachedPasswords.Unreachable`, and their link is not
  used up by it, so trying again later needs no new one for as long as the
  link lasts.

  The administrator is told, so that the site is not quietly turning people
  away, at most once an hour for each service
  (`ReportUnreachableService.feature`).

  Nothing stays suspended. Each attempt asks the service afresh, so everything
  works again the moment it answers, without anybody having to lift anything.

  These scenarios stand in for each service with one the scenario can take
  down, and register with scripting on, since registering needs it.

  Each scenario has a database and an application of its own. What one
  scenario registers must not be there for the next to find.

  Rule: reCAPTCHA that cannot be reached suspends registering

    Scenario: Registering while reCAPTCHA is down is suspended
      Given a viewport 1200 pixels wide
      And reCAPTCHA cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the registrations suspended page is shown

    Scenario: Nothing is recorded of a suspended registration
      Given a viewport 1200 pixels wide
      And reCAPTCHA cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then "someone@example.com" has no account

    Scenario: Registering works again the moment reCAPTCHA answers
      Given a viewport 1200 pixels wide
      And reCAPTCHA cannot be reached
      And reCAPTCHA can be reached again
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the welcome page is shown

  Rule: A breached password check that cannot be reached holds up confirming, and keeps the link

    Scenario: Confirming while the check is down says it cannot be checked
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the confirm password typed as "correct horse battery staple"
      When the dialog is submitted
      Then the message for "BreachedPasswords.Unreachable" is above the fields

    Scenario: The address is not confirmed while the check is down
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the confirm password typed as "correct horse battery staple"
      When the dialog is submitted
      Then the email address "someone@example.com" is not confirmed

    Scenario: The link still confirms once the check answers again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, not confirmed
      And a link to confirm the email address has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the confirm password typed as "correct horse battery staple"
      And the dialog is submitted
      And Have I Been Pwned can be reached again
      And the link is followed
      And the name typed as "Sam Someone"
      And the password typed as "correct horse battery staple"
      And the confirm password typed as "correct horse battery staple"
      When the dialog is submitted
      Then the email address "someone@example.com" is confirmed

  Rule: A breached password check that cannot be reached holds up setting a new password, and keeps the link

    Scenario: Setting a new password while the check is down says it cannot be checked
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      When the new password "a different long password" is set
      Then the message for "BreachedPasswords.Unreachable" is above the fields

    Scenario: The password is not changed while the check is down
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      When the new password "a different long password" is set
      Then the reader can sign in as "someone@example.com" with the password "correct horse battery staple"

    Scenario: The link still works once the check answers again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      And the new password "a different long password" is set
      And Have I Been Pwned can be reached again
      And the link is followed
      When the new password "a different long password" is set
      Then the reader is told their password has been changed

  Rule: The administrator is told

    Scenario: The administrator is emailed when reCAPTCHA cannot be reached
      Given a viewport 1200 pixels wide
      And reCAPTCHA cannot be reached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the administrator is emailed that "reCAPTCHA" cannot be reached

    Scenario: The administrator is emailed when Have I Been Pwned cannot be reached
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And a link to set a new password has been sent to "someone@example.com"
      And Have I Been Pwned cannot be reached
      And the link is followed
      When the new password "a different long password" is set
      Then the administrator is emailed that "Have I Been Pwned" cannot be reached

  Rule: The page says why, in the reader's language

    Scenario: The page says registering is suspended for now
      Given a viewport 1200 pixels wide
      When the registrations suspended page is opened
      Then the reader is told registering is suspended

    Scenario: The page says to try again later
      Given a viewport 1200 pixels wide
      When the registrations suspended page is opened
      Then the reader is told to try again later

    Scenario: Every word on the page is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the registrations suspended page is opened
      Then every word in the page's content is in the test locale
