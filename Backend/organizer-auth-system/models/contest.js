// models/Contest.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  correctAnswer: String,
  hint: String
});

const participantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  submittedAt: Date
});

const contestSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  timeLimit: Number,
  questions: [questionSchema],
  startTime: Date,
  endTime: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer'
},
    createdAt: {
    type: Date,
    default: Date.now
  },

  passcode: {
  type: String,
  required: true
},
participants: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  submittedAt: Date
}],
savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

   participants: [participantSchema], // ✅ Added this
  createdAt: {
    type: Date,
    default: Date.now
  }


});




module.exports = mongoose.model('Contest', contestSchema);
