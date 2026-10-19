// The bot that asks a contributor to sign the Contributor License Agreement
// (CLA.md), keeps who has, and says on the pull request whether it is signed.
// Run by .github/workflows/cla.yml, which says why it is written here and not
// taken from an action somebody else keeps.
//
// A contributor signs by commenting the words below on a pull request of
// theirs. The signature is kept in a file on a branch of its own, by the
// contributor's GitHub account number and not their name, which they can
// change. The pull request's "CLA" status is green once everyone who wrote
// something in it has signed, or does not need to.

/** The words that sign, which CLA.md and CONTRIBUTING.md give to the contributor. */
export const signingWords =
  "I have read the Contributor License Agreement in CLA.md and I agree to it.";

// People who need not sign: the ones who own the project. Bots need not either,
// whatever they are called (dependency updates arrive from one), which is
// told by the type GitHub gives the account and not by its name.
const owners = ["TimMurphy"];

// Kept apart from the code, on a branch of its own that holds nothing else, so
// that a signature is not a commit on main and is not in the history of the
// site. A file on a branch rather than a comment, because a comment can be
// deleted by whoever wrote it after the pull request is merged.
const branch = "cla-signatures";
const path = "signatures.json";

// What the pull request shows beside its checks.
const statusName = "CLA";

// Found again on the next run, so that the bot says one thing on a pull request
// and changes it, and does not add a comment each time it is run.
const marker = "<!-- cla-bot -->";

const needsToSign = (person) =>
  person.type !== "Bot" && !owners.includes(person.login);

const decoded = (content) =>
  JSON.parse(Buffer.from(content, "base64").toString("utf8"));

const encoded = (signatures) =>
  Buffer.from(`${JSON.stringify(signatures, null, 2)}\n`).toString("base64");

/**
 * Looks at the pull request that `context` is about and says whether it has
 * been signed for, recording a signature where the comment that started this
 * is one.
 */
export const run = async ({ github, context: event }) => {
  const { owner, repo } = event.repo;
  const number =
    event.eventName === "pull_request_target"
      ? event.payload.pull_request.number
      : event.payload.issue.number;

  const comment =
    event.eventName === "issue_comment" ? event.payload.comment : undefined;
  const said = comment?.body.trim();

  // A comment that is not the signature or a request to look again has nothing
  // for the bot to do, so it is not read further.
  if (comment !== undefined && said !== signingWords && said !== "recheck") {
    return;
  }

  const { data: pull } = await github.rest.pulls.get({
    owner,
    repo,
    pull_number: number,
  });

  // Everyone who wrote something in it: the one who opened it, and the author
  // of each commit, since a commit they wrote is theirs to give.
  const commits = await github.paginate(github.rest.pulls.listCommits, {
    owner,
    repo,
    pull_number: number,
    per_page: 100,
  });

  const people = new Map([[pull.user.id, pull.user]]);
  let unlinked = 0;

  for (const commit of commits) {
    // A commit whose email address is not one of a GitHub account's has no one
    // to sign for it.
    if (commit.author === null) unlinked += 1;
    else people.set(commit.author.id, commit.author);
  }
  const needed = [...people.values()].filter(needsToSign);

  const kept = await readSignatures({ github, owner, repo });
  const { sha } = kept;
  let { signatures } = kept;

  const signs = needed.find(
    (person) =>
      person.id === comment?.user.id &&
      said === signingWords &&
      !signatures.some((signed) => signed.id === person.id),
  );
  if (signs !== undefined) {
    signatures = [
      ...signatures,
      {
        id: signs.id,
        login: signs.login,
        signedAt: comment.created_at,
        pullRequest: number,
        comment: comment.id,
      },
    ];
    await writeSignatures({
      github,
      owner,
      repo,
      signatures,
      sha,
      message: `${signs.login} signed the CLA on #${String(number)}`,
    });
  }

  const missing = needed.filter(
    (person) => !signatures.some((signed) => signed.id === person.id),
  );
  const signedFor = missing.length === 0 && unlinked === 0;

  await github.rest.repos.createCommitStatus({
    owner,
    repo,
    sha: pull.head.sha,
    state: signedFor ? "success" : "failure",
    context: statusName,
    description: signedFor
      ? "Everyone who contributed has signed the CLA"
      : unlinked > 0
        ? "A commit is not linked to a GitHub account"
        : `${String(missing.length)} contributor(s) must sign the CLA`,
    target_url: `https://github.com/${owner}/${repo}/blob/main/CLA.md`,
  });

  await say({
    github,
    owner,
    repo,
    number,
    body: signedFor
      ? `${marker}\n**CLA:** everyone who contributed to this pull request has signed the Contributor License Agreement. Thank you.`
      : ask({ owner, repo, missing, unlinked }),
    // Nothing is said on a pull request that never needed it.
    onlyToChange: signedFor,
  });
};

