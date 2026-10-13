@postgres
Feature: Importing the old sites' tournaments

  The old sites kept each tournament as a document in RavenDB, with its
  players in a document of their own and each competition in another. This
  brings the tournament itself over: what it is called, when it was played,
  in what sport, format and country, and who ran it. Its players and its
  competitions are brought over after it, with it
  (`ImportWholeTournaments.feature`), which also says which tournaments are
  brought over at all: an archived one is not.

  A tournament is brought over as it is on the old site, and as the site
  would hold it, and where the two differ the scenarios below say which wins.
  It is brought over as created by the account the user who created it
  became (`ImportUsers.feature`), at the start of its first day, since the
  old sites kept no moment it was created at.

  Which tournament each document became is kept, by the website and the
  document, so that its players and its competitions can find it. The record
  goes when importing is finished.

  Background:
    Given the users are imported
    And the tournaments are imported
    And a user "users/1" on "croquetscores.com" is imported as "manager@example.com"

  Rule: A tournament is brought over as it was on the old site

    Scenario: A tournament becomes a tournament
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is kept as a tournament

    Scenario: The tournament is on the website it came from
      Given a tournament "tournaments/12" on "gateballscores.com"
      And the tournament is in the sport "GB"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "gateballscores.com" is on "gateballscores.com"

    Scenario: The tournament is called what it was called
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Canterbury Open"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "Canterbury Open"

    Scenario: The tournament starts at the start of the day it started on
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament started on "2014-03-01T00:00:00.0000000"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" starts at "2014-03-01T00:00:00Z"

    Scenario: The tournament finishes at the start of the day it finished on
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament finished on "2014-03-03T00:00:00.0000000"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" finishes at "2014-03-03T00:00:00Z"

    Scenario: The tournament was created at the start of the day it started on
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament started on "2014-03-01T00:00:00.0000000"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" was created at "2014-03-01T00:00:00Z"

  Rule: A tournament is played in the sport and the format the old site named

    The old sites kept a sport and a tournament type in whatever case they
    were written in, "AC" in one tournament and "ac" in another, and read them
    in any case. So they are read here in any case too.

    Scenario Outline: The old site's sport is the site's sport
      Given a tournament "tournaments/12" on "<website>"
      And the tournament is in the sport "<old sport>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "<website>" is played in "<sport>"

      Examples:
        | website            | old sport | sport               |
        | croquetscores.com  | AC        | Association Croquet |
        | croquetscores.com  | GC        | Golf Croquet        |
        | croquetscores.com  | a6w       | American 6 Wicket   |
        | croquetscores.com  | rc        | Ricochet            |
        | gateballscores.com | GB        | Gateball            |

    Scenario Outline: The old site's sport in another case is the same sport
      Given a tournament "tournaments/12" on "<website>"
      And the tournament is in the sport "<old sport>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "<website>" is played in "<sport>"

      Examples:
        | website            | old sport | sport               |
        | croquetscores.com  | ac        | Association Croquet |
        | croquetscores.com  | gc        | Golf Croquet        |
        | croquetscores.com  | A6W       | American 6 Wicket   |
        | croquetscores.com  | RC        | Ricochet            |
        | gateballscores.com | gb        | Gateball            |

    Scenario Outline: The old site's tournament type is the site's format
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "<type>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the format "<format>"

      Examples:
        | type             | format                     |
        | standard         | Standard                   |
        | teams            | Teams                      |
        | eirecup          | Eire Cup                   |
        | interstateshield | Interstate Shield          |
        | gcwtc            | GC World Team Championship |

    Scenario: The old site's tournament type in another case is the same format
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "EireCup"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the format "Eire Cup"

    Scenario: A sport the old site never offered is refused
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is in the sport "XX"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.UnknownSport"

    Scenario: A tournament type the old site never offered is refused
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "league"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.UnknownType"

  Rule: A tournament is found where the old site had it

    The old sites found a tournament at the year it started, its sport and its
    slug, as the site does, and the links to them are all over the web. So a
    tournament keeps the slug it had rather than being given one of its name,
    which the old site had often changed since (`bringOver.feature`).

    Scenario: A tournament is found at the old site's slug
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament started on "2014-03-01T00:00:00.0000000"
      And the tournament is in the sport "AC"
      And the tournament was called "Canterbury Open"
      And the tournament's slug is "canterbury-championships"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is found at "2014/ac/canterbury-championships"

    Scenario: A tournament is found at a slug the old site numbered
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament started on "2014-03-01T00:00:00.0000000"
      And the tournament is in the sport "AC"
      And the tournament's slug is "canterbury-open-1"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is found at "2014/ac/canterbury-open-1"

  Rule: A tournament is in the country its time zone says, and in no region

    The old sites kept no country, which the site asks of every tournament.
    The time zone each tournament was kept in is the nearest thing to one.
    The old sites ran on Windows, so every time zone they kept is one of
    Windows', and the import holds a list of every one of them and the
    country each means: the country of the zone the Unicode Consortium's
    list of them (CLDR) gives it for the world as a whole, so that a zone no
    tournament has used yet is known when one does. A time zone does not say
    which of a country's regions a tournament was in, so it is in none, which
    the site allows (`create.feature`), and a manager can choose one
    afterwards.

    Some time zones mean no country: an hour from UTC, as "UTC-11", which
    the sea keeps, and "South Sudan Standard Time", whose country the site
    does not have. A tournament kept in one, with no time zone, or with one
    not on the list, is refused rather than guessed at.

    "GMT Standard Time" and "W. Europe Standard Time" are each kept by several
    countries, and are taken as England's, where the old sites' tournaments kept
    in them were played; a manager can move one played elsewhere.

    Three that mean no country are taken as one all the same, since the old
    sites' tournaments were kept in them: "UTC" and "Dateline Standard Time"
    as England's, and "UTC+13" as New Zealand's. A manager can move one played
    elsewhere.

    A tournament kept in "Pacific Standard Time (Mexico)" is read as kept in
    "Pacific Standard Time", whose tournaments were played in the United
    States: the old sites offered the time zones of the machine they ran on,
    and some managers on the Pacific coast chose Mexico's, which keeps the same
    hours.

    Scenario: A tournament is in the country of its time zone
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "New Zealand Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "nz"

    Scenario Outline: A tournament is in the country its time zone means
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "<time zone>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "<country>"

      Examples:
        | time zone                    | country |
        | GMT Standard Time            | england |
        | W. Europe Standard Time      | england |
        | Morocco Standard Time        | ma      |
        | Romance Standard Time        | fr      |
        | Arabian Standard Time        | ae      |
        | Argentina Standard Time      | ar      |
        | Canada Central Standard Time | ca      |
        | UTC                          | england |
        | Dateline Standard Time       | england |
        | UTC+13                       | nz      |

    Scenario: A tournament kept in Mexico's Pacific time is in the country of Pacific time
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Pacific Standard Time (Mexico)"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "us"

    Scenario: A tournament is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament with no time zone is refused
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament has no time zone
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.NoTimeZone"

    Scenario: A time zone the import does not know is refused
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Nowhere Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.UnknownTimeZone"

    Scenario Outline: A time zone that means no country the site has is refused
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "<time zone>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.UnknownTimeZone"

      Examples:
        | time zone                 |
        | UTC-11                    |
        | South Sudan Standard Time |

  Rule: A tournament's subtitle is read as the old site showed it

    What the old sites called a tournament's notes is its subtitle here. They
    wrote "<" and ">" in notes as "&lt;" and "&gt;", and showed them as the
    characters. They are brought over as the characters, so that a manager
    editing the subtitle sees what they wrote. The subtitle is then whatever
    the site makes of it, which takes out anything that is HTML.

    A tournament with no notes was kept in either of two ways: with notes of
    nothing, or with no notes in its document at all. Either has no subtitle
    here.

    Scenario: The notes are kept as the subtitle
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's notes were "Play starts at 9am."
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the subtitle "Play starts at 9am."

    Scenario: Angle brackets written as the old site wrote them are read as angle brackets
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's notes were "Handicaps &lt; 2 play first."
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the subtitle "Handicaps < 2 play first."

    Scenario: A tournament with no notes has no subtitle
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament had no notes
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no subtitle

    Scenario: A tournament whose document holds no notes has no subtitle
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's document held no notes
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no subtitle

  Rule: A tournament allows no drawn games, and counts towards the world rankings where its sport does

    The old sites refused a drawn game, so none of their tournaments allowed
    one. Nor did they say whether a tournament was played under handicap, or
    was a national or an international event, and nothing is claimed for one
    that the old site never said.

    They did send a tournament's results to the world rankings, and what they
    sent was what the site now counts: a tournament of Association Croquet,
    Golf Croquet or American 6 Wicket (`Sport.feature`). So one of those is
    brought over counting towards them, and one of any other sport is not. It
    is ticked only where it can be: one that allows drawn games cannot count
    (`Tournament.DrawsInWorldRankings`), so a tournament in which the import
    found a tie marked in text is not (`ImportWholeTournaments.feature`).

    Scenario: A tournament does not allow drawn games
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" does not allow drawn games

    Scenario: A tournament is not played under handicap
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is not played under handicap

    Scenario Outline: A tournament of a ranked sport counts towards the world rankings
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is in the sport "<old sport>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" counts towards the world rankings

      Examples:
        | old sport |
        | AC        |
        | ac        |
        | GC        |
        | gc        |
        | A6W       |
        | a6w       |

    Scenario: A tournament of Ricochet does not count towards the world rankings
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is in the sport "rc"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" does not count towards the world rankings

    Scenario: A tournament of Gateball does not count towards the world rankings
      Given a tournament "tournaments/12" on "gateballscores.com"
      And the tournament is in the sport "GB"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "gateballscores.com" does not count towards the world rankings

    Scenario: A tournament is not a national event
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is not a national event

    Scenario: A tournament is not an international event
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is not an international event

  Rule: A tournament played by teams draws a level test where the old site said to

    The old sites let a tournament say that a test level on matches was drawn
    rather than decided by net games and hoops, and the site says the same
    (`create.feature`). It meant something only to a tournament played by
    teams, and the site refuses it of any other, so it is brought over for a
    tournament played by teams and left behind for a Standard one. Said or not,
    the old sites always drew a level test in the GC World Team Championship,
    and so does the site.

    Scenario: A tournament played by teams that drew level tests draws them
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament drew level tests
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" draws a level test

    Scenario: A tournament played by teams that did not draw level tests decides them on net games and hoops
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "teams"
      And the tournament did not draw level tests
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" decides a level test on net games and hoops

    Scenario: A GC World Team Championship that did not say draws level tests
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "gcwtc"
      And the tournament did not draw level tests
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" draws a level test

    Scenario: A Standard tournament that said it drew level tests is brought over
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "standard"
      And the tournament drew level tests
      And the tournament was created by "users/1"
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is kept as a tournament

    Scenario: A Standard tournament that said it drew level tests does not
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is of the type "standard"
      And the tournament drew level tests
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" decides a level test on net games and hoops

  Rule: A name all in capitals or all in small letters is written in title case

    The site refuses a tournament name written all in capitals or all in
    small letters, and the old sites accepted both. Rather than leave the
    tournament behind, each word is given a capital first letter and small
    letters after it. A name with both capitals and small letters is left as
    it was, since its case is somebody's choice.

    Scenario: A name all in capitals is written in title case
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "CANTERBURY OPEN"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "Canterbury Open"

    Scenario: A name all in small letters is written in title case
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "canterbury open"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "Canterbury Open"

    Scenario: A name with capitals and small letters is left as it was
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "NSW Open"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "NSW Open"

  Rule: A name shorter than 3 characters says the import corrected it

    The site refuses a name shorter than 3 characters, and the old sites
    accepted some. Rather than leave the tournament behind, " - Import
    correction" is added to it, which makes it long enough and tells a manager
    that the import changed it, so that they can name it better. A person's
    name is lengthened with " - Imported" (`ImportUsers.feature`). A
    competition's name is never too short: the site takes a name of one
    character, as a block called "A".

    Scenario: A name shorter than 3 characters says the import corrected it
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Ok"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "Ok - Import correction"

    Scenario: A name shorter than 3 characters in capitals is written in title case first
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "OK"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "Ok - Import correction"

    Scenario: A name of 3 characters is left as it was
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Cup"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is called "Cup"

  Rule: A tournament is run by the accounts its managers and scorers became

    The old sites made whoever created a tournament its manager and its
    scorer, and made every manager a scorer too. The site keeps the two
    apart: a manager does everything a scorer does, so a manager is not made
    a scorer as well.

    A user is found by their document's key in any case, as every document is
    here: the old sites wrote a key in more than one case, "users/12" in one
    place and "Users/12" in another.

    Scenario: The user who created the tournament manages it
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is managed by "manager@example.com"

    Scenario: Each manager manages the tournament
      Given a user "users/2" on "croquetscores.com" is imported as "second@example.com"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      And the tournament is managed by "users/2"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is managed by "second@example.com"

    Scenario: Each scorer scores the tournament
      Given a user "users/3" on "croquetscores.com" is imported as "scorer@example.com"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      And the tournament is scored by "users/3"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is scored by "scorer@example.com"

    Scenario: A user named in another case is the user
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "Users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is managed by "manager@example.com"

    Scenario: A manager is not made a scorer as well
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      And the tournament is scored by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is not scored by "manager@example.com"

  Rule: A user who became no account is a forgotten account

    A user who never confirmed their email address became no account
    (`ImportUsers.feature`), and a user the old sites lost had no document to
    become one from. Where such a user created, managed or scored a
    tournament, they are brought over as a forgotten account
    (`forget.feature`): one that holds nothing about them and that nobody can
    sign in to, so that the tournament is still created, managed and scored by
    somebody, without giving anybody an account they never asked for. A user
    is one forgotten account however many tournaments they ran, as a user is
    one account.

    Scenario: A tournament created by a user who never confirmed is created by a forgotten account
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/4"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" was created by a forgotten account

    Scenario: A tournament created by a user the old site lost is created by a forgotten account
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/404"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" was created by a forgotten account

    Scenario: A manager who never confirmed is a forgotten account managing the tournament
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      And the tournament is managed by "users/4"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 2 managers

    Scenario: A scorer who never confirmed is a forgotten account scoring the tournament
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/1"
      And the tournament is scored by "users/4"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 1 scorer

    Scenario: A forgotten account is reached at no address
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And the user's email address is "unconfirmed@example.com"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/4"
      When the tournament is imported
      Then no account is reached at "unconfirmed@example.com"

    Scenario: A user who ran two tournaments is one forgotten account
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/4"
      And the tournament is imported
      And a tournament "tournaments/13" on "croquetscores.com"
      And the tournament was created by "users/4"
      When the tournament is imported
      Then "tournaments/12" and "tournaments/13" on "croquetscores.com" were created by the same account

    Scenario: A user who ran two tournaments, named in two cases, is one forgotten account
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/4"
      And the tournament is imported
      And a tournament "tournaments/13" on "croquetscores.com"
      And the tournament was created by "Users/4"
      When the tournament is imported
      Then "tournaments/12" and "tournaments/13" on "croquetscores.com" were created by the same account

    Scenario: A user is kept as the forgotten account they became
      Given a user "users/4" on "croquetscores.com" who never confirmed their email address
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was created by "users/4"
      When the tournament is imported
      Then "users/4" on "croquetscores.com" is kept as a forgotten account

    Scenario: A user on the other site is a forgotten account here
      Given a tournament "tournaments/12" on "gateballscores.com"
      And the tournament is in the sport "GB"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "gateballscores.com" was created by a forgotten account

  Rule: A tournament the site would refuse is refused, naming why

    What the import does with a refusal is `runImporter.feature`'s. Here it is
    only that the tournament is refused, and nothing of it is kept.

    Scenario: A tournament in a sport its site does not offer is refused
      Given a tournament "tournaments/12" on "gateballscores.com"
      And the tournament is in the sport "AC"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "Tournament.SportNotOffered"

    Scenario: A tournament that finishes before it starts is refused
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament started on "2014-03-03T00:00:00.0000000"
      And the tournament finished on "2014-03-01T00:00:00.0000000"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "Tournament.FinishesBeforeStarts"

    Scenario: A tournament refused is not kept as any tournament
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament started on "2014-03-03T00:00:00.0000000"
      And the tournament finished on "2014-03-01T00:00:00.0000000"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then "tournaments/12" on "croquetscores.com" is not kept as any tournament
