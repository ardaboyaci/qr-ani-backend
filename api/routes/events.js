const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// @route   GET /api/events
router.get('/', getAllEvents);

// @route   POST /api/events
router.post('/', createEvent);

// @route   GET /api/events/:slug
router.get('/:slug', getEventBySlug);

// @route   PUT /api/events/:slug
router.put('/:slug', updateEvent);

// @route   DELETE /api/events/:slug
router.delete('/:slug', deleteEvent);

module.exports = router;