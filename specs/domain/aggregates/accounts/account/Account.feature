Feature: An account, from registering on

  An account begins as an email address and nothing else. Registering asks for
  no name and no password, because whoever registers has not yet shown the
  address is theirs, and anything kept of what they typed would be kept for
  whoever does turn out to own it: a stranger who registered somebody else's
  address first would have chosen the name on their account, and the password
  to it. So an account begins unconfirmed, unnamed and with no password, and
  is given all three at once, by whoever follows the link sent to the address
  and says who they are.

  The account's own id is given it by whatever registers it, and names its
  stream. Registering is the account's first event, and says everything the
  account began with. Registering is also given a keyed hash of the email
  address, made by whatever registers the account, since the key is the site's
  and not the domain's, and says it, so that anything finding accounts by
  their address can be made from the events alone.

  An account is registered once. Registering its address again, confirmed or
  not, changes nothing about it: what is sent to the address instead is
  specified with registering.

  Confirming is an event of its own, stamped with the moment it was asked for
  like every other, and says the name the account is called and the hash of
  the password it is signed in to with. The password is never part of it: only
  its hash is. An account is confirmed once: confirming it again records
  nothing and changes neither, so that a link followed twice leaves one event
  and not two, and a link left in an inbox is not a way to take over an
  account that has since been confirmed.

  An account brought over from the old site does not begin that way. It was
  somebody's before this site was, so it begins with the name it had there,
  the hash of the password it had there, marked as the old site's, and
  confirmed: its owner gets in with the password they already have, and a link
  to confirm would ask them to choose a name and a password they chose long
  ago. Being brought over is an event of its own, and an account's first, as
  registering is.

  Signing in is recorded too, and only for a confirmed account: one whose
  email address is not confirmed is refused, with `Account.NotConfirmed`,
  whoever asks. It has no password to have been given, so nobody reaches that
  refusal by signing in the ordinary way; it is there so that the account
  itself, and not only whatever asks it, says an unconfirmed account is not
  signed in to.

  A password's hash is made again when a better way of making it is to hand,
  which for an account brought over from the old site is the first time it
  signs in. That is an event of its own, holding the new hash, so that
  rebuilding the account from its stream gives the hash it has now.

  Forgetting is recorded too, as an event that holds nothing about the person,
  alongside deleting the account's key: the key makes what is kept of them
  unreadable, and the event is what tells every read model to stop finding the
  account by what it holds, such as the row it is found by. A forgotten account
  cannot be signed in to, confirmed, registered again or have its password
  hashed again, with `Account.Forgotten`: a new hash would be something new
  kept of the person after forgetting was to have kept nothing more. Its email
  address is free for a new account instead. An account is forgotten once:
  forgetting it again records nothing, so that whatever acts on its being
  forgotten acts once.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: Registering begins an account with an email address and nothing else

    Scenario: Registering records that the account was registered
      When an account is registered at "someone@example.com"
      Then it has recorded 1 event
      And the first thing it recorded is its registering

    Scenario: A registered account is reached at the address it was registered at
      When an account is registered at "someone@example.com"
      Then the account is reached at "someone@example.com"

    Scenario: A registered account is not yet confirmed
      When an account is registered at "someone@example.com"
      Then the account is not confirmed

    Scenario: A registered account is not yet called anything
      When an account is registered at "someone@example.com"
      Then the account has no name

    Scenario: A registered account has no password yet
      When an account is registered at "someone@example.com"
      Then the account has no password

    Scenario: Registering records the hash of the email address it was given
      When an account is registered at "someone@example.com" with the email address hash "hash-of-someone"
      Then its registering says the email address hash "hash-of-someone"

  Rule: An account rebuilt from its stream is as registering left it

    Scenario: An account rebuilt from its registering is reached where it was registered
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is reached at "someone@example.com"

    Scenario: An account rebuilt from its registering is not confirmed
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is not confirmed

    Scenario: An account rebuilt from its registering has no name
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account has no name

    Scenario: An account rebuilt from its registering has no password
      Given a stream where an account was registered at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account has no password

  Rule: Confirming gives an account its name and its password, once

    Scenario: Confirming records that the email address was confirmed
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then it has recorded 1 event
      And the first thing it recorded is its email address being confirmed

    Scenario: A confirmed account is confirmed
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then the account is confirmed

    Scenario: A confirmed account is called what it was confirmed as
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then the account is called "Sam Someone"

    Scenario: A confirmed account has the password hash it was confirmed with
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with the password hash "hash-of-a-password"
      Then the account's password hash is "hash-of-a-password"

    Scenario: What confirming recorded does not hold the password
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with the password "correct horse battery staple"
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: Confirming a confirmed account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Somebody Else"
      Then it has recorded 0 events

    Scenario: Confirming a confirmed account does not rename it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Somebody Else"
      Then the account is called "Sam Someone"

    Scenario: Confirming a confirmed account does not change its password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with the password hash "hash-of-a-password"
      And the account is rebuilt from the stream
      When the account's email address is confirmed with the password hash "hash-of-another"
      Then the account's password hash is "hash-of-a-password"

    Scenario: An account rebuilt from its confirming is confirmed
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      When the account is rebuilt from the stream
      Then the account is confirmed

    Scenario: An account rebuilt from its confirming is called what it was confirmed as
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      When the account is rebuilt from the stream
      Then the account is called "Sam Someone"

    Scenario: An account rebuilt from its confirming has the password hash it was confirmed with
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed with the password hash "hash-of-a-password"
      When the account is rebuilt from the stream
      Then the account's password hash is "hash-of-a-password"

  Rule: An account brought over from the old site begins named, confirmed, and with its old password

    Scenario: Bringing an account over records it
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then it has recorded 1 event
      And the first thing it recorded is its being brought over

    Scenario: An account brought over is called what it was called there
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account is called "Sam Someone"

    Scenario: An account brought over is reached at the address it had there
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account is reached at "someone@example.com"

    Scenario: An account brought over is confirmed
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account is confirmed

    Scenario: An account brought over has the password hash it had there
      When an account is brought over as "Sam Someone" at "someone@example.com" with the password hash "hash-from-the-old-site"
      Then the account's password hash is "hash-from-the-old-site"

    Scenario: An account brought over has an imported password
      When an account is brought over as "Sam Someone" at "someone@example.com"
      Then the account's password is imported

    Scenario: Being brought over records the hash of the email address it was given
      When an account is brought over as "Sam Someone" at "someone@example.com" with the email address hash "hash-of-someone"
      Then its being brought over says the email address hash "hash-of-someone"

    Scenario: An account rebuilt from its being brought over is confirmed
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is confirmed

    Scenario: An account rebuilt from its being brought over has an imported password
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account's password is imported

  Rule: Signing in to a confirmed account is recorded, and an unconfirmed one is refused

    Scenario: Signing in to a confirmed account records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it has recorded 1 event
      And the first thing it recorded is its signing in

    Scenario: Signing in to an unconfirmed account is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it is refused with "Account.NotConfirmed"

    Scenario: Signing in to an unconfirmed account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it has recorded 0 events

  Rule: A password hashed again keeps its new hash

    Scenario: Hashing a password again records it
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it has recorded 1 event
      And the first thing it recorded is its password being hashed again

    Scenario: What it recorded holds the new hash, and not the password
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When its password "correct horse battery staple" is hashed again
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: An account rebuilt after its password was hashed again has the new hash
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And its password was hashed again
      When the account is rebuilt from the stream
      Then the account's password hash is the one it was hashed again with

    Scenario: An account rebuilt after its password was hashed again no longer has an imported password
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And its password was hashed again
      When the account is rebuilt from the stream
      Then the account's password is not imported

  Rule: A new password replaces whatever hash the account had, and says when

    A reader who has forgotten their password is sent a link that sets a new
    one (`forgotPassword.feature`). What the account keeps of it is the new
    hash and the moment it was set, which is when somebody last chose the
    password the account is signed in with.

    An account that has not been confirmed is refused with
    `Account.NotConfirmed`: it has no password to replace, and giving it one
    here would let somebody who never showed they read mail at the address
    have an account at it. A forgotten account is refused with
    `Account.Forgotten`, as it is for everything else.

    Scenario: Setting a new password records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When a new password is set on the account
      Then it has recorded 1 event
      And the first thing it recorded is its password being set

    Scenario: What setting a new password recorded does not hold the password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the new password "correct horse battery staple" is set on the account
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: An account rebuilt after a new password was set has the new hash
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a new password was set on the account
      When the account is rebuilt from the stream
      Then the account's password hash is the one it was set with

    Scenario: An account rebuilt after a new password was set no longer has an imported password
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And a new password was set on the account
      When the account is rebuilt from the stream
      Then the account's password is not imported

    Scenario: An account knows when its password was set
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a new password was set on the account at "2026-09-19T11:00:00Z"
      When the account is rebuilt from the stream
      Then the account's password was set at "2026-09-19T11:00:00Z"

    Scenario: An account knows when confirming gave it its password
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone" at "2026-09-19T10:30:00Z"
      When the account is rebuilt from the stream
      Then the account's password was set at "2026-09-19T10:30:00Z"

    Scenario: Setting a new password on an account that is not confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When a new password is set on the account
      Then it is refused with "Account.NotConfirmed"

    Scenario: Setting a new password on a forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When a new password is set on the account
      Then it is refused with "Account.Forgotten"

  Rule: A forgotten account is recorded as forgotten, and cannot be used again

    Scenario: Forgetting records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 1 event
      And the first thing it recorded is its being forgotten

    Scenario: What forgetting recorded holds nothing about the person
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account is forgotten
      Then what it recorded does not contain "Sam Someone"
      And what it recorded does not contain "someone@example.com"

    Scenario: A forgotten account cannot be signed in to
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account cannot be confirmed
      Given a stream where an account was registered at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account's email address is confirmed as "Sam Someone"
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account's password cannot be hashed again
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account's password hashed again records nothing
      Given a stream where an account was brought over as "Sam Someone" at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it has recorded 0 events

    Scenario: Forgetting a forgotten account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 0 events
