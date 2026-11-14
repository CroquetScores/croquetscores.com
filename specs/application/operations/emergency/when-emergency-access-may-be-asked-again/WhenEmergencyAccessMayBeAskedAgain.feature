@postgres
Feature: Telling somebody when they may ask for emergency access again

  An account may ask once in 48 hours (`AskForEmergencyAccess.feature`). The
  page for asking says so as it is opened, and not only once a message has been
  written and sent and refused, so that nobody writes to two people who are
  grieving, or worried, something the site will not send.

  Background:
    Given the application's asking for emergency access
    And the moment "2026-11-14T10:00:00Z"
    And an account "Sam Jones" at "sam@example.com"
    And the emergency contacts are at "first@example.com" and "second@example.com"
    And the message "I run a croquet club and Tim asked me to look after the site"

  Rule: An account that has not asked may ask now

    Scenario: An account that never asked may ask now
      When "Sam Jones" is asked when they may ask again
      Then they may ask now

  Rule: An account that has asked may ask 48 hours after

    Scenario: An account that asked is told when it may ask again
      Given "Sam Jones" has asked for emergency access
      When "Sam Jones" is asked when they may ask again
      Then they may ask again at "2026-11-16T10:00:00Z"

    Scenario: An account that asked 48 hours ago may ask now
      Given "Sam Jones" has asked for emergency access
      And 48 hours and a minute have passed
      When "Sam Jones" is asked when they may ask again
      Then they may ask now

    Scenario: Another account that asked does not hold this one
      Given an account "Alex Lee" at "alex@example.com"
      And "Alex Lee" has asked for emergency access
      When "Sam Jones" is asked when they may ask again
      Then they may ask now
