const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
})
module.exports = mongoose.model("Organizer", organizerSchema);