const ask = ({ owner, repo, missing, unlinked }) =>
  [
    marker,
    "**CLA:** this pull request cannot be reviewed until everyone who contributed to it has signed the [Contributor License Agreement](" +
      `https://github.com/${owner}/${repo}/blob/main/CLA.md).`,
    ...(missing.length === 0
      ? []
      : [
          "",
          `Still to sign: ${missing.map((person) => `@${person.login}`).join(", ")}.`,
          "",
          "To sign, each of them writes this as a comment on this pull request, in these words:",
          "",
          `> ${signingWords}`,
          "",
          "It is asked once, and covers everything contributed afterwards. Comment `recheck` to have this looked at again.",
        ]),
    ...(unlinked === 0
      ? []
      : [
          "",
          `${String(unlinked)} commit(s) here were written under an email address that is not linked to a GitHub account, so there is no one for the bot to ask. Link the address in your GitHub settings, or write the commits again under one that is.`,
        ]),
  ].join("\n");

/** Says `body` on the pull request, in the one comment the bot keeps there. */
const say = async ({ github, owner, repo, number, body, onlyToChange }) => {
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: number,
    per_page: 100,
  });
  const mine = comments.find((each) => each.body?.startsWith(marker));
  if (mine !== undefined) {
    if (mine.body !== body) {
      await github.rest.issues.updateComment({
        owner,
        repo,
        comment_id: mine.id,
        body,
      });
    }
    return;
  }
  if (onlyToChange) return;
  await github.rest.issues.createComment({
    owner,
    repo,
    issue_number: number,
    body,
  });
};

// Nothing there is no one signed, whether it is the file or the branch that is
// not there yet: it is made by the first signature.
const readSignatures = async ({ github, owner, repo }) => {
  try {
    const { data } = await github.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    return { signatures: decoded(data.content).signatures, sha: data.sha };
  } catch (failure) {
    if (failure.status === 404) return { signatures: [], sha: undefined };
    throw failure;
  }
};

const writeSignatures = async ({
  github,
  owner,
  repo,
  signatures,
  sha,
  message,
}) => {
  const file = { version: 1, signatures };
  if (sha !== undefined) {
    await github.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message,
      sha,
      content: encoded(file),
    });
    return;
  }

  let branchIsThere = true;
  try {
    await github.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
  } catch (failure) {
    if (failure.status !== 404) throw failure;
    branchIsThere = false;
  }
  if (branchIsThere) {
    await github.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message,
      content: encoded(file),
    });
    return;
  }

  // The first signature makes the branch, with no parent, so that it does not
  // carry the whole of the code with it.
  const { data: tree } = await github.rest.git.createTree({
    owner,
    repo,
    tree: [
      {
        path,
        mode: "100644",
        type: "blob",
        content: `${JSON.stringify(file, null, 2)}\n`,
      },
    ],
  });
  const { data: commit } = await github.rest.git.createCommit({
    owner,
    repo,
    message,
    tree: tree.sha,
    parents: [],
  });
  await github.rest.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branch}`,
    sha: commit.sha,
  });
};
