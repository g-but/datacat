const db = require('../db');

exports.createSubmission = async (req, res) => {
  const { form_id, data } = req.body;

  if (!form_id || !data) {
    return res.status(400).json({ msg: 'Form ID and data are required' });
  }

  try {
    // First, find the owner of the form
    const form = await db.query('SELECT user_id FROM forms WHERE id = $1', [form_id]);
    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }
    const userId = form.rows[0].user_id;

    // Now, create the submission
    const newSubmission = await db.query(
      `INSERT INTO submissions (form_id, user_id, data)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [form_id, userId, data]
    );

    res.status(201).json({ 
      msg: 'Submission received successfully', 
      submissionId: newSubmission.rows[0].id 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 

exports.getFormSubmissions = async (req, res) => {
  const { form_id } = req.params;
  const { search, startDate, endDate } = req.query; // Get filter query params
  const userId = req.user.id;

  try {
    // First, verify the user owns the form
    const form = await db.query('SELECT user_id FROM forms WHERE id = $1', [form_id]);
    if (form.rows.length === 0) {
      return res.status(404).json({ msg: 'Form not found' });
    }
    if (form.rows[0].user_id.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorized to view these submissions' });
    }

    let query = 'SELECT id, data, submitted_at FROM submissions WHERE form_id = $1';
    const params = [form_id];
    let paramIndex = 2;

    if (search) {
      // This is a simple text search across the JSONB data column.
      // It's not the most performant for very large datasets, but great for a start.
      // For performance, a dedicated search index (like GIN) on the `data` column would be needed.
      query += ` AND data::text ILIKE $${paramIndex++}`;
      params.push(`%${search}%`);
    }

    if (startDate) {
      query += ` AND submitted_at >= $${paramIndex++}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND submitted_at <= $${paramIndex++}`;
      params.push(endDate);
    }

    query += ' ORDER BY submitted_at DESC';

    const submissions = await db.query(query, params);

    res.json(submissions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 