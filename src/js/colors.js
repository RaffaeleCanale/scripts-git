module.exports = {
  cyan(s) {
    return `\x1b[36m${s}\x1b[0m`;
  },

  green(s) {
    return `\x1b[32m${s}\x1b[0m`;
  },

  yellow(s) {
    return `\x1b[33m${s}\x1b[0m`;
  },

  red(s) {
    return `\x1b[31m${s}\x1b[0m`;
  },

  grey(s) {
    return `\x1b[90m${s}\x1b[0m`;
  },
};
