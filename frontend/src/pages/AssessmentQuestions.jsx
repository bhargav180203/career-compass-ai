import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AssessmentQuestions = () => {
  const [questions, setQuestions] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('personality');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({
    personality: [],
    interests: [],
    skills: [],
    workStyle: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const assessmentId = location.state?.assessmentId;

  const categories = ['personality', 'interests', 'skills', 'workStyle'];
  const categoryNames = {
    personality: 'Personality Assessment',
    interests: 'Interest Inventory',
    skills: 'Skills Assessment',
    workStyle: 'Work Style Preferences',
  };

  useEffect(() => {
    if (!assessmentId) {
      navigate('/assessment/start');
      return;
    }
    fetchQuestions();
  }, [assessmentId, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/assessment/questions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
  console.error('Fetch questions error:', error);
  console.log('Status:', error.response?.status);
  console.log('Response:', error.response?.data);
  console.log('URL:', error.config?.url);
  alert('Failed to load questions');
    }
  };

  const handleAnswer = (answer, score) => {
    const currentQuestion = getCurrentQuestion();
    
    const response = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: answer,
      score: score,
    };

    setResponses(prev => ({
      ...prev,
      [currentCategory]: [...prev[currentCategory], response],
    }));

    // Move to next question
    setTimeout(() => {
      moveToNext();
    }, 300);
  };

  const moveToNext = () => {
    const currentCategoryQuestions = questions[currentCategory];
    
    if (currentQuestionIndex < currentCategoryQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to next category
      const currentCategoryIdx = categories.indexOf(currentCategory);
      if (currentCategoryIdx < categories.length - 1) {
        setCurrentCategory(categories[currentCategoryIdx + 1]);
        setCurrentQuestionIndex(0);
      } else {
        // Assessment complete
        submitAssessment();
      }
    }
  };

  const moveToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Remove last response
      setResponses(prev => ({
        ...prev,
        [currentCategory]: prev[currentCategory].slice(0, -1),
      }));
    } else {
      // Move to previous category
      const currentCategoryIdx = categories.indexOf(currentCategory);
      if (currentCategoryIdx > 0) {
        const prevCategory = categories[currentCategoryIdx - 1];
        setCurrentCategory(prevCategory);
        setCurrentQuestionIndex(questions[prevCategory].length - 1);
        // Remove last response from previous category
        setResponses(prev => ({
          ...prev,
          [prevCategory]: prev[prevCategory].slice(0, -1),
        }));
      }
    }
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/assessment/submit`,
        {
          assessmentId,
          responses,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/assessment/results', {
        state: { 
          results: response.data.results,
          aiAnalysis: response.data.aiAnalysis,
        },
      });
    } catch (error) {
      console.error('Submit assessment error:', error);
      alert('Failed to submit assessment');
      setSubmitting(false);
    }
  };

  const getCurrentQuestion = () => {
    if (!questions) return null;
    return questions[currentCategory][currentQuestionIndex];
  };

  const getTotalProgress = () => {
    if (!questions) return 0;
    const totalQuestions = Object.values(questions).reduce((sum, arr) => sum + arr.length, 0);
    const answeredQuestions = Object.values(responses).reduce((sum, arr) => sum + arr.length, 0);
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getCategoryProgress = () => {
    if (!questions) return 0;
    const totalInCategory = questions[currentCategory].length;
    return Math.round((responses[currentCategory].length / totalInCategory) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <p className="text-gray-600 font-semibold">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-5xl">🤖</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Responses...</h2>
          <p className="text-gray-600">Our AI is generating your personalized career recommendations</p>
          <div className="mt-6">
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Header with Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{categoryNames[currentCategory]}</h2>
              <span className="text-sm font-semibold text-indigo-600">
                {getTotalProgress()}% Complete
              </span>
            </div>
            
            {/* Overall Progress Bar */}
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{ width: `${getTotalProgress()}%` }}
              ></div>
            </div>

            {/* Category Progress */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {questions[currentCategory].length}</span>
              <span>{getCategoryProgress()}% in this section</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">
                    {currentCategory === 'personality' && '🧠'}
                    {currentCategory === 'interests' && '💡'}
                    {currentCategory === 'skills' && '⚡'}
                    {currentCategory === 'workStyle' && '💼'}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                {currentQuestion.question}
              </h3>
              <p className="text-gray-500 text-center text-sm">Choose the option that best describes you</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value, option.score)}
                  className="w-full p-5 text-left border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition transform hover:scale-105 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="font-bold text-indigo-600">{String.fromCharCode(65 + index)}</span>
                    </div>
                    <span className="text-gray-800 font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={moveToPrevious}
              disabled={currentQuestionIndex === 0 && currentCategory === 'personality'}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex gap-2">
              {categories.map((cat, idx) => (
                <div
                  key={cat}
                  className={`w-3 h-3 rounded-full transition ${
                    categories.indexOf(currentCategory) > idx
                      ? 'bg-green-500'
                      : categories.indexOf(currentCategory) === idx
                      ? 'bg-indigo-600'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>

            <div className="w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentQuestions;