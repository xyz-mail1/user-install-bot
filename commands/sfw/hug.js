const createCommand = require("../../src/helpers/createCommand");

module.exports = createCommand(
  "hug",
  "hug someone",
  "the person to hug",
  "hugs",
  "https://purrbot.site/api/img/sfw/hug/gif",
  "hugs"
);
