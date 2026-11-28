Feature: Reading the players' lists from the world rankings' site

  The world rankings keep the players they know as two files on their own
  site, which is where the import reads them from
  (`ImportWorldRankingPlayers.feature`): association croquet's at
  rank.worldcroquet.org/cgs/data_dir/names.dat, and golf croquet's at
  rank.worldcroquet.org/gctest/data_source/players.txt. Each is a line to a
  player, with the player's details separated by commas. Here the details
  are counted from 1, the first detail on the line being the first.

  The two files are not laid out alike. An association croquet line has 25
  details, padded with spaces to line up; a golf croquet line has 17. Only
  each player's full name and number are read from either, since those are
  what the site wants of them: an association croquet player's full name is the
  seventh detail, their
  first name, then a space, then the second, their surname; and a golf croquet
  player's is the fourth detail, the name they are known by, then a space,
  then the second, their surname. The spaces padding a detail are not part of
  it.

  A player is read with their world ranking number as well, which is the first
  detail on their line in either list, a whole number with the spaces padding
  it left out. A line whose first detail is not a whole number is refused
  like any other that cannot be read.

  A player is read with their country as well, which is where the player is
  from and not where they play. An association croquet line says it in its
  fifth detail, by the name that sport's list gives it, and a golf croquet
  line in its sixth, in the three letters that sport uses. The site knows a
  country by its own code, so each is translated: England and ENG are
  `england`, and New Zealand and NZL are `nz`. A country the site has no code for is read as the
  rankings write it, rather than refuse a whole list for one country the site
  has yet to learn. The golf croquet list has players of one name in different
  countries, so a golf croquet player is told apart by their name and their
  country together, and a golf croquet line with no country is refused. An
  association croquet player is told apart by name alone and the country is
  only told of them, so a line with none is read with none, as it is better to
  tell a player with no country than to refuse the whole list for one line.

  An association croquet list may not give one full name to two players,
  whatever their numbers: the site finds a player by their name, and a name
  that is two players cannot be told apart. A golf croquet list may not give
  one full name and country to two players, for the same reason. Such a list is
  refused as `WorldRankingLists.DuplicateNames`, whole, and says which names
  and which numbers, for whoever has to correct the list at the rankings. Nor
  may a number go to two names, which is refused as
  `WorldRankingLists.DuplicateNumbers`. The golf croquet list once read a name
  given to two players as one player; it is refused now, as association
  croquet's is, unless the two are from different countries.

  A list is read whole or not at all, since a list read in part would let go
  of every player it did not reach. So a list is refused as
  `WorldRankingLists.Unreadable` where any line in it cannot be read: one
  without the details its sport's lines have, and one missing either half of
  the player's full name. A list with nobody on it is refused the same way,
  since the rankings know thousands of players and a file with none is not
  their list. A list is read as UTF-8, and one that is not is refused rather
  than read with its names spelled wrong. An empty line is no player, and is
  passed over.

  A list the site could not be asked for is refused as
  `WorldRankingLists.Unreachable`: one the site answers with a failure, one it
  does not finish answering in time, and one asked of a site that is not
  there. The site is given half a minute, since each list is most of a
  megabyte and the rankings' site is not quick.

  These scenarios stand a fake of the world rankings' site up in its place,
  which answers as the scenario says. They give the reading as little time to
  wait as it can be given, so that a fake told to answer late need not be
  slow.

  Background:
    Given a fake of the world rankings

  Rule: An association croquet player's full name is their first name and surname

    Scenario: The player's full name is read
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the first player read is "Keith Aiton"

    Scenario: Every line is a player
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     4,Aldridge,WO,       ,England,      100,Bill, , ,Chs, ,Standard, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then 2 players are read

  Rule: An association croquet player is read with their country

    Scenario: The player's country is read as the site's code
      Given the association croquet list has the line "     3,Aiton,KMH,          ,New Zealand,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the first player read is from "nz"

    Scenario: A country the association croquet list writes in its own words is read as the site's code
      Given the association croquet list has the line "     3,Aiton,KMH,          ,Czech Rep,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the first player read is from "cz"

    Scenario: A country the site has no code for is read as the rankings write it
      Given the association croquet list has the line "     3,Aiton,KMH,          ,Atlantis,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the first player read is from "Atlantis"

    Scenario: A line with no country is read with none
      Given the association croquet list has the line "     3,Aiton,KMH,          , ,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the first player read is "Keith Aiton"
      And the first player read has no country

  Rule: An association croquet player is read with their world ranking number

    Scenario: The player's world ranking number is read
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the first player read has the world ranking number 3

    Scenario: Two lines with the same full name are refused
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     9,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the reading is refused with "WorldRankingLists.DuplicateNames"

    Scenario: The refusal names the full name given twice
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     9,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the refusal names "Keith Aiton"

    Scenario: The refusal names the first world ranking number of the name
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     9,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the refusal names the world ranking number 3

    Scenario: The refusal names the second world ranking number of the name
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     9,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the refusal names the world ranking number 9

    Scenario: Two lines with the same number and name are refused
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the reading is refused with "WorldRankingLists.DuplicateNames"

    Scenario: Two lines with the same number and different names are refused
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     3,Aldridge,WO,       ,England,      100,Bill, , ,Chs, ,Standard, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the reading is refused with "WorldRankingLists.DuplicateNumbers"

    Scenario: Names that differ only in case are not the same name
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      And the association croquet list has the line "     9,AITON,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then 2 players are read

    Scenario: A line whose world ranking number is not a whole number is refused
      Given the association croquet list has the line "  none,Aiton,KMH,          ,England,      130,Keith, , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

  Rule: A golf croquet player's full name is the name they are known by and their surname

    Scenario: The player's full name is read
      Given the golf croquet list has the line "1,Arliss,William,Bill,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      When the golf croquet list is read
      Then the first player read is "Bill Arliss"

    Scenario: Every line is a player
      Given the golf croquet list has the line "1,Arliss,William,Bill,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      And the golf croquet list has the line "2,Brand,Richard,Richard,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then 2 players are read

  Rule: A golf croquet player is read with their world ranking number

    Scenario: The player's world ranking number is read
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the first player read has the world ranking number 4

    Scenario: The player's country is read as the site's code
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,NZL,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the first player read is from "nz"

    Scenario: A country of the United Kingdom is read as the site's code
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,WAL,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the first player read is from "wales"

    Scenario: A country the rankings write in letters of their own is read as the site's code
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,DEN,DEN,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the first player read is from "dk"

    Scenario: A country the site has no code for is read as the rankings write it
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,XYZ,XYZ,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the first player read is from "XYZ"

    Scenario: Two lines with the same full name and country are refused
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "5,Brand,Ivor,Ivor,m,ENG,WAL,,1800,1800,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.DuplicateNames"

    Scenario: Two lines with the same full name in different countries are two players
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "5,Brand,Ivor,Ivor,m,WAL,WAL,,1800,1800,,,,,1,0,0"
      When the golf croquet list is read
      Then 2 players are read

    Scenario: Two lines with the same full name in different countries are not refused
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "5,Brand,Ivor,Ivor,m,WAL,WAL,,1800,1800,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is not refused

    Scenario: The refusal names the full name given twice
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "5,Brand,Ivor,Ivor,m,ENG,WAL,,1800,1800,,,,,1,0,0"
      When the golf croquet list is read
      Then the refusal names "Ivor Brand"

    Scenario: The refusal names the first world ranking number of the name
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "5,Brand,Ivor,Ivor,m,ENG,WAL,,1800,1800,,,,,1,0,0"
      When the golf croquet list is read
      Then the refusal names the world ranking number 4

    Scenario: The refusal names the second world ranking number of the name
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "5,Brand,Ivor,Ivor,m,ENG,WAL,,1800,1800,,,,,1,0,0"
      When the golf croquet list is read
      Then the refusal names the world ranking number 5

    Scenario: Two lines with the same number and different names are refused
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "4,Brand,Richard,Richard,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.DuplicateNumbers"

    Scenario: Names that differ only in their first names are two players
      Given the golf croquet list has the line "2,Brand,Richard,Richard,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      And the golf croquet list has the line "4,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then 2 players are read

    Scenario: A line with no country is refused
      Given the golf croquet list has the line "4,Brand,Ivor,Ivor,m, ,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: A line whose world ranking number is not a whole number is refused
      Given the golf croquet list has the line "none,Brand,Ivor,Ivor,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

  Rule: An empty line is passed over

    Scenario: An empty line is no player
      Given the golf croquet list has the line "1,Arliss,William,Bill,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      And the golf croquet list has an empty line
      And the golf croquet list has the line "2,Brand,Richard,Richard,m,ENG,ENG,,2250,2250,,,,,1,0,0"
      When the golf croquet list is read
      Then 2 players are read

  Rule: A list with a line that cannot be read is not read at all

    Scenario: A line without its sport's details is refused
      Given the golf croquet list has the line "1,Arliss,William,Bill,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      And the golf croquet list has the line "2,Brand,Richard,Richard,m,ENG"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: A line with another sport's details is refused
      Given the association croquet list has the line "1,Arliss,William,Bill,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      When the association croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: A line with no surname is refused
      Given the golf croquet list has the line "1, ,William,Bill,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: A golf croquet line with no name the player is known by is refused
      Given the golf croquet list has the line "1,Arliss,William, ,m,ENG,ENG,,2050,2050,,,,,1,0,0"
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: An association croquet line with no first name is refused
      Given the association croquet list has the line "     3,Aiton,KMH,          ,England,      130,     , , ,Ntt, ,Irish, , , , , , , , , , , , ,"
      When the association croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: A list with nobody on it is refused
      Given the golf croquet list is empty
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

    Scenario: A list that is not UTF-8 is refused
      Given the golf croquet list has a line that is not UTF-8
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreadable"

  Rule: A list the site could not be asked for is said to be

    Scenario: A list the site answers with a failure
      Given the world rankings answer the golf croquet list with a failure
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreachable"

    Scenario: A list the site answers too late
      Given the world rankings answer the golf croquet list only after the reading has stopped waiting
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreachable"

    Scenario: A site that is not there
      Given the world rankings cannot be reached
      When the golf croquet list is read
      Then the reading is refused with "WorldRankingLists.Unreachable"
