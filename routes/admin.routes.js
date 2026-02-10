const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');
const supabase = require('../config/supabaseAdmin');

// GET all bookings (admin only)
router.get('/bookings', requireAuth, requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// Update booking status
router.put('/bookings/:id/status', requireAuth, requireAdmin, async (req, res) => {
    const { status } = req.body;

    const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', req.params.id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// Analytics endpoint 
router.get('/analytics', requireAuth, requireAdmin, async (req, res) => {
    const { data, error } = await supabase.rpc("booking_stats")

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router;
