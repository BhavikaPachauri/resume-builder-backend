const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  employerId: { type: String, required: true },
  candidateId: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shortlist', shortlistSchema); 