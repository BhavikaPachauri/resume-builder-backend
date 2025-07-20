const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
  employerId: { type: String, required: true },
  filters: { type: Object, required: true },
  label: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedSearch', savedSearchSchema); 