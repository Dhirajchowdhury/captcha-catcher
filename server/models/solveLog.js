const mongoose = require('mongoose')

const solveLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'math', 'grid'],
    required: true
  },
  website: {
    type: String,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number,
  },
  answer: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('SolveLog', solveLogSchema)