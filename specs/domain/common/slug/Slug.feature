Feature: The part of an address that names a thing

  A tournament and each of its competitions are found at an address a reader
  can read, such as "/2026/ac/spring-open/competitions/block-a", rather than 
  at an id. The part of the address that names one thing is its slug, and a 
  slug is made from the thing's name.

  A slug keeps the letters and digits of the name, in lower case, and turns
  every run of anything else into a single hyphen, with none left at either
  end. An accent is taken off the letter it is on, so that nobody has to know
  how to type "ö" to type the address. A letter with no plainer form, such as
  one written in Chinese, is kept as it is: dropping it would leave a name in
  another script with no slug at all.

  A name with no letter or digit in it makes no slug, and is refused rather
  than given one that means nothing.

  A slug is kept once it is made, not made again from the name each time it
  is wanted, so that a thing whose name is corrected is still found where it
  was. So a slug is also read back from where it was kept, and only a writing
  that making a slug would have given is read as one. Whether a slug is taken
  already is not the slug's to know, and is asked by whatever it names.

  Rule: A slug is made from a name

    Scenario Outline: A slug made from a name
      When a slug is made from the name "<name>"
      Then the slug is written "<slug>"

      Examples:
        | name             | slug             |
        | Block A          | block-a          |
        | Spring Open 2026 | spring-open-2026 |
        | Plate — Doubles! | plate-doubles    |
        | Böck Cup         | bock-cup         |
        | 李小龍 Cup       | 李小龍-cup       |
        | --Knockout--     | knockout         |

    Scenario: A name with no letter or digit in it makes no slug
      When a slug is made from the name "— !! —"
      Then it is refused for breaking "Slug.Empty"

  Rule: Only what making a slug would give is read as one

    Scenario: A slug read from its writing is written the same way
      When a slug is read from "block-a"
      Then the slug is written "block-a"

    Scenario Outline: A writing that making a slug would not give is refused
      When a slug is read from "<written>"
      Then it is refused for breaking "Slug.Malformed"

      Examples:
        | written  |
        | Block-A  |
        | block a  |
        | -block-a |
        | block--a |
        | böck-cup |

    Scenario: An empty writing is refused
      When a slug is read from ""
      Then it is refused for breaking "Slug.Empty"
