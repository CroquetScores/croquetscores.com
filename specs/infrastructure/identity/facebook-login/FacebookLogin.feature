Feature: Believing who Facebook says came back, and only that

  A reader who registers with Facebook is sent there and comes back with a
  code. Facebook, unlike Google, sends no signed token saying who the reader
  is that can be checked here, so the site asks. It exchanges the code with
  Facebook, over the back channel and with its own secret, for an access token,
  and with that asks Facebook's Graph for the reader's id, name and email
  address. What Facebook answers to that is believed, and nothing else is: not
  anything in the reader's address bar, which the reader could write.

  The code is what ties the answer to this sign-in. Facebook gives a token for
  a code only once, only to the site it was made for, and only to the return
  address it was asked for with, so a code taken from somebody's address bar,
  already used, or made for another site or another address, is of no use to
  whoever took it. The Graph is asked with proof of the site's secret as well,
  which Facebook can be set to require, so that an access token taken from the
  site's own traffic cannot be used from anywhere else.

  The reader's id is the one Facebook knows them by for this site. Their email
  address is what Facebook gives or nothing: Facebook gives none where the
  reader has no address confirmed with it, or has not allowed it, and there is
  no saying so in the answer beyond its being absent. Whether to go on without
  one is the application's to decide (`SignInWithFacebook.feature`).

  An answer that is not believed is refused with `Facebook.Refused`. Facebook
  that could not be asked is `Facebook.Unreachable` instead, because the two
  are told to the reader differently: one is a sign-in that did not work, the
  other a service that will be back. Facebook answering with something it
  should not, or with an error of its own, is Facebook being unwell and not
  the sign-in being bad, and is unreachable too.

  These scenarios stand a fake of Facebook up in its place, and call it
  Facebook in their steps because that is what it is standing in for. It says
  whatever each scenario has Facebook say.

  Background:
    Given a fake of Facebook
    And Facebook knows the reader as "facebook-id-1"
    And Facebook gives the email address "someone@example.com"
    And Facebook calls the reader "Sam Someone"

  Rule: What Facebook says of the reader who came back is who they are

    Scenario: The reader is known by the id Facebook knows them by
      Given the reader has been sent to Facebook
      When who came back from Facebook is asked
      Then the reader is known to Facebook as "facebook-id-1"

    Scenario: The reader's email address is the one Facebook gives
      Given the reader has been sent to Facebook
      When who came back from Facebook is asked
      Then the reader's email address is "someone@example.com"

    Scenario: The reader is called what Facebook calls them
      Given the reader has been sent to Facebook
      When who came back from Facebook is asked
      Then the reader is called "Sam Someone"

    Scenario: A reader Facebook gives no email address has none
      Given Facebook gives no email address
      And the reader has been sent to Facebook
      When who came back from Facebook is asked
      Then the reader has no email address

    Scenario: Facebook is asked with proof of the site's secret
      Given Facebook requires proof of the site's secret
      And the reader has been sent to Facebook
      When who came back from Facebook is asked
      Then the reader is known to Facebook as "facebook-id-1"

  Rule: An answer that should not be believed is refused

    Scenario: An access token Facebook will not accept is refused
      Given the reader has been sent to Facebook
      And Facebook will refuse the access token it gave
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Refused"

    Scenario: An exchange that gives no access token is refused
      Given the reader has been sent to Facebook
      And Facebook will give no access token for the code
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Refused"

    Scenario: An answer naming nobody is refused
      Given the reader has been sent to Facebook
      And Facebook will name no id for the reader
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Refused"

    Scenario: An answer giving no name is refused
      Given the reader has been sent to Facebook
      And Facebook will give no name for the reader
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Refused"

    Scenario: A proof of the secret that Facebook does not accept is refused
      Given Facebook requires proof of the site's secret
      And the reader has been sent to Facebook
      And Facebook will not accept the site's proof
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Refused"

  Rule: A code Facebook will not exchange is refused

    Scenario: A code already exchanged is refused
      Given the reader has been sent to Facebook
      And who came back from Facebook has been asked
      When who came back from Facebook is asked again with the same code
      Then it is refused with "Facebook.Refused"

    Scenario: A code exchanged for another return address is refused
      Given the reader has been sent to Facebook
      When who came back from Facebook is asked with another return address
      Then it is refused with "Facebook.Refused"

    Scenario: A code made for another site is refused
      Given the reader has been sent to Facebook
      And Facebook made the code for another site
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Refused"

  Rule: Facebook that cannot be asked, or answers wrongly, is unreachable

    Scenario: Facebook that cannot be reached is unreachable
      Given the reader has been sent to Facebook
      And Facebook cannot be reached
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Unreachable"

    Scenario: Facebook that hangs up on the exchange is unreachable
      Given the reader has been sent to Facebook
      And Facebook will hang up on the exchange
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Unreachable"

    Scenario: Facebook that hangs up on the question about the reader is unreachable
      Given the reader has been sent to Facebook
      And Facebook will hang up on the question about the reader
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Unreachable"

    Scenario: Facebook that answers with an error of its own is unreachable
      Given the reader has been sent to Facebook
      And Facebook will answer the question about the reader with a server error
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Unreachable"

    Scenario: Something that is not an answer, answered for the token, is unreachable
      Given the reader has been sent to Facebook
      And Facebook will answer the exchange with something that is not an answer
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Unreachable"

    Scenario: Something that is not an answer, answered about the reader, is unreachable
      Given the reader has been sent to Facebook
      And Facebook will answer the question about the reader with something that is not an answer
      When who came back from Facebook is asked
      Then it is refused with "Facebook.Unreachable"
