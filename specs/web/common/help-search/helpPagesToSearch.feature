Feature: Which pages of the built help are searched

  The index is made from the pages the build wrote, every language's, and a
  reader asking the help a question is shown the ones that answer it. Most of
  them are the help's to be searched. A few are not, because finding them
  would not be an answer.

  A page of what's new is the one: it says what changed in a release, not how
  anything is done, and a reader asking how to do something would be sent to a
  list of what was different last month. Both of them, the one for everybody
  and the one for people who run tournaments, and in every language.

  Rule: A page of what's new is not searched

    Scenario: The what's new for everybody
      Given the built help has the english page "whats-new"
      And the built help has the english page "readers/index"
      When the pages to search are listed
      Then the pages listed do not include "whats-new"
      And the pages listed include "readers"

    Scenario: The what's new for people who run tournaments
      Given the built help has the english page "admin/whats-new"
      And the built help has the english page "admin/terms-of-use"
      When the pages to search are listed
      Then the pages listed do not include "admin/whats-new"
      And the pages listed include "admin/terms-of-use"

    Scenario: The what's new of every language
      Given the built help has the english page "whats-new"
      And the built help has the welsh page "whats-new"
      And the built help has the welsh page "readers/index"
      When the pages to search are listed
      Then the pages listed do not include "whats-new"
      And the pages listed include "readers"
