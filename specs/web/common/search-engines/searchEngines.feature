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
  nothing about what a page holds, which is each page's own. A scenario that
  names no website is asked of croquetscores.com, the one the setting is
  about.

  Rule: Told nothing, the site asks every search engine to keep away

    Scenario: The robots file disallows everything
      Given the site is told nothing about search engines
      When the robots file is asked for
      Then it disallows "/"

    Scenario: The robots file is asked for again each time
      Given the site is told nothing about search engines
      When the robots file is asked for
      Then it is checked again before it is used

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

  Rule: Told they are welcome, only the two websites readers know are found

    One server answers for croquetscores.com, gateballscores.com, the try
    website under each, and the beta (`betaSite.feature`), and the setting is
    the server's, not any one website's. So a server told that search engines
    are welcome would otherwise offer the try websites to them too, where
    whatever is entered "may be removed at any time" (`layout.feature`) and a
    result once indexed would put somebody's practice in front of the world.
    The try websites, the beta and a developer's own computer keep search
    engines away whatever the setting says; only croquetscores.com and
    gateballscores.com are found.

    Scenario Outline: A page of a website readers know does not ask not to be indexed
      Given the site is told search engines are welcome
      When a page of the website at "<address>" is asked for
      Then it does not ask not to be indexed

      Examples:
        | address               |
        | croquetscores.com     |
        | gateballscores.com    |
        | CroquetScores.com     |
        | croquetscores.com.    |
        | croquetscores.com:443 |

    Scenario Outline: A page of a try website, the beta or a developer's computer asks not to be indexed
      Given the site is told search engines are welcome
      When a page of the website at "<address>" is asked for
      Then it asks not to be indexed

      Examples:
        | address                |
        | try.croquetscores.com  |
        | try.gateballscores.com |
        | beta.croquetscores.com |
        | localhost:3000         |

    Scenario Outline: A page of an address that is none of the websites asks not to be indexed
      Given the site is told search engines are welcome
      When a page of the website at "<address>" is asked for
      Then it asks not to be indexed

      Examples:
        | address               |
        | example.org           |
        | notcroquetscores.com  |
        | croquetscores.com:80  |

    Scenario Outline: The robots file of a website readers know does not disallow everything
      Given the site is told search engines are welcome
      When the robots file is asked for at "<address>"
      Then it does not disallow "/"

      Examples:
        | address               |
        | croquetscores.com     |
        | gateballscores.com    |
        | CroquetScores.com     |
        | croquetscores.com.    |
        | croquetscores.com:443 |

    Scenario Outline: The robots file of a try website, the beta or a developer's computer disallows everything
      Given the site is told search engines are welcome
      When the robots file is asked for at "<address>"
      Then it disallows "/"

      Examples:
        | address                |
        | try.croquetscores.com  |
        | try.gateballscores.com |
        | beta.croquetscores.com |
        | localhost:3000         |

  Rule: The address is the one a trusted proxy says the reader asked for

    The site is reached through a proxy, which is addressed to the server's own
    address and says in a header which website the reader asked for. That is
    believed only where the proxy is one the site trusts, as it is everywhere
    else the site reads the address, so a welcome is not lost to the proxy's own
    address, and not given to whoever writes the header.

    Scenario: A trusted proxy's word for the address is believed
      Given the site is told search engines are welcome
      And the site is behind a proxy it trusts
      When a page is asked for at "127.0.0.1:3000" by way of the proxy for "croquetscores.com"
      Then it does not ask not to be indexed

    Scenario: A trusted proxy's word for a try website is believed
      Given the site is told search engines are welcome
      And the site is behind a proxy it trusts
      When a page is asked for at "127.0.0.1:3000" by way of the proxy for "try.croquetscores.com"
      Then it asks not to be indexed

    Scenario: A proxy that is not trusted is not believed
      Given the site is told search engines are welcome
      When a page is asked for at "try.croquetscores.com" by way of the proxy for "croquetscores.com"
      Then it asks not to be indexed

  Rule: What is answered depends on the address, and a cache is told so

    Scenario: The robots file varies by the address it was asked at
      Given the site is told search engines are welcome
      When the robots file is asked for
      Then the answer varies by "Host"

    Scenario: A page varies by the address it was asked at
      Given the site is told search engines are welcome
      When a page is asked for
      Then the answer varies by "Host"

    Scenario: A page that already varies by something says so as well
      Given the site is told search engines are welcome
      When a page that varies by "Cookie" is asked for
      Then the answer varies by "Cookie"
      And the answer varies by "Host"

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
