// backend/controllers/careerController.js
import Career from '../models/Career.js';
import Assessment from '../models/Assessment.js';

// Get all careers with filtering, search, and pagination
export const getAllCareers = async (req, res) => {
  try {
    const {
      search,
      industry,
      educationRequired,
      experienceLevel,
      minSalary,
      maxSalary,
      hollandCodes,
      personalityTypes,
      growthOutlook,
      sortBy = 'featured',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Industry filter
    if (industry) {
      query.industry = industry;
    }

    // Education filter
    if (educationRequired) {
      query.educationRequired = educationRequired;
    }

    // Experience level filter
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query['salary.median'] = {};
      if (minSalary) query['salary.median'].$gte = Number(minSalary);
      if (maxSalary) query['salary.median'].$lte = Number(maxSalary);
    }

    // Holland codes filter
    if (hollandCodes) {
      const codes = hollandCodes.split(',');
      query.hollandCodes = { $in: codes };
    }

    // Personality types filter
    if (personalityTypes) {
      const types = personalityTypes.split(',');
      query.personalityTypes = { $in: types };
    }

    // Growth outlook filter
    if (growthOutlook) {
      query['growthOutlook.rate'] = growthOutlook;
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'salary-high':
        sort = { 'salary.median': -1 };
        break;
      case 'salary-low':
        sort = { 'salary.median': 1 };
        break;
      case 'growth':
        sort = { 'growthOutlook.percentage': -1 };
        break;
      case 'title':
        sort = { title: 1 };
        break;
      case 'featured':
      default:
        sort = { featured: -1, views: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const careers = await Career.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-relatedCareers -resources'); // Exclude heavy fields for list view

    // Get total count
    const total = await Career.countDocuments(query);

    res.json({
      success: true,
      data: careers,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalCareers: total,
        hasMore: skip + careers.length < total
      }
    });
  } catch (error) {
    console.error('Get careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch careers',
      error: error.message
    });
  }
};

// Get single career by slug
export const getCareerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const career = await Career.findOne({ slug, isActive: true })
      .populate('relatedCareers', 'title slug industry salary category');

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    // Increment views
    await career.incrementViews();

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    console.error('Get career error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch career details',
      error: error.message
    });
  }
};

// Get recommended careers based on user's assessment
export const getRecommendedCareers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's latest completed assessment
    const assessment = await Assessment.findOne({
      userId,
      status: 'completed'
    }).sort({ completedAt: -1 });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'No completed assessment found. Please complete an assessment first.'
      });
    }

    const { personalityType, dominantInterests, topSkills } = assessment.results;

    // Find matching careers
    const recommendedCareers = await Career.find({
      isActive: true,
      $or: [
        { personalityTypes: personalityType },
        { hollandCodes: { $in: dominantInterests } }
      ]
    })
      .limit(20)
      .select('title slug description industry salary category growthOutlook personalityTypes hollandCodes');

    // Calculate match scores
    const careersWithScores = recommendedCareers.map(career => {
      let matchScore = 0;

      // Personality match (40%)
      if (career.personalityTypes.includes(personalityType)) {
        matchScore += 40;
      }

      // Interest match (40%)
      const matchingInterests = career.hollandCodes.filter(code =>
        dominantInterests.includes(code)
      );
      matchScore += (matchingInterests.length / dominantInterests.length) * 40;

      // Skills match (20%)
      if (career.skills && career.skills.technical) {
        const matchingSkills = career.skills.technical.filter(skill =>
          topSkills.some(userSkill =>
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        matchScore += (matchingSkills.length / Math.max(topSkills.length, 1)) * 20;
      }

      return {
        ...career.toObject(),
        matchScore: Math.round(matchScore)
      };
    });

    // Sort by match score
    careersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: careersWithScores.slice(0, 12), // Top 12 matches
      assessmentDate: assessment.completedAt
    });
  } catch (error) {
    console.error('Get recommended careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get career recommendations',
      error: error.message
    });
  }
};

// Get filter options (for frontend dropdowns)
export const getFilterOptions = async (req, res) => {
  try {
    const industries = await Career.distinct('industry', { isActive: true });
    const educationLevels = await Career.distinct('educationRequired', { isActive: true });
    const experienceLevels = await Career.distinct('experienceLevel', { isActive: true });
    const hollandCodes = await Career.distinct('hollandCodes', { isActive: true });
    const growthRates = await Career.distinct('growthOutlook.rate', { isActive: true });

    // Get salary range
    const salaryStats = await Career.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          minSalary: { $min: '$salary.min' },
          maxSalary: { $max: '$salary.max' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        industries: industries.sort(),
        educationLevels: educationLevels.sort(),
        experienceLevels: experienceLevels.sort(),
        hollandCodes: hollandCodes.sort(),
        growthRates: growthRates.sort(),
        salaryRange: salaryStats[0] || { minSalary: 0, maxSalary: 200000 }
      }
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
};

// Get featured careers (for homepage)
export const getFeaturedCareers = async (req, res) => {
  try {
    const featuredCareers = await Career.find({
      isActive: true,
      featured: true
    })
      .sort({ views: -1 })
      .limit(6)
      .select('title slug description industry salary category growthOutlook');

    res.json({
      success: true,
      data: featuredCareers
    });
  } catch (error) {
    console.error('Get featured careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured careers',
      error: error.message
    });
  }
};

// Search careers (autocomplete)
export const searchCareers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const careers = await Career.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    })
      .limit(10)
      .select('title slug industry category');

    res.json({
      success: true,
      data: careers
    });
  } catch (error) {
    console.error('Search careers error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

// Get career statistics (for dashboard/homepage)
export const getCareerStats = async (req, res) => {
  try {
    const totalCareers = await Career.countDocuments({ isActive: true });

    const industryStats = await Career.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const avgSalary = await Career.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avgMedian: { $avg: '$salary.median' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalCareers,
        industries: industryStats,
        averageSalary: Math.round(avgSalary[0]?.avgMedian || 0)
      }
    });
  } catch (error) {
    console.error('Get career stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};