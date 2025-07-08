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

    // Fetch submissions for the form
    const submissions = await db.query(
      'SELECT id, data, submitted_at FROM submissions WHERE form_id = $1 ORDER BY submitted_at DESC', 
      [form_id]
    );

    res.json(submissions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 