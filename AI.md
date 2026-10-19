# AI.md — Working in this repository

For whoever is working here with an AI agent, and for the agent. The other documents say what the repository is: `SETUP.md` how it is built and why, `STYLE.md` what things are called and what the scales are, `LAYOUT.md` what the site looks like, `TODO.md` what is known to be wrong. This says how to work in it, and it is the shortest of them on purpose.

---

## 1. Behaviour is specified before it is written

A `.feature` file comes first and is accepted before anything else is done. Then the step definitions, then the code under `/src`. A change that arrives as code with scenarios written afterwards to match it has the order backwards: the scenarios are then a description of what was built rather than a decision about what to build.

There is no `/tests` folder and nothing else that tests. If something is worth testing it is worth stating as behaviour, and if it cannot be stated as behaviour it is worth asking whether it is worth having.

A feature and its step definitions share a folder, and both are named after the source file they describe, casing included: `Mediator.feature` and `Mediator.steps.ts` for `Mediator.ts`, `crossSite.feature` for `crossSite.ts`. So the case says the same thing it says in `/src` — a class here, a module of functions there — and the two are found together by eye. Directories are lower case, hyphenated where they run to more than one word, as `value-objects` is in `/src`, so a capital letter in a path always means a file. Where a feature describes no one file, such as navigation across pages, it is named for the behaviour instead.

Land a large feature one `Rule:` at a time, so that review stays something a person can actually do.

---

## 2. One item to a step

A step carries one thing. Where a step would carry two, it becomes two steps — and where a `When` would both act and assert, the assertion becomes a `Then`.

Not this:

```gherkin
Given the stream "tournament/spring" is not there
When "TournamentOpened" and "GameRecorded" are appended to it, expecting it at version 0
Then the stream "tournament/spring" reads back "TournamentOpened" then "GameRecorded"
```

This:

```gherkin
Given the stream "tournament/spring" is not there
And event "TournamentOpened"
And event "GameRecorded"
When the events are appended
And the stream "tournament/spring" is read back
Then the first event is "TournamentOpened"
And the second event is "GameRecorded"
```

It is longer, and it is worth it. A step that names one thing is a step the next feature can reuse, so the vocabulary grows instead of the step count. A failure points at the line that failed rather than at a sentence with four claims in it, one of which was wrong. And a scenario that reads as a sequence of small facts can be checked against what somebody meant, which is what a specification is for.

The same rule applies to a `Then`: one assertion to a step, and a set asserted by naming each member.

---

## 3. What a feature says, and what it does not

A `.feature` file describes behaviour in the words of whoever cares about it. Method names, signatures, field names, types, status codes and encodings belong in the step definitions and in the `/src` types, where a reviewer sees them next to the code they describe.

A failure is named by its code — `EventStore.Concurrency`, `Command.RequestedAtMissing` — because the code is the contract and the sentence beside it is for whoever reads the log. Scenarios assert the code, never the wording.

Where a feature describes an interface rather than one implementation, say so in the narrative, keep the setup step neutral (`Given an event store`), and let the step definitions decide what is behind it. That is what lets a second implementation be held to the same scenarios instead of to a copy of them that drifts.

A `Rule:` earns a paragraph of narrative where the reason for it is not obvious from the scenarios. Write the reason, not the restatement.

---

## 4. Prose, in code and everywhere else

Comments say why, not what. The code already says what it does; a comment that repeats it is a second thing to keep true. Where a decision could reasonably have gone the other way, the comment says why it went this way — and where something was tried and rejected, that is worth a line too.

Plain words over jargon, and a whole sentence over an abbreviation. This holds in comments, in `.feature` files, in commit messages and in pull request descriptions. It is why this repository reads the way it does, and matching it is part of the work rather than a flourish on top.

An email address is always an email address: `emailAddress` in code, `EMAIL_ADDRESS` in a setting, "email address" in a feature, a comment or a page, and never `email` on its own. An email is what is sent or received. The two are different things, and a name that could be either leaves every reader to guess, and sooner or later one of them guesses wrong.

A commit message says what changed and why it changed, in paragraphs. What went wrong before, what it does now, and what was checked. Not a list of files: the diff already has those.

