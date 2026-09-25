@postgres
Feature: Setting a new password with the link that was emailed

  A reader who has forgotten their password is emailed a link
  (`ResetPassword.feature`), and submits a new password with it. It is
  asked for by nobody signed in: whoever has the link has shown they can read
  mail at the address, and that is the whole of what they are asked to show.

  The password's rules are the command's own, and asked on the way in, as
  every command's are: they are the same rules confirming asks, since it is
  the same password (`ConfirmEmailAddress.feature`).

  Whether it has been breached is asked here, and where in the order it is
  asked is the substance of it. Asking means a request to another site, which
  takes as long as that site takes; a transaction held open across it holds a
  database connection doing nothing, and enough of those at once leaves the
  site with no connections at all. So setting a password reads what it needs
  and lets go of it, asks with nothing held open, and opens the transaction it
  writes in only then — which is why the command says it runs its own
  transactions (`TransactionBehaviour.feature`).

  The password is asked about as it will be kept, which is with the whitespace
  at either end taken off, because a password is trimmed wherever one is made
  from what a command carries. One typed with a space after it would otherwise
  be asked about as nobody will ever type it again, found clean, and then kept
  as the breached password it is.

  What falls out of that order is that a link that was never any good, and a
  setting already kept, are both answered without the service being asked
  anything: a forged link would otherwise cost a request to it every time one
  was posted. What the service itself is worth, and what becomes of a password
  nobody could check, are said where the service is.

  A link works for an hour, and once. Once, because a setting that was kept
  writes the link down among the requests already carried out, and a second
  submission with the same link finds it there: it is refused with
  `Link.NoLongerWorks` rather than as expired, since there is nothing to be had
  for it. Written down rather than worked out from when the password was last
  set, because an account confirmed and a link asked for can share a moment,
  and a moment cannot tell a link just used from one never used. A setting
  refused after the link was written down rolls that back with everything else,
  so only a setting that was kept spends one.

  Every other link to set a password that was made before the password was
  last set is spent by it too. An address may be sent three an hour, and a
  reader who has used one of them has chosen their password: the others,
  still sitting in the inbox, would each be a way to change it again. Made
  strictly before, because an account confirmed and a link asked for can share
  a moment, and the link asked for then has not been spent by anything.

  So is every link made before the account last moved to another address. It
  was sent to the address the account has moved from, and a reader may move
  because that address is no longer theirs: whoever reads mail there now would
  otherwise have what is left of the hour to set the password of an account
  that has left them. Strictly before, for the same reason.

  A link for an account that has been forgotten, or one whose address has
  never been confirmed, is refused the same way: neither has a password to
  replace. So is a link the site made for anything else, however it is sent.

  Setting a new password answers with the account it was set on, so that
  whoever asked can end every session that account has: a reader may be
  setting one because somebody else got in, and somebody else would otherwise
  stay in. Ending them is the web layer's, and is specified with the page
  (`session.feature`).

  These scenarios run against Postgres, with the application's asking for a
  way back in, its event store and read models, a password hasher, and a
  breached password check the scenario can take down. The link is read out of
  the email the email queue holds, as a reader reads it out of their mail.

  Background:
    Given the application's asking for a way back in
    And the application's confirming
    And the moment "2026-09-19T10:00:00Z"

  Rule: A sound password, submitted with a link that works, is set

    Scenario: The account keeps the new password
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      Then "a different long password" is the password of the account for "someone@example.com"

    Scenario: The account keeps a hash, and not the password
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      Then nothing kept for the account contains "a different long password"

    Scenario: Setting it answers with the account
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      Then it is answered with the account for "someone@example.com"

  Rule: The password must break none of its own rules

    Scenario Outline: A password that breaks a rule is refused for it
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "<password>" is set with that link, confirmed as "<confirmation>"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | password                  | confirmation              | code                         |
        | too short                 | too short                 | Password.TooShort            |
        | a different long password | a different long passwerd | Password.ConfirmationDiffers |

    Scenario: A password known to have been breached is refused
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And "a different long password" is known to have been breached
      When the new password "a different long password" is set with that link
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: A breached password typed with spaces around it is refused
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And "a different long password" is known to have been breached
      When the new password "  a different long password  " is set with that link
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: A setting whose link no longer works asks nothing about the password
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link in that email is altered
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.NoLongerWorks"
      And nothing was asked of the breached password check

    Scenario: A setting already kept asks nothing about the password when it is sent again
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      And what the breached password check was asked is forgotten
      And the same setting is sent again
      Then nothing was asked of the breached password check

    Scenario: A password that breaks a rule changes nothing
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "too short" is set with that link
      Then "correct horse battery staple" is the password of the account for "someone@example.com"

  Rule: A link works for an hour

    Scenario: A link a minute short of an hour old works
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And 59 minutes have passed
      When the new password "a different long password" is set with that link
      Then "a different long password" is the password of the account for "someone@example.com"

    Scenario: A link a minute over an hour old is refused
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And an hour and a minute have passed
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.Expired"

  Rule: A link works once

    Scenario: A link used once no longer works
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the new password "a different long password" has been set with that link
      When the new password "another long password again" is set with that link
      Then it is refused with "Link.NoLongerWorks"

    Scenario: The password stays as the first setting left it
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the new password "a different long password" has been set with that link
      When the new password "another long password again" is set with that link
      Then "a different long password" is the password of the account for "someone@example.com"

    Scenario: A link made before the password was last set no longer works
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the moment "2026-09-19T10:01:00Z"
      And a way back in is asked for "someone@example.com"
      And the second link emailed to "someone@example.com" is taken out of it
      And the new password "a different long password" has been set with that link
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "another long password again" is set with that link
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link made before the account moved to another address no longer works
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And a way back in is asked for "someone@example.com"
      And the moment "2026-09-19T10:01:00Z"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And moving has been confirmed with that link, signed in to the account for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link made after the account moved works
      Given "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And moving to "sam@example.org" has been asked for by the reader signed in to the account for "someone@example.com", with the password "correct horse battery staple"
      And the link emailed to "sam@example.org" is taken out of it
      And moving has been confirmed with that link, signed in to the account for "someone@example.com"
      And the moment "2026-09-19T10:01:00Z"
      And a way back in is asked for "sam@example.org"
      And the second link emailed to "sam@example.org" is taken out of it
      When the new password "a different long password" is set with that link
      Then it is answered with the account for "sam@example.org"

  Rule: A link that could set nothing no longer works

    Scenario: A link that has been altered is refused
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link in that email is altered
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link to confirm an email address sets no password
      Given "someone@example.com" has an account, not confirmed
      And a link to confirm the email address, sent to "someone@example.com"
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.NoLongerWorks"

    Scenario: A link for an account that has been forgotten is refused
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the account for "someone@example.com" has been forgotten
      When the new password "a different long password" is set with that link
      Then it is refused with "Link.NoLongerWorks"

  Rule: The same setting sent twice sets one password

    Scenario: The same setting sent twice is answered as it was the first time
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      When the new password "a different long password" is set with that link
      And the same setting is sent again
      Then the account for "someone@example.com" has recorded 3 events

    Scenario: The same setting sent again is not refused
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the new password "a different long password" has been set with that link
      When the same setting is sent again
      Then it is not refused

    Scenario: The same setting sent again is answered with the account
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the account for "someone@example.com" is taken hold of
      And the new password "a different long password" has been set with that link
      When the same setting is sent again
      Then it is answered with that account

    Scenario: A request id already used, sent with another link, sets the password all the same
      Given "someone@example.com" has an account, confirmed
      And a way back in is asked for "someone@example.com"
      And the link emailed to "someone@example.com" is taken out of it
      And the new password "a different long password" has been set with that link
      And the moment "2026-09-19T10:01:00Z"
      And a way back in is asked for "someone@example.com"
      And the second link emailed to "someone@example.com" is taken out of it
      When the new password "another long password again" is set with that link, carrying the same request id
      Then "another long password again" is the password of the account for "someone@example.com"
