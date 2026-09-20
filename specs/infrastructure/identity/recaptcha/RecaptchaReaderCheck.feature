Feature: Judging whether whoever is registering is a person, with reCAPTCHA

  Registering is guarded by reCAPTCHA v3. Google's script runs in the reader's
  browser and hands the form a token; the site sends the token to Google, with
  its secret key, and is answered with a score between 0 and 1 — how likely
  Google thinks it is that a person, rather than a program, filled the form in.

  The failure code names reCAPTCHA because reCAPTCHA is what this is. Nothing
  stands between the application and it, and nothing is meant to: judging a
  reader is reCAPTCHA's, here, and there is no second way of doing it to hold
  to the same scenarios. This is deliberately unlike the pair beside it, where
  `BreachedPasswords.feature` says what the application wants of a check and
  `HaveIBeenPwnedPasswords.feature` is one service held to it — worth saying,
  so that the difference reads as a decision rather than as something left
  undone. If a second way of judging a reader is ever wanted, that pair is what
  to make of this one, and the code takes the interface's name then.

  These scenarios stand a fake of Google's service up in its place, and call it
  reCAPTCHA in their steps because that is what it is standing in for. They
  give the check as little time to wait as it can be given, so that a fake told
  to answer late need not be slow.

  Background:
    Given a fake of reCAPTCHA

  Rule: A score of 0.5 or more is a person

    Scenario Outline: The score decides
      Given reCAPTCHA scores the token "a token" at <score>
      When "a token" is judged
      Then the reader is judged <judged>

      Examples:
        | score | judged       |
        | 0.9   | a person     |
        | 0.5   | a person     |
        | 0.4   | not a person |

  Rule: An answer for another form is worth nothing

    An answer is only trusted if it says it was for this site's registering.
    One for anything else is an answer about another form, and however well it
    scores it says nothing about this one.

    Scenario: An answer for something other than registering is not a person
      Given reCAPTCHA scores the token "a token" at 0.9
      And reCAPTCHA says the answer was for signing in
      When "a token" is judged
      Then the reader is judged not a person

  Rule: A token Google will not accept is not a person

    A token Google will not accept — one it never minted, one that has gone
    stale, one it has already been shown — is judged not a person rather than
    as having no judgement, since the script did run and produced something
    Google disowns. Read as no judgement instead, a reader whose token went
    stale on a form left open would be told to switch scripting on, which is
    already on.

    What such an answer is worth is nothing, whatever else it carries. Google
    sends no score with one, so of the two scenarios below the second has the
    fake send a score anyway: it is the only way to say that the refusal is
    what the check reads, rather than the check happening to be right because
    there was no score there to read. Without it, taking the reading of the
    refusal out of the check would break nothing.

    Scenario: A token Google will not accept is not a person
      Given reCAPTCHA will not accept the token "a token"
      When "a token" is judged
      Then the reader is judged not a person

    Scenario: A token Google will not accept is not a person, whatever it scores
      Given reCAPTCHA scores the token "a token" at 0.9
      And reCAPTCHA will not accept the token "a token"
      When "a token" is judged
      Then the reader is judged not a person

  Rule: No token is no judgement

    A form with no token was sent by a browser that did not run the script, and
    is judged as having none, which is not the same as not being a person. What
    is made of no judgement is the caller's to say, and is specified with the
    caller: it is why the register page sends a reader without scripting away
    before they have filled anything in.

    Scenario: A form with no token has no judgement
      When no token is judged
      Then the reader has no judgement

  Rule: The site's secret key is sent with the token

    Scenario: Google is sent the site's secret key
      Given reCAPTCHA scores the token "a token" at 0.9
      When "a token" is judged
      Then reCAPTCHA was sent the site's secret key

    Scenario: Google is sent the token
      Given reCAPTCHA scores the token "a token" at 0.9
      When "a token" is judged
      Then reCAPTCHA was sent the token "a token"

  Rule: Google not being reached is said to be, not guessed at

    When Google cannot be reached, the check says so rather than guessing, with
    `RecaptchaReaderCheck.Unreachable`. Answering later than the check waits,
    answering with a failure, and answering with something that is not one of
    Google's answers are each Google not being reached, and are said to be:
    read as a reader who is not a person instead, a reader would be turned away
    for a hiccup of Google's that had nothing to do with them.

    There are two ways of answering with something that is not one of Google's
    answers, and they are caught in different places, so both are here: an
    answer that is not JSON at all, and one that is JSON and says nothing about
    whether it succeeded. The second is what a proxy in the way answers with,
    and it is the one where the check would otherwise read a reader who is not
    a person out of a page that mentions no reader.

    Scenario: Google answering too late
      Given reCAPTCHA answers only after the check has stopped waiting
      When "a token" is judged
      Then the judging is refused with "RecaptchaReaderCheck.Unreachable"

    Scenario: Google answering with a failure
      Given reCAPTCHA answers with a failure
      When "a token" is judged
      Then the judging is refused with "RecaptchaReaderCheck.Unreachable"

    Scenario: Google answering with a page rather than an answer
      Given reCAPTCHA answers with a page rather than an answer
      When "a token" is judged
      Then the judging is refused with "RecaptchaReaderCheck.Unreachable"

    Scenario: Google answering with something that says nothing of a judgement
      Given reCAPTCHA answers with something that is not one of its answers
      When "a token" is judged
      Then the judging is refused with "RecaptchaReaderCheck.Unreachable"
