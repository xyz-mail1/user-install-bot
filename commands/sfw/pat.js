const createCommand = require("../../src/helpers/createCommand");

module.exports = createCommand(
  "pat",
  "pat someone",
  "the person to pat",
  "pats",
  "https://purrbot.site/api/img/sfw/pat/gif",
  "patted"
);
