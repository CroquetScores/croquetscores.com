@postgres
Feature: An app lists the sports a site offers

  A tournament says which sport it is played in by a code (`tournaments.feature`),
  and a list of a year may be asked for one sport. An app that lets its user
  choose a sport, or that names the one a tournament says, would otherwise have
  to carry the codes and names itself and go out of date when one is added. So it
  asks the API, at `/api/v0/tournaments/sports`, which sports the site it asks
  offers.

  Each is told by its code and its name, in the order the site offers them. A
  site offers only its own: Croquet Scores the four croquet sports, and Gateball
  Scores Gateball alone, as its page for a new tournament does.

  The answer is the same for every caller, so a caller with no key is answered as
  one with a key is, and a key that does not work is refused, as the lists are.
  The names are in English unless the app asks for another language, named as the
  site's own pages name theirs, such as `sv` for Swedish. A language the site
  does not offer is refused rather than answered in English, so that an app that
  mistypes one finds out, and so is a language asked for twice, since the app
  has not said which it means. A regional form of a language is the language it
  is a form of, as a browser's is.

  Every answer carries a mark of what it said, so that one the app already has is
  answered not modified.

  No browser is needed: these scenarios send plain requests.

  Rule: A site lists the sports it offers, in its order

    Background:
      Given a site served as "croquetscores.com"
      And "reader@example.com" has an account, confirmed, called "Rae Reader"
      And "reader@example.com" has made a key that may only read

    Scenario: The sports are listed
      When the sports are asked with that key
      Then the API answers 200
      And the first sport is "ac"
      And the second sport is "gc"
      And the third sport is "a6w"
      And the fourth sport is "rc"
      And there are 4 sports

    Scenario: A sport says its name
      When the sports are asked with that key
      Then the sport "ac" is named "Association Croquet"
      And the sport "gc" is named "Golf Croquet"
      And the sport "a6w" is named "American 6 Wicket"
      And the sport "rc" is named "Ricochet"

    Scenario: The sports are listed with no key
      When the sports are asked with no key
      Then the API answers 200
      And there are 4 sports

    Scenario: A key that does not work is refused
      When the sports are asked with the key "cs_notakey"
      Then the API answers 401
      And the API's code is "ApiKey.Invalid"

  Rule: An app asks for the names in a language

    Background:
      Given a site served as "croquetscores.com"

    Scenario: A sport is named in the language asked for
      When the sports are asked with no key in the language "sv"
      Then the API answers 200
      And the sport "gc" is named "Golfcroquet"

    Scenario: A regional form is the language it is a form of
      When the sports are asked with no key in the language "sv-SE"
      Then the sport "gc" is named "Golfcroquet"

    Scenario: A language is asked for however it is cased
      When the sports are asked with no key in the language "SV"
      Then the sport "gc" is named "Golfcroquet"

    Scenario: The codes are the same in every language
      When the sports are asked with no key in the language "sv"
      Then the first sport is "ac"
      And the second sport is "gc"
      And there are 4 sports

    Scenario: The language of the browser is not the language asked for
      When the sports are asked with no key, the browser preferring "sv"
      Then the sport "gc" is named "Golf Croquet"

    Scenario: A language the site does not offer is refused
      When the sports are asked with no key in the language "xx"
      Then the API answers 400
      And the API's code is "Sports.LanguageNotOffered"
      And the API says the field at fault is "language"

    Scenario: A language asked for twice is refused
      When the sports are asked with no key in the languages "sv" and "en"
      Then the API answers 400
      And the API's code is "Sports.LanguageNotOffered"
      And the API says the field at fault is "language"

    Scenario: A language left empty is refused
      When the sports are asked with no key in the language ""
      Then the API answers 400
      And the API's code is "Sports.LanguageNotOffered"

  Rule: A site does not list the sports of another

    Scenario: Gateball Scores lists Gateball alone in another language
      Given a site served as "gateballscores.com"
      When the sports are asked with no key in the language "sv"
      Then the first sport is "gb"
      And there is 1 sport

    Scenario: Gateball Scores lists Gateball alone
      Given a site served as "gateballscores.com"
      When the sports are asked with no key
      Then the API answers 200
      And the first sport is "gb"
      And there is 1 sport
      And the sport "gb" is named "Gateball"

  Rule: An answer unchanged is answered not modified, by its mark

    Background:
      Given a site served as "croquetscores.com"

    Scenario: An answer carries a mark of what it said
      When the sports are asked with no key
      Then the API gives a mark of its answer

    Scenario: The same question is answered not modified once its mark is sent
      Given the sports are asked with no key
      When the sports are asked again with no key and the mark it gave
      Then the API answers 304
      And the API says nothing more

    Scenario: Another language has a mark of its own
      Given the sports are asked with no key
      And the mark of the answer is kept
      When the sports are asked with no key in the language "sv"
      Then the API gives a mark other than the one kept

    Scenario: The answer is kept by the app and not by anybody between
      When the sports are asked with no key
      Then the API says the answer is for the app to keep and to check before it uses it
