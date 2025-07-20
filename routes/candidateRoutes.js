const express = require('express');
const { createCandidate, searchCandidates, getCandidate, exportCandidatesCSV, exportCandidatesPDF } = require('../controllers/candidateController');
const auth = require('../middleware/auth');
const verifiedEmployer = require('../middleware/verifiedEmployer');
const router = express.Router();

/**
 * @swagger
 * /api/candidates/export/csv:
 *   get:
 *     summary: Export candidate search results as CSV
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 */
/**
 * @swagger
 * /api/candidates/export/pdf:
 *   get:
 *     summary: Export candidate search results as PDF
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file
 */
router.post('/', createCandidate);
router.get('/search', auth, verifiedEmployer, searchCandidates);
router.get('/:id', auth, verifiedEmployer, getCandidate);
router.get('/export/csv', auth, verifiedEmployer, exportCandidatesCSV);
router.get('/export/pdf', auth, verifiedEmployer, exportCandidatesPDF);

module.exports = router; 