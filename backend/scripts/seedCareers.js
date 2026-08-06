// backend/scripts/seedCareers.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Career from '../models/Career.js';
import { careersData } from '../data/careerSeedData.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedCareers = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing careers
    console.log('Clearing existing careers...');
    await Career.deleteMany({});

    // Insert new careers
    console.log('Seeding careers...');
    const insertedCareers = await Career.insertMany(careersData);
    console.log(`✅ ${insertedCareers.length} careers seeded successfully!`);

    // Update related careers (linking similar careers)
    console.log('Linking related careers...');
    for (const career of insertedCareers) {
      // Find related careers in same industry or with similar interests
      const related = await Career.find({
        _id: { $ne: career._id },
        $or: [
          { industry: career.industry },
          { hollandCodes: { $in: career.hollandCodes } }
        ]
      }).limit(6);

      career.relatedCareers = related.map(c => c._id);
      await career.save();
    }

    console.log('✅ Related careers linked successfully!');
    console.log('\n📊 Database Statistics:');
    
    // Show stats
    const stats = await Career.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nCareers by Industry:');
    stats.forEach(s => {
      console.log(`  - ${s._id}: ${s.count} careers`);
    });

    console.log('\n✨ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedCareers();