Feature: The site is offered in the languages of the countries tournaments are played in

  A language is written and kept up to date by hand, so the site is offered
  in the languages of the countries it is most used in rather than in as many
  as could be had. Those are the countries `countryOrder.feature` puts first:
  the six tournaments are most played in, and the others they have been played
  in since 2025. A country that speaks English is served by English, and so
  has no language of its own.

  Each language is written in whole: the site's words, and the help beside
  them. Each language's own feature holds it to English's words. This is about
  which languages there are.

  Rule: Every language is spoken in a country tournaments are played in

    Scenario Outline: <language> is spoken in <country>
      Given the language file "<language>"
      Then the country "<country>" is one tournaments are played in

      Examples:
        | language   | country |
        | english    | england |
        | afrikaans  | za      |
        | czech      | cz      |
        | egyptian   | eg      |
        | german     | de      |
        | greek      | gr      |
        | latvian    | lv      |
        | norwegian  | no      |
        | portuguese | pt      |
        | spanish    | es      |
        | swedish    | se      |
        | welsh      | wales   |

  Rule: The site is in no other language

    Scenario: The languages the site is written in are those and no others
      Then the site is written in english, afrikaans, czech, egyptian, german, greek, latvian, norwegian, portuguese, spanish, swedish and welsh

    Scenario: The help is written in the same languages as the site
      Then the help is written in the languages the site is
