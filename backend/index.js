const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Kivi-HR Backend is running!');
});

// Use Auth Routes
app.use('/api/auth', require('./routes/auth'));

// Use User Routes
app.use('/api/user', require('./routes/user'));

// Use Forms Routes
app.use('/api/forms', require('./routes/forms'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 