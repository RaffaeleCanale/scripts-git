const { red, grey, cyan } = require("./colors");
const { prStatus } = require("./prStatus");
const fs = require("fs");
const Treeify = require("./Treeify");

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

const pullRequests = JSON.parse(process.argv[2]);
if (Array.isArray(pullRequests)) {
  const tree = pullRequestsToTree(pullRequests);
  Treeify.asTree(tree);
} else {
  console.log(prStatus(pullRequests));
}
