@postgres
Feature: An app lists the countries and their regions

  A tournament is held in a country, and in one of its regions where the country
  has them, so an app that creates a tournament (`createTournament.feature`) or
  reads one (`tournament.feature`) has to know which countries there are and
  which regions each has. The site's own form is given the same list at
  `/api/site/tournaments/new`, but only to a reader who is signed in, and along
  with much else an app does not need. An app asks the API for it at
  `/api/v0/countries`.

  Each country is told by its code (`code`), its name (`name`) and its regions
  (`regions`), each region by its code (`code`) and its name (`name`). A country
  that is not divided has one region, coded and named as the country is, since
  that is the region creating a tournament there takes. The codes are what an
  app keeps.

  The names are English unless the app asks for another language of the site,
  with `language` and the tag the site knows it by, such as `language=de`. The
  request's own language headers and cookies are not looked at, since an app
  that did not ask should get what it got the last time. A country is named in
  the language asked for, and the countries are in the order of those names as
  that language has them. A region is named as it was recorded, whatever the
  language, as the site's own form does. A language the site does not offer is
  refused and not answered in English, since an app that was told so would show
  the wrong words without knowing.

  The list is the same for every caller and changes only when the site does, so
  it follows the conventions of the other reads: a caller with no key is answered
  as one with a key is, a key that does not work is refused, and every answer
  carries an `ETag`, so that one the app already has is answered `304`. It is
  one answer and not pages, since there are only a few hundred.

  No browser is needed: these scenarios send plain requests.

  Background:
    Given a site served as "croquetscores.com"
    And "reader@example.com" has an account, confirmed, called "Rae Reader"
    And "reader@example.com" has made a key that may only read

  Rule: Every country is listed with its regions

    Scenario: A country says its code
      When the countries are asked with that key
      Then the API answers 200
      And the country "Australia" says its code is "au"

    Scenario: A country says its regions
      When the countries are asked with that key
      Then the country "Australia" lists the region "Victoria"

    Scenario: A region says its code
      When the countries are asked with that key
      Then the region "Victoria" of "Australia" says its code is "vic"

    Scenario: A country that is not divided lists itself as its one region
      When the countries are asked with that key
      Then the country "Andorra" lists the region "Andorra"
      And the region "Andorra" of "Andorra" says its code is "ad"

    Scenario: The countries are in the order of their names
      When the countries are asked with that key
      Then the countries are in the order of their names

    Scenario: The countries are listed with no key
      When the countries are asked with no key
      Then the API answers 200
      And the country "Australia" says its code is "au"

    Scenario: A key that does not work is refused
      When the countries are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: The names are in the language asked for

    Scenario: The names are English where no language is asked for
      When the countries are asked with that key
      Then the country "Germany" says its code is "de"

    Scenario: A country is named in the language asked for
      When the countries are asked with that key in the language "de"
      Then the country "Deutschland" says its code is "de"

    Scenario: The countries are in the order of the names in that language
      When the countries are asked with that key in the language "sv"
      Then the country "Österrike" is listed after the country "Zimbabwe"

    Scenario: A region is named as it was recorded in any language
      When the countries are asked with that key in the language "de"
      Then the region "Victoria" of "Australien" says its code is "vic"

    Scenario: The language of the request's headers is not looked at
      When the countries are asked with that key and the header language "de"
      Then the country "Germany" says its code is "de"

    Scenario: A language the site does not offer is refused
      When the countries are asked with that key in the language "tlh"
      Then the API answers 400
      And the API's code is "Countries.LanguageUnknown"
      And the API says the field at fault is "language"

  Rule: An answer unchanged is answered not modified, by its mark

    Scenario: An answer carries a mark of what it said
      When the countries are asked with that key
      Then the API gives a mark of its answer

    Scenario: The same question is answered not modified once its mark is sent
      Given the countries are asked with that key
      When the countries are asked again with that key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: A language has a mark of its own
      Given the countries are asked with that key
      And the mark of the answer is kept
      When the countries are asked with that key in the language "de"
      Then the answer's mark is not the mark kept

    Scenario: The answer is kept by the app and not by anybody between
      When the countries are asked with that key
      Then the API says the answer is for the app to keep and to check before it uses it
