@postgres
Feature: Telling the administrator a service the site needs cannot be reached

  Registering asks reCAPTCHA whether whoever is registering is a person, and
  confirming an address and setting a new password ask Have I Been Pwned
  whether a password has been breached. When one of them cannot be reached,
  what asked it goes no further, and the reader is told to try again later
  (`registrationsSuspended.feature`). The administrator is told as well, so
  that the site is not quietly turning people away.

  They are told at most once an hour for each service, so that an outage does
  not bury them in email, and each email says which service it was and when.
  What is counted is what the site has written to the administrator about that
  service, the same way every other email is counted (`EmailsWritten`).

  It is asked for in a transaction of its own, by whatever found the service
  down, because the work that found it was refused and recorded nothing: the
  telling must be kept although the rest was not.

  These scenarios run against Postgres, with the application's event store and
  read models, and read what was sent out of the email queue.

  Background:
    Given the application's reporting of unreachable services
    And the moment "2026-09-19T10:00:00Z"

  Rule: The administrator is told which service cannot be reached

    Scenario: The administrator is emailed about a service
      Given the site's administrator is at "administrator@example.com"
      When "Have I Been Pwned" is reported unreachable
      Then the email "Email.RegistrationsSuspended" is queued for "administrator@example.com"

    Scenario: The email says which service it was
      Given the site's administrator is at "administrator@example.com"
      When "Have I Been Pwned" is reported unreachable
      Then the email queued for "administrator@example.com" names the service "Have I Been Pwned"

  Rule: The administrator is told at most once an hour for each service

    Scenario: A service reported twice in an hour is emailed about once
      Given the site's administrator is at "administrator@example.com"
      And "Have I Been Pwned" has been reported unreachable
      When "Have I Been Pwned" is reported unreachable
      Then one email is queued for "administrator@example.com"

    Scenario: A service reported again an hour later is emailed about again
      Given the site's administrator is at "administrator@example.com"
      And "Have I Been Pwned" has been reported unreachable
      And an hour and a minute have passed
      When "Have I Been Pwned" is reported unreachable
      Then 2 emails are queued for "administrator@example.com"

    Scenario: Each service is emailed about on its own
      Given the site's administrator is at "administrator@example.com"
      And "Have I Been Pwned" has been reported unreachable
      When "reCAPTCHA" is reported unreachable
      Then 2 emails are queued for "administrator@example.com"
