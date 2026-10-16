Feature: Sending an email through a mail server

  This is the sender that takes an email out of the site. It hands each one to
  a mail server over SMTP, the way the old site's sender did, with the server's
  address, port and the user name and password the site signs in with all set
  from outside the code. It does what the file sender does for development and
  the scenarios (`FileEmailSender.feature`), except that the email leaves the
  machine.

  Like the old site's, it always encrypts the connection. A mail server that
  will not encrypt is not sent to, rather than sent to in the clear: the
  password and every email's body, which holds links that sign a reader in,
  would otherwise be readable on the way.

  The email's body is already HTML, written by the email writer, and is sent as
  HTML. The old site had to look inside a body to tell, and this one never has
  to.

  Sending that fails throws, and says why in its message, so that the queue
  keeps the email and tries it again later. Nothing here retries.

  Background:
    Given a mail server that encrypts its connections
    And the moment "2026-09-19T10:00:00Z"

  Rule: An email is handed to the mail server as it was written

    Scenario: Sending an email gives the server one email
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent through the server
      Then the server has received 1 email

    Scenario: The email goes to the address it was given
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent through the server
      Then the email is to "someone@example.com"

    Scenario: The email comes from the address it was given
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent from "site@example.com" through the server
      Then the email is from "site@example.com"

    Scenario: The email has the subject it was given
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent with the subject "Confirm your email address" through the server
      Then the email's subject is "Confirm your email address"

    Scenario: The email's body is sent as HTML
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent with the body "<p>Hello</p>" through the server
      Then the email's HTML is "<p>Hello</p>"

    Scenario: A subject with a non-English letter is sent as it was written
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent with the subject "Bienvenue à Croquet Scores" through the server
      Then the email's subject is "Bienvenue à Croquet Scores"

  Rule: The sender signs in, and over an encrypted connection

    Scenario: It signs in with the user name it was given
      Given an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent through the server
      Then the server was signed in to as the user name

    Scenario: A server that refuses the password is a failure
      Given an SMTP email sender signing in with the wrong password
      When an email to "someone@example.com" is sent through the server
      Then sending fails
      And the server has received 0 emails

    Scenario: A server that will not encrypt is a failure
      Given a mail server that does not encrypt its connections
      And an SMTP email sender signing in with the right user name and password
      When an email to "someone@example.com" is sent through the server
      Then sending fails
      And the server has received 0 emails

    Scenario: The password is never in the failure's message
      Given an SMTP email sender signing in with the wrong password
      When an email to "someone@example.com" is sent through the server
      Then sending fails
      And the failure's message does not hold the password

  Rule: A failure is thrown so the email is tried again

    Scenario: A server that cannot be reached is a failure
      Given an SMTP email sender whose server cannot be reached
      When an email to "someone@example.com" is sent through the server
      Then sending fails

    Scenario: A server that refuses the address is a failure
      Given a mail server that refuses the address "nobody@example.com"
      And an SMTP email sender signing in with the right user name and password
      When an email to "nobody@example.com" is sent through the server
      Then sending fails

    Scenario: A failure says what the server said
      Given a mail server that refuses the address "nobody@example.com"
      And an SMTP email sender signing in with the right user name and password
      When an email to "nobody@example.com" is sent through the server
      Then sending fails
      And the failure's message holds what the server said
