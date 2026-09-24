@browser @postgres
Feature: Registering an account

  Anyone can register; nobody needs to be signed in. The register page,
  /account/register, asks for an email address and nothing else, trimmed where
  it is typed. It asks for nothing else because registering takes nothing
  else: whoever registers has not yet shown the address is theirs, so the name
  and the password are given by whoever turns out to read mail at it, on the
  page its link opens (`ConfirmEmailAddress.feature`).

  The page is guarded by reCAPTCHA, which runs in the browser, so the page
  needs scripting; a reader without it is sent to be told so before filling
  anything in, and a registration that arrives without reCAPTCHA's judgement
  anyway is sent there too, having recorded nothing. A registration judged not
  to be from a person is refused, and says so above the fields. Registering
  asks for no password and hashes nothing, so reCAPTCHA is all that stands
  between a program and an inbox: without it, anybody could have the site
  email an address of their choosing three times an hour.

  A registration that breaks a rule is shown again, as every refused form is:
  each rule beneath the field it is about, and what was typed put back. The
  field is an email address field, so a browser turns away what it can see is
  not one before the site is asked at all; what reaches the rules is an address
  a browser takes for one and the site does not, such as an address with no
  domain after the @.

  One that breaks none ends at the welcome page, whoever the address belongs
  to. What differs — whether an account is made, and which email is sent — is
  registering's to decide, and only the address's owner learns it. The address
  never appears on the welcome page or in its address.

  The same form sent twice — pressed twice, or sent again by a browser whose
  answer was lost — registers once: the form carries an id made when it was
  shown, and the same id sent twice sends one email, counted once towards the
  address's limit.

  When reCAPTCHA cannot be reached, the reader is sent to the registrations
  suspended page, which is specified with it.

  The token reCAPTCHA judges is asked for as the form is sent, not as the page
  opens. A token lasts two minutes and is good once, so one fetched on arrival
  would be stale for a reader who took their time, and missing for one who
  sent the form before it came.

  These scenarios register with scripting on, and stand in for reCAPTCHA with
  one the scenario controls, on both sides: in place of Google's script in the
  browser, and of Google's answer on the server. It judges a person unless the
  scenario says otherwise.

  Each scenario has a database and an application of its own. What one
  scenario registers must not be there for the next to find.

  Rule: The page asks for an email address, and for nothing else

    Scenario: The page asks for an email address
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog asks for an email address

    Scenario: The page asks for no name
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog does not ask for a name

    Scenario: The page asks for no password
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog does not ask for a password

  Rule: The dialog has no cancel button

    Cancelling registering changes nothing and goes nowhere a reader could not
    reach from the site's own bars, so the button does nothing for them, and
    the row has room for buttons that do.

    Scenario: The dialog has no cancel button
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog has no cancel button

  Rule: The email address is trimmed where it is typed

    Scenario: An address typed with spaces around it is registered without them
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "  someone@example.com  "
      When the dialog is submitted
      Then "someone@example.com" has an account

  Rule: A registration that breaks a rule is shown again

    Scenario: An address with no domain is said beneath the address
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example"
      When the dialog is submitted
      Then the email address field says the message for "EmailAddress.NoDomain"

    Scenario: What was typed is put back
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example"
      When the dialog is submitted
      Then the email address field holds "someone@example"

    Scenario: A registration shown again records nothing
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example"
      When the dialog is submitted
      Then "someone@example" has no account

  Rule: Registering ends at the welcome page, whoever the address belongs to

    Scenario: Registering a new address arrives at the welcome page
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the welcome page is shown

    Scenario: Registering a new address sends it a link to confirm it
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then a link to confirm the email address is emailed to "someone@example.com"

    Scenario: Registering an address that already has an account arrives at the same page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the welcome page is shown

    Scenario: The address never shows on the way
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the page does not contain "someone@example.com"
      And the page's address does not contain "someone@example.com"

  Rule: The same form sent twice registers once

    Scenario: The same registration sent twice sends one email
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      When the form is sent twice for "someone@example.com"
      Then "someone@example.com" is sent one email

  Rule: reCAPTCHA must judge the reader a person

    Scenario: The form carries the token reCAPTCHA's script fills in
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the form carries reCAPTCHA's token

    Scenario: The token judged is asked for as the form is sent
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the email address "someone@example.com" is typed
      When the dialog is submitted
      Then reCAPTCHA judged a token asked for once the form was filled in

    Scenario: A registration without reCAPTCHA's judgement is sent to be told why
      Given a viewport 1200 pixels wide
      When a registration for "someone@example.com" arrives without reCAPTCHA's judgement
      Then the java script required page is shown

    Scenario: Nothing is recorded of a registration without a judgement
      Given a viewport 1200 pixels wide
      When a registration for "someone@example.com" arrives without reCAPTCHA's judgement
      Then "someone@example.com" has no account

    Scenario: A registration judged not to be from a person is refused above the fields
      Given a viewport 1200 pixels wide
      And reCAPTCHA judges the reader not a person
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the message for "Registration.NotAPerson" is above the fields

    Scenario: Nothing is recorded of a registration judged not to be from a person
      Given a viewport 1200 pixels wide
      And reCAPTCHA judges the reader not a person
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then "someone@example.com" has no account

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the register page is opened with scripting on
      Then every word in the dialog is in the test locale
