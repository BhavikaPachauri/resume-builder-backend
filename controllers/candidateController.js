const Candidate = require('../models/CandidateProfile');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const stopwords = new Set(['the','and','is','in','at','of','a','to','for','with','on','by','an','be','as','are','from','that','this','it','or','was','but','not','have','has','had','will','would','can','could','should','may','might','do','does','did','so','if','than','then','which','who','whom','whose','what','when','where','why','how']);

function extractKeywords(text) {
  if (!text) return [];
  const tokens = tokenizer.tokenize(text.toLowerCase());
  const stemmed = tokens.map(t => natural.PorterStemmer.stem(t));
  return Array.from(new Set(
    stemmed.filter(word => word && !stopwords.has(word))
  ));
}

exports.createCandidate = async (req, res) => {
  try {
    const { resumeText, ...rest } = req.body;
    const resumeKeywords = extractKeywords(resumeText);
    const candidate = await Candidate.create({ ...rest, resumeText, resumeKeywords });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: 'Candidate creation failed', details: err.message });
  }
};

exports.searchCandidates = async (req, res) => {
  try {
    const { skills, location, minScore, course, availability, jdKeywords, jdText } = req.query;
    const filter = {};
    if (skills) filter.skills = { $in: skills.split(',') };
    if (location) filter.location = location;
    if (minScore) filter.skillScore = { $gte: parseInt(minScore) };
    if (course) filter.completedCourses = course;
    if (availability) filter.availability = availability;
    // Extract JD keywords using NLP
    let jdKeywordsArr = [];
    if (jdText) {
      jdKeywordsArr = extractKeywords(jdText);
    } else if (jdKeywords) {
      jdKeywordsArr = extractKeywords(jdKeywords);
    }
    // For skill fit calculation
    let jdSkillsArr = [];
    if (skills) {
      jdSkillsArr = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    }
    const candidates = await Candidate.find(filter).sort({ skillScore: -1 });
    // Calculate fit percentage for each candidate
    const results = candidates.map(candidate => {
      let skillFit = 0;
      let keywordFit = 0;
      let fitPercent = 0;
      // Skill fit: overlap between candidate.skills and jdSkillsArr
      if (jdSkillsArr.length && candidate.skills && candidate.skills.length) {
        const matchCount = candidate.skills.map(s => s.toLowerCase()).filter(s => jdSkillsArr.includes(s)).length;
        skillFit = matchCount / jdSkillsArr.length;
      }
      // Keyword fit: overlap between candidate.resumeKeywords and jdKeywordsArr
      if (jdKeywordsArr.length && candidate.resumeKeywords && candidate.resumeKeywords.length) {
        const matchCount = candidate.resumeKeywords.filter(k => jdKeywordsArr.includes(k)).length;
        keywordFit = matchCount / jdKeywordsArr.length;
      }
      // Weighted fit: 60% skill, 40% keyword
      fitPercent = Math.round((skillFit * 0.6 + keywordFit * 0.4) * 100);
      return {
        ...candidate.toObject(),
        fitPercent
      };
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
};

exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', details: err.message });
  }
};

exports.exportCandidatesCSV = async (req, res) => {
  try {
    // Reuse search logic
    req.query.limit = 1000; // limit export size
    const { skills, location, minScore, course, availability, jdKeywords, jdText } = req.query;
    const filter = {};
    if (skills) filter.skills = { $in: skills.split(',') };
    if (location) filter.location = location;
    if (minScore) filter.skillScore = { $gte: parseInt(minScore) };
    if (course) filter.completedCourses = course;
    if (availability) filter.availability = availability;
    const candidates = await Candidate.find(filter).sort({ skillScore: -1 }).limit(1000);
    const fields = ['userId','name','email','phone','location','skills','availability','completedCourses','experience','resumeUrl','skillScore','isJobReady','updatedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(candidates.map(c => c.toObject()));
    res.header('Content-Type', 'text/csv');
    res.attachment('candidates.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'CSV export failed', details: err.message });
  }
};

exports.exportCandidatesPDF = async (req, res) => {
  try {
    // Reuse search logic
    req.query.limit = 1000;
    const { skills, location, minScore, course, availability, jdKeywords, jdText } = req.query;
    const filter = {};
    if (skills) filter.skills = { $in: skills.split(',') };
    if (location) filter.location = location;
    if (minScore) filter.skillScore = { $gte: parseInt(minScore) };
    if (course) filter.completedCourses = course;
    if (availability) filter.availability = availability;
    const candidates = await Candidate.find(filter).sort({ skillScore: -1 }).limit(1000);
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=candidates.pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Candidate Export', { underline: true });
    doc.moveDown();
    candidates.forEach((c, i) => {
      doc.fontSize(12).text(`${i+1}. ${c.name} (${c.email})`);
      doc.text(`Location: ${c.location}, Skills: ${c.skills.join(', ')}`);
      doc.text(`Availability: ${c.availability}, Experience: ${c.experience}, SkillScore: ${c.skillScore}`);
      doc.text(`Job Ready: ${c.isJobReady ? 'Yes' : 'No'}`);
      doc.text('---');
    });
    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'PDF export failed', details: err.message });
  }
}; 