# Contributing

Thank you for wanting to help. Croquet Scores is run by one person, so this page says what to expect and how to make a contribution that can be accepted.

## What to expect

**Every contribution is read and reviewed. None is guaranteed to be accepted.** The site is for the people who use it, and a change that is good code can still be the wrong change for it: it may not fit where the site is going, it may cost more to keep than it gives, or it may be something another change is already doing. A contribution that is declined is told why. It is not a judgement of you or of the work.

Reviews are done when there is time for them, by one person, so a contribution can wait. A small change that does one thing is reviewed sooner and is more likely to be accepted than a large one.

## Before you start

**Open a GitHub issue first, however small the change.** Say what you would like to change and why, and wait to be told it is welcome. A typo is no exception. A conversation before the work is cheaper for both of us than a pull request that cannot be accepted, and an issue is where the decision is kept for the next person to find. A pull request with no issue behind it will be asked to start with one.

**Do one thing in a pull request.** A change that also quietly fixes three other things is a change nobody can review. Where you find something else that is wrong, say so in an issue, and leave it.

## The licence of what you contribute, and the CLA

The code is licensed under the GNU Affero General Public License, version 3 only (`AGPL-3.0-only`): see `LICENSE`.

**Before a first contribution can be accepted, you sign the Contributor License Agreement in [`CLA.md`](CLA.md).** It is short, and it says what you are giving and what you keep. You keep the copyright in what you wrote. You give the project owner the right to use your contribution under the AGPL, and under any other license the project owner later chooses, which is what lets the project change its license without finding every contributor to ask. Read it, and if you do not agree to it, do not contribute.

**To sign it,** open your pull request. A bot comments on it, and its `CLA` check stays red, until everyone who wrote something in it has signed. Each of them writes this as a comment on the pull request, in these words:

> I have read the Contributor License Agreement in CLA.md and I agree to it.

The bot records your GitHub account and the date, and the check turns green. You sign once, and it covers every contribution you make afterwards. A pull request that has not been signed for is not reviewed. Comment `recheck` to have the bot look again.

Commits are counted as well as the pull request: a commit written under an email address that is not linked to a GitHub account has no one to sign for it, so link the address in your GitHub settings first.

If you are contributing on behalf of an employer, or your employer may have rights in your work, get their permission first and say so in the pull request.

## How work is done here

[`AI.md`](AI.md) is the whole of the guidance, and it is short. Read it before you write anything. It is written for people working with an AI agent and for the agent, and applies the same to anyone. In brief:

- **Behaviour is specified before it is written.** A `.feature` file comes first, then its step definitions, then the code under `src`. The feature files are all in the `specs` folder, which follows the shape of `src`, and a feature shares its folder with its step definitions, both named after the source file they describe: `Mediator.feature` and `Mediator.steps.ts` for `Mediator.ts`. There is no `tests` folder, and nothing else that tests. If something cannot be stated as behaviour, ask whether it is worth having. A contribution that arrives as code with scenarios written afterwards to match it has the order backwards, and will be asked to be put in the right one.
- **A step carries one item,** and a feature says what a reader or an operator cares about in their own words, not method names or status codes.
- **The layers hold.** Dependencies point inwards: web and infrastructure onto application, application onto domain. ESLint enforces it, so breaking it fails the build.
- **Comments say why, not what.** Plain words over jargon. A commit message says what changed and why, in paragraphs, not a list of files.
- An email address is always an email address, in code, in settings and in words, and never `email` on its own. An email is what is sent.

The other documents say what the repository is: [`SETUP.md`](SETUP.md) how it is built and why, [`STYLE.md`](STYLE.md) what things are called, and [`LAYOUT.md`](LAYOUT.md) what the site looks like.

## Running it

[`README.md`](README.md) says how to get the site running. The scenarios that need a database run against Postgres: either the container (`npm run db:up`) or one you already have installed, which [`SETUP.md`](SETUP.md) section 6 explains.

## Before you open a pull request

These four must pass:

```bash
npm run typecheck
npm run lint
npx prettier --check .
npm run test:changed
```

`npm run test:changed` runs the scenarios in the features your branch has touched. Where you changed something under `src` with no feature changed beside it, name the feature to run, as `AI.md` section 6 shows. Where a change reaches further, as anything under `specs/support` or `src/domain/common` does, run `npm test`.

Check that a new scenario can fail: break the code it describes, watch it go red, and put the code back. Say in the pull request what you ran, and what you did not. If you could not run the scenarios that need a database, say so, and CI will.

CI runs every scenario but the `@browser` ones on your pull request. Run `npm run test:browser` yourself where a change touches what they check.

## The pull request

- Say what changed and why, in plain words, and what you checked.
- Keep it small. A large feature is landed one `Rule:` at a time.
- It is squash-merged, so the history of your branch does not matter, but the pull request's description becomes the commit's.
- Expect to be asked for changes. A review is a conversation.

## Translations

The help is in [`docs/help`](docs/help), a folder for each language the site speaks. The words the screen shows are in `src/web/languages`, and the help must use the same ones for a button or a tab. [`docs/help/translate-prompt.md`](docs/help/translate-prompt.md) says how. A native speaker reading a translation and saying where it reads wrongly is one of the most useful contributions there is. To ask for a language to be added, email <croquetscores@gmail.com>, or open an issue.

## Reporting a security problem

Please do not open a public issue for something that could be used against the site or its readers. Email <croquetscores@gmail.com> and say what you found.

## Behaving well

Be courteous, and assume good faith. A contribution or a conversation that is not will be closed.
