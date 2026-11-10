@postgres
Feature: Every page names the one address it is known by

  The same page is reached by more than one address: a list sorted, a list
  narrowed to a country, a link carrying where it was shared from. A search
  engine that finds each of them treats them as pages of their own, and the
  ranking a page has earned is shared among copies of it. So a page says which
  address is its own, in a link to itself that a search engine reads, and the
  copies are counted as one.

  The address is the page's path alone, on the website it was reached at, over
  https: whatever follows a "?" is how the reader asked to see the page and not
  which page it is, so "/2026?tournaments=name" and "/2026" are the one page at
  "https://croquetscores.com/2026". A reader's language is not part of it
  either, since the same address is answered in the language each reader asked
  for, and each language is not a page of its own.

  It is on every page a reader is sent to, not only the ones listed to be found
  (`sitemap.feature`), since a link shared in a message is to whichever page the
  reader was reading. A page that is not there, and the admin and the API,
  which are not pages to be found, have none.

  A website says its own address, whichever of them it is: a try website names
  itself rather than the real website. Whether it is found is the robots
  file's to say (`searchEngines.feature`).

  These scenarios run against a server with tournaments kept, and say nothing
  of what else is on a page, which is each page's own.

  Rule: A page names its own address

    Scenario Outline: A page's address is its path on its website
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And a tournament "Beach Open" of Gateball in 2026 on gateballscores.com
      When the page "<path>" is asked for at "<address>"
      Then its canonical link is "<canonical>"

      Examples:
        | path                         | address               | canonical                                             |
        | /                            | croquetscores.com     | https://croquetscores.com/                            |
        | /2026                        | croquetscores.com     | https://croquetscores.com/2026                        |
        | /2026/ac                     | croquetscores.com     | https://croquetscores.com/2026/ac                     |
        | /2026/ac/spring-open         | croquetscores.com     | https://croquetscores.com/2026/ac/spring-open         |
        | /2026/ac/spring-open/players | croquetscores.com     | https://croquetscores.com/2026/ac/spring-open/players |
        | /terms-of-use                | croquetscores.com     | https://croquetscores.com/terms-of-use                |
        | /2026/gb/beach-open          | gateballscores.com    | https://gateballscores.com/2026/gb/beach-open         |
        | /                            | try.croquetscores.com | https://try.croquetscores.com/                        |

    Scenario: A page has one canonical link
      When the page "/" is asked for at "croquetscores.com"
      Then it has one canonical link

  Rule: What the reader asked of the page is not part of its address

    Scenario: How a list is sorted is not part of the address
      When the page "/2026?tournaments=name" is asked for at "croquetscores.com"
      Then its canonical link is "https://croquetscores.com/2026"

    Scenario: A country a list is narrowed to is not part of the address
      When the page "/2026?country=nz" is asked for at "croquetscores.com"
      Then its canonical link is "https://croquetscores.com/2026"

    Scenario: Where a link was shared from is not part of the address
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the page "/2026/ac/spring-open?utm_source=newsletter" is asked for at "croquetscores.com"
      Then its canonical link is "https://croquetscores.com/2026/ac/spring-open"

  Rule: The reader's language is not part of the address

    Scenario Outline: A page names the same address in every language
      When the page "/2026" is asked for at "croquetscores.com" in the language "<language>"
      Then its canonical link is "https://croquetscores.com/2026"

      Examples:
        | language |
        | en       |
        | cs       |

  Rule: An address a tournament has moved on from leads to the one it is at now

    A tournament moved to another year is at a new address, and its old one
    leads there for good (`tournament.feature`), so the page a reader is shown
    names the address it is at now.

    Scenario: The page a moved tournament leads to names its own address
      Given a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And the tournament is moved to 2027
      When the page "/2027/ac/spring-open" is asked for at "croquetscores.com"
      Then its canonical link is "https://croquetscores.com/2027/ac/spring-open"

  Rule: An answer that is not a page to be found names nothing

    Scenario Outline: Some answers have no canonical link
      When the page "<path>" is asked for at "croquetscores.com"
      Then it has no canonical link

      Examples:
        | path                 |
        | /2026/ac/no-such-one |
        | /admin               |
        | /api/site/session    |
