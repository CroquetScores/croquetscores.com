Feature: Words readers use that the help does not

  Readers describe what they want to do in words the help does not always
  use: they ask how to make a tournament visible, and the help says publish.
  A synonym says that two words mean the same here, so that a question using
  either finds the pages using the other.

  The synonyms of each language are kept with that language, because what is
  a synonym in one is not in another and nobody should have to translate a
  list to read it. A language with none searches by what was typed alone.

  Synonyms add to a question and never take away from it: what the reader
  typed is always searched for, so a synonym can widen a result but cannot
  hide a page the reader's own words would have found.

  Rule: A word is searched for together with the words that mean the same

    A synonym is matched to the word as it was typed. The search itself
    matches a word's other forms ("publishing" for "publish"), but a synonym
    does not, so a list names each form a reader is likely to type.

    Scenario: A word with a synonym
      Given the help language "english"
      And the synonym "visible" for "publish"
      And the question "How do I make my tournament visible?"
      When the question is expanded
      Then the words searched for include "visible"
      And the words searched for include "publish"

    Scenario: A synonym works in both directions
      Given the help language "english"
      And the synonym "visible" for "publish"
      And the question "How do I publish results?"
      When the question is expanded
      Then the words searched for include "visible"

    Scenario: A word with no synonym is searched for as typed
      Given the help language "english"
      And the question "players"
      When the question is expanded
      Then the words searched for include "players"

  Rule: A question is made into words that cannot be mistaken for the search's own syntax

    Scenario: Punctuation is not part of a word
      Given the help language "english"
      And the question "How do I seed players?!"
      When the question is expanded
      Then the words searched for include "players"

    Scenario: The search's own symbols typed by a reader are only characters
      Given the help language "english"
      And the question "players & | ! ( ) : * <-> draw"
      When the question is expanded
      Then the question is accepted

    Scenario: A letter with a mark written beside it is one word
      Given the help language "english"
      And the question "café"
      When the question is expanded
      Then the words searched for include "café"

    Scenario: A word of a script whose vowels are marks is one word
      Given the help language "egyptian"
      And the question "كَتَبَ"
      When the question is expanded
      Then the words searched for include "كَتَبَ"

    Scenario: A question of nothing but punctuation has no words
      Given the help language "english"
      And the question "?!"
      When the question is expanded
      Then there are no words to search for

  Rule: A synonym is held to the same words a question is

    A synonym is written by hand into a list, and a list is not read by
    anybody who types a question. One written with a hyphen, a space or a
    quotation mark must not be able to break every search in its language.

    Scenario: A synonym of more than one word is searched for as its words
      Given the help language "english"
      And the synonym "email" for "electronic mail"
      And the question "email"
      When the question is expanded
      Then the words searched for include "electronic"
      And the words searched for include "mail"

    Scenario: A synonym with a hyphen in it is searched for as its words
      Given the help language "english"
      And the synonym "email" for "e-mail"
      And the question "email"
      When the question is expanded
      Then the words searched for include "mail"

    Scenario: A synonym with a quotation mark in it is accepted
      Given the help language "english"
      And the synonym "player" for "player's"
      And the question "player"
      When the question is expanded
      Then the question is accepted

  Rule: Every language with help pages has its synonyms kept, even if it has none yet

    Scenario: Every folder of the help has a list of synonyms
      Given the folders of the help
      When the synonyms of each are looked for
      Then every folder has a list of synonyms
