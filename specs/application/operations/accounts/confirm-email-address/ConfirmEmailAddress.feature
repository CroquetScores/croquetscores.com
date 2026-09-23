@postgres
Feature: Confirming an account's email address

  Registering a new address sends it a link to confirm it, and registering it
  again before it is confirmed sends the link again. Confirming is asked for
  with what the link carries, and with a name, a password, and the password
  again — by nobody signed in, since whoever has the link has shown they can
  read mail at the address, and that is the whole of what they are asked to
  show.

  An address is confirmed when a name and a password that break no rule are
  submitted with a link that works, and at no other moment. The link on its
  own confirms nothing: following it opens a form, and it is what is submitted
  that decides. So a reader who follows their link and types a password too
  short has an address still unconfirmed and a link still good, and may type
  again; and the same link, submitted with a sound name and password, confirms
  the address then. Whoever follows a link and never submits anything has
  confirmed nothing, which is why the link goes on working until it expires.

  The name and the password are asked for here rather than at registering, and
  that is the point of asking at all. Registering takes an address and nothing
  else, because whoever registers has not yet shown the address is theirs, and
  a stranger who registered somebody else's address would otherwise have named
  their account and chosen its password (`RegisterAccount.feature` says more).
  So an account is named, and given its password, by whoever turns out to read
  mail at the address, and nothing a stranger typed is ever kept. An account
  waiting to be confirmed has no name and no password at all.

  It follows that the slow work is here. Registering has no password to hash,
  and confirming has one. How long it takes does not matter to what confirming
  answers the way it mattered to registering, since confirming is asked for by
  somebody who has already shown the address is theirs, and there is nothing
  left to keep from them.

  What was typed is judged before the link. The name's rules and the
  password's are the command's own, and every command's rules are asked on the
  way in, before anything is read: a confirmation that was never going to be
  carried out costs nothing but the asking, and no account is looked up for
  one. So a reader whose password is too short is told so whatever became of
  their link, and a reader who types a sound one is told about the link.

  The link is judged before the account is changed. What a link is worth needs
  the account it names, so it cannot be asked on the way in with the rules.

  Whether the password has been breached is asked here, and where in the order
  it is asked is the substance of it. Asking means a request to another site,
  which takes as long as that site takes; a transaction held open across it
  holds a database connection doing nothing, and enough of those at once leaves
  the site with no connections at all. So confirming reads what it needs and
  lets go of it, asks with nothing held open, and opens the transaction it
  writes in only then — which is why the command says it runs its own
  transactions (`TransactionBehaviour.feature`).

  What falls out of that order is that a link that was never any good, and a
  confirmation already carried out, are both answered without the service being
  asked anything. A link nobody made, or one long expired, costs no request:
  whoever posted it is told what is wrong with it, and Have I Been Pwned never
  hears about the password that came with it. What the service itself is worth,
  and what becomes of a password nobody could check, are said where the service
  is.

  The rules about links below send a name and a password that break no rule
  without saying so, so that they stay about links: what a good submission
  looks like is settled by the rule that is about submitting, and repeating it
  in every scenario about an altered or expired link would bury the thing each
  of those is asking. Wherever what was submitted bears on the answer — the
  rule that an address is confirmed by submitting, and the rules about what
  the name and the password must be — the scenarios say what was entered.

  The link carries what it is for, the account, and when it stops working, all
  signed with a key the site keeps as a setting, like every other secret. A
  link whose signature does not match what it carries has been altered, and
  does not work. What it is for is signed with the rest, so that a link the
  site made for anything else — setting a new password, forgetting an account —
  is not taken for one to confirm, however it is sent. Signing it, rather than
  keeping a table of links sent, means there is nothing to look up, nothing to
  clear out once links have expired, and every link sent for an account works
  until it expires or the account is confirmed, whichever email it came in.

  A link works for 24 hours. Confirming does less harm in the wrong hands than
  setting a new password or forgetting an account, whose links last an hour
  and 15 minutes, and an email held up by a mail provider that is down can
  arrive nearly six hours late. A link that has expired is not the end of it.
  It is refused with `Link.Expired`, told apart from a link that does not work
  for any other reason, because an expired link still shows which account it
  was sent for, and can be traded for a new one; that is specified with the
  new confirmation link page. So a link is only called expired once its
  signature holds and its account is one that could still be confirmed: an
  altered link, or one for a forgotten account, is refused with
  `Link.NoLongerWorks` however old it is.

  A link works once, because an account is confirmed once. Submitting with it
  again is refused as already confirmed, rather than as a link that no longer
  works, since only whoever reads mail at the address has the link, and telling
  them their address is confirmed tells them nothing they could not find out.
  Whether the account is confirmed already is looked at here, before the
  account is asked to confirm, because the account itself says nothing about
  it: confirming a confirmed account records nothing and is refused with
  nothing (`Account.feature`). So `Account.AlreadyConfirmed` is this
  operation's, and without it a second submission would be answered as though
  it had confirmed the address, under a name and a password that were thrown
  away.

  A confirmation sent twice — because an answer was lost on its way back — is
  not that. It carries the same request id both times, and the second finds the
  first and answers as it did, as a registration sent twice does
  (`RegisterAccount.feature`). It is a second submission with its own request
  id, carrying a link for an account that is confirmed, that is refused.

  A link for an account that has been forgotten no longer works. Not because
  the account cannot be read — a forgotten account still reads back, as a name
  and an address that say only that it was forgotten — but because it cannot
  be confirmed, and there is nothing to trade an expired link for. A forgotten
  account is looked at here as a confirmed one is, since the account would
  refuse with `Account.Forgotten`, and what the reader is owed is that their
  link no longer works rather than word about an account.

  That scenario takes the link out of the email before the account is
  forgotten, because forgetting throws away the key the email was sealed with
  and nothing can read it afterwards. That is not a way round the scenario but
  the shape of the thing: the link reached somebody's inbox while the account
  was there, and forgetting the account does not reach into their mail and
  take it back. What is being asked is what happens when they submit with it.

  What the reader sees is not here. Following a link opens a form, and being
  signed in once the address is confirmed and landing where a signed-in reader
  lands are the confirm page's, specified with it; this feature is the
  operation behind the page, and says only what it was asked for and what came
  of it.

  These scenarios run against Postgres, with the application's registering and
  its confirming, the event store and read models the two share, a password
  hasher, and a breached password check the scenario can take down and fill
  with passwords of its choosing. The link is read out of the email the email
  queue holds, as a reader reads it out of their mail.

  Background:
    Given the application's registering
    And the application's confirming
    And the moment "2026-09-19T10:00:00Z"

  Rule: An address is confirmed when a sound name and password are submitted with a link that works

    Scenario: A confirmation with the link registering sent confirms the address
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" is confirmed

    Scenario: The account is called the name that was submitted
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: The account keeps a hash of the password, and not the password
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then nothing kept for the account contains "correct horse battery staple"

    Scenario: The first link still works once the link has been sent again
      Given a registration for "someone@example.com" is sent an email
      And a registration for "someone@example.com" is sent an email
      And a confirmation with the link in the first email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" is confirmed

  Rule: The name and the password must break none of their own rules

    Scenario Outline: A confirmation that breaks a rule is refused for it
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "<name>"
      And the password given as "<password>"
      And the password confirmed as "<confirmation>"
      When the confirmation is submitted
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | name        | password                     | confirmation                 | code                         |
        | Sa          | correct horse battery staple | correct horse battery staple | PersonName.TooShort          |
        | Sam Someone | too short                    | too short                    | Password.TooShort            |
        | Sam Someone | correct horse battery staple | correct horse battery stapel | Password.ConfirmationDiffers |

    Scenario: A confirmation that breaks a rule confirms nothing
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sa"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" is not confirmed

    Scenario: A confirmation that breaks a rule leaves the account with no name
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sa"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" has no name

    Scenario: What was typed is judged before the link, so an expired one is not what is answered
      Given a registration for "someone@example.com" is sent an email
      And the moment "2026-09-20T10:01:00Z"
      And a confirmation with the link in that email
      And the name given as "Sa"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then it is refused with "Request.Invalid"
      And the first rule broken is "PersonName.TooShort"

    Scenario: The link still works after a confirmation that broke a rule
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sa"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      And the confirmation has been submitted
      And another confirmation with the same link
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then the account for "someone@example.com" is confirmed

  Rule: A breached password is refused, and is asked about only once the link is good

    The refusal is the same thing to whoever typed it as a password too short:
    something wrong with what they typed, told to them beside the field they
    typed it into. What is asked of the service, and what becomes of a password
    nobody could check, are specified with the service itself.

    The password is asked about as it will be kept, which is with the
    whitespace at either end taken off, because a password is trimmed wherever
    one is made from what a command carries. A breached password typed with a
    space after it would otherwise be asked about as nobody will ever type it
    again, found clean, and then kept as the breached password it is.

    What is here is when the asking happens. A link that will be refused
    whatever the password is, and a confirmation that has already been carried
    out, are both settled by reading alone, and neither is worth a request to
    another site — a forged link would otherwise cost one every time it was
    posted, from somebody who had proved nothing.

    Scenario: A password known to have been breached is refused
      Given a registration for "someone@example.com" is sent an email
      And "correct horse battery staple" is known to have been breached
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: A breached password typed with spaces around it is refused
      Given a registration for "someone@example.com" is sent an email
      And "correct horse battery staple" is known to have been breached
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "  correct horse battery staple  "
      And the password confirmed as "  correct horse battery staple  "
      When the confirmation is submitted
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Password.Breached"

    Scenario: A confirmation whose link no longer works asks nothing about the password
      Given a registration for "someone@example.com" is sent an email
      And the link in that email is altered
      And a confirmation with that link
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      Then it is refused with "Link.NoLongerWorks"
      And nothing was asked of the breached password check

    Scenario: A confirmation already carried out asks nothing about the password
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      And what the breached password check was asked is forgotten
      And the confirmation is submitted again with the same request id
      Then the two confirmations answer the same
      And nothing was asked of the breached password check

  Rule: A link works for 24 hours

    Scenario: A link a minute short of 24 hours old works
      Given a registration for "someone@example.com" is sent an email
      And the moment "2026-09-20T09:59:00Z"
      And a confirmation with the link in that email
      When the confirmation is submitted
      Then the account for "someone@example.com" is confirmed

    Scenario: A link a minute over 24 hours old is refused
      Given a registration for "someone@example.com" is sent an email
      And the moment "2026-09-20T10:01:00Z"
      And a confirmation with the link in that email
      When the confirmation is submitted
      Then it is refused with "Link.Expired"

    Scenario: A link refused for its age confirms nothing
      Given a registration for "someone@example.com" is sent an email
      And the moment "2026-09-20T10:01:00Z"
      And a confirmation with the link in that email
      When the confirmation is submitted
      Then the account for "someone@example.com" is not confirmed

  Rule: A link that has been altered does not work

    Scenario: A link whose signature does not match what it carries is refused
      Given a registration for "someone@example.com" is sent an email
      And the link in that email is altered
      And a confirmation with that link
      When the confirmation is submitted
      Then it is refused with "Link.NoLongerWorks"

    Scenario: An altered link is refused as one that no longer works, whatever its age
      Given a registration for "someone@example.com" is sent an email
      And the link in that email is altered
      And the moment "2026-09-20T10:01:00Z"
      And a confirmation with that link
      When the confirmation is submitted
      Then it is refused with "Link.NoLongerWorks"

    Scenario: An altered link confirms nothing
      Given a registration for "someone@example.com" is sent an email
      And the link in that email is altered
      And a confirmation with that link
      When the confirmation is submitted
      Then the account for "someone@example.com" is not confirmed

  Rule: A link the site made for something else does not confirm

    Scenario: A link to confirm forgetting an account does not confirm its address
      Given "someone@example.com" has an account, not confirmed
      And a link to confirm forgetting the account for "someone@example.com"
      And a confirmation with that link
      When the confirmation is submitted
      Then it is refused with "Link.NoLongerWorks"

  Rule: An account is confirmed once

    Scenario: A second confirmation with the same link is refused as already confirmed
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      And the confirmation has been submitted
      And another confirmation with the same link
      And the name given as "Somebody Else"
      And the password given as "another correct horse"
      And the password confirmed as "another correct horse"
      When the confirmation is submitted
      Then it is refused with "Account.AlreadyConfirmed"

    Scenario: The second confirmation leaves the account called what the first confirmed it as
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      And the confirmation has been submitted
      And another confirmation with the same link
      And the name given as "Somebody Else"
      And the password given as "another correct horse"
      And the password confirmed as "another correct horse"
      When the confirmation is submitted
      Then the account for "someone@example.com" is called "Sam Someone"

    Scenario: The same confirmation sent twice is answered as it was the first time
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the name given as "Sam Someone"
      And the password given as "correct horse battery staple"
      And the password confirmed as "correct horse battery staple"
      When the confirmation is submitted
      And the confirmation is submitted again with the same request id
      Then the two confirmations answer the same

  Rule: A link for a forgotten account does not work

    Scenario: A link for an account that has been forgotten is refused
      Given a registration for "someone@example.com" is sent an email
      And a confirmation with the link in that email
      And the account for "someone@example.com" has been forgotten
      When the confirmation is submitted
      Then it is refused with "Link.NoLongerWorks"
