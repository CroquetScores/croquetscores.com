@browser @postgres
Feature: Registering with Google

  The register page offers a reader a way to register with the Google account
  they already have, rather than by email address. Pressing it sends them to
  Google to say who they are, and Google sends them back here. What the site
  then does with who Google says they are — signing in to the account at that
  address, linking it, or making one — is `SignInWithGoogle.feature`'s. What
  is here is the page, the round trip, and where the reader lands: signed in,
  in the admin. The admin is open to every reader whose email address is
  confirmed, and an account made by registering with Google is confirmed.

  Only a site that has been given Google's credentials offers it. A site
  without them has nothing to send a reader to Google with, and a button that
  could only fail is worse than none.

  The way back from Google is a request anybody could make, and a page
  elsewhere could send a reader's browser along it carrying a sign-in of its
  own choosing, leaving the reader signed in to somebody else's account
  without knowing it. So a way back is taken only from a reader this site sent
  to Google, in this browser, a moment ago. Anything else signs nobody in.

  Registering with Google is not judged by reCAPTCHA, as registering by email
  address is. A reader who comes back from Google has been through Google's
  own sign-in, and that is more than reCAPTCHA would have asked of them.

  Google is not asked by these scenarios. A stand-in plays its part, saying
  whatever each scenario has it say, and signs what it says with a key of the
  scenarios' own for the site to check as it would Google's.

  Rule: The register page offers registering with Google where the site can

    Scenario: The register page offers registering with Google
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the page offers registering with Google

    Scenario: A site without Google's credentials does not
      Given a viewport 1200 pixels wide
      And a site that has not been given Google's credentials
      When the register page is opened with scripting on
      Then the page does not offer registering with Google

    Scenario: The offer is in the reader's language
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the register page is opened with scripting on
      Then the offer to register with Google is in the test locale

  Rule: Registering with Google signs the reader in, and takes them to the admin

    Scenario: A reader new to the site is signed in to a new account
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Google
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A reader with an account is signed in to it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Google
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: The reader is taken to the admin
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Google
      Then the admin is shown

  Rule: A way back from Google is taken only from a reader this site sent there

    A way back is taken once. Google takes a code once as well, so a way back
    followed again is refused by Google whatever the site does, and a scenario
    of that alone would pass with the site taking the same way back twice.
    The site's guard is its own, and is not to lean on Google's: so it is held
    to it with a Google that would take the code again.

    Scenario: A way back this site did not send the reader on signs nobody in
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When the reader arrives back from Google without having been sent there
      Then the reader is signed out

    Scenario: A way back this site did not send the reader on makes no account
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When the reader arrives back from Google without having been sent there
      Then "someone@example.com" has no account

    Scenario: A way back used twice signs nobody in the second time
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the register page is open with scripting on
      And the reader has registered with Google
      And nobody is signed in
      When the reader follows the same way back from Google again
      Then the reader is signed out

    Scenario: A way back used twice signs nobody in the second time, even where Google would take its code again
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And Google will take a code more than once
      And the register page is open with scripting on
      And the reader has registered with Google
      And nobody is signed in
      When the reader follows the same way back from Google again
      Then the reader is signed out

  Rule: A reader Google does not vouch for is brought back to register, and told why

    Scenario: A reader who turns Google down is brought back to the register page
      Given a viewport 1200 pixels wide
      And the reader will turn Google down
      And the register page is open with scripting on
      When the reader registers with Google
      Then the register page is shown

    Scenario: A reader who turns Google down is signed in to nothing
      Given a viewport 1200 pixels wide
      And the reader will turn Google down
      And the register page is open with scripting on
      When the reader registers with Google
      Then the reader is signed out

    Scenario: An email address Google has not verified is said on the register page
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has not verified the email address
      And Google calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Google
      Then the dialog says the message for "SignInWithGoogle.EmailAddressNotVerified"

    Scenario: A Google account that gives no name is said on the register page
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      And the register page is open with scripting on
      When the reader registers with Google
      Then the dialog says the message for "SignInWithGoogle.NameMissing"

    Scenario: An account linked to another Google account is said on the register page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-2"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Google
      Then the dialog says the message for "SignInWithGoogle.LinkedToAnother"

    Scenario: Google that cannot be reached is said on the register page
      Given a viewport 1200 pixels wide
      And Google cannot be reached
      And the register page is open with scripting on
      When the reader registers with Google
      Then the dialog says the message for "Google.Unreachable"
