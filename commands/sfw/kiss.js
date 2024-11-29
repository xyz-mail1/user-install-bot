const createCommand = require("../../src/helpers/createCommand");

module.exports = createCommand(
  "kiss",
  "kiss someone",
  "the person to kiss",
  "kisses",
  "https://purrbot.site/api/img/sfw/kiss/gif",
  "kisses"
);
