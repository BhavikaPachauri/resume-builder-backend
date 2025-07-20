const SavedSearch = require('../models/SavedSearch');
const Shortlist = require('../models/Shortlist');
const Employer = require('../models/Employer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Interview = require('../models/Interview');
const Candidate = require('../models/CandidateProfile');

exports.register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const existing = await Employer.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Employer already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const employer = await Employer.create({ email, name, password: hashed });
    res.status(201).json({ message: 'Registered', employer: { email, name, verified: employer.verified } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employer = await Employer.findOne({ email });
    if (!employer) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, employer.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, employer: { email: employer.email, name: employer.name, verified: employer.verified } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.saveSearch = async (req, res) => {
  try {
    const { filters, label } = req.body;
    await SavedSearch.create({ employerId: req.user._id, filters, label });
    res.json({ message: 'Search saved' });
  } catch (err) {
    res.status(500).json({ error: 'Save search failed', details: err.message });
  }
};

exports.getSavedSearches = async (req, res) => {
  try {
    const saved = await SavedSearch.find({ employerId: req.user._id });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Fetch saved searches failed', details: err.message });
  }
};

exports.addToShortlist = async (req, res) => {
  try {
    const { candidateId } = req.body;
    await Shortlist.create({ employerId: req.user._id, candidateId });
    res.json({ message: 'Candidate shortlisted' });
  } catch (err) {
    res.status(500).json({ error: 'Shortlist failed', details: err.message });
  }
};

exports.getShortlist = async (req, res) => {
  try {
    const list = await Shortlist.find({ employerId: req.user._id });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Fetch shortlist failed', details: err.message });
  }
};

exports.exportShortlistCSV = async (req, res) => {
  try {
    const list = await Shortlist.find({ employerId: req.user._id });
    const fields = ['employerId', 'candidateId', 'addedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(list.map(l => l.toObject()));
    res.header('Content-Type', 'text/csv');
    res.attachment('shortlist.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Shortlist CSV export failed', details: err.message });
  }
};

exports.exportShortlistPDF = async (req, res) => {
  try {
    const list = await Shortlist.find({ employerId: req.user._id });
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=shortlist.pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Shortlisted Candidates', { underline: true });
    doc.moveDown();
    list.forEach((l, i) => {
      doc.fontSize(12).text(`${i+1}. Candidate ID: ${l.candidateId}`);
      doc.text(`Added At: ${l.addedAt}`);
      doc.text('---');
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Shortlist PDF export failed', details: err.message });
  }
};

exports.scheduleInterview = async (req, res) => {
  try {
    const { candidateId, scheduledAt, mode, location, notes } = req.body;
    const interview = await Interview.create({
      employerId: req.user._id,
      candidateId,
      scheduledAt,
      mode,
      location,
      notes
    });
    res.status(201).json({ message: 'Interview scheduled', interview });
  } catch (err) {
    res.status(500).json({ error: 'Schedule interview failed', details: err.message });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ employerId: req.user._id });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: 'Fetch interviews failed', details: err.message });
  }
};

exports.bulkMessageShortlisted = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const shortlist = await Shortlist.find({ employerId: req.user._id });
    const candidateIds = shortlist.map(s => s.candidateId);
    const candidates = await Candidate.find({ userId: { $in: candidateIds } });
    // Simulate sending message (e.g., by email or notification)
    candidates.forEach(c => {
      console.log(`Message to ${c.email || c.name}: ${message}`);
    });
    res.json({ message: `Bulk message sent to ${candidates.length} shortlisted candidates.` });
  } catch (err) {
    res.status(500).json({ error: 'Bulk message failed', details: err.message });
  }
}; 