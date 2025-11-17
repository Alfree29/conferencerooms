const express = require('express');
const cors = require('cors');
const path = require('path');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});