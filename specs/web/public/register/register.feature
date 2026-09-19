@browser @postgres
Feature: Registering an account

  Anyone can register; nobody needs to be signed in. The register page asks
  for a name, an email address, a password, and the password again, and every
  one of them is trimmed where it is typed, the password included: a password
  that begins or ends with a space loses it. That leaves an account imported
  from the old site, whose password did, unable to sign in with it; it resets
  it through the forgot password page instead, which is judged less trouble
  than a password that must be typed with the same stray space every time.

  The page is guarded by reCAPTCHA, which runs in the browser, so the page
  needs scripting; a reader without it is sent to be told so before filling
  anything in, and a registration that arrives without reCAPTCHA's judgement
  anyway is sent there too, having recorded nothing. A registration judged not
  to be from a person is refused, and says so above the fields.

  A registration that breaks a rule is shown again, as every refused form is:
  each rule beneath the field it is about, what was typed put back, and never
  the password.

  One that breaks none ends at the welcome page, whoever the address belongs
  to. What differs — whether an account is made, and which email is sent — is
  the registering's to decide and only the address's owner learns it. The
  address never appears on the welcome page or in its address.

  When a service registering needs cannot be reached, the reader is sent to
  the registrations suspended page, which is specified with it.

  These scenarios register with scripting on, and stand in for reCAPTCHA and
  for the breached password check with fakes the scenario controls; reCAPTCHA
  judges a person unless the scenario says otherwise.

  Each scenario has a database and an application of its own. What one
  scenario registers, and how often it has asked from this browser's IP
  address, must not be there for the next to find.

  Rule: The page asks for a name, an email address and the password twice

    Scenario Outline: The page asks for each
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog asks for <what>

      Examples:
        | what                  |
        | a name                |
        | an email address      |
        | a password            |
        | the password again    |

  Rule: Every field is trimmed where it is typed, the password included

    Scenario: A name typed with spaces around it is registered without them
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      And "  Sam Someone  " is typed into the name field
      When the dialog is submitted
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: An address typed with spaces around it is registered without them
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "  someone@example.com  "
      When the dialog is submitted
      Then there is an account for "someone@example.com"

    Scenario: A password typed with spaces around it is kept without them
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      And "  correct horse battery staple  " is typed into the password field
      And "  correct horse battery staple  " is typed into the confirm password field
      When the dialog is submitted
      Then "correct horse battery staple" is the password of the account for "someone@example.com"

  Rule: A registration that breaks a rule is shown again

    Scenario: A name too short is said beneath the name
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      And "Sa" is typed into the name field
      When the dialog is submitted
      Then the name field says the message for "PersonName.TooShort"

    Scenario: A password known to have been breached is said beneath the password
      Given a viewport 1200 pixels wide
      And "correct horse battery staple" is known to have been breached
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the password field says the message for "Password.Breached"

    Scenario: A password typed differently the second time is said beneath the second
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      And "correct horse battery stapel" is typed into the confirm password field
      When the dialog is submitted
      Then the confirm password field says the message for "Password.ConfirmationDiffers"

    Scenario: What was typed is put back, except the passwords
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      And "Sa" is typed into the name field
      When the dialog is submitted
      Then the email address field holds "someone@example.com"
      And the password field is empty
      And the confirm password field is empty

    Scenario: A registration shown again records nothing
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      And "Sa" is typed into the name field
      When the dialog is submitted
      Then there is no account for "someone@example.com"

  Rule: Registering ends at the welcome page, whoever the address belongs to

    Scenario: Registering a new address arrives at the welcome page
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the welcome page is shown

    Scenario: Registering an address that already has an account arrives at the same page
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then the welcome page is shown

    Scenario: The address never shows on the way
      Given a viewport 1200 pixels wide
      And the register page is open with scripting on
      And the register form is filled in for "someone@example.com"
      When the dialog is submitted
      Then "someone@example.com" is nowhere in the page's address
      And "someone@example.com" is nowhere on the page

  Rule: reCAPTCHA must judge the reader a person

    Scenario: A registration without reCAPTCHA's judgement is sent to be told why
      Given a viewport 1200 pixels wide
      When a registration for "someone@example.com" arrives without reCAPTCHA's judgement
      Then the java script required page is shown

    Scenario: Nothing is recorded of a registration without a judgement
      Given a viewport 1200 pixels wide
      When a registration for "someone@example.com" arrives without reCAPTCHA's judgement
      Then there is no account for "someone@example.com"

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
      Then there is no account for "someone@example.com"

  Rule: The page is in the reader's language

    Scenario: Every word in the dialog is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the register page is opened with scripting on
      Then every word in the dialog is in the test locale
