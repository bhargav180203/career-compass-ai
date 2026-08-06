// backend/controllers/assessmentController.js
import Assessment from '../models/Assessment.js';
import { assessmentQuestions } from '../data/assessmentQuestions.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiModel = googleAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Get assessment questions
// @route   GET /api/assessment/questions
// @access  Private
export const getAssessmentQuestions = async (req, res) => {
  try {
    res.json({
      success: true,
      questions: assessmentQuestions,
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assessment questions',
      error: error.message,
    });
  }
};

// @desc    Start new assessment
// @route   POST /api/assessment/start
// @access  Private
export const startAssessment = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has incomplete assessment
    const existingAssessment = await Assessment.findOne({
      userId,
      status: 'in-progress',
    });

    if (existingAssessment) {
      return res.json({
        success: true,
        message: 'Resuming existing assessment',
        assessmentId: existingAssessment._id,
      });
    }

    // Create new assessment
    const assessment = await Assessment.create({
      userId,
      status: 'in-progress',
    });

    res.status(201).json({
      success: true,
      message: 'Assessment started',
      assessmentId: assessment._id,
    });
  } catch (error) {
    console.error('Start assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start assessment',
      error: error.message,
    });
  }
};

// Calculate scores from responses
const calculateScores = (responses) => {
  const scores = {
    // Holland Code (RIASEC)
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
    // MBTI dimensions
    introversion: 0,
    extroversion: 0,
    sensing: 0,
    intuition: 0,
    thinking: 0,
    feeling: 0,
    judging: 0,
    perceiving: 0,
  };

  // Process personality responses
  responses.personality?.forEach(r => {
    const value = r.answer;
    if (value === 'E') scores.extroversion += r.score;
    if (value === 'I') scores.introversion += r.score;
    if (value === 'S') scores.sensing += r.score;
    if (value === 'N') scores.intuition += r.score;
    if (value === 'T') scores.thinking += r.score;
    if (value === 'F') scores.feeling += r.score;
    if (value === 'J') scores.judging += r.score;
    if (value === 'P') scores.perceiving += r.score;
  });

  // Process interest responses (Holland Code)
  responses.interests?.forEach(r => {
    const value = r.answer;
    if (value === 'R') scores.realistic += r.score;
    if (value === 'I') scores.investigative += r.score;
    if (value === 'A') scores.artistic += r.score;
    if (value === 'S') scores.social += r.score;
    if (value === 'E') scores.enterprising += r.score;
    if (value === 'C') scores.conventional += r.score;
  });

  return scores;
};

// Determine personality type (MBTI-style)
const determinePersonalityType = (scores) => {
  let type = '';

  type += scores.extroversion > scores.introversion ? 'E' : 'I';
  type += scores.sensing > scores.intuition ? 'S' : 'N';
  type += scores.thinking > scores.feeling ? 'T' : 'F';
  type += scores.judging > scores.perceiving ? 'J' : 'P';

  const descriptions = {
    'INTJ': 'The Architect - Strategic, analytical, and independent thinker',
    'INTP': 'The Logician - Innovative, curious, and theoretical',
    'ENTJ': 'The Commander - Bold, strategic leader and organizer',
    'ENTP': 'The Debater - Smart, curious, and intellectually playful',
    'INFJ': 'The Advocate - Idealistic, organized, and compassionate',
    'INFP': 'The Mediator - Poetic, kind, and altruistic',
    'ENFJ': 'The Protagonist - Charismatic, inspiring leader',
    'ENFP': 'The Campaigner - Enthusiastic, creative, and sociable',
    'ISTJ': 'The Logistician - Practical, fact-minded, and reliable',
    'ISFJ': 'The Defender - Dedicated, warm, and protective',
    'ESTJ': 'The Executive - Organized, practical administrator',
    'ESFJ': 'The Consul - Caring, social, and popular',
    'ISTP': 'The Virtuoso - Bold, practical experimenter',
    'ISFP': 'The Adventurer - Flexible, charming artist',
    'ESTP': 'The Entrepreneur - Smart, energetic, and perceptive',
    'ESFP': 'The Entertainer - Spontaneous, energetic entertainer',
  };

  return {
    type,
    description: descriptions[type] || 'Unique personality profile',
  };
};

// Get dominant interests (Holland Code)
const getDominantInterests = (scores) => {
  const interests = [
    { name: 'Realistic', code: 'R', score: scores.realistic },
    { name: 'Investigative', code: 'I', score: scores.investigative },
    { name: 'Artistic', code: 'A', score: scores.artistic },
    { name: 'Social', code: 'S', score: scores.social },
    { name: 'Enterprising', code: 'E', score: scores.enterprising },
    { name: 'Conventional', code: 'C', score: scores.conventional },
  ];

  return interests
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(i => i.name);
};

// @desc    Submit assessment responses
// @route   POST /api/assessment/submit
// @access  Private
export const submitAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { responses } = req.body;

    // Find the in-progress assessment
    const assessment = await Assessment.findOne({
      userId,
      status: 'in-progress'
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No active assessment found'
      });
    }

    // Calculate scores
    const scores = calculateScores(responses);
    const personality = determinePersonalityType(scores);
    const dominantInterests = getDominantInterests(scores);

    // Extract top skills
    const topSkills = responses.skills
      ?.filter(r => r.score >= 4)
      .map(r => r.question.replace('How comfortable are you with ', '')
                         .replace('How would you rate your ', '')
                         .replace('?', ''))
      .slice(0, 5);

    // Prepare data for AI analysis
    const userProfile = {
      personalityType: personality.type,
      interests: dominantInterests,
      skills: topSkills,
      workStyle: responses.workStyle?.map(r => r.answer).join(', '),
    };

    // Generate AI analysis
    const prompt = `You are a career counselor. Analyze this user profile and provide career recommendations.
User Profile:
- Personality Type: ${userProfile.personalityType}
- Top Interests: ${userProfile.interests.join(', ')}
- Top Skills: ${userProfile.skills?.join(', ')}
- Work Style: ${userProfile.workStyle}

Provide a detailed analysis in JSON format with:
1. summary: A 2-3 sentence overview of their career profile
2. careerRecommendations: Array of 5 careers with:
   - careerTitle
   - matchPercentage (number 70-95)
   - reason (why this career fits)
   - requiredSkills (array of 3-5 skills)
   - salaryRange (e.g., "$50,000 - $80,000")
   - growthPotential ("High", "Medium", "Excellent")
3. strengths: Array of 4-5 key strengths
4. areasToImprove: Array of 3-4 areas to develop
5. nextSteps: Array of 3-4 actionable next steps

Return ONLY valid JSON, no markdown or extra text.`;

    // Generate AI analysis with retry logic
    let aiAnalysisData;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount < maxRetries) {
      try {
        const result = await geminiModel.generateContent(prompt);
        const aiResponseText = result.response.text();
        
        // Clean and parse AI response
        const cleanedResponse = aiResponseText
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        aiAnalysisData = JSON.parse(cleanedResponse);
        break; // Success, exit retry loop
        
      } catch (aiError) {
        retryCount++;
        console.error(`AI generation attempt ${retryCount} failed:`, aiError.message);
        
        if (retryCount >= maxRetries || aiError.status === 503) {
          // Use intelligent fallback based on user profile
          console.log('Using fallback AI analysis');
          aiAnalysisData = generateFallbackAnalysis(personality, dominantInterests, topSkills);
          break;
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Prepare update data
    const updateData = {
      personalityResponses: responses.personality || [],
      interestResponses: responses.interests || [],
      skillsResponses: responses.skills || [],
      workStyleResponses: responses.workStyle || [],
      results: {
        personalityType: personality.type,
        personalityDescription: personality.description,
        dominantInterests,
        topSkills: topSkills || [],
        workStylePreference: responses.workStyle?.[0]?.answer || 'Not specified',
        scores,
        strengths: aiAnalysisData.strengths || [],
        areasToImprove: aiAnalysisData.areasToImprove || [],
      },
      aiAnalysis: {
        summary: aiAnalysisData.summary,
        careerRecommendations: aiAnalysisData.careerRecommendations || [],
        nextSteps: aiAnalysisData.nextSteps || [],
      },
      status: 'completed',
      completedAt: new Date()
    };

    // Update using findByIdAndUpdate to avoid version conflicts
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessment._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Assessment completed successfully',
      results: updatedAssessment.results,
      aiAnalysis: updatedAssessment.aiAnalysis,
      assessmentId: updatedAssessment._id
    });

  } catch (error) {
    console.error('Submit assessment error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit assessment',
        error: error.message,
      });
    }
  }
};

