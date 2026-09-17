@browser
Feature: Forms are shown in a dialog

  Every form on the site is shown the same way, so that a reader who has filled
  in one knows where to look on the next: what the form is for across the top,
  what to fill in beneath that, and the button that does it at the bottom right.

  A form is the whole of the page it is on. It takes the place of the white
  panel other content sits in, and stands on the page's own background.

  This covers forms that are a page's purpose — registering, signing in. The
  theme choice in the footer is a control rather than a form of that kind, and
  keeps the shape it has.

  The register page is the first form, and until there are accounts it is a
  stand-in: it has the shape registering will need and does not pretend to
  register anyone. It is here so that the dialog has a real page to be shown on,
  and it is replaced by the real thing when accounts arrive.

  For testing only, the stand-in also shows every field's message all the time,
  so that there is always a message whose look can be checked. That is not how a
  form behaves. A real form shows a message only when its field needs attention,
  and the rules deciding when arrive with each form's own feature.

  Rule: A form takes the place of the panel

    Scenario: There is no panel on a page with a form
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then there is no panel on the page

    Scenario: The dialog stands on the page's own background
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the register page is opened
      Then the page is light

  Rule: A dialog reads from its title, to its content, to its buttons

    Scenario: The title bar comes first
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the dialog's title bar is above its content

    Scenario: The buttons come last
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the dialog's buttons are below its content

    Scenario: The dialog is known by its title
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the dialog is named "Register"

  Rule: The dialog is centred across the page

    Scenario: On a wide screen there is as much space either side of it
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the dialog has as much space to its left as to its right

    Scenario: On a narrow screen it takes the width it is given
      Given a viewport 375 pixels wide
      When the register page is opened
      Then the dialog reaches from one side of the page's gutter to the other

  Rule: The button that submits is last, and unmistakable

    Scenario: It is the furthest right of the buttons
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the submit button is the furthest right of the dialog's buttons

    Scenario: It is still the last button on a narrow screen
      Given a viewport 375 pixels wide
      When the register page is opened
      Then the submit button is the last of the dialog's buttons

    Scenario: It can be pressed with a thumb
      Given a viewport 375 pixels wide
      When the register page is opened
      Then the submit button is at least 44 pixels tall

    Scenario: It is the only button that looks like it
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then no other button in the dialog shares the submit button's colour

  Rule: In light, the dialog wears the section navigation's colour

    Scenario: The title bar is the colour of the section navigation
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the register page is opened
      Then the dialog's title bar is the colour of the section navigation

    Scenario: The content is white
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the register page is opened
      Then the dialog's content is white

    Scenario: The submit button is the colour of the section navigation
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the register page is opened
      Then the submit button is the colour of the section navigation

  Rule: In dark, the submit button is the lightest thing in the dialog

    The section navigation's dark green, on a dark dialog, reads as a hole
    rather than as the thing to press — the same reason the current section's
    tile turns pale in dark. So in dark the submit button is pale, and the title
    bar keeps the section navigation's colour.

    Scenario: The title bar is the colour of the section navigation
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the register page is opened
      Then the dialog's title bar is the colour of the section navigation

    Scenario: The submit button is lighter than the dialog's content
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the register page is opened
      Then the submit button is lighter than the dialog's content

  Rule: In either theme, the dialog can be read and its submit button found

    Scenario Outline: The title can be read on its bar
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the register page is opened
      Then the dialog's title reads against its bar at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

    Scenario Outline: The submit button stands out from the content around it
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the register page is opened
      Then the submit button stands out from the dialog's content at no less than 3 to 1

      Examples:
        | theme |
        | light |
        | dark  |

    Scenario Outline: The submit button's label can be read
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the register page is opened
      Then the submit button's label reads against it at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

  Rule: A field names itself from inside its own border

    A label inside the field's border is still a label: it is what a screen
    reader announces for the field, and what a click on it focuses. It is not
    placeholder text, which disappears the moment anyone types.

    Scenario: Every label is inside its field
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then every label in the dialog is inside its field

    Scenario: The labels stay once something has been typed
      Given a viewport 1200 pixels wide
      And the register page is open
      When something is typed into every field in the dialog
      Then every label in the dialog is inside its field

  Rule: A field that needs attention says so beneath itself

    A message is shown only when its field needs attention. These scenarios
    check where a message sits, how it looks and how it is announced. They are
    run against the stand-in register form because it shows every message all
    the time for testing — not because a form ever should.

    Scenario: A message sits beneath its field
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then every field in the dialog has a message beneath it

    Scenario: The messages are bold
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then every message in the dialog is bold

    Scenario: A message is announced with its field
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then every message in the dialog is announced with its field

    Scenario Outline: The messages are red
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the register page is opened
      Then every message in the dialog is red

      Examples:
        | theme |
        | light |
        | dark  |

    Scenario Outline: The messages can be read
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the register page is opened
      Then every message in the dialog reads against its content at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

  Rule: Until there are accounts, the register form is a stand-in

    Everything in this rule is true of the stand-in only, and goes when the real
    register form replaces it.

    Scenario: For testing only, it shows every field's message before anything is submitted
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then every field in the dialog has a message beneath it

    Scenario: It asks for an email address
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the dialog asks for an email address

    Scenario: It asks for a password
      Given a viewport 1200 pixels wide
      When the register page is opened
      Then the dialog asks for a password

    Scenario: Submitting it says registering is not open yet
      Given a viewport 1200 pixels wide
      And the register page is open
      When the dialog is submitted
      Then the reader is told registering is not open yet

    Scenario: Cancelling returns the reader to the home page
      Given a viewport 1200 pixels wide
      And the register page is open
      When the dialog is cancelled
      Then the home page is shown
