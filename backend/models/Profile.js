// backend/models/Profile.js
import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Personal Information
  personalInfo: {
    phone: {
      type: String,
      default: ''
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
      default: ''
    },
    location: {
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    bio: {
      type: String,
      maxlength: 500,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    linkedIn: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    }
  },

  // Education History
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldOfStudy: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    grade: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      maxlength: 500,
      default: ''
    }
  }],

  // Work Experience
  experience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Self-employed'],
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      maxlength: 1000,
      default: ''
    },
    achievements: [{
      type: String
    }]
  }],

  // Skills
  skills: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'],
      required: true
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0
    }
  }],

  // Certifications
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuingOrganization: {
      type: String,
      required: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date
    },
    credentialId: {
      type: String,
      default: ''
    },
    credentialUrl: {
      type: String,
      default: ''
    }
  }],

  // Languages
  languages: [{
    name: {
      type: String,
      required: true
    },
    proficiency: {
      type: String,
      enum: ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native'],
      required: true
    }
  }],

  // Projects
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: 500,
      required: true
    },
    technologies: [{
      type: String
    }],
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    current: {
      type: Boolean,
      default: false
    },
    projectUrl: {
      type: String,
      default: ''
    },
    repositoryUrl: {
      type: String,
      default: ''
    }
  }],

  // Career Preferences
  careerPreferences: {
    desiredRoles: [{
      type: String
    }],
    desiredIndustries: [{
      type: String
    }],
    desiredLocations: [{
      type: String
    }],
    jobType: [{
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
    }],
    expectedSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    availableToStart: {
      type: String,
      enum: ['','Immediately', 'Within 2 weeks', 'Within 1 month', '1-3 months', 'More than 3 months'],
      default: ''
    },
    willingToRelocate: {
      type: Boolean,
      default: false
    }
  },

  // Profile Metadata
  completeness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  isPublic: {
    type: Boolean,
    default: false
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate profile completeness
ProfileSchema.methods.calculateCompleteness = function() {
  let score = 0;
  const weights = {
    personalInfo: 15,
    education: 15,
    experience: 20,
    skills: 15,
    certifications: 10,
    languages: 5,
    projects: 10,
    careerPreferences: 10
  };

  // Personal Info (15%)
  const personalInfo = this.personalInfo;
  let personalScore = 0;
  if (personalInfo.phone) personalScore += 3;
  if (personalInfo.location?.city) personalScore += 3;
  if (personalInfo.bio) personalScore += 4;
  if (personalInfo.linkedIn || personalInfo.github) personalScore += 3;
  if (personalInfo.dateOfBirth) personalScore += 2;
  score += Math.min(personalScore, weights.personalInfo);

  // Education (15%)
  if (this.education.length > 0) {
    score += Math.min(this.education.length * 7.5, weights.education);
  }

  // Experience (20%)
  if (this.experience.length > 0) {
    score += Math.min(this.experience.length * 10, weights.experience);
  }

  // Skills (15%)
  if (this.skills.length > 0) {
    score += Math.min(this.skills.length * 3, weights.skills);
  }

  // Certifications (10%)
  if (this.certifications.length > 0) {
    score += Math.min(this.certifications.length * 5, weights.certifications);
  }

  // Languages (5%)
  if (this.languages.length > 0) {
    score += Math.min(this.languages.length * 2.5, weights.languages);
  }

  // Projects (10%)
  if (this.projects.length > 0) {
    score += Math.min(this.projects.length * 5, weights.projects);
  }

  // Career Preferences (10%)
  const prefs = this.careerPreferences;
  let prefsScore = 0;
  if (prefs.desiredRoles?.length > 0) prefsScore += 3;
  if (prefs.desiredIndustries?.length > 0) prefsScore += 3;
  if (prefs.jobType?.length > 0) prefsScore += 2;
  if (prefs.expectedSalary?.min) prefsScore += 2;
  score += Math.min(prefsScore, weights.careerPreferences);

  this.completeness = Math.round(score);
  return this.completeness;
};

// Update lastUpdated timestamp
ProfileSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  this.calculateCompleteness();
});

const Profile = mongoose.model('Profile', ProfileSchema);
export default Profile;