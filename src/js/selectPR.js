const execSync = require("child_process").execSync;
const { green, grey } = require("./colors");
const { prStatus } = require("./prStatus");

const pullRequests = JSON.parse(process.argv[2]);
const cmd = process.argv[3];

const cliSelect = require("cli-select");

cliSelect({
  values: pullRequests,
  valueRenderer: (pr, selected) =>
    `${selected ? green(pr.title) : pr.title} ${prStatus(pr)}`,
  selected: "◉",
  unselected: "◌",
})
  .then(({ value }) => {
    execSync(cmd.replace("\\1", value.headRefName));
  })
  .catch(console.error);
