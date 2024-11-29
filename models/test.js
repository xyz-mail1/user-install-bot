const { Schema, model } = require("mongoose");

let counter = new Schema({
  type: String, // name of command for counter
  senderID: String,
  recieverID: String,
  count: { type: Number, default: 0 },
});

module.exports = (name) => {
  return model(name, counter); // Dynamically create the model with the name
};
