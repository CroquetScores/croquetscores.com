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

  Rule: A tournament is in the country its time zone says, and in no region but Western Australia's

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

    "China Standard Time" is the one time zone the import does not take at its
    word: a tournament kept in it is in Australia, in the region Western
    Australia. It is the only time zone that is given a region, since it is
    not a country's time zone that says which region of it a tournament was in.
    A manager can move one played elsewhere.

    "GMT Standard Time", "W. Europe Standard Time" and "Romance Standard Time"
    are each kept by several countries. The first is taken as England's, where
    the old sites' tournaments kept in it were played, and the other two as
    Spain's; a manager can move one played elsewhere.

    Three that mean no country are taken as one all the same, since the old
    sites' tournaments were kept in them: "UTC" and "Dateline Standard Time"
    as England's, and "UTC+13" as New Zealand's. A manager can move one played
    elsewhere.

    Every time zone of Russia, "Russian Standard Time" and each "Russia Time
    Zone", is taken as New Zealand's all the same, since the old sites'
    tournaments kept in them were played there. A manager can move one played
    elsewhere.

    A tournament kept in "Pacific Standard Time (Mexico)" is read as kept in
    "Pacific Standard Time", whose tournaments were played in the United
    States: the old sites offered the time zones of the machine they ran on,
    and some managers on the Pacific coast chose Mexico's, which keeps the same
    hours.

    A tournament called "Oktober GC" is in Norway whatever time zone it was
    kept in, since it was played there and the time zone it was kept in does
    not say so. A manager can move it.

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
        | W. Europe Standard Time      | es      |
        | Romance Standard Time        | es      |
        | Arabian Standard Time        | ae      |
        | Argentina Standard Time      | ar      |
        | Canada Central Standard Time | ca      |
        | UTC                          | england |
        | Dateline Standard Time       | england |
        | UTC+13                       | nz      |
        | Russian Standard Time        | nz      |
        | Russia Time Zone 3           | nz      |
        | Russia Time Zone 10          | nz      |
        | Russia Time Zone 11          | nz      |

    Scenario: A tournament kept in Mexico's Pacific time is in the country of Pacific time
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Pacific Standard Time (Mexico)"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "us"

    Scenario: A tournament kept in China's time zone is in Australia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario: A tournament kept in China's time zone is in Western Australia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the region "wa"

    Scenario: A tournament called "Oktober GC" is in Norway
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Oktober GC"
      And the tournament's time zone is "W. Europe Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "no"

    Scenario: A tournament called "Oktober GC" is in Norway whatever its time zone was
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Oktober GC"
      And the tournament has no time zone
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "no"

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

  Rule: A tournament the world rankings list is in the country they give

    The time zone says little of where a tournament was played, and the world
    rankings know: they keep a list of the Association Croquet and Golf Croquet
    events they have ranked, each with its country (`WorldRankingEvents.feature`).
    A tournament of either sport that is found in its sport's list, by its days
    and its name, is in the country the list gives, over its time zone's. One
    that is not found is in its time zone's country, and one in any other sport
    is not looked for.

    The list is only a better word for the country, and does not stand in for a
    time zone: a tournament that is refused for its time zone is refused all the
    same. A region is a country's, so a tournament moved to another country by
    the list is in none, and one kept in its own is in the region it was.

    Scenario: A tournament of the list is in its country, over its time zone's
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "NZ Wellington Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "nz"

    Scenario: A Golf Croquet tournament of the list is in its country
      Given a Golf Croquet event "Wellington Open" starting on "2012-01-26" in "NZL"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is in the sport "GC"
      And the tournament was called "Wellington Open"
      And the tournament started on "2012-01-26T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "nz"

    Scenario: A tournament not in the list is in its time zone's country
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Sydney Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario: A tournament of another sport is not looked for
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "gateballscores.com"
      And the tournament is in the sport "GB"
      And the tournament was called "Wellington Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "gateballscores.com" is in the country "au"

    Scenario: A tournament of the list that the time zone refuses is refused all the same
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Wellington Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament has no time zone
      And the tournament was created by "users/1"
      When the tournament is imported
      Then importing the tournament is refused with "ImportTournaments.NoTimeZone"

    Scenario: A tournament kept in China's time zone is in no region once the list moves it
      Given an Association Croquet event "Perth Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Perth Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament the list keeps in its country keeps its region
      Given an Association Croquet event "Perth Open" played on "27-30.12.11" in "Australia"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Perth Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the region "wa"

  Rule: A tournament is moved out of a country it was never played in, or into the one its name says

    The old sites had tournaments played in the United States that their time
    zones, and in places the world rankings' lists, put in Chile, and ones
    played in Egypt that they put in Iraq, Israel, Jordan or Namibia, ones
    played in Latvia that they put in Morocco or Ukraine, and ones played in
    Australia that they put in Singapore, Taiwan or Thailand. None was played
    where it was put, so wherever the country comes from, the time zone or a
    list, Chile is taken as the USA, Iraq, Israel, Jordan and Namibia as
    Egypt, Morocco and Ukraine as Latvia, and Singapore, Taiwan and Thailand
    as Australia.

    Some names say where a tournament was played better than any of that, and
    are taken over the time zone and the lists. Each is matched in any case
    unless it says otherwise, and the first of these to match is the one taken:

    - a name that begins with Latvia is in Latvia;
    - a name with Spanish anywhere in it is in Spain;
    - a name with the name of a Spanish club as a word of its own, written in
      capitals, as "RCP", is in Spain: RSHECC, CCVM, VGCC, RCGVH, RCLM and RCP.
      A word is whole when no letter or digit is beside it, and capitals are
      meant, since "rcp" and "Rcp" are common words and names;
    - a name with Western Cape in it is in South Africa;
    - a name with South African in it is in South Africa;
    - a name with Open Door or Stage Door in it is in South Africa;
    - a name with Egypt in it, which Egyptian has, is in Egypt;
    - a name with Norfolk Island in it is in Norfolk Island;
    - a name with Gauteng Provincial or Western Province Croquet Association in
      it is in South Africa;
    - a name with Allasch Kummel in it is in Latvia;
    - a name with Zouzou Abdelhalim Cup or Borg Cup in it is in Egypt;
    - a name with Greece as a word of its own is in Greece;
    - a tournament called exactly "WGCA Women's Intl Friendship Cup", with the
      apostrophe straight or curled, is in the USA. A name with more in it is
      not that tournament;
    - a name with the name of any other country as a word of its own, as
      "Open of Chile" or "Samoa Cup", is in that country. A country's whole name
      is meant, and where one name has another in it, as Papua New Guinea has
      Guinea, the longer is the one taken.

    Others are for a tournament put in one country only, the country it was
    put in being what makes them mean something, and are tried next:

    - one put in Namibia with SACA, South African or South Africa in its name
      is in South Africa, and the rest put in Namibia are in Egypt;
    - one put in Nigeria with Rondebosch in its name is in South Africa;
    - one put in Romania with WCCA in its name is in South Africa, as is one put
      there with Western Cape in its name, which any name with it is;
    - one put in São Tomé and Príncipe with Surbiton as a word of its own in
      its name is in England;
    - one put in Romania with SWF as a word of its own in its name, in capitals,
      is in England, and one with Ramadan as a word of its own, capitalised as
      it is here, is in Egypt. A word is whole when no letter or digit is
      beside it, and the case is meant, since "swf" and "ramadan" are plain
      words and names. Where a name has more than one of these, the first
      listed here is the one taken;
    - one put in England with Balgreen, Scottish, Edinburgh or Auchincruive as
      a word of its own is in Scotland, as is one with SCA as a word of its
      own, in capitals, since "sca" begins other words and names. One put in
      England with Dublin, Carrickmines, Leinster or Herbert Park as a word of
      its own, or Mc Weeney with or without the space, is in Ireland. Scotland
      and Ireland have no time zone of their own, so the old sites put their
      tournaments in England; and only there are these looked for, since
      Dublin and Edinburgh are places elsewhere too. Where a name has both,
      the one in Scotland is taken;
    - one put in Morocco whose name begins with an ordinal, as "1st", "2nd",
      "3rd" or "10th", as a word of its own, is in Spain instead: those are the
      Spanish club tournaments, which are numbered. The rest put in Morocco
      are in Latvia.

    A region is a country's, so a tournament moved to another country is in
    none.

    Scenario: A tournament kept in Chile's time zone is in the USA
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Pacific SA Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "us"

    Scenario: A tournament kept in Chile's time zone is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Pacific SA Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament the list puts in Chile is in the USA
      Given an Association Croquet event "Santiago Open" played on "27-30.12.11" in "Chile"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Santiago Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "us"

    Scenario: A tournament kept in Iraq's time zone is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Arabic Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament kept in Israel's time zone is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Israel Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament kept in Jordan's time zone is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Jordan Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament the list puts in Jordan is in Egypt
      Given an Association Croquet event "Amman Open" played on "27-30.12.11" in "Jordan"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Amman Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament the list puts in Israel is in Egypt
      Given an Association Croquet event "Tel Aviv Open" played on "27-30.12.11" in "Israel"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Tel Aviv Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament kept in Morocco's time zone is in Latvia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Morocco Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario: A tournament the list puts in Morocco is in Latvia
      Given an Association Croquet event "Rabat Open" played on "27-30.12.11" in "Morocco"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Rabat Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario: A tournament whose name begins with Latvia is in Latvia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Latvia Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario: A tournament whose name begins with Latvia in other case is in Latvia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "LATVIA open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario: A tournament whose name begins with Latvia is in Latvia whatever the list says
      Given an Association Croquet event "Latvia Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Latvia Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario: A tournament whose name begins with Latvia is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Latvia Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament whose name only has Latvia in it is in Latvia as any country's name is
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Open of Latvia"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario: A tournament whose name has Spanish in it is in Spain
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Spanish Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

    Scenario: A tournament whose name has Spanish in the middle of it is in Spain
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "The Big Spanish Championship"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

    Scenario: A tournament whose name has Spanish in it in other case is in Spain
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "open spanish gc"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

    Scenario: A tournament whose name has Spanish in it is in Spain whatever the list says
      Given an Association Croquet event "Spanish Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Spanish Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

    Scenario: A tournament whose name has Spanish in it is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Spanish Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament whose name says Latvia first and Spanish after is in Latvia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Latvia Spanish Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

    Scenario Outline: A tournament whose name has the name of a Spanish club in it is in Spain
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

      Examples:
        | name                 |
        | RSHECC Open          |
        | Open CCVM            |
        | The VGCC Cup         |
        | RCGVH Trophy         |
        | RCLM Championship    |
        | RCP Open             |
        | Open (RCP)           |
        | Open-RCP-Cup         |
        | RCP                  |

    Scenario Outline: A tournament whose name does not have the name of a Spanish club as a whole word in capitals is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name           |
        | rcp Open       |
        | Rcp Open       |
        | RCPX Open      |
        | XRCP Open      |
        | RCP2 Open      |
        | Open RCPS      |
        | ccvm Cup       |

    Scenario: A tournament whose name has the name of a Spanish club in it is in Spain whatever the list says
      Given an Association Croquet event "RCP Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "RCP Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

    Scenario: A tournament whose name has the name of a Spanish club in it is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "RCP Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament kept in Namibia's time zone is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Namibia Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament the list puts in Namibia is in Egypt
      Given an Association Croquet event "Windhoek Open" played on "27-30.12.11" in "Namibia"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Windhoek Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario Outline: A tournament put in Morocco whose name begins with an ordinal is in Spain
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "Morocco Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

      Examples:
        | name              |
        | 1st Open          |
        | 2nd Open          |
        | 3rd Open          |
        | 10th Open         |
        | 21st Open         |
        | 112th Open        |
        | 4TH Open          |
        |  7th Open         |

    Scenario: A tournament the list puts in Morocco whose name begins with an ordinal is in Spain
      Given an Association Croquet event "1st Rabat Open" played on "27-30.12.11" in "Morocco"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "1st Rabat Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "es"

    Scenario: A tournament put in Morocco whose name begins with an ordinal is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "1st Open"
      And the tournament's time zone is "Morocco Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament put in Morocco whose name does not begin with an ordinal is in Latvia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "Morocco Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

      Examples:
        | name           |
        | Open 1st       |
        | The 1st Open   |
        | 1 Open         |
        | 1sts Open      |
        | 1stX Open      |
        | First Open     |

    Scenario: A tournament put in another country whose name begins with an ordinal is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "1st Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario Outline: A tournament whose name has Western Cape in it is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

      Examples:
        | name                        |
        | Western Cape Open           |
        | Open of the Western Cape    |
        | western cape GC             |
        | WESTERN CAPE Championship  |

    Scenario Outline: A tournament whose name has Open Door or Stage Door in it is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

      Examples:
        | name                       |
        | Open Door                  |
        | Western Province Open Door |
        | Stage Door Cup             |
        | the stage door GC          |
        | OPEN DOOR 2012             |

    Scenario: A tournament whose name has Western Cape or a door in it is in South Africa whatever the list says
      Given an Association Croquet event "Western Cape Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Western Cape Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament whose name has Western Cape in it is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Western Cape Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament whose name has Open Window in it is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Open Window"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario Outline: A tournament put in Namibia with SACA, South African or South Africa in its name is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "Namibia Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

      Examples:
        | name                  |
        | SACA Open             |
        | Windhoek SACA         |
        | South African Open    |
        | the south african GC  |
        | South Africa Open     |
        | Open of South Africa  |
        | the south africa GC   |

    Scenario: A tournament the list puts in Namibia with SACA in its name is in South Africa
      Given an Association Croquet event "SACA Open" played on "27-30.12.11" in "Namibia"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "SACA Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament put in Namibia with SACA in its name is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "SACA Open"
      And the tournament's time zone is "Namibia Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament put in Namibia with neither in its name is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Windhoek Open"
      And the tournament's time zone is "Namibia Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament put in another country with SACA in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "SACA Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario: A tournament put in Nigeria with Rondebosch in its name is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Rondebosch Open"
      And the tournament's time zone is "W. Central Africa Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament put in Nigeria with Rondebosch in its name in other case is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "The RONDEBOSCH Cup"
      And the tournament's time zone is "W. Central Africa Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament the list puts in Nigeria with Rondebosch in its name is in South Africa
      Given an Association Croquet event "Rondebosch Open" played on "27-30.12.11" in "Nigeria"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Rondebosch Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament put in Nigeria without Rondebosch in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Lagos Open"
      And the tournament's time zone is "W. Central Africa Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "ng"

    Scenario: A tournament put in another country with Rondebosch in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Rondebosch Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario Outline: A tournament whose name has Egypt or Egyptian in it is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

      Examples:
        | name                      |
        | Egypt Open                |
        | Egyptian Open             |
        | The Cairo Egypt Cup       |
        | EGYPT GC                  |
        | egyptian championship     |

    Scenario: A tournament whose name has Egypt in it is in Egypt whatever the list says
      Given an Association Croquet event "Egypt Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Egypt Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario: A tournament whose name has Egypt in it is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Egypt Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament kept in Singapore's time zone is in Australia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Singapore Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario: A tournament kept in Singapore's time zone is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Singapore Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament the list puts in Singapore is in Australia
      Given an Association Croquet event "Lion City Open" played on "27-30.12.11" in "Singapore"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Lion City Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "Pacific Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario Outline: A tournament put in Romania with WCCA or Western Cape in its name is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

      Examples:
        | name                  |
        | WCCA Open             |
        | Open WCCA             |
        | wcca GC               |
        | Western Cape Open     |

    Scenario: A tournament the list puts in Romania with WCCA in its name is in South Africa
      Given an Association Croquet event "WCCA Open" played on "27-30.12.11" in "Romania"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "WCCA Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament put in Romania with neither in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Bucharest Open"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "ro"

    Scenario: A tournament put in another country with WCCA in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "WCCA Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario Outline: A tournament kept in a time zone that means Taiwan, Thailand or Ukraine is moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "<time zone>"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "<country>"

      Examples:
        | time zone              | country |
        | Taipei Standard Time   | au      |
        | SE Asia Standard Time  | au      |
        | FLE Standard Time      | lv      |

    Scenario Outline: A tournament the list puts in Taiwan, Thailand or Ukraine is moved
      Given an Association Croquet event "Open" played on "27-30.12.11" in "<listed>"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "Pacific Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "<country>"

      Examples:
        | listed   | country |
        | Taiwan   | au      |
        | Thailand | au      |
        | Ukraine  | lv      |

    Scenario: A tournament kept in Ukraine's time zone is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "FLE Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament called WGCA Women's Intl Friendship Cup is in the USA
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "us"

      Examples:
        | name                                 |
        | WGCA Women's Intl Friendship Cup     |
        | WGCA Women’s Intl Friendship Cup     |
        | WGCA WOMEN'S INTL FRIENDSHIP CUP     |

    Scenario Outline: A tournament called something more than WGCA Women's Intl Friendship Cup is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name                                      |
        | WGCA Women's Intl Friendship Cup 2012     |
        | The WGCA Women's Intl Friendship Cup      |
        | WGCA Women's Intl Friendship              |

    Scenario: A tournament called WGCA Women's Intl Friendship Cup is in the USA whatever the list says
      Given an Association Croquet event "WGCA Women's Intl Friendship Cup" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "WGCA Women's Intl Friendship Cup"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "us"

    Scenario: A tournament called WGCA Women's Intl Friendship Cup is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "WGCA Women's Intl Friendship Cup"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament whose name has South African in it is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

      Examples:
        | name                      |
        | South African Open        |
        | The South African Cup     |
        | SOUTH AFRICAN GC          |
        | south african champs      |

    Scenario: A tournament whose name has South African in it is in South Africa whatever the list says
      Given an Association Croquet event "South African Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "South African Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

    Scenario: A tournament whose name has South African in it is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "South African Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament put in Romania with SWF as a word of its own in its name is in England
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "england"

      Examples:
        | name           |
        | SWF Open       |
        | Open SWF       |
        | The SWF Cup    |
        | Open (SWF)     |
        | Open-SWF-Cup   |

    Scenario Outline: A tournament put in Romania without SWF as a word of its own in capitals is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "ro"

      Examples:
        | name          |
        | swf Open      |
        | Swf Open      |
        | SWFX Open     |
        | XSWF Open     |
        | SWF2 Open     |

    Scenario Outline: A tournament put in Romania with Ramadan as a word of its own in its name is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

      Examples:
        | name              |
        | Ramadan Open      |
        | Open Ramadan      |
        | The Ramadan Cup   |
        | Open (Ramadan)    |

    Scenario Outline: A tournament put in Romania without Ramadan as a word of its own in its case is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "ro"

      Examples:
        | name              |
        | ramadan Open      |
        | RAMADAN Open      |
        | Ramadans Open     |
        | XRamadan Open     |

    Scenario Outline: A tournament the list puts in Romania is moved by SWF and Ramadan in its name
      Given an Association Croquet event "<name>" played on "27-30.12.11" in "Romania"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "<country>"

      Examples:
        | name          | country |
        | SWF Open      | england |
        | Ramadan Open  | eg      |

    Scenario: A tournament put in Romania with SWF and Ramadan in its name is in England
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Ramadan SWF Open"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "england"

    Scenario Outline: A tournament put in another country with SWF or Ramadan in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name          |
        | SWF Open      |
        | Ramadan Open  |

    Scenario: A tournament put in Romania with SWF in its name is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "SWF Open"
      And the tournament's time zone is "GTB Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament whose name has Greece as a word of its own is in Greece
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "gr"

      Examples:
        | name              |
        | Greece Open       |
        | Open Greece       |
        | The Greece Cup    |
        | Open (Greece)     |
        | greece GC         |
        | GREECE GC         |

    Scenario Outline: A tournament whose name has Greece in it but not as a word of its own is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name            |
        | Greeces Open    |
        | NewGreece Open  |
        | Greece2 Open    |

    Scenario: A tournament whose name has Greece as a word of its own is in Greece whatever the list says
      Given an Association Croquet event "Greece Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Greece Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "gr"

    Scenario: A tournament whose name has Greece as a word of its own is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Greece Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament put in São Tomé and Príncipe with Surbiton as a word of its own in its name is in England
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "Sao Tome Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "england"

      Examples:
        | name              |
        | Surbiton Open     |
        | Open Surbiton     |
        | The Surbiton Cup  |
        | Open (Surbiton)   |
        | surbiton GC       |

    Scenario Outline: A tournament put in São Tomé and Príncipe without Surbiton as a word of its own is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "Sao Tome Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "st"

      Examples:
        | name              |
        | Surbitons Open    |
        | XSurbiton Open    |
        | Sao Tome Open     |

    Scenario: A tournament the list puts in São Tomé and Príncipe with Surbiton in its name is in England
      Given an Association Croquet event "Surbiton Open" played on "27-30.12.11" in "São Tomé and Príncipe"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Surbiton Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "england"

    Scenario: A tournament put in another country with Surbiton in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Surbiton Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

    Scenario: A tournament put in São Tomé and Príncipe with Surbiton in its name is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Surbiton Open"
      And the tournament's time zone is "Sao Tome Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario Outline: A tournament whose name has Norfolk Island in it is in Norfolk Island
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "nf"

      Examples:
        | name |
        | Norfolk Island Open |
        | The Norfolk Island Cup |
        | norfolk island GC |
        | NORFOLK ISLAND OPEN |

    Scenario Outline: A tournament whose name has Gauteng Provincial or Western Province Croquet Association in it is in South Africa
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "za"

      Examples:
        | name |
        | Gauteng Provincial Championship |
        | The gauteng provincial GC |
        | Gauteng Provinicial Championship |
        | Western Province Croquet Association Open |
        | western province croquet association GC |

    Scenario Outline: A tournament whose name has Allasch Kummel in it is in Latvia
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "lv"

      Examples:
        | name |
        | Allasch Kummel Cup |
        | The Allasch Kummel |
        | allasch kummel GC |

    Scenario Outline: A tournament whose name has Zouzou Abdelhalim Cup or Borg Cup in it is in Egypt
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

      Examples:
        | name |
        | Zouzou Abdelhalim Cup |
        | The Borg Cup |
        | borg cup GC |
        | ZOUZOU ABDELHALIM CUP 2012 |

    Scenario Outline: A tournament whose name has only part of one of them is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name                          |
        | Norfolk Open                  |
        | Gauteng Open                  |
        | Western Province Open         |
        | Allasch Open                  |
        | Kummel Cup                    |
        | Zouzou Open                   |
        | Borg Open                     |

    Scenario Outline: A tournament whose name has one of them in it is moved whatever the list says
      Given an Association Croquet event "<name>" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "<country>"

      Examples:
        | name                                      | country |
        | Norfolk Island Open                       | nf      |
        | Gauteng Provincial Open                   | za      |
        | Western Province Croquet Association Open | za      |
        | Allasch Kummel Cup                        | lv      |
        | Zouzou Abdelhalim Cup                     | eg      |
        | Borg Cup                                  | eg      |

    Scenario: A tournament whose name has Norfolk Island in it is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Norfolk Island Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A tournament kept in another country's time zone is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "Argentina Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "ar"

    Scenario Outline: A tournament whose name has the name of a country as a word of its own is in that country
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "<country>"

      Examples:
        | name                  | country |
        | Ireland Open          | ie      |
        | Open of Chile         | cl      |
        | The japan Cup         | jp      |
        | SAMOA GC              | ws      |
        | Open (Fiji)           | fj      |
        | Singapore Open        | sg      |
        | Papua New Guinea Open | pg      |
        | Guinea-Bissau Open    | gw      |
        | American Samoa Open   | as      |
        | Côte d'Ivoire Open    | ci      |

    Scenario Outline: A tournament whose name has a country in it but not as a word of its own is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name           |
        | Irelands Open  |
        | NewFiji Open   |
        | Japan2 Open    |
        | Japanese Open  |

    Scenario: A tournament whose name has the name of a country is in that country whatever the list says
      Given an Association Croquet event "Japan Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Japan Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "jp"

    Scenario: A tournament whose name has the name of a country is in no region
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Japan Open"
      And the tournament's time zone is "China Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in no region

    Scenario: A name that says two countries is in the one a rule listed earlier says
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Japan Egypt Open"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "eg"

    Scenario Outline: A tournament whose name has a Scottish place or body as a word of its own is in Scotland
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GMT Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "scotland"

      Examples:
        | name |
        | Balgreen Spring One-Ball |
        | European GC Club League Balgreen Heat |
        | Scottish CA - Spring Weekend |
        | Malmet Trophy, Scottish Croquet Association |
        | Appleton Match - SCA v CAI |
        | SCA Short Croquet |
        | Meadows (Edinburgh) Women's GC Handicap Singles |
        | Edinburgh Tournament GC |
        | Auchincruive D Grade Level Play |
        | balgreen open |
        | EDINBURGH OPEN |

    Scenario Outline: A tournament whose name has an Irish place or name as a word of its own is in Ireland
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GMT Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "ie"

      Examples:
        | name |
        | The Championships of County Dublin |
        | The Dublin Golf Croquet Invitational |
        | European GC Clubs League Grand Final - Carrickmines |
        | South Leinster Open Championship |
        | GC European League Heat Herbert Park |
        | Mc Weeney CAI v CqE |
        | McWeeney Cup |
        | carrickmines open |

    Scenario Outline: A tournament whose name has one of them in it but not as a word of its own is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "GMT Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "england"

      Examples:
        | name |
        | Balgreens Open |
        | Scottishness Open |
        | Sca Open |
        | Scarborough Open |
        | Dublins Open |
        | Leinsters Open |

    Scenario Outline: A tournament put in another country than England with one of these words in its name is not moved
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "<name>"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" is in the country "au"

      Examples:
        | name                |
        | Balgreen Open       |
        | Edinburgh Open      |
        | Dublin Open         |
        | SCA Open            |
        | Carrickmines Open   |

  Rule: The tournaments of each ranked sport are counted, and those that took the world rankings' country

    Whoever runs the import is told on screen, at the end, how many tournaments
    of Association Croquet and of Golf Croquet it brought over and how many of
    them took their country from the world rankings' lists, so that they can
    see whether the lists found what they were expected to. What is shown is
    for whoever is watching, and is not specified here; what is counted is.

    A tournament is counted once it is brought over, and one that is refused is
    not. Only the two sports the world rankings keep a list for are counted.

    Scenario: An Association Croquet tournament brought over is counted
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then 1 Association Croquet tournament is counted

    Scenario: A Golf Croquet tournament is counted apart from Association Croquet's
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is in the sport "GC"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then 1 Golf Croquet tournament is counted
      And no Association Croquet tournament is counted

    Scenario: A tournament of another sport is not counted
      Given a tournament "tournaments/12" on "gateballscores.com"
      And the tournament is in the sport "GB"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then no Association Croquet tournament is counted
      And no Golf Croquet tournament is counted

    Scenario: A tournament that is refused is not counted
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament has no time zone
      And the tournament was created by "users/1"
      When the tournament is imported
      Then no Association Croquet tournament is counted

    Scenario: A tournament the site refuses is not counted
      Given a tournament "tournaments/12" on "croquetscores.com"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament started on "2014-03-03T00:00:00.0000000"
      And the tournament finished on "2014-03-01T00:00:00.0000000"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then no Association Croquet tournament is counted

    Scenario: A tournament found in the list is counted as taking its country
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Wellington Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then 1 Association Croquet tournament took the world rankings' country

    Scenario: A Golf Croquet tournament found in the list is counted as taking its country
      Given a Golf Croquet event "Wellington Open" starting on "2012-01-26" in "NZL"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament is in the sport "GC"
      And the tournament was called "Wellington Open"
      And the tournament started on "2012-01-26T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then 1 Golf Croquet tournament took the world rankings' country

    Scenario: A tournament not found in the list is not counted as taking its country
      Given an Association Croquet event "Wellington Open" played on "27-30.12.11" in "New Zealand"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Sydney Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then no Association Croquet tournament took the world rankings' country

    Scenario: A tournament found in the list in the country its time zone gave is counted as taking it
      Given an Association Croquet event "Sydney Open" played on "27-30.12.11" in "Australia"
      And a tournament "tournaments/12" on "croquetscores.com"
      And the tournament was called "Sydney Open"
      And the tournament started on "2011-12-27T00:00:00.0000000"
      And the tournament finished on "2011-12-30T00:00:00.0000000"
      And the tournament's time zone is "AUS Eastern Standard Time"
      And the tournament was created by "users/1"
      When the tournament is imported
      Then 1 Association Croquet tournament took the world rankings' country

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

  Rule: A tournament is neither national nor international

    The old sites did not say whether a tournament was a national or an
    international event, and nothing is claimed for one that the old site never
    said. How its competitions are played and counted, with handicaps, with
    drawn results, and towards the world rankings, is each competition's, and
    is brought over with it (`ImportWholeTournaments.feature`).

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
