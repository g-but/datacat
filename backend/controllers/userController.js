const db = require('../db');

exports.getMe = async (req, res) => {
  try {
    // req.user is attached by the auth middleware
    const user = await db.query('SELECT id, email, created_at FROM users WHERE id = $1', [req.user.id]);

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 