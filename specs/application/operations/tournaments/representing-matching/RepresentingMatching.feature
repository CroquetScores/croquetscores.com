@postgres
Feature: Finding what players represent that a name typed may be

  A player's dialog asks what the player represents (`player.feature`): a
  club, a region, a country, or anything else a manager cares to write. The
  same clubs are written again and again across a season's tournaments, and
  written a little differently each time, so the field offers what players
  have been added representing as it is typed, and a manager takes the club
  as it has been written before rather than typing it out.

  This is what is asked: the things players represent, from every tournament
  on the site, whatever its sport and whoever manages it, whose words the
  typing may be the start of. A manager adding players to one tournament is
  helped by the clubs of every other, which is the point, and what players
  represent is already published beside their names, so whoever is signed in
  may ask.

  Something is found where what was typed begins any word of it, whatever its
  case, as the world ranking players are (`WorldRankingPlayersMatching.feature`):
  "can" and "club" both find "Canterbury Croquet Club" and "Auckland Croquet
  Club". A hyphen parts the words as a space does. What was typed is taken as
  it was typed, with the spaces at either end left off, and no character in it
  stands for any other. Fewer than two characters find nothing, since one
  letter begins too many to choose from. At most ten are found, in
  alphabetical order, since a list is for choosing from at a glance.

  Each is found once however many players represent it, spelled as it was
  first kept when it was spelled two ways that differ only in capitals, so
  that a list is not made of the same club three times. Nothing is found for a
  player who has been archived, since a manager archives a player they added
  by mistake and a mistake is not worth offering again.

  These scenarios run against Postgres, with the players kept in the tables
  the read models keep them in.

  Background:
    Given the application's finding of what players represent
    And a tournament "Spring Open"
    And a tournament "Autumn Open"

  Rule: Something is found by the start of any word of it, whatever its case

    Scenario: The start of the first word finds it
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "cant" is found
      Then "Canterbury Croquet Club" is among those found

    Scenario: The start of a later word finds it
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "club" is found
      Then "Canterbury Croquet Club" is among those found

    Scenario: The start of a word after a hyphen finds it
      Given a player of "Spring Open" represents "Hurlingham-Roehampton"
      When what players represent matching "roe" is found
      Then "Hurlingham-Roehampton" is among those found

    Scenario: Capitals find it
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "CANT" is found
      Then "Canterbury Croquet Club" is among those found

    Scenario: The middle of a word finds nothing
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "erbury" is found
      Then none is found

    Scenario: The spaces around what was typed do not count
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "  cant  " is found
      Then "Canterbury Croquet Club" is among those found

    Scenario: A character that stands for any other elsewhere stands for itself
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "c_nt" is found
      Then none is found

    Scenario: A character that stands for any number elsewhere stands for itself
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "%club" is found
      Then none is found

  Rule: What players of every tournament represent is found

    Scenario: What a player of another tournament represents is found
      Given a player of "Autumn Open" represents "Auckland Croquet Club"
      When what players represent matching "auck" is found
      Then "Auckland Croquet Club" is among those found

    Scenario: A player who represents nothing finds nothing
      Given a player of "Spring Open" represents nothing
      When what players represent matching "no" is found
      Then none is found

  Rule: A player who is archived is not found

    Scenario: What an archived player represents is not found
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And that player is archived
      When what players represent matching "cant" is found
      Then none is found

    Scenario: What an archived player represents is found while another represents it too
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And that player is archived
      And a player of "Autumn Open" represents "Canterbury Croquet Club"
      When what players represent matching "cant" is found
      Then "Canterbury Croquet Club" is among those found

    Scenario: What a player represents is found again once they are restored
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And that player is archived
      And that player is restored
      When what players represent matching "cant" is found
      Then "Canterbury Croquet Club" is among those found

  Rule: What a player has been changed to represent is found, and what they no longer represent is not

    Scenario: What a player is changed to represent is found
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And that player is changed to represent "Auckland Croquet Club"
      When what players represent matching "auck" is found
      Then "Auckland Croquet Club" is among those found

    Scenario: What a player was changed from is not found
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And that player is changed to represent "Auckland Croquet Club"
      When what players represent matching "cant" is found
      Then none is found

  Rule: Each is found once

    Scenario: What many players represent is found once
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And a player of "Autumn Open" represents "Canterbury Croquet Club"
      When what players represent matching "cant" is found
      Then 1 is found

    Scenario: What differs only in capitals is found once
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And a player of "Autumn Open" represents "CANTERBURY CROQUET CLUB"
      When what players represent matching "cant" is found
      Then 1 is found

    Scenario: What differs only in capitals is found as it was first kept
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And a player of "Autumn Open" represents "CANTERBURY CROQUET CLUB"
      When what players represent matching "cant" is found
      Then the first found is "Canterbury Croquet Club"

  Rule: Fewer than two characters find nothing

    Scenario: One character finds nothing
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "c" is found
      Then none is found

    Scenario: Two characters find it
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching "ca" is found
      Then "Canterbury Croquet Club" is among those found

    Scenario: One character with spaces around it finds nothing
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      When what players represent matching " c " is found
      Then none is found

  Rule: At most ten are found, in alphabetical order

    Scenario: What is found is in alphabetical order
      Given a player of "Spring Open" represents "Canterbury Croquet Club"
      And a player of "Spring Open" represents "Auckland Croquet Club"
      When what players represent matching "club" is found
      Then the first found is "Auckland Croquet Club"

    Scenario: No more than ten are found
      Given 12 players of "Spring Open" each represent a club beginning "Croquet Club"
      When what players represent matching "croquet" is found
      Then 10 are found
