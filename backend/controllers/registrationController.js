const db = require('../config/db');

exports.registerForWorkshop = async (req, res) => {
    const { workshopId, dept, year, notes } = req.body;
    try {
        // Check if already registered
        const [existing] = await db.query('SELECT * FROM registrations WHERE workshop_id = ? AND user_id = ?', [workshopId, req.user.id]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'You have already registered for this workshop' });
        }

        // Check capacity
        const [workshops] = await db.query('SELECT capacity, registered FROM workshops WHERE id = ?', [workshopId]);
        if (workshops.length === 0) return res.status(404).json({ message: 'Workshop not found' });

        const workshop = workshops[0];
        if (workshop.registered >= workshop.capacity) {
            return res.status(400).json({ message: 'Workshop is at full capacity' });
        }

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'INSERT INTO registrations (workshop_id, user_id, dept, year, notes) VALUES (?, ?, ?, ?, ?)',
                [workshopId, req.user.id, dept, year, notes]
            );

            await connection.query(
                'UPDATE workshops SET registered = registered + 1 WHERE id = ?',
                [workshopId]
            );

            await connection.commit();
            res.status(201).json({ message: 'Successfully registered for workshop' });
        } catch (txnErr) {
            await connection.rollback();
            throw txnErr;
        } finally {
            connection.release();
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyRegistrations = async (req, res) => {
    try {
        const [registrations] = await db.query(`
            SELECT r.id as registration_id, r.dept, r.year, r.notes, r.created_at, 
                   w.id as workshop_id, w.title as workshopTitle, w.club, w.date, w.location,
                   u.name as attendeeName, u.email as attendeeEmail
            FROM registrations r
            JOIN workshops w ON r.workshop_id = w.id
            JOIN users u ON r.user_id = u.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `, [req.user.id]);

        res.json(registrations);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deregisterFromWorkshop = async (req, res) => {
    const { workshopId } = req.params;
    try {
        const [existing] = await db.query('SELECT * FROM registrations WHERE workshop_id = ? AND user_id = ?', [workshopId, req.user.id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'DELETE FROM registrations WHERE workshop_id = ? AND user_id = ?',
                [workshopId, req.user.id]
            );

            await connection.query(
                'UPDATE workshops SET registered = GREATEST(0, registered - 1) WHERE id = ?',
                [workshopId]
            );

            await connection.commit();
            res.status(200).json({ message: 'Successfully deregistered from workshop' });
        } catch (txnErr) {
            await connection.rollback();
            throw txnErr;
        } finally {
            connection.release();
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
