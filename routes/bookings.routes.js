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

  const { data: existing } = await supabase
    .from("bookings")
    .select("*")
    .eq("date", date)
    .eq("time_slot", time_slot)
    .single();

  if (existing) {
    return res.status(409).json({ error: "Time slot already booked." 

    });
  }

  const { data, error } = await supabase    
    .from("bookings")
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

// Update booking
router.put("/:id", requireAuth, async (req, res) => {
  const { date, time_slot } = req.body;
  const bookingId = req.params.id;

  const { data, error } = await supabase
    .from("bookings")
    .update({ date, time_slot })
    .eq("id", bookingId)
    .eq("user_id", req.user.id) // RLS ensures user can only update their own bookings
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data.length) {
    return res.status(403).json({ error: "Not allowed to update this booking." });
  }

  res.json(data);

});

// Delete booking
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("user_id", req.user.id) // RLS ensures user can only delete their own bookings
    .single();

    if (fetchError || !booking) {
    return res.status(404).json({ error: "Booking not  authorized." }); 
  }

  //Delete the booking
  const { error: deleteError } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id);

  if (deleteError) {
    return res.status(404).json({ error: deleteError.message });
  }

  res.json({ message: "Booking deleted successfully." });
});




module.exports = router;