const mysql = require('mysql2/promise');
require('dotenv').config();

const workshops = [
    {
        title: "AI & Machine Learning Kickoff",
        club: "AI Society",
        date: "2024-03-25",
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
        club: "Web Dev Club",
        date: "2024-03-28",
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
        club: "Hackers Group",
        date: "2024-04-02",
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
        club: "Cloud Enthusiasts",
        date: "2024-04-10",
        time: "3:00 PM - 5:00 PM",
        location: "Online",
        durationHours: 2,
        capacity: 200,
        registered: 45,
        level: "Beginner",
        topics: ["AWS", "Azure", "Deployment"]
    },
    {
        title: "UI/UX Design for Developers",
        club: "Design Hub",
        date: "2024-04-15",
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
    console.log("Connecting to database to seed workshops...");

    // We create a temporary connection to ensure the DB exists if possible, but assuming it exists is safer based on user intent
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'workshop_management'
    });

    try {
        console.log("Connected successfully. Clearing old workshops...");
        // Clear existing workshops purely for seeding
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE table workshops');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log("Inserting new workshops...");

        for (const w of workshops) {
            await connection.query(
                `INSERT INTO workshops (title, club, date, time, location, durationHours, capacity, registered, level, topics) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [w.title, w.club, w.date, w.time, w.location, w.durationHours, w.capacity, w.registered, w.level, JSON.stringify(w.topics)]
            );
        }

        console.log("Database seeded successfully with initial workshops!");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await connection.end();
        process.exit();
    }
}

seedDatabase();
