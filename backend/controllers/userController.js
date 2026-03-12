const db = require('../config/firebase');
const bcrypt = require('bcryptjs');

/* GET PROFILE */
exports.getProfile = async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.id).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userDoc.data();
        res.json({
            id: userDoc.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        });
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* UPDATE PROFILE */
exports.updateProfile = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userRef = db.collection('users').doc(req.user.id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updates = {};
        if (name) updates.name = name;

        if (email) {
            const normalizedEmail = email.toLowerCase().trim();
            const existing = await db.collection('users').where('email', '==', normalizedEmail).get();
            const otherUser = existing.docs.find(doc => doc.id !== req.user.id);
            if (otherUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            updates.email = normalizedEmail;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        await userRef.update(updates);

        const updatedDoc = await userRef.get();
        const updatedUser = updatedDoc.data();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedDoc.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* DELETE PROFILE */
exports.deleteProfile = async (req, res) => {
    try {
        const regsSnapshot = await db.collection('registrations')
            .where('user_id', '==', req.user.id)
            .get();

        // Fetch all workshop docs in parallel instead of sequentially
        const workshopFetches = regsSnapshot.docs
            .map(reg => reg.data().workshop_id)
            .filter(Boolean)
            .map(id => db.collection('workshops').doc(id).get());

        const workshopDocs = await Promise.all(workshopFetches);

        // Build workshop map for quick lookup
        const workshopMap = {};
        workshopDocs.forEach(doc => {
            if (doc.exists) workshopMap[doc.id] = doc;
        });

        // Firestore batch max is 500 ops — chunk if needed
        const allOps = [];

        regsSnapshot.docs.forEach(regDoc => {
            allOps.push({ type: 'delete', ref: regDoc.ref });
            const workshopId = regDoc.data().workshop_id;
            if (workshopId && workshopMap[workshopId]) {
                const wDoc = workshopMap[workshopId];
                const currentCount = wDoc.data().registered || 0;
                allOps.push({
                    type: 'update',
                    ref: wDoc.ref,
                    data: { registered: Math.max(0, currentCount - 1) }
                });
            }
        });

        // Add user deletion as last op
        allOps.push({ type: 'delete', ref: db.collection('users').doc(req.user.id) });

        // Commit in chunks of 500
        const chunkSize = 500;
        for (let i = 0; i < allOps.length; i += chunkSize) {
            const batch = db.batch();
            const chunk = allOps.slice(i, i + chunkSize);
            chunk.forEach(op => {
                if (op.type === 'delete') batch.delete(op.ref);
                else batch.update(op.ref, op.data);
            });
            await batch.commit();
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Delete profile error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};