const createCommand = require("../../src/helpers/createCommand");

module.exports = createCommand(
  "cuddle",
  "cuddle someone",
  "the person to cuddle",
  "cuddles",
  "https://purrbot.site/api/img/sfw/cuddle/gif",
  "cuddled"
);
