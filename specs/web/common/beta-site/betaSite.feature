Feature: A site that is not on one of the two websites says it is a beta

  A site being tried by a few people before anybody else is let in is not at
  one of the two addresses readers know it by, and whatever is entered there
  may be thrown away when the site is made again. A reader should not have to
  be told that in an email to find it out: the notice is on every page, above
  everything, in black on yellow so that it is not read as part of the site.

  It is decided by the address the reader reached the site at, and not by a
  setting, so that the same build is a beta at one address and the real thing
  at another, and moving it cannot leave the notice behind or take it away
  wrongly. The two are croquetscores.com and gateballscores.com and every
  website under them, try among them. A name that merely ends the same, such as
  notcroquetscores.com, is not under them. The one website under them that is
  a beta is beta.croquetscores.com, which is where the site is tried: it has
  croquetscores.com's database (`Website.feature`), and says that anything
  entered there may be thrown away.

  These scenarios run against a server built for the notice and one page,
  and say nothing of what a page holds, which is each page's own.

  Rule: An address that is neither website's shows the notice above the page

    Scenario Outline: A page at another address says it is a beta
      When a page is asked for at "<address>"
      Then it says it is a beta site
      And the notice comes before the page's own content

      Examples:
        | address                      |
        | localhost:3000               |
        | beta.croquetscores.com       |
        | beta.croquetscores.com:443   |
        | BETA.CroquetScores.com       |
        | beta.example.com             |
        | notcroquetscores.com         |
        | croquetscores.com.example.io |

  Rule: An address under one of the two websites does not

    Scenario Outline: A page at the website's own address does not
      When a page is asked for at "<address>"
      Then it does not say it is a beta site

      Examples:
        | address                  |
        | croquetscores.com        |
        | www.croquetscores.com    |
        | try.croquetscores.com    |
        | gateballscores.com       |
        | try.gateballscores.com   |
        | CroquetScores.com        |
        | croquetscores.com:443    |

  Rule: Only a page has the notice

    Scenario: An answer that is not a page is left as it was
      When data is asked for at "beta.example.com"
      Then the answer is as it was written

  Rule: The notice is said in the reader's language

    Scenario: A reader who asks for Welsh is told in Welsh
      Given a browser that asks for Welsh
      When a page is asked for at "beta.example.com"
      Then it says it is a beta site in Welsh