---

## 5. The layers hold

Dependencies point inwards — web and infrastructure onto application, application onto domain, domain onto nothing. `src/web/server.ts` is the only file outside `src/infrastructure/` that names a concrete implementation, apart from the import from the old sites under `src/import-ravendb/`, which is put together from the layers as the site is and which nothing in them may name. `specs/support/` is loaded by every spec in the repository, so it may name nothing from infrastructure or web.

ESLint enforces this, so breaking it fails the build rather than being noticed in review. If a rule is in the way, the thing to question is the design, not the rule.

---

## 6. Before saying it is done

```bash
npm run typecheck
npm run lint
npx prettier --check .
npm run test:changed
```

`npm run test:changed` runs the scenarios in the feature files this branch has touched, and none of the others. It looks in all four places a change can be — committed on the branch, staged, in the working tree, and not yet added at all — so a feature still being written counts the same as one that landed three commits ago.

It is narrowed because the whole suite takes long enough that running it after every change holds the work up, and nearly all of what it runs has nothing to do with the change in front of it. A gate that slow stops being run, which is worse than a gate that is narrow.

Nothing is given up by narrowing it, because CI runs every scenario but the `@browser` ones, against a real database, on every pull request, split four ways across runners of their own so that the run takes less time. It does not run them again on `main`, which a pull request only reaches once its scenarios have passed. The `@browser` scenarios are not run there, so run `npm run test:browser` by hand when a change touches what they check. Everything else is still what has to pass before anything reaches `main`. It is simply not what has to pass before saying a morning's work is done.

Run `npm test` by hand where a change reaches further than its own feature: anything under `specs/support/`, anything in `src/domain/common/`, anything most of the suite is standing on. Judgement is wanted here, and the cost of being wrong is one CI run.

Where something changed under `/src` with no feature file changed beside it, name the feature to run:

```bash
npm run test:changed -- specs/application/common/mediator/Mediator.feature
```

Where a database is not available, say which scenarios were not run rather than leaving it to be assumed. Say too when only the changed features were run, because "tests pass" means something narrower than it used to.

A new scenario is worth only as much as its ability to fail. Check it by breaking the code it describes and watching it go red, then put the code back. A scenario that passes against a deliberately broken implementation is worse than no scenario, because it says something is covered when it is not.

Report what happened, including what did not work. "Tests pass" when they were not run, or when some were skipped, costs more than it saves.

---

## 7. When a review is asked for

A review is run when somebody asks for one, and not otherwise: it is not a step on the way to a pull request.

A pull request is where to say that one is worth asking for. When a pull request has been opened, say so, and give the line that runs the review with the number filled in:

```
/code-review 123
```

Wait for CI to go green first, and say so: a review of code that does not yet pass its own scenarios spends itself on faults the scenarios were about to name. Reminding is the whole of it — whoever opened the pull request decides whether the review happens.

Its report is written to the top of `code-review.md`, above whatever is already there, with a `---` line between the new report and the ones before it, so that the newest is the first thing read and nothing earlier is lost. The file is not committed; `.gitignore` keeps it out. A report's heading says when the review was run, then comes a heading for each file by its path from the root of the repository, and under each the status and what was found.

A reviewer told to find faults will report some that are not, so a finding is checked against the code before it is acted on, and one that turns out to be wrong is recorded as wrong rather than quietly dropped. A finding that stands is either fixed or answered with the reason it stands.

---

## 8. Scope

Do what was asked. Where something else is wrong, say so and leave it: a change that quietly fixes three other things is a change nobody can review. Where a decision could go two ways and both are defensible, make one, say which, and say what would change if it went the other way.

Git is nobody's but the author's. Nothing is staged, committed, pushed, force-pushed, or opened as a pull request without being asked for in those words, each time: being asked to commit is not being asked to push, and being asked once is not being asked again. Work is done, checked, and left in the working tree, with what is there said plainly. When asked to commit what is staged, commit what is staged: exactly that, with nothing added to the index first, and unstaged work left alone. Where a review or a fix changes files, say which, and leave the staging to whoever asked.
