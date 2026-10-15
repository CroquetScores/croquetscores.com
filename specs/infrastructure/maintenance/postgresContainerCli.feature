Feature: Making a Postgres container

  A Postgres in a Docker container is the easiest database to have on a
  computer for anything that needs one that is not the development database
  (`compose.yaml`): a copy of the website's events, a place to try a restore,
  a database for a second site. Making it by hand is one long command with the
  data's place, the restart, the port and the password all to be remembered,
  and a mistake in any of them is found when the computer is restarted and
  the database is gone.

  "npm run db:create-container" makes it, and is given what it cannot choose:

      npm run db:create-container -- --name my-postgres --username sam --password "a password" --port 5433

  `--name` is what the container is called, `--username` is the Postgres user
  made in it, `--password` is that user's password, and `--port` is the port
  of this computer the database is reached on. All four are needed. The port
  is asked for and not defaulted because there is no port that is safe to
  guess: the development database is on 5432, and another Postgres, or
  anything at all, may be on the one chosen for it.

  What it makes is the same Postgres the site is developed against, kept for
  the long run and not for a test: its data is in a volume of its own that
  outlives the container, so that removing the container and making it again
  does not lose what was kept; it starts again when Docker does, and when the
  computer does; and it is reached from this computer only, not from the
  network, since a database is not to be offered to the room unless somebody
  decides it is.

  The password is given to Docker by the environment and not on its command
  line, where anyone looking at what is running on the computer could read it.

  It does not replace a container: one by the name, running or stopped, is
  refused and left as it is. The thing to find out a container was deleted and
  made again empty is not a second run of this.

  Once made it waits for Postgres to take connections, since the next thing
  anybody does is connect to it, and says the address to reach it by. The
  address has the password in it, and is said once, here, to the one who
  asked. The database is empty: it has none of the site's tables, which
  `npm run db:migrate` makes where it is to be one of the site's.

  These scenarios run the script's own function with the arguments as the
  command line gives them, against a Docker the scenario can read, make
  unavailable, and take as long to be ready as it says.

  Rule: The name, the username and the password are needed

    Scenario Outline: Without one of them it is refused
      When the container script is run with "<arguments>"
      Then the container script exits with failure

      Examples:
        | arguments                                              |
        |                                                        |
        | --username sam --password secret --port 5433           |
        | --name my-postgres --password secret --port 5433       |
        | --name my-postgres --username sam --port 5433          |
        | --name my-postgres --username sam --password secret    |

    Scenario: Without the name it says the name is needed
      When the container script is run with "--username sam --password secret --port 5433"
      Then the container script says the name is needed

    Scenario: Without the username it says the username is needed
      When the container script is run with "--name my-postgres --password secret --port 5433"
      Then the container script says the username is needed

    Scenario: Without the password it says the password is needed
      When the container script is run with "--name my-postgres --username sam --port 5433"
      Then the container script says the password is needed

    Scenario: Without the port it says the port is needed
      When the container script is run with "--name my-postgres --username sam --password secret"
      Then the container script says the port is needed

    Scenario: Refused, nothing is made
      When the container script is run with "--username sam --password secret --port 5433"
      Then no container was made

    Scenario: An unknown flag is refused
      When the container script is run with "--name my-postgres --username sam --password secret --image postgres:9 --port 5433"
      Then the container script exits with failure

    Scenario: A flag given twice is refused
      When the container script is run with "--name one --name two --username sam --password secret --port 5433"
      Then the container script exits with failure

  Rule: What is given is something Docker and Postgres will take

    Scenario Outline: A name Docker would refuse is refused
      When the container script is run with "--name <name> --username sam --password secret --port 5433"
      Then the container script exits with failure

      Examples:
        | name       |
        | -dash      |
        | has/slash  |
        | has:colon  |
        | .dotfirst |

    Scenario Outline: A username that would need quoting is refused
      When the container script is run with "--name my-postgres --username <username> --password secret --port 5433"
      Then the container script exits with failure

      Examples:
        | username |
        | 1sam     |
        | back-up  |
        | back.up  |

    Scenario Outline: A port that is not a port is refused
      When the container script is run with "--name my-postgres --username sam --password secret --port <port>"
      Then the container script exits with failure

      Examples:
        | port  |
        | 0     |
        | 65536 |
        | 54.3  |
        | soon  |

    Scenario: A name that is the same in another case is not the same container
      Given a container called "My-Postgres"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with success

  Rule: A container already there is left as it is

    Scenario: A container of the name is refused
      Given a container called "my-postgres"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with failure

    Scenario: A container of the name is said
      Given a container called "my-postgres"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says there is a container called "my-postgres" already

    Scenario: A container of the name is not made again
      Given a container called "my-postgres"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then no container was made

    Scenario: A container of another name is no matter
      Given a container called "croquet-web"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with success

  Rule: The container is a Postgres kept for the long run

    Background:
      Given the container script is run with "--name my-postgres --username sam --password secret --port 5433"

    Scenario: It is made with the name
      Then a container called "my-postgres" was made

    Scenario: It is the Postgres the site is developed against
      Then the container was made from "postgres:17-alpine"

    Scenario: It runs in the background
      Then the container was made to run in the background

    Scenario: Its data is in a volume of its own
      Then the container keeps its data in the volume "my-postgres-data"

    Scenario: It starts again when Docker does
      Then the container was made to start again unless it was stopped

    Scenario: It is reached from this computer only
      Then the container is reached on port 5433 of this computer only

    Scenario: Its user is the one given
      Then the container's Postgres user is "sam"

    Scenario: Its database is the user's
      Then the container's database is "sam"

    Scenario: Its password is the one given
      Then the container's Postgres password is "secret"

    Scenario: Its password is not on the command line
      Then the password is not on Docker's command line

  Rule: The port is chosen with --port

    Scenario: The port given is the one it is reached on
      When the container script is run with "--name my-postgres --username sam --password secret --port 6000"
      Then the container is reached on port 6000 of this computer only

  Rule: It waits until Postgres takes connections

    Scenario: It says when Postgres is ready
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says Postgres is ready

    Scenario: It waits for Postgres that is not ready at once
      Given Postgres takes 3 tries to be ready
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with success

    Scenario: It gives up on Postgres that is never ready, and says so
      Given Postgres is never ready
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says Postgres was not ready

    Scenario: Postgres that is never ready is a failure
      Given Postgres is never ready
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with failure

    Scenario: Postgres that is never ready says how to see why
      Given Postgres is never ready
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says to look at the container's logs

    Scenario: Postgres that is never ready leaves the container
      Given Postgres is never ready
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then a container called "my-postgres" was made

  Rule: It says the address to use

    Scenario: The address is said
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says the address is "postgres://sam:secret@127.0.0.1:5433/sam"

    Scenario: A password with characters that mean something is written into the address as it must be
      When the container script is run with "--name my-postgres --username sam --password p@ss/w:rd --port 5433"
      Then the container script says the address is "postgres://sam:p%40ss%2Fw%3Ard@127.0.0.1:5433/sam"

    Scenario: It says to migrate it
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says how to migrate the database

  Rule: Docker not being there is said

    Scenario: Docker that cannot be reached is a failure
      Given Docker cannot be reached
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with failure

    Scenario: Docker that cannot be reached is said
      Given Docker cannot be reached
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says Docker could not be reached

    Scenario: A container Docker refuses to make is said, with why
      Given Docker refuses to make the container, saying "port is already allocated"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script says "port is already allocated"

    Scenario: A container Docker refuses to make is a failure
      Given Docker refuses to make the container, saying "port is already allocated"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script exits with failure

    Scenario: The password is not said when Docker refuses
      Given Docker refuses to make the container, saying "failed for password secret"
      When the container script is run with "--name my-postgres --username sam --password secret --port 5433"
      Then the container script does not say the password
