require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../src/models/User');
const Event = require('../src/models/Event');
const Opportunity = require('../src/models/Opportunity');
const Campaign = require('../src/models/Campaign');
const NewsArticle = require('../src/models/NewsArticle');
const AlumniStory = require('../src/models/AlumniStory');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_platform';

const seedData = async () => {
  try {
    console.log('Seeding Database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Opportunity.deleteMany({}),
      Campaign.deleteMany({}),
      NewsArticle.deleteMany({}),
      AlumniStory.deleteMany({})
    ]);

    // Create Super Admin
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    
    const admin = await User.create({
      email: 'admin@wit.edu',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'WIT',
      role: 'admin',
      department: 'CSE',
      graduationYear: 2000,
      isProfileComplete: true,
      isVerified: true,
      status: 'active'
    });
    console.log('Admin created');

    // Create Alumni
    const alumniPassword = await bcrypt.hash('Alumni@123', salt);
    const alumni = await User.insertMany([
      { email: 'alumni1@wit.edu', password: alumniPassword, firstName: 'John', lastName: 'Doe', role: 'alumni', department: 'CSE', graduationYear: 2018, company: 'Google', jobTitle: 'SDE', isVerified: true, status: 'active', skills: ['React', 'Node.js'] },
      { email: 'alumni2@wit.edu', password: alumniPassword, firstName: 'Jane', lastName: 'Smith', role: 'alumni', department: 'IT', graduationYear: 2019, company: 'Amazon', jobTitle: 'Backend Engineer', isVerified: true, status: 'active', skills: ['Java', 'AWS'] },
      { email: 'alumni3@wit.edu', password: alumniPassword, firstName: 'Mike', lastName: 'Johnson', role: 'alumni', department: 'ENTC', graduationYear: 2017, company: 'Intel', jobTitle: 'Hardware Engineer', isVerified: true, status: 'active' },
      { email: 'alumni4@wit.edu', password: alumniPassword, firstName: 'Sarah', lastName: 'Williams', role: 'alumni', department: 'CIVIL', graduationYear: 2020, company: 'L&T', jobTitle: 'Civil Engineer', isVerified: true, status: 'active' },
      { email: 'alumni5@wit.edu', password: alumniPassword, firstName: 'David', lastName: 'Brown', role: 'alumni', department: 'MECH AND AUTOMATION', graduationYear: 2016, company: 'Tata Motors', jobTitle: 'Mechanical Engineer', isVerified: true, status: 'active' }
    ]);
    console.log('Alumni created');

    // Create Students
    const studentPassword = await bcrypt.hash('Student@123', salt);
    const students = await User.insertMany([
      { email: 'student1@wit.edu', password: studentPassword, firstName: 'Alex', lastName: 'Wilson', role: 'student', department: 'CSE', graduationYear: 2024, status: 'active' },
      { email: 'student2@wit.edu', password: studentPassword, firstName: 'Emily', lastName: 'Davis', role: 'student', department: 'IT', graduationYear: 2025, status: 'active' },
      { email: 'student3@wit.edu', password: studentPassword, firstName: 'Chris', lastName: 'Miller', role: 'student', department: 'AIML', graduationYear: 2026, status: 'active' }
    ]);
    console.log('Students created');

    // Create Events
    await Event.insertMany([
      { title: 'Tech Meetup 2024', description: 'Annual tech meetup for alumni', date: new Date(Date.now() + 86400000 * 10), time: '10:00 AM', type: 'Networking', category: 'Professional', capacity: 100, organizer: admin._id },
      { title: 'Career Fair', description: 'Job fair for graduating students', date: new Date(Date.now() + 86400000 * 20), time: '09:00 AM', type: 'Career', category: 'Business', capacity: 500, organizer: admin._id },
      { title: 'Alumni Reunion', description: 'Class of 2014 reunion', date: new Date(Date.now() + 86400000 * 30), time: '06:00 PM', type: 'Reunion', category: 'Social', capacity: 200, organizer: admin._id }
    ]);
    console.log('Events created');

    // Create Opportunities
    await Opportunity.insertMany([
      { title: 'Frontend Developer', type: 'job', company: 'Google', description: 'Looking for React developer', postedBy: alumni[0]._id, status: 'active' },
      { title: 'Backend Intern', type: 'internship', company: 'Amazon', description: 'Node.js internship', postedBy: alumni[1]._id, status: 'active' },
      { title: 'Hardware Engineer', type: 'job', company: 'Intel', description: 'Entry level position', postedBy: alumni[2]._id, status: 'active' },
      { title: 'Civil Site Engineer', type: 'job', company: 'L&T', description: 'Site engineer required', postedBy: alumni[3]._id, status: 'active' },
      { title: 'Mechanical Intern', type: 'internship', company: 'Tata Motors', description: 'Summer internship', postedBy: alumni[4]._id, status: 'active' }
    ]);
    console.log('Opportunities created');

    // Create Campaigns
    await Campaign.insertMany([
      { title: 'Scholarship Fund 2024', description: 'Fund for brilliant students', goal: 500000, endDate: new Date(Date.now() + 86400000 * 60), createdBy: admin._id },
      { title: 'Lab Equipment Upgrade', description: 'New computers for CS lab', goal: 1000000, endDate: new Date(Date.now() + 86400000 * 90), createdBy: admin._id }
    ]);
    console.log('Campaigns created');

    // Create News
    await NewsArticle.insertMany([
      { title: 'WIT Ranked #1 in Region', content: 'Our college has achieved top ranking...', category: 'Academic', author: admin._id, status: 'published', publishedDate: new Date() },
      { title: 'New AI Lab Inaugurated', content: 'State of the art AI lab...', category: 'Campus Updates', author: admin._id, status: 'published', publishedDate: new Date() },
      { title: 'Alumni Hackathon Results', content: 'The annual hackathon...', category: 'Alumni Network', author: admin._id, status: 'published', publishedDate: new Date() }
    ]);
    console.log('News created');

    // Create Stories
    await AlumniStory.insertMany([
      { title: 'My Journey to Google', content: 'How I started at WIT and reached Google...', author: alumni[0]._id, status: 'published', verified: true },
      { title: 'Startup Experience', content: 'Building my own company after graduation...', author: alumni[1]._id, status: 'published', verified: true }
    ]);
    console.log('Stories created');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedData;
