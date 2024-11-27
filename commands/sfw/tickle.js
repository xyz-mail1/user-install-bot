const createCommand = require("../../src/helpers/createCommand");

module.exports = createCommand(
  "tickle",
  "tickle someone",
  "the person to tickle",
  "tickles",
  "https://purrbot.site/api/img/sfw/tickle/gif",
  "tickled"
);
