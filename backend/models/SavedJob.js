import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Adzuna job data snapshot (stored so it's available even if job expires)
    jobId: { type: String, required: true }, // Adzuna job ID
    title: { type: String, required: true },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    salary: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: 'INR' },
    },
    jobType: { type: String, default: '' },
    category: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    postedAt: { type: Date, default: null },

    // Application tracking
    status: {
      type: String,
      enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected', ''],
      default: 'saved',
    },
    appliedAt: { type: Date, default: null },
    notes: { type: String, default: '', maxlength: 1000 },

    // AI match score
    matchScore: { type: Number, default: null, min: 0, max: 100 },
    matchReasons: [{ type: String }],
  },
  { timestamps: true }
);

// One saved instance per user per job
savedJobSchema.index({ user: 1, jobId: 1 }, { unique: true });

export default mongoose.model('SavedJob', savedJobSchema);