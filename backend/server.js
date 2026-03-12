require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const userRoutes = require('./routes/userRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/users', userRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('Workshop Management System API is running...');
});

// Error handling fallback
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke inside the backend!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
