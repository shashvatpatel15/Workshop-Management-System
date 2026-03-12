const db = require('./config/firebase'); // ✅ changed from ./config/db

const workshops = [
    {
        title: "AI & Machine Learning Kickoff",
        description: "Dive into the world of artificial intelligence! This beginner-friendly workshop covers Python, TensorFlow, and the fundamentals of neural networks with hands-on exercises.",
        club: "AI Society",
        date: "2026-03-20",
        time: "4:00 PM - 6:00 PM",
        location: "Tech Lab 3",
        durationHours: 2,
        capacity: 40,
        registered: 12,
        level: "Beginner",
        topics: ["Python", "TensorFlow", "Neural Nets"]
    },
    {
        title: "Advanced React Patterns",
        description: "Master advanced React patterns including custom hooks, render props, compound components, and performance optimization strategies used in production apps.",
        club: "Web Dev Club",
        date: "2026-03-22",
        time: "5:00 PM - 8:00 PM",
        location: "CS Building, Room 101",
        durationHours: 3,
        capacity: 30,
        registered: 28,
        level: "Advanced",
        topics: ["React", "Custom Hooks", "Performance"]
    },
    {
        title: "Hackathon Prep & Teambuilding",
        description: "Get ready for upcoming hackathons! Learn ideation techniques, effective pitching, team dynamics, and rapid prototyping workflows.",
        club: "Hackers Group",
        date: "2026-03-25",
        time: "2:00 PM - 4:00 PM",
        location: "Innovation Hub",
        durationHours: 2,
        capacity: 100,
        registered: 100,
        level: "All Levels",
        topics: ["Networking", "Ideation", "Pitching"]
    },
    {
        title: "Introduction to Cloud Computing",
        description: "Explore AWS, Azure, and Google Cloud fundamentals. Learn to deploy applications, manage services, and understand cloud architecture principles.",
        club: "Cloud Enthusiasts",
        date: "2026-04-01",
        time: "3:00 PM - 5:00 PM",
        location: "Online (Zoom)",
        durationHours: 2,
        capacity: 200,
        registered: 45,
        level: "Beginner",
        topics: ["AWS", "Azure", "Deployment"]
    },
    {
        title: "UI/UX Design for Developers",
        description: "Bridge the gap between design and development. Learn Figma basics, design system creation, accessibility best practices, and user-centered design thinking.",
        club: "Design Hub",
        date: "2026-04-05",
        time: "4:30 PM - 6:30 PM",
        location: "Design Studio A",
        durationHours: 2,
        capacity: 25,
        registered: 10,
        level: "Intermediate",
        topics: ["Figma", "Design Systems", "Accessibility"]
    }
];

async function seedDatabase() {
    console.log("🌱 Seeding Firestore with demo workshops...");

    try {
        const batch = db.batch();
        const workshopsRef = db.collection('workshops');

        // Clear existing workshops first (be careful in production!)
        const snapshot = await workshopsRef.get();
        snapshot.forEach(doc => batch.delete(doc.ref));

        console.log(`🗑️  Cleared ${snapshot.size} old workshops.`);

        for (const w of workshops) {
            const newDocRef = workshopsRef.doc();
            batch.set(newDocRef, {
                ...w,
                created_at: new Date().toISOString(),
                created_by: null
            });
        }

        await batch.commit();
        console.log(`✅ Successfully seeded ${workshops.length} workshops!`);
    } catch (err) {
        console.error("❌ Error seeding database:", err.message);
    } finally {
        process.exit();
    }
}

seedDatabase();