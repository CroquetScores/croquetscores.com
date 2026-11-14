Feature: The address a request is logged with

  Every request is logged with the address it was made to. Some addresses
  carry what lets whoever holds them act as a reader: a signed link sent in an
  email, which sets a password or confirms an address, and the state and code
  a reader brings back from Google. The log is kept for longer than any of
  them is good for, and read by whoever looks after the site, none of whom
  need them to do that. So the address is logged with each of them written as
  taken out, and with the rest of it as it was, so that a request is still
  found by what else it carried.

  They are taken out by name wherever they are in an address, and not only on
  the pages that read them, because the site reads a name however it was
  spelt: an escaped letter in it is read as the letter. Nothing else the site
  answers is asked for with a state or a code, so nothing is lost by it.

  Rule: What lets somebody act as a reader is taken out

    Scenario: A link is taken out
      Given the requested address "/account/set-new-password?link=abc.def&request=r1"
      When the address is written for the log
      Then the address is logged as "/account/set-new-password?link=[removed]&request=r1"

    Scenario: A link is taken out when it is the last thing in the address
      Given the requested address "/confirm?request=r1&link=abc.def"
      When the address is written for the log
      Then the address is logged as "/confirm?request=r1&link=[removed]"

    Scenario: The state is taken out
      Given the requested address "/auth/google/callback?state=S1&scope=email"
      When the address is written for the log
      Then the address is logged as "/auth/google/callback?state=[removed]&scope=email"

    Scenario: The code is taken out
      Given the requested address "/auth/google/callback?scope=email&code=C1"
      When the address is written for the log
      Then the address is logged as "/auth/google/callback?scope=email&code=[removed]"

    Scenario: Each is taken out however many there are
      Given the requested address "/auth/google/callback?state=S1&code=C1&state=S2"
      When the address is written for the log
      Then the address is logged as "/auth/google/callback?state=[removed]&code=[removed]&state=[removed]"

  Rule: A name is taken out however it was spelt

    Scenario: A name with an escaped letter is taken out
      Given the requested address "/auth/google/callback?%73tate=S1"
      When the address is written for the log
      Then the address is logged as "/auth/google/callback?%73tate=[removed]"

    Scenario: A name is taken out on an address spelt another way
      Given the requested address "/auth/%67oogle/callback?code=C1"
      When the address is written for the log
      Then the address is logged as "/auth/%67oogle/callback?code=[removed]"

    Scenario: A name that will not be read as one is kept as it is
      Given the requested address "/search?state%=S1"
      When the address is written for the log
      Then the address is logged as "/search?state%=S1"

  Rule: Anything else is kept as it was

    Scenario: An address with no question is kept as it is
      Given the requested address "/2026/croquet"
      When the address is written for the log
      Then the address is logged as "/2026/croquet"

    Scenario: What else an address asks is kept as it is
      Given the requested address "/search?q=croquet&links=3"
      When the address is written for the log
      Then the address is logged as "/search?q=croquet&links=3"

    Scenario: A name with no value is kept as it is
      Given the requested address "/search?state"
      When the address is written for the log
      Then the address is logged as "/search?state"
