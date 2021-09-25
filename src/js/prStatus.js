const { red, yellow, green } = require("./colors");

module.exports = {
  prStatus(pr) {
    if (pr.isDraft) {
      return "Draft";
    }

    if (pr.reviewDecision === "REQUEST_CHANGES") {
      return red("❌ Changes required");
    }

    const failedChecks = pr.statusCheckRollup.filter(
      (check) => check.state !== "SUCCESS" && check.state !== "PENDING"
    );
    if (failedChecks.length > 0) {
      const names = failedChecks.map((check) => check.context).join(", ");
      return red(`❌ Failure(s) (${names})`);
    }

    if (pr.mergeable === "CONFLICTING") {
      return red("❌ Conflicts");
    }

    const pendingChecks = pr.statusCheckRollup.filter(
      (check) => check.state === "PENDING"
    );
    if (pendingChecks.length > 0) {
      const names = pendingChecks.map((check) => check.context).join(", ");
      return yellow(`🍊 Pending checks (${names})`);
    }

    if (pr.reviewRequests.length > 0 && pr.reviewDecision !== "APPROVED") {
      const reviewers = pr.reviewRequests.map(({ login }) => login).join(", ");
      return yellow(`🍊 Waiting for review (${reviewers})`);
    }

    if (pr.mergeStateStatus !== "CLEAN") {
      return red(`❌ Not clean (${pr.mergeStateStatus})`);
    }

    if (
      pr.baseRefName !== "master" &&
      pr.baseRefName !== "staging" &&
      pr.baseRefName !== "develop"
    ) {
      return red("❌ Blocked by parent");
    }

    if (pr.reviewDecision === "APPROVED") {
      return green("🍏 Approved");
    }

    return red("Unknown");
  },
};
