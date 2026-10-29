@postgres
Feature: Signing in with Facebook

  Signing in with Facebook is asked for with what Facebook has said about the
  reader: the id it knows them by, their email address and their name. What
  Facebook said has been checked to be Facebook's by the time it gets here; this
  is what the site does with it. It answers with the account signed in to, as
  signing in with a password does (`SignIn.feature`) and signing in with Google
  does (`SignInWithGoogle.feature`), and holding the session that follows is the
  web layer's.

  A Facebook account already linked to an account signs in to that account, and
  is found by its id alone, whatever email address it carries now.

  One not yet linked is matched by its email address, as a Google account is.
  This differs from Google in one way that matters: Facebook does not say
  whether it has verified the address, as Google does. It gives an address only
  where the reader has one on Facebook that it has confirmed, and the site
  takes that to be the reader's, as surely as one they followed a link from.
  So an account at that address is linked to the Facebook account and signed in
  to, keeping the name and the password it had. An account at that address not
  yet confirmed is confirmed by it, called what Facebook calls the reader, and
  left with no password. An account already linked to another Facebook account
  is refused rather than linked again or taken over.

  An address with no account gets one, confirmed, called what Facebook calls
  the reader, and linked, with no password. The reader signs in with Facebook,
  and one who wants to sign in with a password as well has a link sent to set
  one (`setPassword.feature`). An account that has been forgotten is not there
  to be found, so its address gets a new account, as registering it again
  would.

  Facebook does not always give an email address: a reader may have none on
  Facebook, or none confirmed, or may have not allowed it. A Facebook account
  already linked does not need one. One not yet linked does, since the address
  is what it is matched or made by, and is refused without one before anything
  is looked up, rather than being given an address it did not choose.

  Facebook always gives a name, and so a Facebook account is never refused for
  want of one, as a Google account may be.

  These scenarios run against Postgres, with the application's event store and
  read models, and a password hasher.

  Background:
    Given the application's signing in with Facebook
    And the moment "2026-09-19T10:00:00Z"

  Rule: A Facebook account already linked signs in to its account

    Scenario: A linked Facebook account signs in to its account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: A linked Facebook account is found whatever email address it now carries
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "sam@example.org"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: Signing in with Facebook is recorded on the account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the last thing the account for "someone@example.com" recorded is its signing in

  Rule: A Facebook account not yet linked is linked to the account at its email address

    Scenario: The account at the email address is signed in to
      Given "someone@example.com" has an account, confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The account at the email address is linked to the Facebook account
      Given "someone@example.com" has an account, confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is linked to the Facebook account "facebook-id-1"

    Scenario: The email address is found in any case
      Given "someone@example.com" has an account, confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "Someone@Example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The account keeps the name it had
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Samantha Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: The account keeps the password it had
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And signing in with Facebook has been sent
      When signing in as "someone@example.com" with the password "correct horse battery staple" is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: An account not yet confirmed is confirmed
      Given "someone@example.com" has an account, not confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is confirmed

    Scenario: An account not yet confirmed is left with no password
      Given "someone@example.com" has an account, not confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" has no password

    Scenario: An account not yet confirmed is called what Facebook calls the reader
      Given "someone@example.com" has an account, not confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: An account not yet confirmed is linked to the Facebook account
      Given "someone@example.com" has an account, not confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is linked to the Facebook account "facebook-id-1"

  Rule: A Facebook account that gives no email address is refused where one is needed

    Scenario: No email address with no account is refused
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives no email address
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is refused with "SignInWithFacebook.EmailAddressMissing"

    Scenario: Something that is not an email address is refused as no email address
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "this is not an address"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is refused with "SignInWithFacebook.EmailAddressMissing"

    Scenario: No email address links no account
      Given "someone@example.com" has an account, confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives no email address
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is linked to no Facebook account

    Scenario: No email address for a Facebook account already linked signs in to its account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives no email address
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

  Rule: An account linked to another Facebook account is not linked again

    Scenario: A second Facebook account for the same email address is refused
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-2"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is refused with "SignInWithFacebook.LinkedToAnother"

    Scenario: The first Facebook account stays linked
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And Facebook knows the reader as "facebook-id-2"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is linked to the Facebook account "facebook-id-1"

  Rule: An email address with no account gets one

    Scenario: The reader is signed in to a new account
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

    Scenario: The new account is confirmed
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is confirmed

    Scenario: The new account is called what Facebook calls the reader
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: The new account is linked to the Facebook account
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is linked to the Facebook account "facebook-id-1"

    Scenario: The new account has no password
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" has no password

    Scenario: Nothing is emailed about the new account
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then nothing is queued to be sent

    Scenario: A forgotten account's email address gets a new account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" has been forgotten
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with a new account for "someone@example.com"

    Scenario: A Facebook account linked to a forgotten account gets a new account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And the account for "someone@example.com" has been forgotten
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with a new account for "someone@example.com"

  Rule: A second signing in that looked before the first had linked signs in too

    Two first signings in with the same Facebook account can arrive together, as
    a double click sends them. Both look for the Facebook account before either
    has linked it, and neither finds it. The first links it to the account at
    its email address, making the account if there was none. The second then
    finds that account linked to the Facebook account it is signing in with,
    which is not another Facebook account, so it signs in rather than being
    refused.

    Scenario: A second signing in that looked too early is answered with the account
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      And signing in with Facebook has been sent
      And the next signing in with Facebook looks for its Facebook account before it is linked
      When signing in with Facebook is sent
      Then it is answered with the account for "someone@example.com"

  Rule: Signings in with the same Facebook account at once all sign in

    The rule above stands where the second of two signings in stands. This is
    the two, or more, run for real, each in a transaction of its own. Where the
    account at the email address is already there, none of them makes it, so
    nothing makes the later ones wait: each loads the account as it was before
    any had linked it, and all but the first would find it changed under them
    when they came to keep what they did, and be refused for it. So whoever
    finds the account at the address holds it until they are done, as whoever
    makes one does, and the next finds it linked.

    Scenario: Signings in at once to an account already there are each answered with it
      Given "someone@example.com" has an account, confirmed
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When 5 signings in with Facebook are sent at once
      Then each of them is answered with the account for "someone@example.com"

    Scenario: Signings in at once for an address with no account are each answered with the one account made
      Given Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When 5 signings in with Facebook are sent at once
      Then each of them is answered with the account for "someone@example.com"

  Rule: A Facebook account whose account is forgotten while it waits gets a new account

    A signing in with a Facebook account already linked finds the account, and
    then waits its turn to hold it. If the account's owner is having it
    forgotten meanwhile, the account it holds once its turn comes is
    forgotten. Found a moment later, the Facebook account would have been linked
    to nothing, and a Facebook account linked to a forgotten account gets a new
    account. So this one does too, rather than the reader seeing the site
    fail.

    Scenario: A Facebook account whose account is forgotten while it waits is answered with a new account
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And the next signing in with Facebook finds its account before it is forgotten
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then it is answered with a new account for "someone@example.com"

    Scenario: The new account is linked to the Facebook account whose account was forgotten while it waited
      Given "someone@example.com" has an account, confirmed
      And the account for "someone@example.com" was linked to the Facebook account "facebook-id-1"
      And the next signing in with Facebook finds its account before it is forgotten
      And Facebook knows the reader as "facebook-id-1"
      And Facebook gives the email address "someone@example.com"
      And Facebook calls the reader "Sam Someone"
      When signing in with Facebook is sent
      Then the account for "someone@example.com" is linked to the Facebook account "facebook-id-1"
