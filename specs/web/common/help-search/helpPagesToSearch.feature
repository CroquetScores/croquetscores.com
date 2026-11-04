Feature: Which pages of the built help are searched

  The index is made from the pages the build wrote, every language's, and a
  reader asking the help a question is shown the ones that answer it. Most of
  them are the help's to be searched. A few are not, because finding them
  would not be an answer.

  A page of what's new is the one: it says what changed in a release, not how
  anything is done, and a reader asking how to do something would be sent to a
  list of what was different last month. Both of them, the one for everybody
  and the one for people who run tournaments, and in every language.

  Rule: A page the build wrote without its words is searched by its title

    A build made before the words were kept wrote pages that have only a title
    and a body of HTML. One such page must not stop every other from being
    searched.

    Scenario: A page with no headings or text
      Given the built help has the english page "readers/index" written without its words
      And the built help has the english page "accounts/index"
      When the pages to search are listed
      Then the pages listed include "readers"
      And the page "readers" is listed with no headings
      And the page "readers" is listed with no text
      And the pages listed include "accounts"

  Rule: Only pages are searched, and each page once

    Scenario: A file that is not a page
      Given the built help has the english file "readers/notes" that is not a page
      And the built help has the english page "accounts/index"
      When the pages to search are listed
      Then the pages listed do not include "readers/notes"
      And the pages listed include "accounts"

    Scenario: A page that is written twice
      Given the built help has the english page "readers"
      And the built help has the english page "readers/index"
      When the pages to search are listed
      Then the pages listed include "readers" once

    Scenario: A page written twice, whose file name ends as a folder's index does
      Given the built help has the english page "reindex" titled "The file"
      And the built help has the english page "reindex/index" titled "The folder"
      When the pages to search are listed
      Then the page "reindex" is listed titled "The file"

  Rule: A help that is not there is not read as a help with no pages

    An index made from nothing would replace a good one with an empty one, and
    a site started from a checkout that was never built would lose its search.
    It cannot be read, and what is kept is left as it was
    (PostgresHelpSearchIndex.feature).

    Scenario: The built help is not there
      Given the built help is not there
      When an attempt is made to list the pages to search
      Then the pages cannot be listed

    Scenario: A language the build wrote nothing for has no pages
      Given the built help has the english page "readers/index"
      And the help is asked for the languages "english" and "welsh"
      When the pages to search are listed
      Then the pages listed include "readers"

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
