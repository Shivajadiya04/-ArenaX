const mongoose = require("mongoose");

const savedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedContest", savedSchema);
