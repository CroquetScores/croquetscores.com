Feature: The help is read in the language the site is shown in

  The help is written once for each language the site is offered in. A reader
  is shown it in the language the rest of the site is already in, which is the
  one they chose, or else the one their browser asks for, and the address of a
  page is the same in every language.

  Where the help has not been written in that language, or not that page of
  it, the reader is shown the English page rather than none.

  Scenarios here read pages and nothing more, so none need a browser or a
  database.

  Rule: A page is shown in the language of the site

    Scenario: The first page of the help, with nothing chosen
      When the help is opened
      Then the page is in English

    Scenario: A page in the language the reader has chosen
      Given the reader has chosen Welsh
      When the help is opened
      Then the page is in Welsh

    Scenario: A page in the language the browser asks for
      Given a browser that asks for French
      When the help is opened
      Then the page is in French

    Scenario: A language written from right to left is shown that way
      Given the reader has chosen Egyptian Arabic
      When the help is opened
      Then the page is shown from right to left

    Scenario: The page is not kept for readers of another language
      Given the reader has chosen Welsh
      When the help is opened
      Then the page varies by the language the reader has chosen

  Rule: The page asked for is the page shown

    Scenario: A page inside the help
      When the help page "tournament-managers/standard-tournament/players" is opened
      Then the page is the one about players in a standard tournament

    Scenario: The same page in another language
      Given the reader has chosen German
      When the help page "tournament-managers/standard-tournament/players" is opened
      Then the page is the one about players in a standard tournament
      And the page is in German

    Scenario: A page the help does not have
      When the help page "no-such-page" is opened
      Then the page is not found

  Rule: A page not written in the reader's language is shown in English

    Scenario: A page missing from a language
      Given the reader has chosen Welsh
      And the help has no Welsh page "tournament-managers/standard-tournament/players"
      When the help page "tournament-managers/standard-tournament/players" is opened
      Then the page is in English

  Rule: The links and pictures of a page lead somewhere

    Scenario: A link to another page of the help
      When the help page "tournament-managers/standard-tournament" is opened
      Then every link into the help leads to a page

    Scenario: A picture on a page
      When the help page "tournament-managers/standard-tournament/scores" is opened
      Then every picture is found

  Rule: A picture shows the site in the language of the page

    The pictures are photographs of the admin and the public pages, and the
    words in them are the site's, so each language has its own, made by
    npm run help:screenshots. Where a language has not got one, the picture
    is the English one, since a picture in the wrong language is better than
    none.

    Scenario: A picture made for the reader's language
      Given the reader has chosen Welsh
      When the help picture "tournament-managers/standard-tournament/players-tab.png" is opened
      Then the picture is the Welsh one

    Scenario: A picture not made for the reader's language
      Given the reader has chosen Welsh
      And the help has no Welsh picture "tournament-managers/standard-tournament/players-tab.png"
      When the help picture "tournament-managers/standard-tournament/players-tab.png" is opened
      Then the picture is the English one

    Scenario: The picture varies by the language the reader has chosen
      Given the reader has chosen Welsh
      When the help picture "tournament-managers/standard-tournament/players-tab.png" is opened
      Then the picture varies by the language the reader has chosen
