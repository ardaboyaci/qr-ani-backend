const { supabase } = require('../supabaseClient');

// Helper function to generate a unique slug
const generateSlug = (title) => {
  const slug = title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomSuffix}`;
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public (later we'll add authentication)
const getAllEvents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: error.message
    });
  }
};

// @desc    Get single event by slug
// @route   GET /api/events/:slug
// @access  Public
const getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
      message: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (photographer only - we'll add auth later)
const createEvent = async (req, res) => {
  try {
    const { title, date, theme, cover_url } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    // Generate unique slug
    const slug = generateSlug(title);

    // Create event in database
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          slug,
          date: date || new Date().toISOString().split('T')[0],
          theme: theme || 'classic',
          cover_url: cover_url || null
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Generate QR code URL (we'll implement actual QR generation later)
    const qrCodeUrl = `${req.protocol}://${req.get('host')}/upload/${slug}`;

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: {
        ...data,
        qr_code_url: qrCodeUrl,
        upload_url: qrCodeUrl
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event',
      message: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:slug
// @access  Private (photographer only)
const updateEvent = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, date, theme, cover_url } = req.body;

    // Build update object (only include provided fields)
    const updates = {};
    if (title) updates.title = title;
    if (date) updates.date = date;
    if (theme) updates.theme = theme;
    if (cover_url !== undefined) updates.cover_url = cover_url;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
      message: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:slug
// @access  Private (photographer only)
const deleteEvent = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
      data: data
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      message: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent
}; 