Feature: The website a site is served as

  Croquet Scores and Gateball Scores are built from the one code, and each is
  served as more than one website. Each has its own, croquetscores.com and
  gateballscores.com, where tournaments are really run, and each has a try
  website, try.croquetscores.com and try.gateballscores.com, where a reader
  learns the system without anything they do counting. The fifth is
  localhost:3000, which is where development serves, and which is a Croquet
  Scores website because the code is mostly worked on as Croquet Scores.

  A website is known by its host, written as a browser's address bar writes
  it, since that is the one thing about it nobody could mistake for another.
  A host is the same host however it is capitalised, because a browser treats
  it that way, and a host nobody set up is refused rather than taken as the
  nearest: a website that is not one of the five would offer sports and
  formats nobody decided on.

  Two things are known about each website: which of the two sites it serves,
  and whether it is a try website. The site is what the sports and formats
  it offers follow, which are specified with them; a try website offers what
  its own site offers, because the point of it is to learn the same system.
  What a try website shows differently is specified where it is shown: the
  banner every one of its pages carries is the shell's (`layout.feature`).

  Development is not a try website. It is where the site itself is worked
  on, and a try website is somewhere readers are sent.

  Rule: There are five websites

    Scenario Outline: A website there is is accepted
      When the website "<host>" is made
      Then it is not refused

      Examples:
        | host                   |
        | croquetscores.com      |
        | try.croquetscores.com  |
        | gateballscores.com     |
        | try.gateballscores.com |
        | localhost:3000         |

    Scenario: A host is the same host however it is capitalised
      When the website "CroquetScores.com" is made
      Then it is not refused

    Scenario Outline: A host that is no website's is refused
      When the website "<host>" is made
      Then it is refused for breaking "Website.Unknown"

      Examples:
        | host                      |
        | example.com               |
        | www.croquetscores.com     |
        | localhost:5173            |
        | https://croquetscores.com |

    Scenario: No host at all is refused
      When the website "" is made
      Then it is refused for breaking "Website.Missing"

  Rule: Each website serves one of the two sites

    Scenario Outline: A website serves its site
      Given the website "<host>"
      Then it serves the site "<site>"

      Examples:
        | host                   | site            |
        | croquetscores.com      | Croquet Scores  |
        | try.croquetscores.com  | Croquet Scores  |
        | gateballscores.com     | Gateball Scores |
        | try.gateballscores.com | Gateball Scores |
        | localhost:3000         | Croquet Scores  |

  Rule: Each site has one try website

    Scenario Outline: A try website is a try website
      Given the website "<host>"
      Then it is a try website

      Examples:
        | host                   |
        | try.croquetscores.com  |
        | try.gateballscores.com |

    Scenario Outline: Any other website is not a try website
      Given the website "<host>"
      Then it is not a try website

      Examples:
        | host               |
        | croquetscores.com  |
        | gateballscores.com |
        | localhost:3000     |

  Rule: Two websites are the same when their hosts are

    Scenario: Websites with the same host are the same website
      Given the website "croquetscores.com"
      When it is compared with the website "CROQUETSCORES.COM"
      Then they are the same website

    Scenario: Websites with different hosts are different websites
      Given the website "croquetscores.com"
      When it is compared with the website "try.croquetscores.com"
      Then they are different websites
