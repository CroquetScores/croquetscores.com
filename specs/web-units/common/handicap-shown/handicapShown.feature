Feature: A handicap is shown without a decimal where it is a whole number

  A handicap is kept as it was written, with a sign if it has one, and with
  a fraction of one digit if it has one. A list of players shows it beside
  their name, where a point with a nought after it says nothing a reader
  wants, so a whole number is shown as a whole number. A fraction that is
  not nought is shown as it was written, and so is a sign.

  Scenario Outline: A handicap is shown as a reader would say it
    Given the handicap "<written>"
    When the handicap is shown
    Then the handicap shown is "<shown>"

    Examples:
      | written | shown |
      | 4       | 4     |
      | 4.0     | 4     |
      | 4.5     | 4.5   |
      | +4.0    | +4    |
      | -2.0    | -2    |
      | -2.5    | -2.5  |
      | 10.0    | 10    |
      | 0.0     | 0     |
