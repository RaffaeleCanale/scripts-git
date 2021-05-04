function cyan(s) {
  return `\x1b[36m${s}\x1b[0m`;
}

function green(s) {
  return `\x1b[32m${s}\x1b[0m`;
}

function yellow(s) {
  return `\x1b[33m${s}\x1b[0m`;
}

function red(s) {
  return `\x1b[31m${s}\x1b[0m`;
}

function grey(s) {
  return `\x1b[90m${s}\x1b[0m`;
}

function prStatus(pr) {
  if (pr.isDraft) {
    return "Draft";
  }

  const failedChecks = pr.statusCheckRollup.filter(
    (check) => check.state !== "SUCCESS"
  );
  if (failedChecks.length > 0) {
    const names = failedChecks.map((check) => check.context).join(", ");
    return red(`❌ Failure(s) (${names})`);
  }

  if (pr.mergeable === "CONFLICTING") {
    return red("❌ Conflicts");
  }
  if (pr.reviewDecision === "REQUEST_CHANGES") {
    return red("❌ Changes required");
  }

  if (pr.reviewRequests.length > 0) {
    const reviewers = pr.reviewRequests.map(({ login }) => login).join(", ");
    return yellow(`Waiting for review (${reviewers})`);
  }

  if (pr.reviewDecision === "APPROVED") {
    return green("🍏 Approved");
  }

  return red("Unknown");
}

function pullRequestsToTree(prs) {
  const master = { label: "master", children: [] };

  prs.forEach((pr) => {
    if (pr.baseRefName === "master" || pr.baseRefName === "develop") {
      master.children.push(toNode(pr));
      return false;
    }

    const parent = prs.find((parent) => parent.headRefName === pr.baseRefName);
    if (parent) {
      toNode(parent).children.push(toNode(pr));
    } else {
      console.warn(red(`Something is fishy with ${pr.url}`));
    }
  });

  return master;
}
function toNode(pr) {
  pr.label = `${grey(pr.headRefName)}: ${prStatus(pr)}\n${cyan(
    pr.title
  )}\n${grey(pr.url)}`;
  pr.children = pr.children || [];
  return pr;
}

const fs = require("fs");
const Treeify = require("./Treeify");
const stdinBuffer = fs.readFileSync(0);

const pullRequests = JSON.parse(stdinBuffer.toString());

const tree = pullRequestsToTree(pullRequests);
Treeify.asTree(tree);
