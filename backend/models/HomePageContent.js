import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  value: { type: String, required: true, trim: true, maxlength: 50 },
  label: { type: String, required: true, trim: true, maxlength: 100 },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
}, { _id: false });

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true, maxlength: 400 },
}, { _id: false });

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  imageUrl: { type: String, trim: true, maxlength: 2000 },
}, { _id: false });

const universityLogoSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 150 },
  imageUrl: { type: String, trim: true, maxlength: 2000 },
}, { _id: false });

const homePageContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'home' },
  stats: {
    type: [statSchema],
    default: [
      { value: '26+', label: 'Years of Excellence' },
      { value: '12', label: 'Branches Worldwide' },
      { value: '100+', label: 'Partnered Universities' },
      { value: '15+', label: 'Countries to Choose From' },
      { value: '98%', label: 'Visa Success Rate' },
      { value: '10K+', label: 'Success Stories' },
    ],
    validate: [v => Array.isArray(v) && v.length === 6, 'Stats must have exactly 6 items'],
  },
  servicesSubtitle: { type: String, trim: true, maxlength: 100, default: 'What We Offer' },
  servicesHeading: { type: String, trim: true, maxlength: 200, default: 'Comprehensive Guidance For Your Journey' },
  servicesParagraph: { type: String, trim: true, maxlength: 500, default: 'We support you at every step of your abroad journey, from choosing a course to landing in your dream country' },
  services: {
    type: [serviceSchema],
    default: [
      { title: 'Career Counseling', description: 'Aligning your study path with long-term career aspirations and global market trends.' },
      { title: 'University Selection', description: 'Finding the perfect match for your academic goals based on your profile and preferences.' },
      { title: 'Documentation Assistance', description: 'Expert help with documentation, interview preparation, and filing to ensure success.' },
      { title: 'Test Preparation', description: 'Comprehensive coaching for IELTS.' },
      { title: 'Interview Preparation', description: 'Personalized coaching to excel in university and embassy interviews.' },
      { title: 'Scholarship Guidance', description: 'Identifying and applying for financial aid and scholarships to fund your education.' },
      { title: 'Pre-Departure Briefing', description: 'Comprehensive guidance on accommodation, travel, insurance, and cultural adaptation.' },
      { title: 'Post-Departure Assistance', description: 'Continuous support and resources after your arrival to help you settle in and thrive.' },
    ],
    validate: [v => Array.isArray(v) && v.length <= 50, 'Services must be at most 50 items'],
  },
  howItWorksHeading: { type: String, trim: true, maxlength: 100, default: 'How It Works' },
  howItWorksSubtitle: { type: String, trim: true, maxlength: 200, default: 'Your journey to international education in 4 simple steps.' },
  howItWorksSteps: {
    type: [stepSchema],
    default: [
      { title: 'Profile Assessment', description: 'We evaluate your academic background and interests to chart your path.' },
      { title: 'University Selection', description: 'Select from top-ranked universities that match your profile.' },
      { title: 'Application Filing', description: 'We handle the paperwork ensuring error-free application submission.' },
      { title: 'Visa & Departure', description: 'Get your visa approved and fly to your dream destination.' },
    ],
    validate: [v => Array.isArray(v) && v.length <= 20, 'Steps must be at most 20 items'],
  },
  studyDestinationsHeading: { type: String, trim: true, maxlength: 100, default: 'Study Destinations' },
  studyDestinationsSubheading: { type: String, trim: true, maxlength: 200, default: 'Explore opportunities in top educational hubs worldwide' },
  studyDestinations: {
    type: [destinationSchema],
    default: [
      { name: 'United Kingdom', imageUrl: '' },
      { name: 'Canada', imageUrl: '' },
      { name: 'Australia', imageUrl: '' },
      { name: 'The United States', imageUrl: '' },
      { name: 'Europe', imageUrl: '' },
      { name: 'Uzbekistan', imageUrl: '' },
      { name: 'UAE', imageUrl: '' },
      { name: 'China', imageUrl: '' },
      { name: 'India', imageUrl: '' },
      { name: 'Bangladesh', imageUrl: '' },
    ],
    validate: [v => Array.isArray(v) && v.length <= 30, 'Destinations must be at most 30 items'],
  },
  universityLogosRow1: {
    type: [universityLogoSchema],
    default: [],
    validate: [v => Array.isArray(v) && v.length <= 30, 'University logos row 1 must be at most 30 items'],
  },
  universityLogosRow2: {
    type: [universityLogoSchema],
    default: [],
    validate: [v => Array.isArray(v) && v.length <= 30, 'University logos row 2 must be at most 30 items'],
  },
}, { timestamps: true });

const HomePageContent = mongoose.model('HomePageContent', homePageContentSchema);
export default HomePageContent;