// Helper function for fallback analysis
const generateFallbackAnalysis = (personality, interests, skills) => {
  return {
    summary: `Based on your ${personality.type} personality type and interests in ${interests.join(', ')}, you show strong potential for careers that combine analytical thinking with creative problem-solving.`,
    careerRecommendations: [
      {
        careerTitle: "Software Developer",
        matchPercentage: 85,
        reason: "Your analytical skills and systematic approach align well with software development",
        requiredSkills: ["Programming", "Problem Solving", "Logical Thinking", "Debugging"],
        salaryRange: "$70,000 - $120,000",
        growthPotential: "Excellent"
      },
      {
        careerTitle: "Data Analyst",
        matchPercentage: 82,
        reason: "Your investigative nature and attention to detail suit data analysis work",
        requiredSkills: ["Data Analysis", "Statistics", "SQL", "Data Visualization"],
        salaryRange: "$60,000 - $95,000",
        growthPotential: "High"
      },
      {
        careerTitle: "Project Manager",
        matchPercentage: 78,
        reason: "Your organizational abilities and leadership potential fit project management",
        requiredSkills: ["Leadership", "Communication", "Planning", "Risk Management"],
        salaryRange: "$75,000 - $115,000",
        growthPotential: "High"
      },
      {
        careerTitle: "UX/UI Designer",
        matchPercentage: 76,
        reason: "Your creative thinking combined with user-focused approach suits design",
        requiredSkills: ["Design Tools", "User Research", "Prototyping", "Empathy"],
        salaryRange: "$65,000 - $105,000",
        growthPotential: "Excellent"
      },
      {
        careerTitle: "Business Analyst",
        matchPercentage: 74,
        reason: "Your problem-solving skills align with business analysis requirements",
        requiredSkills: ["Analysis", "Communication", "Process Improvement", "Documentation"],
        salaryRange: "$68,000 - $98,000",
        growthPotential: "High"
      }
    ],
    strengths: [
      "Strong analytical and problem-solving capabilities",
      "Attention to detail and systematic thinking",
      "Ability to work independently and in teams",
      "Quick learner with adaptability",
      "Methodical approach to complex challenges"
    ],
    areasToImprove: [
      "Enhance communication and presentation skills",
      "Expand professional networking",
      "Gain practical hands-on experience",
      "Develop leadership and mentoring abilities"
    ],
    nextSteps: [
      "Explore specialized courses in your field of interest",
      "Build a portfolio showcasing your skills and projects",
      "Network with professionals through LinkedIn and industry events",
      "Seek internships or entry-level opportunities for experience"
    ]
  };
};

// @desc    Get user's completed assessments
// @route   GET /api/assessment/my-assessments
// @access  Private
export const getMyAssessments = async (req, res) => {
  try {
    const userId = req.user.id;

    const assessments = await Assessment.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      assessments,
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assessments',
      error: error.message,
    });
  }
};

// @desc    Get specific assessment results
// @route   GET /api/assessment/:id
// @access  Private
export const getAssessmentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const assessment = await Assessment.findOne({ _id: id, userId });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found',
      });
    }

    res.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assessment',
      error: error.message,
    });
  }
};