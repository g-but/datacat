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

exports.getForms = async (req, res) => {
  const userId = req.user.id;

  try {
    const forms = await db.query('SELECT * FROM forms WHERE user_id = $1 ORDER BY updated_at DESC', [userId]);
    res.json(forms.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteForm = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const form = await db.query('SELECT * FROM forms WHERE id = $1', [id]);

    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }

    if (form.rows[0].user_id.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await db.query('DELETE FROM forms WHERE id = $1', [id]);

    res.json({ msg: 'Form removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateForm = async (req, res) => {
  const { id } = req.params;
  const { title, description, structure, status } = req.body;
  const userId = req.user.id;

  try {
    const form = await db.query('SELECT * FROM forms WHERE id = $1', [id]);

    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }

    if (form.rows[0].user_id.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedForm = await db.query(
      `UPDATE forms
       SET title = $1, description = $2, structure = $3, status = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, structure, status, id, userId]
    );

    res.json(updatedForm.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateFormStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!status || !['draft', 'published', 'archived'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status provided' });
  }

  try {
    const form = await db.query('SELECT user_id FROM forms WHERE id = $1', [id]);

    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }

    if (form.rows[0].user_id.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const updatedForm = await db.query(
      `UPDATE forms SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status`,
      [status, id]
    );

    res.json(updatedForm.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPublicForm = async (req, res) => {
  const { id } = req.params;

  try {
    const form = await db.query(
      "SELECT id, title, description, structure FROM forms WHERE id = $1 AND status = 'published'",
      [id]
    );

    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Published form not found' });
    }

    res.json(form.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 