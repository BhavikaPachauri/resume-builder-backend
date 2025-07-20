const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  location: String,
  skills: [String],
  availability: { type: String, enum: ['immediate', '15days', '30days'] },
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  experience: Number,
  resumeUrl: String,
  resumeText: String,
  resumeKeywords: [String],
  skillScore: Number,
  isJobReady: Boolean,
  updatedAt: { type: Date, default: Date.now }
});

// Compound index (only one array field allowed)
candidateSchema.index({ skills: 1, location: 1, skillScore: -1, availability: 1 });

module.exports = mongoose.model('CandidateProfile', candidateSchema); 