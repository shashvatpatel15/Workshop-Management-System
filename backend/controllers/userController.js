const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle optional password change
        let hashedPassword = users[0].password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        await db.query(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, hashedPassword, req.user.id]
        );

        res.json({ message: 'Profile updated successfully', user: { id: req.user.id, name, email, role: users[0].role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.user.id]);
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
