import { supabase } from '../config/supabaseClient.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token menggunakan Supabase Auth
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Lampirkan data pengguna ke request
    req.user = user;
    next();
  } catch (error) {
    console.error('Server auth error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};