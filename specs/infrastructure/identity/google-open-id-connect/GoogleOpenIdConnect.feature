Feature: Believing who Google says came back, and only that

  A reader who registers with Google is sent there and comes back with a code.
  The site exchanges the code with Google, over the back channel and with its
  own secret, for an ID token saying who the reader is, and believes the token
  only once it has checked it: that it is signed with one of the keys Google
  publishes, that Google issued it, that it was issued to this site, that it
  has not expired, and that it carries the nonce this site sent the reader to
  Google with. Those checks are the whole of what stops somebody else's token
  — one Google made for another site, one kept from last week, one made up —
  signing a reader in here as whoever it names. So each is held to a token
  that fails it and nothing else, and each such token is refused.

  A token that is not believed is refused with `Google.Refused`. Google that
  could not be asked is `Google.Unreachable` instead, because the two are told
  to the reader differently: one is a sign-in that did not work, the other a
  service that will be back. Google answering with something it should not —
  its keys asked for and something other than keys sent — is Google being
  unwell, not the token being bad, and is unreachable too.

  A code Google will not exchange — one already used, or one sent without the
  verifier it was asked for with, which is what keeps a code taken from a
  reader's address bar from being any use to whoever took it — is refused,
  since it is the sign-in and not Google that is at fault.

  These scenarios stand a fake of Google up in its place, and call it Google in
  their steps because that is what it is standing in for. It says whatever each
  scenario has Google say, and signs what it says with a key made for the run,
  which the site is told is Google's.

  Background:
    Given a fake of Google
    And Google knows the reader as "google-subject-1"
    And Google gives the email address "someone@example.com"
    And Google has verified the email address
    And Google calls the reader "Sam Someone"

  Rule: A token Google made for this sign-in says who came back

    Scenario: The reader is known by the subject Google knows them by
      Given the reader has been sent to Google
      When who came back from Google is asked
      Then the reader is known to Google as "google-subject-1"

    Scenario: The reader's email address is the one Google gives
      Given the reader has been sent to Google
      When who came back from Google is asked
      Then the reader's email address is "someone@example.com"

    Scenario: An email address Google has verified is said to be verified
      Given the reader has been sent to Google
      When who came back from Google is asked
      Then the reader's email address is said to be verified

    Scenario: An email address Google has not verified is said not to be
      Given Google has not verified the email address
      And the reader has been sent to Google
      When who came back from Google is asked
      Then the reader's email address is said not to be verified

    Scenario: The reader is called what Google calls them
      Given the reader has been sent to Google
      When who came back from Google is asked
      Then the reader is called "Sam Someone"

    Scenario: A reader Google gives no name has none
      Given Google gives no name
      And the reader has been sent to Google
      When who came back from Google is asked
      Then the reader has no name

  Rule: A token that should not be believed is refused

    Scenario: A token signed with a key Google does not publish is refused
      Given the reader has been sent to Google
      And Google will sign the token with a key it does not publish
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token that is not signed at all is refused
      Given the reader has been sent to Google
      And Google will not sign the token
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token issued by somebody other than Google is refused
      Given the reader has been sent to Google
      And Google will name another issuer in the token
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token issued to another site is refused
      Given the reader has been sent to Google
      And Google will issue the token to another site
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token that has expired is refused
      Given the reader has been sent to Google
      And Google will issue the token already expired
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token carrying another nonce is refused
      Given the reader has been sent to Google
      And Google will put another nonce in the token
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token carrying no nonce is refused
      Given the reader has been sent to Google
      And Google will put no nonce in the token
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

    Scenario: A token naming nobody is refused
      Given the reader has been sent to Google
      And Google will name no subject in the token
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

  Rule: A code Google will not exchange is refused

    Scenario: A code already exchanged is refused
      Given the reader has been sent to Google
      And who came back from Google has been asked
      When who came back from Google is asked again with the same code
      Then it is refused with "Google.Refused"

    Scenario: A code exchanged without the verifier it was asked for with is refused
      Given the reader has been sent to Google
      And the verifier the reader was sent with is lost
      When who came back from Google is asked
      Then it is refused with "Google.Refused"

  Rule: Google that cannot be asked, or answers wrongly, is unreachable

    Scenario: Google that cannot be reached is unreachable
      Given the reader has been sent to Google
      And Google cannot be reached
      When who came back from Google is asked
      Then it is refused with "Google.Unreachable"

    Scenario: Google that hangs up on the exchange is unreachable
      Given the reader has been sent to Google
      And Google will hang up on the exchange
      When who came back from Google is asked
      Then it is refused with "Google.Unreachable"

    Scenario: Keys that cannot be fetched are Google unreachable
      Given the reader has been sent to Google
      And Google will not answer for its keys
      When who came back from Google is asked
      Then it is refused with "Google.Unreachable"

    Scenario: Something other than keys, answered for its keys, is Google unreachable
      Given the reader has been sent to Google
      And Google will answer for its keys with something that is not keys
      When who came back from Google is asked
      Then it is refused with "Google.Unreachable"
