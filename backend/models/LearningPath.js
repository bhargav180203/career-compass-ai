import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  url: { type: String, default: '' },
  platform: {
    type: String,
    enum: ['Coursera', 'Udemy', 'YouTube', 'edX', 'freeCodeCamp', 'MDN', 'Documentation', 'Blog', 'Other', ''],
    default: 'Other',
  },
  type: {
    type: String,
    enum: ['course', 'video', 'article', 'documentation', 'project', 'other', ''],
    default: 'course',
  },
  duration: { type: String, default: '' }, // e.g. "4 weeks", "2 hours"
  isFree: { type: Boolean, default: true },
});

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedTime: { type: String, default: '' },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', ''],
    default: 'Beginner',
  },
  resources: [resourceSchema],
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const phaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, default: '' }, // e.g. "4 weeks"
  order: { type: Number, default: 0 },
  topics: [topicSchema],
});

const learningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Meta
    title: { type: String, required: true },
    targetRole: { type: String, required: true },
    description: { type: String, default: '' },
    totalDuration: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Mixed', ''],
      default: 'Mixed',
    },

    // Source of generation
    generatedFrom: {
      type: String,
      enum: ['assessment', 'manual', ''],
      default: 'manual',
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      default: null,
    },

    // Skill gap analysis
    currentSkills: [{ type: String }],
    missingSkills: [{ type: String }],

    // Roadmap
    phases: [phaseSchema],

    // Progress
    totalTopics: { type: Number, default: 0 },
    completedTopics: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('LearningPath', learningPathSchema);