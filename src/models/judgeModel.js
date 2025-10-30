const mongoose = require("mongoose");

const judgeSchema = new mongoose.Schema({
  judgeId: { type: String, required: true, unique: true }, // unique Judge ID
  name: { type: String, required: true },
  court: String,
  experience: Number,
  contact: String,
});

module.exports = mongoose.model("Judge", judgeSchema);
