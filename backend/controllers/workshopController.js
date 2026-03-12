const db = require('../config/db');

// Add a workshop (assuming colleague or admin can do this, but for now open it up or just keep it simple)
exports.createWorkshop = async (req, res) => {
    const { title, club, date, time, location, durationHours, capacity, level, topics } = req.body;
    try {
        const [result] = await db.query(
            `INSERT INTO workshops (title, club, date, time, location, durationHours, capacity, level, topics, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, club, date, time, location, durationHours, capacity, level, JSON.stringify(topics), req.user.id]
        );
        res.status(201).json({ message: 'Workshop created successfully', workshopId: result.insertId });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all workshops publicly accessible
exports.getAllWorkshops = async (req, res) => {
    try {
        const [workshops] = await db.query('SELECT * FROM workshops ORDER BY date ASC');
        // Parse topics cleanly
        const mapped = workshops.map(w => ({
            ...w,
            topics: typeof w.topics === 'string' ? JSON.parse(w.topics) : w.topics || []
        }));
        res.json(mapped);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error check database connection' });
    }
};
