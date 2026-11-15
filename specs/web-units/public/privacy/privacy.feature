Feature: A reader can see what the site keeps about them

  The site keeps an email address and a name for each account, and an address
  for each failed attempt to sign in or ask for a way back in. A reader who is
  being asked for any of it, or who has it kept, is owed an answer to what is
  kept, what it is used for, who can see it, and how to have it forgotten.

  That answer is a page of its own at `/privacy`, written once for each
  language the site is offered in as the help is, and shown in English where
  its language has none (`help.feature`). It is a page of the help's library
  and not an entry in a catalogue, because it is prose of some length that is
  better read whole than assembled from words.

  Every page links to it from the footer, so that it is one click from
  wherever a reader is asked for something, the register page among them.

  Where the site has been told who administers it, the page says to ask them, with a link that opens a message to them.
  Where it has not, it says nothing of who, rather than naming nobody.

  Scenarios here read pages and nothing more, so none need a browser or a
  database.

  Rule: The statement is a page of its own

    Scenario: The statement is at its own address
      When the privacy statement is opened
      Then the page is the privacy statement

    Scenario: The statement is not also in the help
      When the help page "privacy" is looked at
      Then the page is not found

    Scenario: The statement is shown in the reader's language
      Given a browser that asks for Welsh
      When the privacy statement is opened
      Then the statement is in Welsh

    Scenario: A language without the statement is shown it in English
      Given a browser that asks for Welsh
      And the help has no Welsh privacy statement
      When the privacy statement is opened
      Then the statement is in English

  Rule: The statement says who to ask

    Scenario: The administrator is named, as a link to send them email
      Given the site is told its administrator is "administrator@example.com"
      When the privacy statement is opened
      Then the statement links to send email to the administrator

    Scenario: An address with characters that mean something is linked as written
      Given the site is told its administrator is "a$&b@example.com"
      When the privacy statement is opened
      Then the statement links to send email to "a$&b@example.com"

  Rule: Every page links to it

    Scenario Outline: The footer links to the statement
      When the page at "<address>" is looked at
      Then the footer links to the privacy statement

      Examples:
        | address  |
        | /help    |
        | /privacy |
