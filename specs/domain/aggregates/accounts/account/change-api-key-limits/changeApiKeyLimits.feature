Feature: Changing the limits of a key of an account

  A key carries limits of its own, so that one can be raised without any other
  changing (`ChangeApiKeyLimits.feature`). They are changed by an
  administrator, who is who the event is caused by, as a role is caused by
  whoever gave it. Whether that account may is not the account's to know.

  The limits a key has already record nothing, because nothing happened. A key
  the account never made is refused with `Account.NoSuchApiKey`, and a
  forgotten account is refused with `Account.Forgotten`.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-11-19T10:00:00Z"

  Rule: New limits are recorded, and are the key's

    Scenario: Changing the limits records them
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the limits of the key are changed to 120 requests a minute and 20000 a day
      Then it has recorded 1 event
      And the first thing it recorded is the limits of a key being changed

    Scenario: What changing the limits recorded says them
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the limits of the key are changed to 120 requests a minute and 20000 a day
      Then the limits being changed say 120 requests a minute and 20000 a day

    Scenario: Changing the limits is caused by whoever changed them
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the limits of the key are changed to 120 requests a minute and 20000 a day
      Then the limits being changed were caused by whoever changed them

    Scenario: The key has the new limits at once
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the limits of the key are changed to 120 requests a minute and 20000 a day
      Then the account's key is allowed 120 requests a minute

    Scenario: An account rebuilt after the limits were changed has them
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the limits of the key were changed to 120 requests a minute and 20000 a day
      When the account is rebuilt from the stream
      Then the account's key is allowed 20000 requests a day

  Rule: The limits a key has already record nothing

    Scenario: The same limits record nothing
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And the account is rebuilt from the stream
      When the limits of the key are changed to 60 requests a minute and 10000 a day
      Then it has recorded 0 events

  Rule: Only a key the account made is found

    Scenario: A key never made is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And the account is rebuilt from the stream
      When the limits of the key are changed to 120 requests a minute and 20000 a day
      Then it is refused with "Account.NoSuchApiKey"

    Scenario: A forgotten account is refused
      Given a stream where an account was registered at "someone@example.com"
      And its email address was confirmed as "Sam Someone"
      And a key labelled "CroquetUniverse" was made
      And it was forgotten
      And the account is rebuilt from the stream
      When the limits of the key are changed to 120 requests a minute and 20000 a day
      Then it is refused with "Account.Forgotten"
