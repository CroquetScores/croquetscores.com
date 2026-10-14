Feature: Search engines are kept away until the site is told they are welcome

  A site that is being tried by a few people before anyone else is let in
  should not be found by anybody who has not been sent there. A search engine
  that indexes it early puts a half-finished site, and the tournaments entered
  by the people trying it, in front of the world, and a result once indexed is
  slow to be forgotten.

  So the site keeps search engines away unless it is told they are welcome,
  which is the one answer that cannot be left behind by mistake: a deployment
  that forgets the setting is merely hard to find, which is noticed, where the
  other way round the half-finished site is found, which is noticed by
  nobody. It is a setting on whatever serves the site, like the host the site
  answers to (`crossSite.feature`), and it belongs on the same deployment
  checklist.

  Two things say it. The robots file is what well-behaved crawlers read first,
  and says to keep away from everything. And every answer carries a header
  saying the same, which is what covers a page that was linked to from
  somewhere before the crawler read the file, and the files that are not pages.

  Where the site is told they are welcome, the header is not sent and the
  robots file asks only that the parts that are not for readers are left alone:
  the admin, the API and the sign-in.

  These scenarios run against a server built for the one setting, and say
  nothing about what a page holds, which is each page's own.

  Rule: Told nothing, the site asks every search engine to keep away

    Scenario: The robots file disallows everything
      Given the site is told nothing about search engines
      When the robots file is asked for
      Then it disallows "/"

    Scenario: A page asks not to be indexed
      Given the site is told nothing about search engines
      When a page is asked for
      Then it asks not to be indexed

    Scenario: Search engines said to be unwelcome are kept away too
      Given the site is told search engines are not welcome
      When a page is asked for
      Then it asks not to be indexed

  Rule: Told they are welcome, the site lets them read what is for readers

    Scenario: A page does not ask not to be indexed
      Given the site is told search engines are welcome
      When a page is asked for
      Then it does not ask not to be indexed

    Scenario: The robots file does not disallow everything
      Given the site is told search engines are welcome
      When the robots file is asked for
      Then it does not disallow "/"

    Scenario Outline: The robots file keeps them out of what is not for readers
      Given the site is told search engines are welcome
      When the robots file is asked for
      Then it disallows "<path>"

      Examples:
        | path   |
        | /admin |
        | /api/  |
        | /auth/ |

  Rule: A setting that is neither yes nor no stops the site starting

    The setting is read as true or false and nothing else, because the guess
    a misspelling would be left to is the dangerous one.

    Scenario Outline: The setting is accepted when it says yes or no
      Given the site is told search engines are "<setting>"
      When the site is started
      Then it is up

      Examples:
        | setting |
        | true    |
        | false   |
        | TRUE    |

    Scenario: A setting that says neither is refused
      Given the site is told search engines are "perhaps"
      When the site is started
      Then the setting is refused
      And the refusal names the setting
