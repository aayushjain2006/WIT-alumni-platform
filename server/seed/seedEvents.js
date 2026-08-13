require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../src/models/User');
const Event = require('../src/models/Event');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_platform';

const seedEvents = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('Connected');

    // Ensure an organizer exists (admin account for Alumni Relations)
    let organizer = await User.findOne({ email: 'alumni-relations@wit.edu' });
    if (!organizer) {
      const salt = await bcrypt.genSalt(12);
      const password = await bcrypt.hash('Alumni@123', salt);
      organizer = await User.create({
        email: 'alumni-relations@wit.edu',
        password,
        firstName: 'Alumni',
        lastName: 'Relations',
        role: 'admin',
        department: 'CSE',
        graduationYear: 2005,
        company: 'Walchand Institute of Technology',
        jobTitle: 'Alumni Relations Team',
        isProfileComplete: true,
        isVerified: true,
        status: 'active'
      });
      console.log('Created organizer user:', organizer.email);
    } else {
      console.log('Using existing organizer:', organizer.email);
    }

    const events = [
      {
        title: 'Minneapolis Technology Summit 2026',
        description:
          'Join us for the 3rd Annual ElevateIT Minneapolis Technology Summit — a premier conference for technology leaders, professionals, and enthusiasts in the Minneapolis-St. Paul area. Executive keynotes, expert panels on AI, security and innovation, an exhibit hall, and powerful networking opportunities for WIT alumni.',
        date: new Date('2026-10-22T09:00:00'),
        time: '09:00',
        endDate: new Date('2026-10-22T17:00:00'),
        endTime: '17:00',
        location: 'Hyatt Regency Minneapolis',
        address: '1300 Nicollet Mall, Minneapolis, MN 55403',
        type: 'Seminar',
        category: 'Professional',
        capacity: 300,
        isVirtual: false,
        image:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
        organizer: organizer._id,
        speakers: [
          'Zhiming Zhao',
          'KC Santos',
          'Meredith Clause',
          'Casey Yarbrough'
        ],
        agenda: [
          { time: '09:00', activity: 'Keynote: Executing at Scale in a High-Risk Digital Era', speaker: 'Zhiming Zhao' },
          { time: '11:00', activity: 'Panel: How CIOs Scale Innovation and Measurable Business Impact' },
          { time: '13:00', activity: 'Panel: AI, Compliance, and Operational Risk' },
          { time: '14:00', activity: 'Panel: Women in Technology Leadership' },
          { time: '16:00', activity: 'Closing Keynote: Why Narrative Is the Most Critical Skill in Tech', speaker: 'Meredith Clause' },
          { time: '17:00', activity: 'Conference Commencement and Prize Giveaways' }
        ],
        registrationDeadline: new Date('2026-10-18T23:59:00'),
        ticketPrice: 0,
        tags: ['technology', 'leadership', 'AI', 'networking'],
        featured: true,
        status: 'active'
      },
      {
        title: 'Splunk .conf26',
        description:
          "Three days of hands-on training, AI insights, new certifications, and endless opportunities to see how others use Splunk. A flagship technology conference for observability, security, and data professionals.",
        date: new Date('2026-09-14T09:00:00'),
        time: '09:00',
        endDate: new Date('2026-09-16T18:00:00'),
        endTime: '18:00',
        location: 'Colorado Convention Center, Denver',
        address: '700 14th Street, Denver, CO 80202',
        type: 'Workshop',
        category: 'Professional',
        capacity: 500,
        isVirtual: false,
        image:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
        organizer: organizer._id,
        speakers: ['Splunk Leadership', 'Customer Keynote Speakers'],
        agenda: [
          { time: '09:00', activity: 'Opening Keynote' },
          { time: '13:00', activity: 'Hands-on Training Labs' },
          { time: '17:00', activity: 'Community & Networking Reception' }
        ],
        registrationDeadline: new Date('2026-09-10T23:59:00'),
        ticketPrice: 0,
        tags: ['security', 'observability', 'AI', 'certifications'],
        featured: false,
        status: 'active'
      },
      {
        title: 'EDUCAUSE Annual Conference 2026',
        description:
          'The largest gathering of higher-education technology professionals. Connect with peers, share ideas, and discover solutions shaping the future of education technology. Great for WIT alumni working in academia and edtech.',
        date: new Date('2026-09-29T09:00:00'),
        time: '09:00',
        endDate: new Date('2026-10-02T17:00:00'),
        endTime: '17:00',
        location: 'Denver, Colorado',
        address: 'Denver Convention Center, CO',
        type: 'Seminar',
        category: 'Academic',
        capacity: 800,
        isVirtual: false,
        image:
          'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop',
        organizer: organizer._id,
        speakers: ['Higher Ed Tech Leaders', 'EDUCAUSE Keynotes'],
        agenda: [
          { time: '09:00', activity: 'General Session' },
          { time: '13:00', activity: 'Breakout Sessions & Expo Hall' },
          { time: '16:00', activity: 'Networking & Receptions' }
        ],
        registrationDeadline: new Date('2026-09-24T23:59:00'),
        ticketPrice: 0,
        tags: ['education', 'technology', 'academic'],
        featured: false,
        status: 'active'
      },
      {
        title: 'Twin Cities Startup Week 2026',
        description:
          'The largest entrepreneurial gathering in the Midwest. From AI to health tech, join founders, investors, and mentors from across the ecosystem. Ideal for alumni entrepreneurs and founders looking to pitch, learn, and grow.',
        date: new Date('2026-09-14T10:00:00'),
        time: '10:00',
        endDate: new Date('2026-09-18T20:00:00'),
        endTime: '20:00',
        location: 'Minneapolis, Minnesota',
        address: 'Multiple venues across Minneapolis',
        type: 'Entrepreneurship',
        category: 'Business',
        capacity: 400,
        isVirtual: false,
        image:
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
        organizer: organizer._id,
        speakers: ['Founders', 'Investors', 'Ecosystem Mentors'],
        agenda: [
          { time: '10:00', activity: 'Startup Showcase' },
          { time: '14:00', activity: 'Investor Pitches' },
          { time: '18:00', activity: 'Community Happy Hours' }
        ],
        registrationDeadline: new Date('2026-09-11T23:59:00'),
        ticketPrice: 0,
        tags: ['startup', 'entrepreneurship', 'investors'],
        featured: false,
        status: 'active'
      },
      {
        title: 'North Star Summit 2026',
        description:
          'A high-energy summit focused on business, media, and innovation for Minnesota’s professional community. Network with leaders, gain market insights, and connect with fellow WIT alumni.',
        date: new Date('2026-09-21T09:00:00'),
        time: '09:00',
        endDate: new Date('2026-09-23T17:00:00'),
        endTime: '17:00',
        location: 'Minneapolis, Minnesota',
        address: 'Minneapolis, MN',
        type: 'Networking',
        category: 'Business',
        capacity: 250,
        isVirtual: false,
        image:
          'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=600&fit=crop',
        organizer: organizer._id,
        speakers: ['Regional Business Leaders'],
        agenda: [
          { time: '09:00', activity: 'Opening Sessions' },
          { time: '13:00', activity: 'Industry Breakouts' },
          { time: '16:00', activity: 'Networking Mixer' }
        ],
        registrationDeadline: new Date('2026-09-17T23:59:00'),
        ticketPrice: 0,
        tags: ['business', 'media', 'networking'],
        featured: false,
        status: 'active'
      },
      {
        title: 'AUB North American Alumni Technology Conference',
        description:
          'A technology conference for the alumni community in Silicon Valley — whether you are in tech, curious about where the industry is headed, or want to learn from leaders at the biggest tech firms. Featuring networking, keynotes, and panels.',
        date: new Date('2026-03-20T09:00:00'),
        time: '09:00',
        endDate: new Date('2026-03-21T18:00:00'),
        endTime: '18:00',
        location: 'Palo Alto, California',
        address: 'Palo Alto, CA',
        type: 'Seminar',
        category: 'Professional',
        capacity: 200,
        isVirtual: false,
        image:
          'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop',
        organizer: organizer._id,
        speakers: ['Silicon Valley Tech Leaders'],
        agenda: [
          { time: '09:00', activity: 'Welcome & Keynotes' },
          { time: '14:00', activity: 'Industry Panels' },
          { time: '18:00', activity: 'Networking Reception' }
        ],
        registrationDeadline: new Date('2026-03-15T23:59:00'),
        ticketPrice: 0,
        tags: ['technology', 'alumni', 'silicon-valley'],
        featured: false,
        status: 'active'
      }
    ];

    let created = 0;
    for (const ev of events) {
      const existing = await Event.findOne({ title: ev.title });
      if (existing) {
        console.log('Already exists, skipping:', ev.title);
        continue;
      }
      await Event.create(ev);
      created++;
      console.log('Inserted event:', ev.title);
    }

    console.log(`\nDone. ${created} new events inserted. Total events in DB: ${await Event.countDocuments()}`);
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
};

seedEvents();
