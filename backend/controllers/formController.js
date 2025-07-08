const db = require('../db');

exports.saveForm = async (req, res) => {
  const { title, description, structure, status } = req.body;
  const userId = req.user.id; // from auth middleware

  if (!title || !structure) {
    return res.status(400).json({ msg: 'Title and structure are required' });
  }

  try {
    const newForm = await db.query(
      `INSERT INTO forms (user_id, title, description, structure, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, title, description, structure, status || 'draft']
    );

    res.status(201).json(newForm.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 