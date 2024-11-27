const { Schema, model } = require("mongoose");

let counter = new Schema({
  type: String, //name of command for counter
  userID: String,
  count: { type: Number, default: 0 },
});

module.exports = model("counter0", counter);
