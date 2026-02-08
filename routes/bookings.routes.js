const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth.middleware");
const supabase = require("../config/supabase");

// GET user's bookings
router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", req.user.id); // RLS already applies

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST create a new booking
router.post("/", requireAuth, async (req, res) => {
  const { date, time_slot } = req.body;
  const { data, error } = await supabase    .from("bookings")
    .insert([
        { 
            user_id: req.user.id,
             date, 
             time_slot, 
            },
        ]);
        if (error ) return res.status(400).json({ error: error.message });
        res.status(201).json(data);
});

module.exports = router;