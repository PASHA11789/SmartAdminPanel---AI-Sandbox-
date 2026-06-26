import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Student from './models/Student.js';
import connectDB from './config/db.js';

// Force DNS resolution using public DNS resolvers to handle Atlas connection issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const sampleStudents = [
  {
    rollNo: '101',
    name: 'Alice Smith',
    studentClass: 'Class 10',
    section: 'A',
    attendanceStatus: 'Present',
    balance: 150
  },
  {
    rollNo: '102',
    name: 'Bob Johnson',
    studentClass: 'Class 10',
    section: 'A',
    attendanceStatus: 'Absent',
    balance: 80
  },
  {
    rollNo: '103',
    name: 'Charlie Brown',
    studentClass: 'Grade 9',
    section: 'B',
    attendanceStatus: 'Present',
    balance: 200
  },
  {
    rollNo: '104',
    name: 'Diana Prince',
    studentClass: 'Grade 9',
    section: 'B',
    attendanceStatus: 'Absent',
    balance: 50
  },
  {
    rollNo: '105',
    name: 'Evan Wright',
    studentClass: 'Class 10',
    section: 'B',
    attendanceStatus: 'Present',
    balance: 120
  },
  {
    rollNo: '106',
    name: 'Fiona Gallagher',
    studentClass: 'Grade 9',
    section: 'A',
    attendanceStatus: 'Absent',
    balance: 300
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_admin');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing students
    await Student.deleteMany({});
    console.log('Cleared existing student records.');

    // Insert sample students
    const createdStudents = await Student.insertMany(sampleStudents);
    console.log(`Successfully seeded ${createdStudents.length} student records.`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
