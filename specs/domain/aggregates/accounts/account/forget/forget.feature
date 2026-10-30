Feature: Forgetting an account

  Forgetting is recorded as an event that holds nothing about the person,
  alongside rewriting the events that hold the account's name, email address
  and Google account: the rewriting replaces what is kept of them, and the
  event is what tells every read model to stop finding the account by what it
  holds, such as the row it is found by. A forgotten account
  cannot be signed in to, confirmed, registered again, have its password
  hashed again or be given a new one, or have a role added or removed, with
  `Account.Forgotten`; each of those refusals is specified with what it
  refuses. Its email address is free for a new account instead. An account is
  forgotten once: forgetting it again records nothing, so that whatever acts
  on its being forgotten acts once.

  A forgotten account holds no role, whatever it held before. Nobody can sign
  in to it to use one, but whatever asks an account what it may do should not
  have to know that to get the right answer.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-19T10:00:00Z"

  Rule: A forgotten account is recorded as forgotten, once

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

    Scenario: Forgetting a forgotten account records nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And it was forgotten
      And the account is rebuilt from the stream
      When the account is forgotten
      Then it has recorded 0 events

  Rule: A forgotten account holds no role

    Scenario Outline: Forgetting an account takes away its roles
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And the account is rebuilt from the stream
      When the account is forgotten
      Then the account does not hold the role "<role>"

      Examples:
        | role                     |
        | Administrator            |
        | AC World Ranking Officer |
        | GC World Ranking Officer |

    Scenario Outline: An account rebuilt after it was forgotten holds no role
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the role "<role>" was added to it
      And it was forgotten
      When the account is rebuilt from the stream
      Then the account does not hold the role "<role>"

      Examples:
        | role                     |
        | Administrator            |
        | AC World Ranking Officer |
        | GC World Ranking Officer |

  Rule: A forgotten account says it is forgotten, whether or not it was confirmed

    What an account not yet confirmed cannot do, a forgotten one cannot do
    either, and being forgotten is what it is told. An account forgotten
    before anybody confirmed its address is forgotten first and unconfirmed
    second: telling whoever asked that it is waiting to be confirmed would
    send them to confirm an account that is gone.

    Scenario Outline: A forgotten account never confirmed is refused as forgotten
      Given a stream where an account was registered at "someone@example.com"
      And it was forgotten
      And the account is rebuilt from the stream
      When <asking>
      Then it is refused with "Account.Forgotten"

      Examples:
        | asking                                                                                   |
        | the account's name is changed to "Samantha Someone"                                      |
        | moving the account to "sam@example.org" is asked for, as "asking-1"                      |
        | the account is moved to "sam@example.org" with the email address hash "hash-of-sam"      |
        | the account is signed in to                                                              |
        | a new password is set on the account                                                     |
        | the Google account "google-subject-1" is linked to the account                           |
        | the role "Administrator" is added to the account                                         |
