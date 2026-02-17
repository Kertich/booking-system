const supabase = require('../config/supabase');

const requireAuth = async (req, res, next) => {
try {
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

    const token = authHeader.split(' ')[1];
    
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    //Get role from profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    req.user = {
        id: data.user.id,
        email: data.user.email,
        role: profile ? profile.role : 'user', // default to 'user' if no profile found
    };

    next();
} catch (err) {
    res.status(500).json({ error: "Server error" });
}

};

module.exports = requireAuth;