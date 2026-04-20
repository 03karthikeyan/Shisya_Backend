const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct route separation
app.use('/matrimony/api/auth', require('./routes/authRoutes'));
app.use('/matrimony/api', require('./routes/appRoutes'));

module.exports = app;