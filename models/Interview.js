const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  employerId: { type: String, required: true },
  candidateId: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  mode: { type: String, enum: ['online', 'offline'], default: 'online' },
  location: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema); 