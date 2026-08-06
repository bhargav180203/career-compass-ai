// backend/models/Career.js
import mongoose from 'mongoose';

const CareerSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Categorization
  industry: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Healthcare',
      'Business & Finance',
      'Education',
      'Engineering',
      'Arts & Media',
      'Science & Research',
      'Legal',
      'Social Services',
      'Government & Public',
      'Skilled Trades',
      'Hospitality & Tourism'
    ]
  },
  
  category: {
    type: String,
    required: true
  },
  
  // Salary Information
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    median: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Education & Experience
  educationRequired: {
    type: String,
    required: true,
    enum: [
      'High School',
      'Associate Degree',
      'Bachelor\'s Degree',
      'Master\'s Degree',
      'Doctoral Degree',
      'Professional Certification',
      'No Formal Education'
    ]
  },
  
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  
  // Skills & Requirements
  skills: {
    technical: [{
      type: String
    }],
    soft: [{
      type: String
    }]
  },
  
  // Career Outlook
  growthOutlook: {
    rate: {
      type: String,
      enum: ['Declining', 'Stable', 'Growing', 'Fast Growing', 'Explosive Growth']
    },
    percentage: {
      type: Number
    },
    description: {
      type: String
    }
  },
  
  // Personality & Interest Matches
  personalityTypes: [{
    type: String,
    enum: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
           'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
  }],
  
  hollandCodes: [{
    type: String,
    enum: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional']
  }],
  
  // Detailed Information
  dayInLife: {
    type: String
  },
  
  workEnvironment: {
    type: String
  },
  
  advantages: [{
    type: String
  }],
  
  challenges: [{
    type: String
  }],
  
  // Career Path
  careerPath: {
    entryLevel: String,
    midLevel: String,
    seniorLevel: String
  },
  
  relatedCareers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career'
  }],
  
  // Additional Information
  topCompanies: [{
    type: String
  }],
  
  certifications: [{
    type: String
  }],
  
  resources: [{
    title: String,
    url: String,
    type: String // 'course', 'article', 'video', 'book'
  }],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for search and filtering
CareerSchema.index({ title: 'text', description: 'text', category: 'text' });
CareerSchema.index({ industry: 1 });
CareerSchema.index({ 'salary.median': 1 });
CareerSchema.index({ slug: 1 });
CareerSchema.index({ featured: 1 });

// Virtual for salary range display
CareerSchema.virtual('salaryRange').get(function() {
  return `$${(this.salary.min / 1000).toFixed(0)}K - $${(this.salary.max / 1000).toFixed(0)}K`;
});

// Method to increment views
CareerSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Static method to get related careers
CareerSchema.statics.findRelated = async function(careerId, limit = 6) {
  const career = await this.findById(careerId);
  if (!career) return [];
  
  return this.find({
    _id: { $ne: careerId },
    $or: [
      { industry: career.industry },
      { hollandCodes: { $in: career.hollandCodes } },
      { personalityTypes: { $in: career.personalityTypes } }
    ],
    isActive: true
  }).limit(limit);
};

const Career = mongoose.model('Career', CareerSchema);
export default Career;