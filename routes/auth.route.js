const express = require('express');
const supabase = require('../config/supabase');
const requireAuth = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const supabaseAdmin = require('../config/supabaseAdmin');

const router = express.Router();

router.post('/register', async (req, res) => {
    
    const { email, password } = req.body;

    // 1. Create auth user (anon key is fine)
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    //2. Now create profile in 'users' table using service role key(bypasses RLS)
    const { error: profileError } = await supabaseAdmin
        .from('users')
        .insert({ id: data.user.id, //THIS must match auth.users.id 
            email: data.user.email,
         });
         if (profileError) {
        return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({ 
        message: "User registered successfully", 
        userId: data.user.id,
    })
     });


router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
        message: "User registered successfully", 
        user: data.user,
    });
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;

       const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    
    if (error) {
        return res.status(401).json({ error: error.message });
    }
    res.json({ 
        message: "Login successful",
        access_token: data.session.access_token, // Return refresh token for client to use
        user: {
            id: data.user.id,
            email: data.user.email,
        },
    });
});

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: "Protected route accessed",
         user: req.user, });
});

router.get("/pending", requireAuth, requireAdmin, async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

module.exports = router; 