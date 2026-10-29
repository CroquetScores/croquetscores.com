@browser @postgres
Feature: Signing in with Google

  The sign in page offers a reader a way to sign in with the Google account
  they already have, rather than with their email address and password. It is
  the same round trip as registering with Google (`google.feature`): pressing
  it sends them to Google to say who they are, and Google sends them back
  here. What the site then does with who Google says they are is
  `SignInWithGoogle.feature`'s, and it does not ask which page the reader
  pressed it on. So a reader new to the site who signs in with Google is given
  an account, as they would have been by registering with Google: turning
  them away to press the same button on another page would ask something of
  them and prove nothing. What is here is the sign in page, where the reader
  lands, and where they are brought back to when Google does not vouch for
  them.

  Only a site that has been given Google's credentials offers it, for the
  reason the register page does: a button that could only fail is worse than
  none.

  The sign in page needs no scripting, and the offer is a link, so it needs
  none either. What Google's own page asks of a browser is Google's.

  Signing in with Google goes back to the page that sent the reader to sign
  in, as signing in with a password does, and judged by the same rule, so that
  which page is gone back to does not depend on which way the reader chose to
  come in. Which addresses that rule refuses is `signIn.feature`'s; the
  scenarios here show only that the rule is the one applied.

  Signing in with Google is not held by the sign in limits, and does not count
  toward them. The limits are there so that the sign in page cannot be used to
  guess passwords, and no password is given here: the reader has been through
  Google's own sign-in, which has limits of its own. Holding it would also
  take away the other way in from a reader whose address somebody else has
  held by failing to sign in to it, which is the cost `signIn.feature` says
  the limits have.

  A way back from Google is taken only from a reader this site sent there, and
  only once. That guard is the way back's, whichever page sent the reader, and
  it is held to it in `google.feature`; it is not said again here.

  Google is not asked by these scenarios. A stand-in plays its part, as it
  does in `google.feature`.

  Rule: The sign in page offers signing in with Google where the site can

    Scenario: The sign in page offers signing in with Google
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the page offers signing in with Google

    Scenario: A site without Google's credentials does not
      Given a viewport 1200 pixels wide
      And a site that has not been given Google's credentials
      When the sign in page is opened
      Then the page does not offer signing in with Google

    Scenario: The offer is there with scripting off
      Given a viewport 1200 pixels wide
      When the sign in page is opened with scripting off
      Then the page offers signing in with Google

    Scenario: The offer is in the reader's language
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the sign in page is opened
      Then the offer to sign in with Google is in the test locale

  Rule: The offer to sign in with Google is a button at the top of the dialog

    The offer sits where it sits on the register page, for the same reasons: it
    asks nothing more than pressing it, so it comes above the email address
    field, drawn as every button but the submit button is, carrying Google's
    icon, as wide as the email address field, with a line saying "OR" between
    them. It is not one of the buttons stacked beneath the fields, which stay
    as `signIn.feature` has them, signing in first: the submit button is still
    the way forward for the form it is beneath.

    Scenario: The offer is a button
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google is a button

    Scenario: The offer looks like a button other than the submit button
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google looks like a button other than the submit button

    Scenario: The offer carries Google's icon
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google carries Google's icon

    Scenario: The offer is in the dialog
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google is in the dialog

    Scenario: The offer is beneath the title bar
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google is beneath the dialog's title bar

    Scenario: The offer is above the email address field
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google is above the email address field

    Scenario: The offer is as wide as the email address field
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the offer to sign in with Google is as wide as the email address field

    Scenario: A reader Google turned away is told so above the offer
      Given a viewport 1200 pixels wide
      And Google cannot be reached
      And the sign in page is open
      When the reader signs in with Google
      Then the message for "Google.Unreachable" is above the offer to sign in with Google

    Scenario: "OR" is beneath the offer
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the line saying "OR" is beneath the offer to sign in with Google

    Scenario: "OR" is above the email address field
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the line saying "OR" is above the email address field

    Scenario: "OR" is centred in the dialog
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the line saying "OR" is centred in the dialog

    Scenario: A site with neither Google's nor Facebook's credentials says no "OR"
      Given a viewport 1200 pixels wide
      And a site that has been given neither Google's nor Facebook's credentials
      When the sign in page is opened
      Then the dialog has no line saying "OR"

    Scenario: The submit button is still the first of the dialog's buttons
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the submit button is the first of the dialog's buttons

  Rule: Signing in with Google signs the reader in

    Scenario: A reader with an account is signed in to it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: A reader new to the site is signed in to a new account
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the reader is signed in to the account for "someone@example.com"

  Rule: Signing in with Google goes back to the page that sent the reader, if it is on this site

    The way to Google is an address like any other, and a link elsewhere can
    send a reader along it without the sign in page ever having been opened,
    carrying wherever that link likes to go back to. The sign in page judges
    where to go back to before putting it in its offer, so the scenarios that
    open it would pass with nothing judging it on the way to Google. So the
    way to Google is held to the same rule on its own, by a reader sent along
    it from elsewhere.

    Scenario: A reader signing in with Google with nowhere to go back to arrives at the admin
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the admin is shown

    Scenario: A reader sent to sign in is taken back once signed in with Google
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open, to go back to "/account/forget-account"
      When the reader signs in with Google
      Then the reader is taken to "/account/forget-account"

    Scenario Outline: A sign in page asked to go back anywhere but a path on this site sends a reader signed in with Google to the admin
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open, to go back to "<where>"
      When the reader signs in with Google
      Then the admin is shown

      Examples:
        | where                      |
        | https://elsewhere.example/ |
        | //elsewhere.example/       |

    Scenario Outline: A way to Google from elsewhere, asked to go back anywhere but a path on this site, sends the reader to the admin
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      When the reader follows a link from elsewhere to sign in with Google, to go back to "<where>"
      Then the admin is shown

      Examples:
        | where                      |
        | https://elsewhere.example/ |
        | //elsewhere.example/       |

  Rule: Signing in with Google is not held by the sign in limits, and does not count toward them

    Scenario: An email address held by the limit signs in with Google
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And signing in as "someone@example.com" has failed 10 times in the last hour
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: An IP address held by the limit signs in with Google
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And this IP address has failed to sign in 30 times in the last hour
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the reader is signed in to the account for "someone@example.com"

    Scenario: Signing in with Google is not counted
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then signing in as "someone@example.com" has been counted 0 times

  Rule: A reader Google does not vouch for is brought back to sign in, and told why

    A reader who pressed the offer on the sign in page came to sign in, so that
    is where they are brought back to, and not to the register page, which is
    where a reader who pressed it there is brought back to. The page they were
    to go back to is kept, so that signing in with their password instead still
    takes them there.

    Scenario: A reader who turns Google down is brought back to the sign in page
      Given a viewport 1200 pixels wide
      And the reader will turn Google down
      And the sign in page is open
      When the reader signs in with Google
      Then the sign in page is shown

    Scenario: A reader who turns Google down is signed in to nothing
      Given a viewport 1200 pixels wide
      And the reader will turn Google down
      And the sign in page is open
      When the reader signs in with Google
      Then the reader is signed out

    Scenario: An email address Google has not verified is said on the sign in page
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has not verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the dialog says the message for "SignInWithGoogle.EmailAddressNotVerified"

    Scenario: A Google account that gives no name is said on the sign in page
      Given a viewport 1200 pixels wide
      And Google knows the reader as "google-subject-1"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google gives no name
      And the sign in page is open
      When the reader signs in with Google
      Then the dialog says the message for "SignInWithGoogle.NameMissing"

    Scenario: An account linked to another Google account is said on the sign in page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Google account "google-subject-1"
      And Google knows the reader as "google-subject-2"
      And Google gives the email address "someone@example.com"
      And Google has verified the email address
      And Google calls the reader "Sam Someone"
      And the sign in page is open
      When the reader signs in with Google
      Then the dialog says the message for "SignInWithGoogle.LinkedToAnother"

    Scenario: Google that cannot be reached is said on the sign in page
      Given a viewport 1200 pixels wide
      And Google cannot be reached
      And the sign in page is open
      When the reader signs in with Google
      Then the dialog says the message for "Google.Unreachable"

    Scenario: A reader Google turned away still goes back where they were sent from, signing in with their password
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And Google cannot be reached
      And the sign in page is open, to go back to "/account/forget-account"
      And the reader has signed in with Google
      When the reader signs in as "someone@example.com" with the password "correct horse battery staple"
      Then the reader is taken to "/account/forget-account"
