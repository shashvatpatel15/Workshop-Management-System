const db = require('../config/firebase');

/* REGISTER FOR WORKSHOP */
exports.registerForWorkshop = async (req, res) => {
    const { workshopId, dept, year, notes } = req.body;

    if (!workshopId) {
        return res.status(400).json({ message: 'Workshop ID is required' });
    }

    try {
        const workshopRef = db.collection('workshops').doc(workshopId);
        const registrationsRef = db.collection('registrations');

        // Check if already registered
        const existingSnapshot = await registrationsRef
            .where('workshop_id', '==', workshopId)
            .where('user_id', '==', req.user.id)
            .get();

        if (!existingSnapshot.empty) {
            return res.status(400).json({ message: 'You have already registered for this workshop' });
        }

        // Use transaction to safely check capacity and increment count atomically
        await db.runTransaction(async (transaction) => {
            const workshopDoc = await transaction.get(workshopRef);

            if (!workshopDoc.exists) {
                throw { status: 404, message: 'Workshop not found' };
            }

            const workshop = workshopDoc.data();
            if ((workshop.registered || 0) >= workshop.capacity) {
                throw { status: 400, message: 'Workshop is at full capacity' };
            }

            const newRegRef = registrationsRef.doc();
            transaction.set(newRegRef, {
                workshop_id: workshopId,
                user_id: req.user.id,
                dept: dept || null,
                year: year || null,
                notes: notes || null,
                created_at: new Date().toISOString()
            });

            transaction.update(workshopRef, {
                registered: (workshop.registered || 0) + 1
            });
        });

        res.status(201).json({ message: 'Successfully registered for workshop' });
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ message: err.message });
        }
        console.error('Register error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* GET MY REGISTRATIONS */
exports.getMyRegistrations = async (req, res) => {
    try {
        const regsSnapshot = await db.collection('registrations')
            .where('user_id', '==', req.user.id)
            .get();

        if (regsSnapshot.empty) {
            return res.json([]);
        }

        const regsData = regsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Collect unique workshop IDs and batch fetch them
        const workshopIds = [...new Set(regsData.map(r => r.workshop_id).filter(Boolean))];
        const workshopMap = {};

        if (workshopIds.length > 0) {
            const workshopFetches = workshopIds.map(id => db.collection('workshops').doc(id).get());
            const workshopDocs = await Promise.all(workshopFetches);
            workshopDocs.forEach(doc => {
                if (doc.exists) workshopMap[doc.id] = doc.data();
            });
        }

        // Fetch user details once (current user)
        const userDoc = await db.collection('users').doc(req.user.id).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        const registrations = regsData.map(reg => {
            const workshop = workshopMap[reg.workshop_id] || {};
            return {
                registration_id: reg.id,
                workshop_id: reg.workshop_id,
                dept: reg.dept,
                year: reg.year,
                notes: reg.notes,
                created_at: reg.created_at,
                workshopTitle: workshop.title || 'Unknown Workshop',
                club: workshop.club || '',
                date: workshop.date || '',
                time: workshop.time || '',
                location: workshop.location || '',
                level: workshop.level || '',
                attendeeName: userData.name || '',
                attendeeEmail: userData.email || ''
            };
        });

        res.json(registrations);
    } catch (err) {
        console.error('Get registrations error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/* DEREGISTER FROM WORKSHOP */
exports.deregisterFromWorkshop = async (req, res) => {
    const { workshopId } = req.params;

    try {
        const regsSnapshot = await db.collection('registrations')
            .where('workshop_id', '==', workshopId)
            .where('user_id', '==', req.user.id)
            .get();

        if (regsSnapshot.empty) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        const regRef = regsSnapshot.docs[0].ref;
        const workshopRef = db.collection('workshops').doc(workshopId);

        // Use transaction to safely delete and decrement atomically
        await db.runTransaction(async (transaction) => {
            const workshopDoc = await transaction.get(workshopRef);
            transaction.delete(regRef);
            if (workshopDoc.exists) {
                const currentCount = workshopDoc.data().registered || 0;
                transaction.update(workshopRef, {
                    registered: Math.max(0, currentCount - 1)
                });
            }
        });

        res.status(200).json({ message: 'Successfully deregistered from workshop' });
    } catch (err) {
        console.error('Deregister error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};