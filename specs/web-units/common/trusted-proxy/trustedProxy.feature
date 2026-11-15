Feature: The IP address a request is counted as coming from

  Two of the site's limits count by the IP address a request came from: how
  often one address may ask for a way back in (`forgotPassword.feature`), and
  how often signing in may fail from one (`signIn.feature`). Each is worth
  exactly as much as the address it counts, and where that address is read from
  depends on what sits in front of the site.

  With nothing in front, it is the address the connection came in on, and that
  is the truth of it: whoever is asking is at the other end.

  Behind a load balancer or a reverse proxy, every connection comes in from the
  proxy. Counting by the connection then counts every reader as one, and the
  first ten askings in an hour spend the limit for everybody, which locks the
  site's own readers out of the one page that exists for readers who cannot get
  in. The reader's own address is in the request instead, put there by the
  proxy — and it is a header like any other. Anything that can reach the site
  can send one saying whatever it likes, so a site that believes every such
  header has no limit at all: each request names an address nobody has asked
  from before, and every one of them is the first.

  So the site is told which proxy to believe, and believes a forwarded address
  from that proxy and from nowhere else. It is a setting on whatever serves the
  site, like the host the site answers to (`crossSite.feature`), and it belongs
  on the same deployment checklist. In development nothing sits in front, so it
  stays blank, and the connection's address is the reader's.

  The setting names the proxy rather than answering yes or no, because yes is
  the dangerous answer: yes believes every sender, which is the state described
  above. Naming it means the site is in no doubt about which senders it trusts,
  and the answer does not become wrong the day something else can reach it.

  Believing a proxy is believing the rest of what it says a request arrived
  with, the host it was addressed to among it, which is a second reason to name
  what is believed rather than to trust whatever connects. The host it was
  addressed to decides which website a request is for, and so what the site
  does with it is `unknownHost.feature`'s and `crossSite.feature`'s.

  These scenarios say where the address is read from, and nothing about what is
  counted with it, which is each limit's own.

  Rule: With nothing said to sit in front, a request comes from its connection

    Scenario: A request is counted as coming from the connection it came in on
      Given the site is told nothing forwards requests to it
      And a request that came in from "203.0.113.5"
      Then it is counted as coming from "203.0.113.5"

    Scenario: A request saying it was forwarded is counted as coming from its connection
      Given the site is told nothing forwards requests to it
      And a request that came in from "203.0.113.5"
      And it says it was forwarded from "198.51.100.7"
      Then it is counted as coming from "203.0.113.5"

  Rule: A forwarded address is believed from the proxy the site was told to trust

    Scenario: A request forwarded by the trusted proxy comes from the address it names
      Given the site is told requests are forwarded by "203.0.113.5"
      And a request that came in from "203.0.113.5"
      And it says it was forwarded from "198.51.100.7"
      Then it is counted as coming from "198.51.100.7"

    Scenario: The trusted proxy saying nothing leaves the connection's address
      Given the site is told requests are forwarded by "203.0.113.5"
      And a request that came in from "203.0.113.5"
      Then it is counted as coming from "203.0.113.5"

    Scenario: A reader on IPv6 is counted as coming from the address the proxy names
      Given the site is told requests are forwarded by "203.0.113.5"
      And a request that came in from "203.0.113.5"
      And it says it was forwarded from "2001:db8::1"
      Then it is counted as coming from "2001:db8::1"

  Rule: A forwarded address is believed from nowhere else

    A request that reaches the site from anywhere but the named proxy is from
    whoever sent it, whatever it says about having been forwarded. This is the
    whole of what the naming buys: a reader who sends the header themselves is
    counted by the address they are on, and gets one reader's share of the
    limit.

    Scenario: A request from elsewhere saying it was forwarded comes from its connection
      Given the site is told requests are forwarded by "203.0.113.5"
      And a request that came in from "198.51.100.9"
      And it says it was forwarded from "198.51.100.7"
      Then it is counted as coming from "198.51.100.9"

  Rule: What is trusted can be more than one proxy, and can be a range

    Scenario Outline: A proxy among those trusted is believed
      Given the site is told requests are forwarded by "<trusted>"
      And a request that came in from "10.0.0.1"
      And it says it was forwarded from "198.51.100.7"
      Then it is counted as coming from "198.51.100.7"

      Examples:
        | trusted               |
        | 10.0.0.1              |
        | 10.0.0.0/8            |
        | 203.0.113.5, 10.0.0.1 |

  Rule: Through several proxies, a request comes from the last address none of them vouched for

    Each proxy a request passes through writes down the address it came in
    from, so the addresses read as a chain from the reader's own to the last
    proxy before this site. Following it back stops at the first hop the site
    was not told to trust, because everything written to the left of that hop
    was written by something with no reason to be believed. What the untrusted
    hop was reached from is the furthest back the site can honestly go, so that
    is what the request is counted as coming from.

    Scenario: Every proxy in the chain is trusted, so the reader's own address is counted
      Given the site is told requests are forwarded by "10.0.0.0/8"
      And a request that came in from "10.0.0.1"
      And it says it was forwarded from "198.51.100.7"
      And it says that was forwarded on by "10.0.0.9"
      Then it is counted as coming from "198.51.100.7"

    Scenario: A hop that is not trusted is as far back as counting goes
      Given the site is told requests are forwarded by "10.0.0.0/8"
      And a request that came in from "10.0.0.1"
      And it says it was forwarded from "198.51.100.7"
      And it says that was forwarded on by "203.0.113.5"
      Then it is counted as coming from "203.0.113.5"

  Rule: Counting stops at anything in the chain that is not an address

    A proxy writes what it likes into the header it appends to, and a
    misconfigured one writes something that is no address at all. It cannot be
    judged: it is in no range the site was told to trust, because it is in no
    range, and it names nobody who could be counted. So counting stops there,
    exactly as it stops at a hop that was not trusted, and the request is
    counted as coming from the last address the chain could be read back to —
    at worst the connection it came in on, which is always an address.

    Counted as it was written, it would be a limit counting by whatever the
    misconfiguration wrote: the same words on every request, holding every
    reader to one reader's share, or different words on each, holding nobody to
    anything. Only a trusted proxy can put it there, so this is not a way in
    for a reader; it is an answer that would be wrong.

    Scenario: A forwarded word that is not an address leaves the connection's address
      Given the site is told requests are forwarded by "10.0.0.0/8"
      And a request that came in from "10.0.0.1"
      And it says it was forwarded from "not an address"
      Then it is counted as coming from "10.0.0.1"

    Scenario: A hop that is not an address is as far back as counting goes
      Given the site is told requests are forwarded by "10.0.0.0/8"
      And a request that came in from "10.0.0.1"
      And it says it was forwarded from "198.51.100.7"
      And it says that was forwarded on by "not an address"
      Then it is counted as coming from "10.0.0.1"

    Scenario: Counting goes back as far as the chain can be read
      Given the site is told requests are forwarded by "10.0.0.0/8"
      And a request that came in from "10.0.0.1"
      And it says it was forwarded from "not an address"
      And it says that was forwarded on by "10.0.0.9"
      Then it is counted as coming from "10.0.0.9"

  Rule: A setting that names no proxy stops the site starting

    A misspelling here is not something to carry on from. Ignoring it would
    leave a deployed site counting every reader as its proxy, and the first
    anybody would know of it is readers being told to try again later for
    something none of them had done. Refused at startup, it is found by whoever
    is deploying, while they are deploying.

    Scenario: The site refuses to start when what it is told to trust is not an address
      Given the site is told requests are forwarded by "our load balancer"
      When the site starts
      Then it refuses to start
      And what it says names the setting

    Scenario: The site starts when it is told nothing forwards requests to it
      Given the site is told nothing forwards requests to it
      When the site starts
      Then it starts

  Rule: A range that fixes no bits is every address, and stops the site starting

    A range says an address and how many of its leading bits are fixed, so /0
    fixes nothing and is every address there is. Written here it would mean
    believing a forwarded address from whatever could reach the site, which is
    the yes this setting exists to make impossible: no limit at all, and
    nothing to notice. So it is refused with the rest, while somebody is
    deploying.

    Scenario Outline: The site refuses to start when told to trust every address
      Given the site is told requests are forwarded by "<trusted>"
      When the site starts
      Then it refuses to start
      And what it says names the setting

      Examples:
        | trusted    |
        | 0.0.0.0/0  |
        | ::/0       |
        | 10.0.0.0/0 |
