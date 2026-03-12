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

exports.updateWorkshop = async (req, res) => {
    const { id } = req.params;
    const { title, club, date, time, location, durationHours, capacity, level, topics } = req.body;
    try {
        const [workshops] = await db.query('SELECT created_by FROM workshops WHERE id = ?', [id]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        if (workshops[0].created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this workshop' });
        }

        await db.query(
            `UPDATE workshops SET title = ?, club = ?, date = ?, time = ?, location = ?, durationHours = ?, capacity = ?, level = ?, topics = ? WHERE id = ?`,
            [title, club, date, time, location, durationHours, capacity, level, JSON.stringify(topics), id]
        );
        res.json({ message: 'Workshop updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteWorkshop = async (req, res) => {
    const { id } = req.params;
    try {
        const [workshops] = await db.query('SELECT created_by FROM workshops WHERE id = ?', [id]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        if (workshops[0].created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this workshop' });
        }

        await db.query('DELETE FROM workshops WHERE id = ?', [id]);
        res.json({ message: 'Workshop deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getWorkshopRegistrants = async (req, res) => {
    const { id } = req.params;
    try {
        const [workshops] = await db.query('SELECT created_by FROM workshops WHERE id = ?', [id]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        if (workshops[0].created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view registrants' });
        }

        const [registrants] = await db.query(`
            SELECT r.id, r.dept, r.year, r.notes, r.created_at, u.name as attendeeName, u.email as attendeeEmail
            FROM registrations r
            JOIN users u ON r.user_id = u.id
            WHERE r.workshop_id = ?
            ORDER BY r.created_at DESC
        `, [id]);

        res.json(registrants);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateWorkshop = async (req, res) => {
    const { id } = req.params;
    const { title, club, date, time, location, durationHours, capacity, level, topics } = req.body;
    try {
        const [workshops] = await db.query('SELECT created_by FROM workshops WHERE id = ?', [id]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        if (workshops[0].created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this workshop' });
        }

        await db.query(
            `UPDATE workshops SET title = ?, club = ?, date = ?, time = ?, location = ?, durationHours = ?, capacity = ?, level = ?, topics = ? WHERE id = ?`,
            [title, club, date, time, location, durationHours, capacity, level, JSON.stringify(topics), id]
        );
        res.json({ message: 'Workshop updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteWorkshop = async (req, res) => {
    const { id } = req.params;
    try {
        const [workshops] = await db.query('SELECT created_by FROM workshops WHERE id = ?', [id]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        if (workshops[0].created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this workshop' });
        }

        await db.query('DELETE FROM workshops WHERE id = ?', [id]);
        res.json({ message: 'Workshop deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getWorkshopRegistrants = async (req, res) => {
    const { id } = req.params;
    try {
        const [workshops] = await db.query('SELECT created_by FROM workshops WHERE id = ?', [id]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        if (workshops[0].created_by !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view registrants' });
        }

        const [registrants] = await db.query(`
            SELECT r.id, r.dept, r.year, r.notes, r.created_at, u.name, u.email
            FROM registrations r
            JOIN users u ON r.user_id = u.id
            WHERE r.workshop_id = ?
            ORDER BY r.created_at DESC
        `, [id]);

        res.json(registrants);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
