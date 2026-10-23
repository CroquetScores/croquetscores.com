Feature: The world rankings' lists of events, where a tournament's country is found

  The world rankings keep a list of every event they have ranked, for
  Association Croquet and for Golf Croquet, each with the country it was played
  in. The old sites' time zone says little of that: a tournament played in
  Wellington by a manager in Sydney was kept in Sydney's. So the import asks the
  list first, and takes the time zone's country only for a tournament the list
  does not know (`ImportTournaments.feature`).

  A tournament is found in the list of its sport by the days it was played and
  by its name. Neither alone is enough: events share days, and names share
  words. The list's names are shorter or longer than the tournament's, as "NZ
  Wellington Open" is of "Wellington Open", so a name is matched by its words
  and not by its letters.

  The two lists are written differently. The Association Croquet list gives
  the days an event started and finished as text, as "27-30.12.11", and its
  country as a number into a list of countries of its own. The Golf Croquet
  list gives only the day an event started, as the number of days since
  1 January 1900 that Excel counts, and its country as the three letters
  used for it in sport. Excel counts a 29 February 1900 that never was, and a
  list kept in it is not to be trusted to the day, so a Golf Croquet event is
  found on the day before or after the tournament's start as well as on it.

  Rule: An Association Croquet event is found by the days it started and finished

    Scenario Outline: Each way of writing the days is read
      Given an Association Croquet event "Wellington Open" played on "<written>" in "New Zealand"
      When the Association Croquet event is asked for, played from "<starts>" to "<finishes>" and called "Wellington Open"
      Then the country found is "nz"

      Examples:
        | written          | starts     | finishes   |
        | 3.1.12           | 2012-01-03 | 2012-01-03 |
        | 27-30.12.11      | 2011-12-27 | 2011-12-30 |
        | 3.1-5.2.12       | 2012-01-03 | 2012-02-05 |
        | 30.12.11-2.1.12  | 2011-12-30 | 2012-01-02 |

    Scenario: An event on other days is not found
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      When the Association Croquet event is asked for, played from "2011-12-27" to "2011-12-31" and called "Wellington Open"
      Then no country is found

    Scenario: A Golf Croquet event is not found among Association Croquet's
      Given a Golf Croquet event "Wellington Open" starting on "2011-12-27" in "NZL"
      When the Association Croquet event is asked for, played from "2011-12-27" to "2011-12-30" and called "Wellington Open"
      Then no country is found

  Rule: A Golf Croquet event is found by the day it started, give or take one

    Scenario Outline: The day before, the day and the day after are found
      Given a Golf Croquet event "Wellington Open" starting on "2012-01-26" in "NZL"
      When the Golf Croquet event is asked for, starting on "<starts>" and called "Wellington Open"
      Then the country found is "nz"

      Examples:
        | starts     |
        | 2012-01-25 |
        | 2012-01-26 |
        | 2012-01-27 |

    Scenario Outline: Two days from the start is not found
      Given a Golf Croquet event "Wellington Open" starting on "2012-01-26" in "NZL"
      When the Golf Croquet event is asked for, starting on "<starts>" and called "Wellington Open"
      Then no country is found

      Examples:
        | starts     |
        | 2012-01-24 |
        | 2012-01-28 |

    Scenario: The day is read from the number of days since 1900
      Given a Golf Croquet event "Australia Day" starting on the day numbered 40934 in "AUS"
      When the Golf Croquet event is asked for, starting on "2012-01-26" and called "Australia Day"
      Then the country found is "au"

    Scenario Outline: The country is the one its three letters mean
      Given a Golf Croquet event "Open" starting on "2012-01-26" in "<letters>"
      When the Golf Croquet event is asked for, starting on "2012-01-26" and called "Open"
      Then the country found is "<country>"

      Examples:
        | letters | country  |
        | AUS     | au       |
        | ENG     | england  |
        | WAL     | wales    |
        | SCO     | scotland |
        | ESP     | es       |

    Scenario: Three letters that mean no country the site has find none
      Given a Golf Croquet event "Open" starting on "2012-01-26" in "XXX"
      When the Golf Croquet event is asked for, starting on "2012-01-26" and called "Open"
      Then no country is found

  Rule: A name is matched by its words

    A name matches when at least 95% of the words of the shorter are words of
    the longer, whatever their case and punctuation. For names this long that is
    all of them. A name of one word matches only the same word alone, since
    "Open" is in the name of a great many events.

    Scenario Outline: Names that match
      Given an Association Croquet event "<listed>" played on "3.1.12" in "New Zealand"
      When the Association Croquet event is asked for, played from "2012-01-03" to "2012-01-03" and called "<asked>"
      Then the country found is "nz"

      Examples:
        | listed             | asked                 |
        | NZ Wellington Open | Wellington Open       |
        | Wellington Open    | NZ Wellington Open    |
        | WELLINGTON OPEN    | wellington open       |
        | Wellington Open    | Wellington, Open      |
        | Open               | Open                  |

    Scenario Outline: Names that do not match
      Given an Association Croquet event "<listed>" played on "3.1.12" in "New Zealand"
      When the Association Croquet event is asked for, played from "2012-01-03" to "2012-01-03" and called "<asked>"
      Then no country is found

      Examples:
        | listed          | asked              |
        | Wellington Open | Auckland Open      |
        | Wellington Open | Open               |
        | Open            | Wellington Open    |

    Scenario: Of two events on the same days the name chooses
      Given an Association Croquet event "Wellington Open" played on "3.1.12" in "New Zealand"
      And an Association Croquet event "Sydney Open" played on "3.1.12" in "Australia"
      When the Association Croquet event is asked for, played from "2012-01-03" to "2012-01-03" and called "Sydney Open"
      Then the country found is "au"

  Rule: A country the site does not have is found as none

    The Association Croquet list names countries in its own words, as "Czech
    Rep", "USA" and "Isle Of Man", which are read as the countries they mean. A
    country the site does not have, or a name that is no country, finds none,
    so that the time zone's is used.

    Scenario Outline: A country named in the list's words
      Given an Association Croquet event "Open Week" played on "3.1.12" in "<named>"
      When the Association Croquet event is asked for, played from "2012-01-03" to "2012-01-03" and called "Open Week"
      Then the country found is "<country>"

      Examples:
        | named        | country |
        | Czech Rep    | cz      |
        | USA          | us      |
        | Isle Of Man  | im      |
        | England      | england |

    Scenario: A name that is no country finds none
      Given an Association Croquet event "Open Week" played on "3.1.12" in "Atlantis"
      When the Association Croquet event is asked for, played from "2012-01-03" to "2012-01-03" and called "Open Week"
      Then no country is found

  Rule: The lists the import holds are read whole

    Scenario: The Association Croquet list is read
      When the lists the import holds are read
      Then there are 8960 Association Croquet events

    Scenario: The Golf Croquet list is read
      When the lists the import holds are read
      Then there are 11151 Golf Croquet events

    Scenario: The first Association Croquet event is the one the list begins with
      When the lists the import holds are read
      Then the first Association Croquet event is "NZ Wellington Open" in "nz"

    Scenario: The first Golf Croquet event is the one the list begins with
      When the lists the import holds are read
      Then the first Golf Croquet event is "VCA Australia Day" in "au"

    Scenario: A row that cannot be read is refused by the file and the line
      Given an Association Croquet list with the row "1,1,2012,Open,not a date,2,95,1,95,3,18,1910,0,A"
      When the list is read
      Then the list is refused with "WorldRankingEvents.UnreadableRow"
