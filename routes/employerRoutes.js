const express = require('express');
const {
  register,
  login,
  saveSearch,
  getSavedSearches,
  addToShortlist,
  getShortlist,
  exportShortlistCSV,
  exportShortlistPDF,
  scheduleInterview,
  getInterviews,
  bulkMessageShortlisted
} = require('../controllers/employerController');
const auth = require('../middleware/auth');
const verifiedEmployer = require('../middleware/verifiedEmployer');
const router = express.Router();

/**
 * @swagger
 * /api/employer/shortlist/export/csv:
 *   get:
 *     summary: Export employer's shortlist as CSV
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 */
/**
 * @swagger
 * /api/employer/shortlist/export/pdf:
 *   get:
 *     summary: Export employer's shortlist as PDF
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file
 */
/**
 * @swagger
 * /api/employer/interview:
 *   post:
 *     summary: Schedule an interview with a candidate
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidateId:
 *                 type: string
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               mode:
 *                 type: string
 *                 enum: [online, offline]
 *               location:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Interview scheduled
 */
/**
 * @swagger
 * /api/employer/interviews:
 *   get:
 *     summary: Get all scheduled interviews for employer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of interviews
 */
/**
 * @swagger
 * /api/employer/shortlist/bulk-message:
 *   post:
 *     summary: Send a bulk message to all shortlisted candidates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bulk message sent
 */
router.post('/register', register);
router.post('/login', login);
router.post('/search/save', auth, verifiedEmployer, saveSearch);
router.get('/search/saved', auth, verifiedEmployer, getSavedSearches);
router.post('/shortlist', auth, verifiedEmployer, addToShortlist);
router.get('/shortlist', auth, verifiedEmployer, getShortlist);
router.get('/shortlist/export/csv', auth, verifiedEmployer, exportShortlistCSV);
router.get('/shortlist/export/pdf', auth, verifiedEmployer, exportShortlistPDF);
router.post('/interview', auth, verifiedEmployer, scheduleInterview);
router.get('/interviews', auth, verifiedEmployer, getInterviews);
router.post('/shortlist/bulk-message', auth, verifiedEmployer, bulkMessageShortlisted);

module.exports = router; 