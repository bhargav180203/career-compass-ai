// backend/models/Assessment.js
import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assessmentType: {
    type: String,
    default: 'comprehensive',
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  
  // Responses by category
  personalityResponses: [{
    questionId: String,
    question: String,
    answer: String,
    score: Number,
  }],
  
  interestResponses: [{
    questionId: String,
    question: String,
    answer: String,
    score: Number,
  }],
  
  skillsResponses: [{
    questionId: String,
    question: String,
    answer: String,
    score: Number,
  }],
  
  workStyleResponses: [{
    questionId: String,
    question: String,
    answer: String,
    score: Number,
  }],
  
  // Calculated Results
  results: {
    personalityType: String,
    personalityDescription: String,
    dominantInterests: [String],
    topSkills: [String],
    workStylePreference: String,
    
    // Scores
    scores: {
      realistic: Number,
      investigative: Number,
      artistic: Number,
      social: Number,
      enterprising: Number,
      conventional: Number,
      
      introversion: Number,
      extroversion: Number,
      thinking: Number,
      feeling: Number,
      judging: Number,
      perceiving: Number,
    },
    
    // Strengths and areas to develop
    strengths: [String],
    areasToImprove: [String],
  },
  
  // AI Generated Insights
  aiAnalysis: {
    summary: String,
    careerRecommendations: [{
      careerTitle: String,
      matchPercentage: Number,
      reason: String,
      requiredSkills: [String],
      salaryRange: String,
      growthPotential: String,
    }],
    learningPath: [{
      skill: String,
      priority: String,
      resources: [String],
    }],
    nextSteps: [String],
  },
  
  completedAt: {
    type: Date,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Assessment', AssessmentSchema);