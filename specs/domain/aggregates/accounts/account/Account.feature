Feature: An account, from registering on

  An account is somebody who has registered: a name, an email address, and a
  hash of their password. It begins unconfirmed, because nothing has yet shown
  that whoever registered can read mail at the address, and is confirmed once
  they follow the link sent to it and say so.

  The account's own id is given it by whatever registers it, and names its
  stream. Registering is the account's first event, and says everything the
  account began with. The password is never part of it: only its hash is.

  An account is registered once. Registering its address again, confirmed or
  not, changes nothing about it: what is sent to the address instead is
  specified with registering.

  Confirming is an event of its own, stamped with the moment it was asked for
  like every other. An account is confirmed once: confirming it again records
  nothing, so that a link followed twice leaves one event and not two.

  Signing in is recorded too, and only for a confirmed account: one whose
  email address is not confirmed is refused, with `Account.NotConfirmed`,
  whoever asks. The password is checked before the account is asked, since
  only somebody who knew it may learn the account is not confirmed; that is
  specified with signing in.

  A password's hash is made again when a better way of making it is to hand,
  which for an account imported from the old site is the first time it signs
  in. That is an event of its own, holding the new hash, so that rebuilding
  the account from its stream gives the hash it has now.

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

  Rule: Registering begins an account, unconfirmed

    Scenario: Registering records that the account was registered
      When an account is registered as "Sam Someone" at "someone@example.com"
      Then it has recorded 1 event
      And the first thing it recorded is its registering

    Scenario: A registered account is called what it was registered as
      When an account is registered as "Sam Someone" at "someone@example.com"
      Then the account is called "Sam Someone"

    Scenario: A registered account is reached at the address it was registered at
      When an account is registered as "Sam Someone" at "someone@example.com"
      Then the account is reached at "someone@example.com"

    Scenario: A registered account is not yet confirmed
      When an account is registered as "Sam Someone" at "someone@example.com"
      Then the account is not confirmed

    Scenario: What it recorded does not hold the password
      When an account is registered as "Sam Someone" at "someone@example.com" with the password "correct horse battery staple"
      Then what it recorded does not contain "correct horse battery staple"

  Rule: An account rebuilt from its stream is as registering left it

    Scenario: An account rebuilt from its registering is as it was registered
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      When the account is rebuilt from the stream
      Then the account is called "Sam Someone"
      And the account is reached at "someone@example.com"
      And the account is not confirmed

  Rule: Confirming an account records that its email address was confirmed, once

    Scenario: Confirming records that the email address was confirmed
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed
      Then it has recorded 1 event
      And the first thing it recorded is its email address being confirmed

    Scenario: A confirmed account is confirmed
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the account's email address is confirmed
      Then the account is confirmed

    Scenario: Confirming a confirmed account records nothing
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      And the account is rebuilt from the stream
      When the account's email address is confirmed
      Then it has recorded 0 events

    Scenario: An account rebuilt from its confirming is confirmed
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      When the account is rebuilt from the stream
      Then the account is confirmed

  Rule: Signing in to a confirmed account is recorded, and an unconfirmed one is refused

    Scenario: Signing in to a confirmed account records it
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it has recorded 1 event
      And the first thing it recorded is its signing in

    Scenario: Signing in to an unconfirmed account is refused
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it is refused with "Account.NotConfirmed"

    Scenario: Signing in to an unconfirmed account records nothing
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it has recorded 0 events

  Rule: A password hashed again keeps its new hash

    Scenario: Hashing a password again records it
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com" with an imported password
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it has recorded 1 event
      And the first thing it recorded is its password being hashed again

    Scenario: What it recorded holds the new hash, and not the password
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com" with an imported password
      And the account is rebuilt from the stream
      When its password "correct horse battery staple" is hashed again
      Then what it recorded does not contain "correct horse battery staple"

    Scenario: An account rebuilt after its password was hashed again has the new hash
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com" with an imported password
      And its password was hashed again
      When the account is rebuilt from the stream
      Then the account's password hash is the one it was hashed again with

    Scenario: An account rebuilt after its password was hashed again no longer has an imported password
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com" with an imported password
      And its password was hashed again
      When the account is rebuilt from the stream
      Then the account's password is not imported

  Rule: A forgotten account is recorded as forgotten, and cannot be used again

    Scenario: Forgetting records it
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 1 event
      And the first thing it recorded is its being forgotten

    Scenario: What forgetting recorded holds nothing about the person
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      And the account is rebuilt from the stream
      When the account is forgotten
      Then what it recorded does not contain "Sam Someone"
      And what it recorded does not contain "someone@example.com"

    Scenario: A forgotten account cannot be signed in to
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is signed in to
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account cannot be confirmed
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account's email address is confirmed
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account's password cannot be hashed again
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com" with an imported password
      And it was forgotten
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it is refused with "Account.Forgotten"

    Scenario: A forgotten account's password hashed again records nothing
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com" with an imported password
      And it was forgotten
      And the account is rebuilt from the stream
      When its password is hashed again
      Then it has recorded 0 events

    Scenario: Forgetting a forgotten account records nothing
      Given a stream where an account was registered as "Sam Someone" at "someone@example.com"
      And its email address was confirmed
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 0 events
