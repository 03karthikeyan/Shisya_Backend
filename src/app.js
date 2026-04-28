const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ ADD THIS


const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
    : true;

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct route separation
app.use('/matrimony/api/auth', require('./routes/authRoutes'));
app.use('/matrimony/api', require('./routes/appRoutes'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err);

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload: please send valid JSON'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

module.exports = app;