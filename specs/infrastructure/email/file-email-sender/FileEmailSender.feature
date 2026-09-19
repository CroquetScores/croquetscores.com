Feature: Sending an email by writing it to a file

  The site will send email through a service outside it. Until then, and
  always in development and the scenarios, an email is "sent" by writing it to
  a file, where whoever is working on the site can open it in a browser and
  follow its links. Nothing leaves the machine.

  Each email is written as HTML to the repository's temp folder, which git
  ignores, as a file named for when it was sent, who it went to, and an id of
  its own, so that no two files are ever named alike:

    email-{when}-{to}-{id}.html

  where {when} is the moment in UTC, written 20260919T100000Z, so the files
  sort in the order they were sent, to the second; two sent in the same second
  sort by address and id rather than by which went first. An address may hold
  characters a file name cannot, such as a slash, so {to} is the address with
  each of those replaced, and an email to such an address is still written.
  And an address may be longer than a file name can hold: most file systems
  allow 255 bytes, and an address may be 254 on its own. So {to} is cut to its
  first 100 bytes, between characters rather than through one, which leaves
  the name well inside the limit and still says whose it is at a glance; the
  id keeps two emails to addresses alike that far apart. An email to the
  longest address is written like any other. What the file holds says who the
  email is to — the whole address — and from, and its subject, as well as its
  body.

  Who the email is to and from, and its subject, are written into the file as
  text, not as markup. An address can hold characters HTML reads as markup,
  and a subject is filled in from outside the site — the name of a service,
  say — so either, written as they came, could put a script in a file that
  runs when whoever is working on the site opens it. The body is already
  HTML, written by the email writer, which makes whatever fills it in text
  (`emailWriter.feature`), and is written as it is.

  Background:
    Given a file email sender writing to a folder of the scenario's own
    And the moment "2026-09-19T10:00:00Z"

  Rule: An email is written to a file of its own

    Scenario: Sending an email writes a file
      When an email to "someone@example.com" is sent
      Then the folder holds 1 file

    Scenario: The file is named for when, to whom, and an id
      When an email to "someone@example.com" is sent
      Then the file's name begins "email-20260919T100000Z-someone@example.com-"
      And the file's name ends ".html"

    Scenario: Two emails to the same address at the same moment are two files
      When an email to "someone@example.com" is sent
      And another email to "someone@example.com" is sent
      Then the folder holds 2 files

    Scenario: An email to an address with a slash in it is still written
      When an email to "some/one@example.com" is sent
      Then the folder holds 1 file

    Scenario: An email to an address of 254 bytes is still written
      When an email to an address of 254 bytes is sent
      Then the folder holds 1 file

    Scenario: The file's name is no longer than a file system allows
      When an email to an address of 254 bytes is sent
      Then the file's name is no longer than 255 bytes

    Scenario: The file names the whole of a long address inside it
      When an email to an address of 254 bytes is sent
      Then the file says it is to the whole address

  Rule: The file holds the whole email

    Scenario: The file says who the email is to
      When an email to "someone@example.com" with the subject "Confirm your address" is sent
      Then the file says it is to "someone@example.com"

    Scenario: The file says what the email is about
      When an email to "someone@example.com" with the subject "Confirm your address" is sent
      Then the file says its subject is "Confirm your address"

    Scenario: The file holds the email's body
      When an email to "someone@example.com" with the body "<p>Follow the link.</p>" is sent
      Then the file holds "<p>Follow the link.</p>"

  Rule: Who the email is to, and its subject, are written as text

    Scenario: An address with markup in it cannot become markup
      When an email to "<script>alert(1)</script>@example.com" is sent
      Then the file contains no element named "script"

    Scenario: A subject with markup in it cannot become markup
      When an email to "someone@example.com" with the subject "<script>alert(1)</script>" is sent
      Then the file contains no element named "script"

    Scenario: A subject with markup in it is still shown
      When an email to "someone@example.com" with the subject "<b>bold</b>" is sent
      Then the file says its subject is "<b>bold</b>"
