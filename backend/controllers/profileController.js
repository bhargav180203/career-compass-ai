// backend/controllers/profileController.js
import Profile from '../models/Profile.js';
import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/profile/me
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let profile = await Profile.findOne({ userId }).populate('userId', 'firstName lastName email profilePicture');

    // Create profile if doesn't exist
    if (!profile) {
      profile = await Profile.create({ userId });
      await profile.populate('userId', 'firstName lastName email profilePicture');
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// @desc    Update personal information
// @route   PUT /api/profile/personal-info
// @access  Private
export const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { personalInfo } = req.body;

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId, personalInfo });
    } else {
      profile.personalInfo = { ...profile.personalInfo, ...personalInfo };
      await profile.save();
    }

    // Update user's profile completeness
    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Personal information updated',
      data: profile
    });
  } catch (error) {
    console.error('Update personal info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update personal information',
      error: error.message
    });
  }
};

// @desc    Add education
// @route   POST /api/profile/education
// @access  Private
export const addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const educationData = req.body;

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    profile.education.push(educationData);
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Education added successfully',
      data: profile.education
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add education',
      error: error.message
    });
  }
};

// @desc    Update education
// @route   PUT /api/profile/education/:id
// @access  Private
export const updateEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const educationData = req.body;

    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const educationIndex = profile.education.findIndex(edu => edu._id.toString() === id);
    
    if (educationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }

    profile.education[educationIndex] = { 
      ...profile.education[educationIndex].toObject(), 
      ...educationData,
      _id: profile.education[educationIndex]._id 
    };
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Education updated successfully',
      data: profile.education
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update education',
      error: error.message
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/profile/education/:id
// @access  Private
export const deleteEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.education = profile.education.filter(edu => edu._id.toString() !== id);
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Education deleted successfully',
      data: profile.education
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete education',
      error: error.message
    });
  }
};

// @desc    Add experience
// @route   POST /api/profile/experience
// @access  Private
export const addExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const experienceData = req.body;

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    profile.experience.push(experienceData);
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Experience added successfully',
      data: profile.experience
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add experience',
      error: error.message
    });
  }
};

// @desc    Update experience
// @route   PUT /api/profile/experience/:id
// @access  Private
export const updateExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const experienceData = req.body;

    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const experienceIndex = profile.experience.findIndex(exp => exp._id.toString() === id);
    
    if (experienceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Experience entry not found'
      });
    }

    profile.experience[experienceIndex] = { 
      ...profile.experience[experienceIndex].toObject(), 
      ...experienceData,
      _id: profile.experience[experienceIndex]._id 
    };
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: profile.experience
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error.message
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/profile/experience/:id
// @access  Private
export const deleteExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.experience = profile.experience.filter(exp => exp._id.toString() !== id);
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Experience deleted successfully',
      data: profile.experience
    });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience',
      error: error.message
    });
  }
};

// @desc    Add/Update skills
// @route   PUT /api/profile/skills
// @access  Private
export const updateSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills } = req.body;

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    profile.skills = skills;
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: profile.skills
    });
  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skills',
      error: error.message
    });
  }
};

// @desc    Add certification
// @route   POST /api/profile/certification
// @access  Private
export const addCertification = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificationData = req.body;

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    profile.certifications.push(certificationData);
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Certification added successfully',
      data: profile.certifications
    });
  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add certification',
      error: error.message
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/profile/certification/:id
// @access  Private
export const deleteCertification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    profile.certifications = profile.certifications.filter(cert => cert._id.toString() !== id);
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Certification deleted successfully',
      data: profile.certifications
    });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete certification',
      error: error.message
    });
  }
};

// @desc    Update career preferences
// @route   PUT /api/profile/career-preferences
// @access  Private
export const updateCareerPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { careerPreferences } = req.body;

    let profile = await Profile.findOne({ userId });
    
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    profile.careerPreferences = { ...profile.careerPreferences, ...careerPreferences };
    await profile.save();

    await User.findByIdAndUpdate(userId, { 
      profileCompleteness: profile.completeness 
    });

    res.json({
      success: true,
      message: 'Career preferences updated successfully',
      data: profile.careerPreferences
    });
  } catch (error) {
    console.error('Update career preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update career preferences',
      error: error.message
    });
  }
};