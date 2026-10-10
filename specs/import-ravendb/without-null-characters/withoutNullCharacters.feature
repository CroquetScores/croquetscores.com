Feature: A document read from the old sites has no null characters in it

  The old sites kept some text with a null character in it, typed or pasted
  in with a name: a tournament player was once called "Ellie Gri", a null
  character, then "ffith & Priscilla Flowers" (TournamentPlayers/69617).
  Postgres keeps JSON that cannot hold a null character, so the event that
  brought the name over was refused, and with it the import.

  A null character says nothing, so it is taken out of every text a document
  read from the old sites holds, wherever in the document the text is, before
  anything is imported from it. Everything else in the document is as it
  was: its other characters, its numbers, its yeses and noes and its empty
  values, and the names its fields go by. The slug the old site made from the
  name is a text like any other, and keeps every character it had, so that
  links to it still find it.

  A null character cannot be typed into a scenario, so "␀" stands for one.

  Rule: A null character is taken out of a text

    Scenario: A name with a null character in it loses it
      Given a document whose "Name" is "Ellie Gri␀ffith & Priscilla Flowers"
      When the null characters are taken out of it
      Then its "Name" is "Ellie Griffith & Priscilla Flowers"

    Scenario: Every null character is taken out of a text
      Given a document whose "Name" is "␀Sam␀ Some␀one␀"
      When the null characters are taken out of it
      Then its "Name" is "Sam Someone"

    Scenario: A text of nothing but null characters is left empty
      Given a document whose "Name" is "␀␀"
      When the null characters are taken out of it
      Then its "Name" is ""

    Scenario: A text with no null character in it is as it was
      Given a document whose "Name" is "Sam Someone"
      When the null characters are taken out of it
      Then its "Name" is "Sam Someone"

  Rule: Every text in a document loses them, however deep

    Scenario: A text in a list of fields loses them
      Given a document whose "Results.0._Players.0.Name" is "Ellie Gri␀ffith"
      When the null characters are taken out of it
      Then its "Results.0._Players.0.Name" is "Ellie Griffith"

    Scenario: A text that is itself in a list loses them
      Given a document whose "Aliases.1" is "Sa␀m"
      When the null characters are taken out of it
      Then its "Aliases.1" is "Sam"

    Scenario: The texts beside it keep what they had
      Given a document whose "Name" is "Ellie Gri␀ffith"
      And whose "Slug" is "ellie-gri-th"
      When the null characters are taken out of it
      Then its "Slug" is "ellie-gri-th"

  Rule: What is not a text is as it was

    Scenario: A number is as it was
      Given a document whose "_Id" is the number 35
      When the null characters are taken out of it
      Then its "_Id" is the number 35

    Scenario: A yes or no is as it was
      Given a document whose "IsArchived" is true
      When the null characters are taken out of it
      Then its "IsArchived" is true

    Scenario: An empty value is as it was
      Given a document whose "Representing" is empty
      When the null characters are taken out of it
      Then its "Representing" is empty

  Rule: The document read is not changed

    Taken out of a copy, since the document read is the one RavenDB's session
    knows, and is asked for its id afterwards.

    Scenario: The document read keeps its null characters
      Given a document whose "Name" is "Ellie Gri␀ffith"
      When the null characters are taken out of it
      Then the document read has "Name" as "Ellie Gri␀ffith"
