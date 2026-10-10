@postgres
Feature: What the import said of one document it refused, as an administrator reads it

  An administrator opens one document from the list of those the import
  refused (`ImportErrorsKept.feature`) to read the whole of what the import
  said of it, so the application answers with the document's id and the full
  message, every line of it as it was kept.

  The import can keep more than one error against a document, as when it
  refuses it for a second reason on another run of the import over the same
  tables. A document is therefore answered with every message kept against it,
  in the order they were kept, rather than with one and the other lost.

  Where the import knew the tournament the document is of, it kept the
  tournament's address and name with the error, and the competition's name
  where the document was one (`ImportDatabase.feature`). They are answered
  too, with the old site the document was on, which its id begins with, and
  the paths the document can be read at on the site and on the old site, so
  that the reader can be taken to it on each. An error kept before the import
  kept those paths is answered with the tournament's address for both. A
  document whose errors knew no tournament is answered with none.

  A document id that nothing was kept against is refused as
  `ImportErrorKept.NotFound`. Only an administrator can ask: anybody else is
  refused with `Account.NotAnAdministrator`, whether or not there is such a
  document, so that the answer does not tell whoever may not ask what is kept.

  Background:
    Given the application's import errors
    And the moment "2026-10-09T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "someone@example.com" has an account, confirmed, called "Sam Someone"

  Rule: The document is answered with its id and its whole message

    Scenario: The document's id is answered
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then the document id answered is "users/1-A"

    Scenario: The first line of the message is answered
      Given the import refused the document "users/1-A" with "No email address" then "at line 4"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then the first message answered has the first line "No email address"

    Scenario: The later lines of the message are answered
      Given the import refused the document "users/1-A" with "No email address" then "at line 4"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then the first message answered has the second line "at line 4"

    Scenario: A document id with a slash in it is found
      Given the import refused the document "users/1-A" with "No email address"
      And the import refused the document "users/2-A" with "No name"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/2-A"
      Then the first message answered has the first line "No name"

  Rule: Every message kept against the document is answered, in the order kept

    Scenario: A second message is answered
      Given the import refused the document "users/1-A" with "No email address"
      And the import refused the document "users/1-A" with "Bad date"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then the second message answered has the first line "Bad date"

    Scenario: A message kept against another document is not answered
      Given the import refused the document "users/1-A" with "No email address"
      And the import refused the document "users/2-A" with "Bad date"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then 1 message is answered

  Rule: The tournament the document is of is answered, where the import knew it

    Scenario: The tournament's name is answered
      Given the import refused the document "croquetscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error's tournament is called "Spring Open"

    Scenario: The tournament's address is answered
      Given the import refused the document "croquetscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error's tournament is at "2014/ac/spring-open"

    Scenario: The old site the document was on is answered
      Given the import refused the document "gateballscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/gb/spring-open" called "Spring Open" with "Refused"
      When the reader signed in to the account for "admin@example.com" reads the import error of "gateballscores.com/blocks/30"
      Then the import error's tournament was on "gateballscores.com"

    Scenario: The competition's name is answered
      Given the import refused the document "croquetscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error's competition is called "A Block"

    Scenario: Where the document is on the new site is answered
      Given the import refused the document "croquetscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      And the import error of "croquetscores.com/blocks/30" is at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error's document is at "2014/ac/spring-open/competitions/a-block" on the new site

    Scenario: Where the document was on the old site is answered
      Given the import refused the document "croquetscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      And the import error of "croquetscores.com/blocks/30" is at "2014/ac/spring-open/competitions/a-block" on the new site and "2014/ac/spring-open/competition/block-a" on the old site
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error's document is at "2014/ac/spring-open/competition/block-a" on the old site

    Scenario: An error kept without where its document is answers its tournament's address
      Given the import refused the document "croquetscores.com/blocks/30" of the competition "A Block" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error's document is at "2014/ac/spring-open" on the new site

    Scenario: A document that was no competition is answered with none
      Given the import refused the document "croquetscores.com/commentaries/30" of the tournament at "2014/ac/spring-open" called "Spring Open" with "Refused"
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/commentaries/30"
      Then the import error is of no competition

    Scenario: A document whose errors knew no tournament is answered with none
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then the import error is of no tournament

  Rule: What went wrong is answered said for a person, where the import said it so

    Scenario: An error said for a person is answered with it
      Given the import refused the document "croquetscores.com/blocks/30" with "Refused"
      And the import error of "croquetscores.com/blocks/30" is said for a person as "Game Tim 26 beat Trev 0"
      When the reader signed in to the account for "admin@example.com" reads the import error of "croquetscores.com/blocks/30"
      Then the import error is said for a person as "Game Tim 26 beat Trev 0"

    Scenario: An error with no saying is answered with none
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/1-A"
      Then the import error is said for a person as nothing

  Rule: A document nothing was kept against is refused

    Scenario: A document that was not refused is not found
      When the reader signed in to the account for "admin@example.com" reads the import error of "users/9-A"
      Then reading the import error is refused with "ImportErrorKept.NotFound"

  Rule: Only an administrator can ask

    Scenario: A reader who is not an administrator is refused
      Given the import refused the document "users/1-A" with "No email address"
      When the reader signed in to the account for "someone@example.com" reads the import error of "users/1-A"
      Then reading the import error is refused with "Account.NotAnAdministrator"

    Scenario: A reader who is not an administrator is refused for a document that is not there
      When the reader signed in to the account for "someone@example.com" reads the import error of "users/9-A"
      Then reading the import error is refused with "Account.NotAnAdministrator"
