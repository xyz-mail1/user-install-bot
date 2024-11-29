const createCommand = require("../../src/helpers/createCommand");

module.exports = createCommand(
  "poke",
  "poke someone",
  "the person to poke",
  "pokes",
  "https://purrbot.site/api/img/sfw/poke/gif",
  "pokes"
);
