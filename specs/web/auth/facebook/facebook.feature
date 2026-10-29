@browser @postgres
Feature: Registering with Facebook

  The register page offers a reader a way to register with the Facebook
  account they already have, as it offers Google (`google.feature`), rather
  than by email address. Pressing it sends them to Facebook to say who they
  are, and Facebook sends them back here. What the site then does with who
  Facebook says they are — signing in to the account at that address, linking
  it, or making one — is `SignInWithFacebook.feature`'s. What is here is the
  page, the round trip, and where the reader lands: signed in, in the admin,
  which is open to every reader whose email address is confirmed, and an
  account made by registering with Facebook is confirmed.

  Only a site that has been given Facebook's credentials offers it, and each
  offer on a site is there for its own credentials: a site with Google's and
  not Facebook's offers only Google, and the other way about. A site with
  neither has nothing to offer, and a button that could only fail is worse
  than none.

  The way back from Facebook is a request anybody could make, and a page
  elsewhere could send a reader's browser along it carrying a sign-in of its
  own choosing, leaving the reader signed in to somebody else's account
  without knowing it. So a way back is taken only from a reader this site sent
  to Facebook, in this browser, a moment ago, and carrying the state it was
  sent with. Anything else signs nobody in.

  Registering with Facebook is not judged by reCAPTCHA, as registering by
  email address is: a reader who comes back from Facebook has been through
  Facebook's own sign-in.

  Registering with Facebook is agreeing to the terms of use for those who
  write, as registering by email address is (`register.feature`), so the box
  that agrees to them, beneath the offers, must be ticked before an offer is
  pressed. A reader who presses one without is brought back to the register
  page before Facebook is asked anything, with the box said to need ticking.
  Where a scenario registers with Facebook and says nothing of the box, it is
  ticked.

  Facebook is not asked by these scenarios. A stand-in plays its part, saying
  whatever each scenario has it say.

  Rule: The register page offers registering with Facebook where the site can

    Scenario: The register page offers registering with Facebook
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the page offers registering with Facebook

    Scenario: A site without Facebook's credentials does not
      Given a viewport 1200 pixels wide
      And a site that has not been given Facebook's credentials
      When the register page is opened with scripting on
      Then the page does not offer registering with Facebook

    Scenario: The offer is in the reader's language
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the register page is opened with scripting on
      Then the offer to register with Facebook is in the test locale

  Rule: The offer to register with Facebook is a button beneath Google's

    Registering with Facebook asks nothing more of the reader than pressing it,
    so it stands where Google's offer does, above the email address field, drawn
    as every button but the submit button is, carrying Facebook's icon and as
    wide as the email address field. Where the site offers both, Facebook's is
    directly beneath Google's, the two read as one row of alternatives to the
    form, and the line saying "OR" is beneath them both. A site that offers only
    Facebook has its offer at the top of the dialog, as a site that offers only
    Google has Google's. A message saying why Facebook turned the reader away
    stays at the top of the dialog, above the offers.

    Scenario: The offer is a button
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is a button

    Scenario: The offer looks like a button other than the submit button
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook looks like a button other than the submit button

    Scenario: The offer carries Facebook's icon
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook carries Facebook's icon

    Scenario: The offer is in the dialog
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is in the dialog

    Scenario: The offer is beneath the title bar
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is beneath the dialog's title bar

    Scenario: The offer is above the email address field
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is above the email address field

    Scenario: The offer is as wide as the email address field
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is as wide as the email address field

    Scenario: A reader Facebook turned away is told so above the offer
      Given a viewport 1200 pixels wide
      And Facebook cannot be reached
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the message for "Facebook.Unreachable" is above the offer to register with Facebook

    Scenario: "OR" is above the email address field
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the line saying "OR" is above the email address field

    Scenario: "OR" is centred in the dialog
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the line saying "OR" is centred in the dialog

    Scenario: The offer is beneath the offer to register with Google
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is beneath the offer to register with Google

    Scenario: The offer is as wide as the offer to register with Google
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the offer to register with Facebook is as wide as the offer to register with Google

    Scenario: "OR" is beneath the offers
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the line saying "OR" is beneath the offer to register with Facebook

    Scenario: A site with only Facebook's credentials has the offer at the top of the dialog
      Given a viewport 1200 pixels wide
      And a site that has not been given Google's credentials
      When the register page is opened with scripting on
      Then the offer to register with Facebook is beneath the dialog's title bar

    Scenario: A site with only Facebook's credentials still says "OR"
      Given a viewport 1200 pixels wide
      And a site that has not been given Google's credentials
      When the register page is opened with scripting on
      Then the line saying "OR" is beneath the offer to register with Facebook

    Scenario: A site with neither Google's nor Facebook's credentials says no "OR"
      Given a viewport 1200 pixels wide
      And a site that has been given neither Google's nor Facebook's credentials
      When the register page is opened with scripting on
      Then the dialog has no line saying "OR"

  Rule: One box agrees to the terms of use for the offers beneath it

    Registering with Google has a box of its own beneath its offer, apart from
    the one beneath the email address field (`google.feature`). With two offers
    the box is not drawn twice: one stands beneath the lower of them, above the
    line saying "OR", and agrees to the terms for registering with either. It is
    the box registering with Google reads, and the one registering with Facebook
    reads. As for Google, it is not kept in step with the box beneath the email
    address field: each belongs to the way in it sits with.

    Scenario: The offers have one box agreeing to the terms of use beneath them
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog asks the reader to agree to the terms of use beneath the offer to register with Facebook

    Scenario: The box is beneath the offer to register with Facebook
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the box beneath the offers is beneath the offer to register with Facebook

    Scenario: The box is above the line saying "OR"
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the box beneath the offers is above the line saying "OR"

    Scenario: The box links to the terms of use for those who write
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the box beneath the offers links to the terms of use for those who write

    Scenario: A site with only Facebook's credentials has the box beneath its offer
      Given a viewport 1200 pixels wide
      And a site that has not been given Google's credentials
      When the register page is opened with scripting on
      Then the dialog asks the reader to agree to the terms of use beneath the offer to register with Facebook

    Scenario: A site with neither Google's nor Facebook's credentials has only the form's box
      Given a viewport 1200 pixels wide
      And a site that has been given neither Google's nor Facebook's credentials
      When the register page is opened with scripting on
      Then the dialog has one box agreeing to the terms of use

    Scenario: Agreeing only beneath the email address field is not agreeing for Facebook
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook having agreed to the terms of use only beneath the email address field
      Then the box beneath the offers says the message for "TermsOfUse.NotAgreed"

  Rule: Registering with Facebook signs the reader in, and takes them to the admin

    Scenario: A reader new to the site is signed in to a new account
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A reader with an account is signed in to it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: The reader is taken to the admin
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the admin is shown

  Rule: Registering with Facebook needs the terms of use agreed to first

    Scenario: A reader who has not agreed is brought back to the register page
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook without agreeing to the terms of use
      Then the register page is shown

    Scenario: A reader who has not agreed is told to tick the box
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook without agreeing to the terms of use
      Then the box beneath the offers says the message for "TermsOfUse.NotAgreed"

    Scenario: A reader who has not agreed is given no account
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook without agreeing to the terms of use
      Then "someone@example.com" has no account

  Rule: A way back from Facebook is taken only from a reader this site sent there

    A way back is taken once. Facebook takes a code once as well, so a way back
    followed again is refused by Facebook whatever the site does, and a scenario
    of that alone would pass with the site taking the same way back twice.
    The site's guard is its own, and is not to lean on Facebook's: so it is held
    to it with a Facebook that would take the code again.

    Scenario: A way back this site did not send the reader on signs nobody in
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When the reader arrives back from Facebook without having been sent there
      Then the reader is signed out

    Scenario: A way back this site did not send the reader on makes no account
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When the reader arrives back from Facebook without having been sent there
      Then "someone@example.com" has no account

    Scenario: A way back used twice signs nobody in the second time
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      And the reader has registered with Facebook
      And nobody is signed in
      When the reader follows the same way back from Facebook again
      Then the reader is signed out

    Scenario: A way back used twice signs nobody in the second time, even where Facebook would take its code again
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And Facebook will take a code more than once
      And the register page is open with scripting on
      And the reader has registered with Facebook
      And nobody is signed in
      When the reader follows the same way back from Facebook again
      Then the reader is signed out

  Rule: A reader Facebook does not vouch for is brought back to register, and told why

    Scenario: A reader who turns Facebook down is brought back to the register page
      Given a viewport 1200 pixels wide
      And the reader will turn Facebook down
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the register page is shown

    Scenario: A reader who turns Facebook down is signed in to nothing
      Given a viewport 1200 pixels wide
      And the reader will turn Facebook down
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the reader is signed out

    Scenario: A Facebook account that gives no email address is said on the register page
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives no email address
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the dialog says the message for "SignInWithFacebook.EmailAddressMissing"

    Scenario: An account linked to another Facebook account is said on the register page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-2"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the dialog says the message for "SignInWithFacebook.LinkedToAnother"

    Scenario: Facebook turning the sign-in away is said on the register page
      Given a viewport 1200 pixels wide
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And Facebook will refuse the access token it gave
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the dialog says the message for "Facebook.Refused"

    Scenario: Facebook that cannot be reached is said on the register page
      Given a viewport 1200 pixels wide
      And Facebook cannot be reached
      And the register page is open with scripting on
      When the reader registers with Facebook
      Then the dialog says the message for "Facebook.Unreachable"

  Rule: Facebook is told to send the reader back to the address they came by

    Facebook sends a reader back only to an address it was given beforehand, so
    it is the address of the website the reader is on that it is told, and
    never one worked out from anything the request says of itself. The beta
    site is its own address for this, though it keeps croquetscores.com's data:
    a reader who signed in from beta.croquetscores.com comes back to it, not to
    croquetscores.com (`Website.feature`).

    Scenario Outline: The way back is the website's own address
      Given a site served as "<host>"
      When the way to Facebook is followed
      Then Facebook is told to send the reader back to "<address>"

      Examples:
        | host                   | address                                         |
        | croquetscores.com      | https://croquetscores.com/auth/facebook/callback  |
        | beta.croquetscores.com | https://beta.croquetscores.com/auth/facebook/callback |
        | try.croquetscores.com  | https://try.croquetscores.com/auth/facebook/callback |
        | gateballscores.com     | https://gateballscores.com/auth/facebook/callback |
