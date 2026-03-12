const db = require('../config/firebase');

/* CREATE WORKSHOP */
exports.createWorkshop = async (req, res) => {
    const { title, description, club, date, time, location, durationHours, capacity, level, topics } = req.body;

    if (!title || !club || !date || !time || !location || !durationHours || !capacity || !level) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (capacity < 1 || durationHours < 1) {
        return res.status(400).json({ message: 'Capacity and duration must be positive numbers' });
    }

    try {
        const workshopDoc = await db.collection('workshops').add({
            title,
            description: description || '',
            club,
            date,
            time,
            location,
            durationHours: parseInt(durationHours),
            capacity: parseInt(capacity),
            registered: 0,
            level,
            topics: topics || [],
            created_by: req.user.id,
            created_at: new Date().toISOString()
        });

        res.status(201).json({ message: 'Workshop created successfully', workshopId: workshopDoc.id });
    } catch (err) {
        console.error('Create workshop error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* GET ALL WORKSHOPS */
exports.getAllWorkshops = async (req, res) => {
    try {
        const snapshot = await db.collection('workshops').orderBy('date', 'asc').get();

        if (snapshot.empty) return res.json([]);

        const workshops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Collect unique organizer IDs and batch fetch in parallel
        const organizerIds = [...new Set(workshops.map(w => w.created_by).filter(Boolean))];
        const organizerMap = {};

        if (organizerIds.length > 0) {
            const userFetches = organizerIds.map(id => db.collection('users').doc(id).get());
            const userDocs = await Promise.all(userFetches);
            userDocs.forEach(doc => {
                if (doc.exists) organizerMap[doc.id] = doc.data().name;
            });
        }

        const result = workshops.map(w => ({
            ...w,
            organizer_name: organizerMap[w.created_by] || null
        }));

        res.json(result);
    } catch (err) {
        console.error('Get workshops error:', err.message);
        res.status(500).json({ message: 'Server error — check Firebase connection' });
    }
};

/* GET SINGLE WORKSHOP */
exports.getWorkshopById = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await db.collection('workshops').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Workshop not found' });
        }

        const data = doc.data();
        let organizer_name = null;

        if (data.created_by) {
            const userDoc = await db.collection('users').doc(data.created_by).get();
            if (userDoc.exists) organizer_name = userDoc.data().name;
        }

        res.json({ id: doc.id, ...data, organizer_name });
    } catch (err) {
        console.error('Get workshop error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* UPDATE WORKSHOP */
exports.updateWorkshop = async (req, res) => {
    const { id } = req.params;
    const { title, description, club, date, time, location, durationHours, capacity, level, topics } = req.body;

    try {
        const docRef = db.collection('workshops').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return res.status(404).json({ message: 'Workshop not found' });

        if (doc.data().created_by !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this workshop' });
        }

        // Only update fields that were actually provided
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description || '';
        if (club !== undefined) updates.club = club;
        if (date !== undefined) updates.date = date;
        if (time !== undefined) updates.time = time;
        if (location !== undefined) updates.location = location;
        if (durationHours !== undefined) updates.durationHours = parseInt(durationHours);
        if (capacity !== undefined) updates.capacity = parseInt(capacity);
        if (level !== undefined) updates.level = level;
        if (topics !== undefined) updates.topics = topics || [];

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        await docRef.update(updates);

        res.json({ message: 'Workshop updated successfully' });
    } catch (err) {
        console.error('Update workshop error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* DELETE WORKSHOP */
exports.deleteWorkshop = async (req, res) => {
    const { id } = req.params;
    try {
        const docRef = db.collection('workshops').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return res.status(404).json({ message: 'Workshop not found' });

        if (doc.data().created_by !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this workshop' });
        }

        const regsSnapshot = await db.collection('registrations')
            .where('workshop_id', '==', id)
            .get();

        // Commit in chunks of 499 to stay under 500 op batch limit
        const allRefs = regsSnapshot.docs.map(d => d.ref);
        const chunkSize = 499;

        for (let i = 0; i < allRefs.length; i += chunkSize) {
            const batch = db.batch();
            allRefs.slice(i, i + chunkSize).forEach(ref => batch.delete(ref));
            await batch.commit();
        }

        // Delete workshop in its own batch
        await docRef.delete();

        res.json({ message: 'Workshop deleted successfully' });
    } catch (err) {
        console.error('Delete workshop error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* GET WORKSHOP REGISTRANTS (organizer only) */
exports.getWorkshopRegistrants = async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await db.collection('workshops').doc(id).get();
        if (!doc.exists) return res.status(404).json({ message: 'Workshop not found' });

        if (doc.data().created_by !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view registrants' });
        }

        const regsSnapshot = await db.collection('registrations')
            .where('workshop_id', '==', id)
            .get();

        if (regsSnapshot.empty) return res.json([]);

        const regsData = regsSnapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Batch fetch all attendee user docs in parallel
        const userIds = [...new Set(regsData.map(r => r.user_id).filter(Boolean))];
        const userMap = {};

        if (userIds.length > 0) {
            const userFetches = userIds.map(uid => db.collection('users').doc(uid).get());
            const userDocs = await Promise.all(userFetches);
            userDocs.forEach(userDoc => {
                if (userDoc.exists) userMap[userDoc.id] = userDoc.data();
            });
        }

        const registrants = regsData.map(reg => {
            const user = userMap[reg.user_id] || {};
            return {
                id: reg.id,
                dept: reg.dept,
                year: reg.year,
                notes: reg.notes,
                created_at: reg.created_at,
                attendeeName: user.name || 'Unknown',
                attendeeEmail: user.email || ''
            };
        });

        res.json(registrants);
    } catch (err) {
        console.error('Get registrants error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* GET STATS (admin dashboard) */
exports.getStats = async (req, res) => {
    try {
        const [workshopsSnapshot, usersSnapshot, regsSnapshot] = await Promise.all([
            db.collection('workshops').get(),
            db.collection('users').get(),
            db.collection('registrations').get()
        ]);

        const today = new Date().toISOString().split('T')[0];
        let upcomingCount = 0;
        workshopsSnapshot.forEach(doc => {
            if (doc.data().date >= today) upcomingCount++;
        });

        res.json({
            totalWorkshops: workshopsSnapshot.size,
            totalUsers: usersSnapshot.size,
            totalRegistrations: regsSnapshot.size,
            upcomingWorkshops: upcomingCount
        });
    } catch (err) {
        console.error('Get stats error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};