@postgres
Feature: A sitemap lists every page a search engine should find

  A search engine finds a page by following links to it, which reaches a
  tournament that is linked to from the home page or a year and misses one
  that is not, and does not know what else is there. A sitemap says what is
  there: one file, at "/sitemap.xml", that the robots file points to
  (`searchEngines.feature`), listing the pages that are for a reader to find.

  It lists the home page, each year that has a tournament in it, each sport in
  a year that has one, and each tournament's page: the pages a reader lands on
  by searching for a tournament, a year or a sport. A tournament's own sections
  (its players, its rankings, its notes) are not listed, since a search for a
  player's name is answered by the tournament, and a crowd of near-copies of
  its page would be a worse answer than the one page. A page that is not for a
  reader to find, such as the admin and the sign-in, is not listed, and nor is
  anything the robots file asks to be left alone.

  Each website has its own, listing its own tournaments at its own address, so
  that croquetscores.com's names no page of gateballscores.com. A tournament is
  listed once, at the address it has now: one it has moved on from leads there
  for good (`tournament.feature`), and is not a page of its own to find.

  A sitemap is for the websites that are found. Where search engines are not
  welcome, and on a try website or the beta whatever the setting says
  (`searchEngines.feature`), there is none: asking for it is a page that is not
  there, since a list of what to find on a website that is not to be found
  would say the opposite of the robots file.

  These scenarios run against a server with tournaments kept, and say nothing
  of what is on a page, which is each page's own.

  Rule: Told they are welcome, a website readers know has a sitemap

    Scenario: The sitemap is an XML sitemap
      Given the site is told search engines are welcome
      When the sitemap is asked for at "croquetscores.com"
      Then it is an XML sitemap

    Scenario: The sitemap lists the home page
      Given the site is told search engines are welcome
      When the sitemap is asked for at "croquetscores.com"
      Then it lists "https://croquetscores.com/"

    Scenario: The robots file points to the sitemap
      Given the site is told search engines are welcome
      When the robots file is asked for at "croquetscores.com"
      Then it names the sitemap "https://croquetscores.com/sitemap.xml"

    Scenario: The sitemap is asked for again each time
      Given the site is told search engines are welcome
      When the sitemap is asked for at "croquetscores.com"
      Then it is checked again before it is used

  Rule: It lists a tournament, the year it is in, and its sport in that year

    Scenario: A tournament is listed
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it lists "https://croquetscores.com/2026/ac/spring-open"

    Scenario: The year it is in is listed
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it lists "https://croquetscores.com/2026"

    Scenario: The sport it is of, in that year, is listed
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it lists "https://croquetscores.com/2026/ac"

    Scenario: A year with no tournament is not listed
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://croquetscores.com/2025"

    Scenario: A sport with no tournament in a year is not listed
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://croquetscores.com/2026/gc"

    Scenario: A tournament is listed once
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it lists "https://croquetscores.com/2026/ac/spring-open" once

    Scenario: A tournament that has moved is listed at the address it has now
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And the tournament is moved to 2027
      When the sitemap is asked for at "croquetscores.com"
      Then it lists "https://croquetscores.com/2027/ac/spring-open"

    Scenario: A tournament that has moved is not listed at the address it left
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And the tournament is moved to 2027
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://croquetscores.com/2026/ac/spring-open"

    Scenario: A tournament's own sections are not listed
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://croquetscores.com/2026/ac/spring-open/players"

    Scenario Outline: A page that is not for a reader to find is not listed
      Given the site is told search engines are welcome
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://croquetscores.com<path>"

      Examples:
        | path   |
        | /admin |
        | /auth/ |

  Rule: Each website lists its own tournaments at its own address

    Scenario: A website does not list another's tournament
      Given the site is told search engines are welcome
      And a tournament "Spring Open" of Association Croquet in 2026 on croquetscores.com
      And a tournament "Beach Open" of Gateball in 2026 on gateballscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://gateballscores.com/2026/gb/beach-open"

    Scenario: A website lists its own tournament at its own address
      Given the site is told search engines are welcome
      And a tournament "Beach Open" of Gateball in 2026 on gateballscores.com
      When the sitemap is asked for at "gateballscores.com"
      Then it lists "https://gateballscores.com/2026/gb/beach-open"

    Scenario: A website does not list a tournament of its try website
      Given the site is told search engines are welcome
      And a tournament "Practice Open" of Association Croquet in 2026 on try.croquetscores.com
      When the sitemap is asked for at "croquetscores.com"
      Then it does not list "https://croquetscores.com/2026/ac/practice-open"

  Rule: A sitemap holds no more than a search engine reads

    A search engine reads at most fifty thousand addresses from a sitemap. A
    website with more is given an index at "/sitemap.xml" naming sitemaps of
    its own, each of no more than that, so that what is past the limit is not
    quietly left unread.

    Scenario: A website with fifty thousand pages has a sitemap of its pages
      Given the site is told search engines are welcome
      And a website with 50000 pages to list
      When the sitemap is asked for at "croquetscores.com"
      Then it is an XML sitemap

    Scenario: A website with more than fifty thousand pages has an index
      Given the site is told search engines are welcome
      And a website with 50001 pages to list
      When the sitemap is asked for at "croquetscores.com"
      Then it is an XML sitemap index

    Scenario: The index names the first sitemap
      Given the site is told search engines are welcome
      And a website with 50001 pages to list
      When the sitemap is asked for at "croquetscores.com"
      Then it names the sitemap "https://croquetscores.com/sitemap-1.xml"

    Scenario: The index names the second sitemap
      Given the site is told search engines are welcome
      And a website with 50001 pages to list
      When the sitemap is asked for at "croquetscores.com"
      Then it names the sitemap "https://croquetscores.com/sitemap-2.xml"

    Scenario: The first sitemap lists fifty thousand pages
      Given the site is told search engines are welcome
      And a website with 50001 pages to list
      When the sitemap "sitemap-1.xml" is asked for at "croquetscores.com"
      Then it lists 50000 pages

    Scenario: The second sitemap lists the page that is left
      Given the site is told search engines are welcome
      And a website with 50001 pages to list
      When the sitemap "sitemap-2.xml" is asked for at "croquetscores.com"
      Then it lists 1 page

  Rule: Where the website is not to be found, there is no sitemap

    Scenario: A site told nothing about search engines has none
      Given the site is told nothing about search engines
      When the sitemap is asked for at "croquetscores.com"
      Then there is no such page

    Scenario: A site told search engines are not welcome has none
      Given the site is told search engines are not welcome
      When the sitemap is asked for at "croquetscores.com"
      Then there is no such page

    Scenario Outline: A try website, the beta or a developer's computer has none whatever the setting says
      Given the site is told search engines are welcome
      When the sitemap is asked for at "<address>"
      Then there is no such page

      Examples:
        | address                |
        | try.croquetscores.com  |
        | try.gateballscores.com |
        | beta.croquetscores.com |
        | localhost:3000         |

    Scenario: The robots file of a site not to be found points to no sitemap
      Given the site is told nothing about search engines
      When the robots file is asked for at "croquetscores.com"
      Then it names no sitemap
