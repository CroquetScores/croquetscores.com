Feature: Making a key for an account

  An account can make a key, so that an app can act for it without being given
  its password (`CreateApiKey.feature`). The account is given the key's id, a
  hash of the key, a label, what the key may do, the one tournament it is
  limited to where there is one, and the limits it carries, and records them as
  an event. It is never given the key, and so cannot record it: the key is
  shown to whoever made it and kept nowhere.

  The label is what the maker typed, so it is kept as a name is, and made
  unreadable with everything else about the person when the account is
  forgotten.

  An account that has not been confirmed is refused with
  `Account.NotConfirmed`: a key is a way in, and one made for an address nobody
  has shown is theirs would be a way in for whoever turns out to own it. A
  forgotten account is refused with `Account.Forgotten`, as it is for
  everything else.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-11-19T10:00:00Z"

  Rule: A key made is recorded, and is the account's

    Scenario: Making a key records it
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then it has recorded 1 event
      And the first thing it recorded is a key being made

    Scenario: What making a key recorded says the label
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then the key being made says the label "CroquetUniverse"

    Scenario: What making a key recorded says the hash
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then the key being made says the hash "the-hash-of-a-key"

    Scenario: What making a key recorded says what the key may do
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then the key being made says the scope "read-and-write"

    Scenario: What making a key recorded says the usual limits
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then the key being made says 60 requests a minute and 10000 a day

    Scenario: The account has the key at once
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then the account holds 1 key

    Scenario: An account rebuilt after a key was made has the key
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      When the account is rebuilt from the stream
      Then the account holds 1 key

    Scenario: A key is made by the account itself
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then the key being made was caused by the account

  Rule: Only a confirmed account that has not been forgotten makes a key

    Scenario: An account that is not confirmed is refused
      Given a stream where an account was registered at "someone@example.com"
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then it is refused with "Account.NotConfirmed"

    Scenario: A forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account makes a key labelled "CroquetUniverse"
      Then it is refused with "Account.Forgotten"

  Rule: Forgetting an account takes its keys

    Scenario: A forgotten account has no keys
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And it was forgotten
      When the account is rebuilt from the stream
      Then the account holds no keys
