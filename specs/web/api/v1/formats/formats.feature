@postgres
Feature: An app lists the formats a tournament may be played in

  An app that makes a tournament (`createTournament.feature`) says which format
  it is played in, so it needs to know which there are. It asks the API at
  `/api/v1/tournaments/formats`, as the site's own page for a new tournament
  asks for its choices, and is told, for each format, its `code`, which is what
  the app sends to make a tournament in it, its `name`, which is what a person
  is shown, whether it is played by teams (`teams`) and whether a test between
  two teams may be drawn level (`drawsLevelTests`).

  The formats are the ones the website offers, so Gateball Scores lists the
  one it offers and not the ones that are for croquet. A name is in the
  language the caller asks for, as a browser asks for one with
  `Accept-Language`, and in English where the site has none of the languages
  asked for. An app that would rather say which language in the address, where
  it is easier to set than a header, adds `language` with the tag of one of the
  site's languages, such as `de`. That is a choice and not a hint, so it
  outranks `Accept-Language`, and a language the site does not have is refused
  rather than answered in another, since the app asked for that one by name. The code is the same in every language, since an app is not
  expected to know what a person is shown.

  Nothing here depends on a tournament or on who asks, so the list follows the
  conventions of the other reads: a caller with no key is answered as one with
  a key is, a key that does not work is refused, and every answer carries an
  `ETag`, so that one the app already has is answered `304`.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read

  Rule: Every format the website offers is listed

    Scenario: The formats are listed
      When the formats are asked with that key
      Then the API answers 200
      And 5 formats are listed

    Scenario: Standard is listed
      When the formats are asked with that key
      Then the format "Standard" is listed

    Scenario: Teams is listed
      When the formats are asked with that key
      Then the format "Teams" is listed

    Scenario: The Eire Cup is listed
      When the formats are asked with that key
      Then the format "Eire Cup" is listed

    Scenario: The Interstate Shield is listed
      When the formats are asked with that key
      Then the format "Interstate Shield" is listed

    Scenario: The GC World Team Championship is listed
      When the formats are asked with that key
      Then the format "GC World Team Championship" is listed

    Scenario: Standard is listed first, as the most used
      When the formats are asked with that key
      Then the first format listed is "Standard"

    Scenario: Gateball Scores lists Standard alone
      When the formats are asked with that key on the site "gateballscores.com"
      Then 1 format is listed
      And the format "Standard" is listed

  Rule: A format says how it is played

    A team format is made of teams and has no players of its own, which is what
    an app needs to know before it asks for the players of a tournament or adds
    one. Only the GC World Team Championship draws a test level, since the others
    are decided on what was won.

    Scenario: Standard is not played by teams
      When the formats are asked with that key
      Then the format "Standard" says it is not played by teams

    Scenario: Teams is played by teams
      When the formats are asked with that key
      Then the format "Teams" says it is played by teams

    Scenario: The Eire Cup is played by teams
      When the formats are asked with that key
      Then the format "Eire Cup" says it is played by teams

    Scenario: The GC World Team Championship draws a test level
      When the formats are asked with that key
      Then the format "GC World Team Championship" says it draws a test level

    Scenario: Teams does not draw a test level
      When the formats are asked with that key
      Then the format "Teams" says it does not draw a test level

    Scenario: Standard does not draw a test level
      When the formats are asked with that key
      Then the format "Standard" says it does not draw a test level

  Rule: A format is named in the language asked for

    Scenario: A name is said in the language asked for
      When the formats are asked with that key in the language "de"
      Then the format "Teams" says its name is "Mannschaften"

    Scenario: A name is said in English where the language asked for is not offered
      When the formats are asked with that key in the language "tlh"
      Then the format "Teams" says its name is "Teams"

    Scenario: A code is the same in every language
      When the formats are asked with that key in the language "de"
      Then the format "Teams" is listed

    Scenario: A name is said in the language the address asks for
      When the formats are asked with that key and the language "de"
      Then the format "Teams" says its name is "Mannschaften"

    Scenario: The language in the address outranks the one a browser asks for
      When the formats are asked with that key and the language "de" in the language "cy"
      Then the format "Teams" says its name is "Mannschaften"

    Scenario: A language is written in either case
      When the formats are asked with that key and the language "DE"
      Then the format "Teams" says its name is "Mannschaften"

    Scenario: A language is written in mixed case
      When the formats are asked with that key and the language "De"
      Then the format "Teams" says its name is "Mannschaften"

    Scenario: A language said twice is refused
      When the formats are asked with that key and the languages "de" and "cy"
      Then the API answers 400
      And the API's code is "Formats.LanguageNotOffered"
      And the API says the field at fault is "language"

    Scenario: A language the site does not have is refused
      When the formats are asked with that key and the language "tlh"
      Then the API answers 400
      And the API's code is "Formats.LanguageNotOffered"
      And the API says the field at fault is "language"

    Scenario: A language that is empty is refused
      When the formats are asked with that key and the language ""
      Then the API answers 400
      And the API's code is "Formats.LanguageNotOffered"

    Scenario: The answer says it depends on the language asked for
      When the formats are asked with that key
      Then the API says the answer depends on the Accept-Language header

    Scenario: The answer says it depends on the language the site remembers
      When the formats are asked with that key
      Then the API says the answer depends on the Cookie header

  Rule: Any caller may ask

    Scenario: The formats are listed with no key
      When the formats are asked with no key
      Then the API answers 200
      And 5 formats are listed

    Scenario: A key that does not work is refused
      When the formats are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: An answer unchanged is answered not modified, by its mark

    Scenario: An answer carries a mark of what it said
      When the formats are asked with that key
      Then the API gives a mark of its answer

    Scenario: The same question is answered not modified once its mark is sent
      Given the formats are asked with that key
      When the formats are asked again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: The answer is kept by the app and not by anybody between
      When the formats are asked with that key
      Then the API says the answer is for the app to keep and to check before it uses it
