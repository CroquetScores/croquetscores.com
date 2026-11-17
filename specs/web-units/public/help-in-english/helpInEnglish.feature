Feature: A help page is shown in English where its language has none

  The privacy statement, the terms of use and the data deletion policy are
  pages of the help's library, written once for each language the site is
  offered in (`privacy.feature`, `termsOfUse.feature`,
  `dataDeletionPolicy.feature`). Where a reader's language has none of them
  they are shown the English one, and not nothing: terms are the one page where
  a translation that says something slightly different is worse than none.

  These scenarios are about a library the site is given and the site's
  settings, which the website alone cannot be made to have, so they are made of
  the site's parts and not of the running site.

  Rule: A language without a page is shown it in English

    Scenario: A language without the statement is shown it in English
      Given a browser that asks for Welsh
      And the help has no Welsh privacy statement
      When the privacy statement is opened
      Then the statement is in English

    Scenario: A language without the terms for readers is shown them in English
      Given a browser that asks for Welsh
      And the help has no Welsh terms of use
      When the terms of use are opened
      Then the terms are in English

    Scenario: A language without the terms for those who write is shown them in English
      Given a browser that asks for Welsh
      And the help has no Welsh terms of use for those who write
      When the terms of use for those who write are opened
      Then the terms are in English

    Scenario: A language without the data deletion policy is shown it in English
      Given a browser that asks for Welsh
      And the help has no Welsh data deletion policy
      When the data deletion policy is opened
      Then the policy is in English

  Rule: The administrator is linked as written

    Scenario: An address with characters that mean something is linked as written
      Given the site is told its administrator is "a$&b@example.com"
      When the privacy statement is opened
      Then the statement links to send email to "a$&b@example.com"
