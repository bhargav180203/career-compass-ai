import mongoose from 'mongoose';

const resumeSectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'custom'],
    required: true,
  },
  title: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

const resumeExperienceSchema = new mongoose.Schema({
  company: { type: String, default: '' },
  position: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String, default: '', maxlength: 1500 },
  achievements: [{ type: String }],
  aiEnhanced: { type: Boolean, default: false },
});

const resumeEducationSchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  currentlyStudying: { type: Boolean, default: false },
  grade: { type: String, default: '' },
  description: { type: String, default: '', maxlength: 500 },
});

const resumeSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other', ''],
    default: 'Technical',
  },
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', ''],
    default: '',
  },
});

const resumeProjectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '', maxlength: 800 },
  technologies: [{ type: String }],
  url: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  aiEnhanced: { type: Boolean, default: false },
});

const resumeCertificationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  issuingOrganization: { type: String, default: '' },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Meta
    name: { type: String, default: 'My Resume', maxlength: 100 },
    template: {
      type: String,
      enum: ['classic', 'modern', 'minimal', 'professional'],
      default: 'modern',
    },
    isDefault: { type: Boolean, default: false },
    atsScore: { type: Number, default: 0, min: 0, max: 100 },

    // Personal header
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },

    // Professional summary
    summary: {
      content: { type: String, default: '', maxlength: 1000 },
      aiEnhanced: { type: Boolean, default: false },
    },

    // Sections
    experience: [resumeExperienceSchema],
    education: [resumeEducationSchema],
    skills: [resumeSkillSchema],
    certifications: [resumeCertificationSchema],
    projects: [resumeProjectSchema],

    // Custom sections (e.g. "Publications", "Volunteer Work")
    customSections: [
      {
        title: { type: String, default: '' },
        content: { type: String, default: '', maxlength: 1000 },
        order: { type: Number, default: 99 },
      },
    ],

    // Section visibility + ordering
    sections: [resumeSectionSchema],
  },
  { timestamps: true }
);

// Ensure only one default resume per user
resumeSchema.pre('save', async function () {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
});

export default mongoose.model('Resume', resumeSchema);