@postgres
Feature: Asking the people who hold the site's passwords to hand them over

  If the person who runs the site cannot, somebody technical may take it over.
  What they need is kept in a secure note that two people Tim chose can open,
  and the site is how they are asked: someone says who they are and why they
  are taking this on, and the two people are emailed what was said. Nothing is
  decided here. The two people read it, make up their own minds and answer the
  sender themselves.

  Whoever asks has an account, so that the two people are told who is asking
  and the page cannot be used by anybody who merely knows its address. The two
  addresses are a setting of the site and are written nowhere in the code,
  because the code is public and the addresses are not meant to be.

  These scenarios run against Postgres, with the application's event store and
  read models, and read what was sent out of the email queue.

  Background:
    Given the application's asking for emergency access
    And the moment "2026-11-14T10:00:00Z"
    And an account "Sam Jones" at "sam@example.com"

  Rule: Both people are emailed what was said

    Scenario: The first person is emailed
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then the email "Email.EmergencyAccessAsked" is queued for "first@example.com"

    Scenario: The second person is emailed
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then the email "Email.EmergencyAccessAsked" is queued for "second@example.com"

    Scenario: The email carries what was said
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then the email queued for "first@example.com" says "I run a croquet club and Tim asked me to look after the site"

    Scenario: The email says who asked
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then the email queued for "first@example.com" names the sender "Sam Jones"

    Scenario: The email gives the address the sender can be answered at
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then the email queued for "first@example.com" gives the sender's address "sam@example.com"

    Scenario: A reply goes to the sender
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then a reply to the email queued for "first@example.com" goes to "sam@example.com"

    Scenario: The email says when it was asked
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then the email queued for "first@example.com" gives the moment "2026-11-14T10:00:00Z"

  Rule: A message has to be there, and short enough to read

    Scenario: A message with nothing in it is refused
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "   "
      When "Sam Jones" asks for emergency access
      Then it is refused with "EmergencyAccess.MessageMissing"

    Scenario: Nothing is emailed for a message with nothing in it
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "   "
      When "Sam Jones" asks for emergency access
      Then no email is queued

    Scenario: A message of two thousand characters is let through
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And a message of 2000 characters
      When "Sam Jones" asks for emergency access
      Then the email "Email.EmergencyAccessAsked" is queued for "first@example.com"

    Scenario: A message of more than two thousand characters is refused
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And a message of 2001 characters
      When "Sam Jones" asks for emergency access
      Then it is refused with "EmergencyAccess.MessageTooLong"

  Rule: Nobody is asked until the site knows who to ask

    Scenario: With no contacts set the request is refused
      Given no emergency contacts are set
      And the message "I run a croquet club and Tim asked me to look after the site"
      When "Sam Jones" asks for emergency access
      Then it is refused with "EmergencyAccess.NoContacts"

  Rule: One account may ask once in 48 hours

    The two people are people, and one account asking over and over is either
    a mistake or a nuisance. They may be slow to answer, away, or grieving, and
    asking again before they have had time only doubles what they have to read.
    Two days is long enough that they can answer, and a message sent with a slip
    in it is put right by answering the one already sent. What is counted is
    what the site has written to the contacts for that account, the same way
    every other email is counted.

    Scenario: A second request within 48 hours is refused
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      And "Sam Jones" has asked for emergency access
      When "Sam Jones" asks for emergency access
      Then it is refused with "EmergencyAccess.TooSoon"

    Scenario: A second request 48 hours later is let through
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      And "Sam Jones" has asked for emergency access
      And 48 hours and a minute have passed
      When "Sam Jones" asks for emergency access
      Then 4 emails are queued

    Scenario: Another account is not held to the first one's 48 hours
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      And an account "Alex Lee" at "alex@example.com"
      And "Sam Jones" has asked for emergency access
      When "Alex Lee" asks for emergency access
      Then 4 emails are queued

  Rule: An account that cannot ask is told so before it is told to wait

    Scenario: A forgotten account that asked lately is not told to wait
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      And "Sam Jones" has asked for emergency access
      And "Sam Jones" is forgotten
      When "Sam Jones" asks for emergency access
      Then it is refused with "EmergencyAccess.NoSuchAccount"

  Rule: Somebody who is not signed in cannot ask

    Scenario: A request with no account behind it is refused
      Given the emergency contacts are at "first@example.com" and "second@example.com"
      And the message "I run a croquet club and Tim asked me to look after the site"
      When somebody signed in as no one asks for emergency access
      Then it is refused with "Command.RequestedByMissing"
