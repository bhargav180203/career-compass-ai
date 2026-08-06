// backend/data/assessmentQuestions.js

export const assessmentQuestions = {
  personality: [
    {
      id: 'p1',
      question: 'At a party, I usually:',
      options: [
        { text: 'Talk to many people, including strangers', value: 'E', score: 5 },
        { text: 'Talk to a few people I know well', value: 'I', score: 5 },
      ],
      category: 'personality',
      trait: 'extroversion-introversion',
    },
    {
      id: 'p2',
      question: 'When making decisions, I tend to:',
      options: [
        { text: 'Focus on facts and logical analysis', value: 'T', score: 5 },
        { text: 'Consider peoples feelings and values', value: 'F', score: 5 },
      ],
      category: 'personality',
      trait: 'thinking-feeling',
    },
    {
      id: 'p3',
      question: 'I prefer to:',
      options: [
        { text: 'Plan things in advance', value: 'J', score: 5 },
        { text: 'Be spontaneous and flexible', value: 'P', score: 5 },
      ],
      category: 'personality',
      trait: 'judging-perceiving',
    },
    {
      id: 'p4',
      question: 'I get more energy from:',
      options: [
        { text: 'Being around people', value: 'E', score: 5 },
        { text: 'Spending time alone', value: 'I', score: 5 },
      ],
      category: 'personality',
      trait: 'extroversion-introversion',
    },
    {
      id: 'p5',
      question: 'When solving problems, I:',
      options: [
        { text: 'Focus on the big picture', value: 'N', score: 5 },
        { text: 'Focus on specific details', value: 'S', score: 5 },
      ],
      category: 'personality',
      trait: 'sensing-intuition',
    },
    {
      id: 'p6',
      question: 'I am more comfortable:',
      options: [
        { text: 'Following a schedule', value: 'J', score: 5 },
        { text: 'Going with the flow', value: 'P', score: 5 },
      ],
      category: 'personality',
      trait: 'judging-perceiving',
    },
    {
      id: 'p7',
      question: 'I prefer work that:',
      options: [
        { text: 'Has clear rules and procedures', value: 'S', score: 5 },
        { text: 'Allows me to be creative and innovative', value: 'N', score: 5 },
      ],
      category: 'personality',
      trait: 'sensing-intuition',
    },
    {
      id: 'p8',
      question: 'In group projects, I:',
      options: [
        { text: 'Take the lead and organize', value: 'E', score: 5 },
        { text: 'Support and contribute from behind', value: 'I', score: 5 },
      ],
      category: 'personality',
      trait: 'extroversion-introversion',
    },
    {
      id: 'p9',
      question: 'When criticized, I:',
      options: [
        { text: 'Analyze the logic of the criticism', value: 'T', score: 5 },
        { text: 'Consider how it makes me feel', value: 'F', score: 5 },
      ],
      category: 'personality',
      trait: 'thinking-feeling',
    },
    {
      id: 'p10',
      question: 'I would rather:',
      options: [
        { text: 'Work on practical, real-world problems', value: 'S', score: 5 },
        { text: 'Explore theoretical concepts and ideas', value: 'N', score: 5 },
      ],
      category: 'personality',
      trait: 'sensing-intuition',
    },
  ],

  interests: [
    {
      id: 'i1',
      question: 'I enjoy working with:',
      options: [
        { text: 'Tools, machines, and physical objects', value: 'R', score: 5 },
        { text: 'Data, numbers, and analysis', value: 'I', score: 5 },
        { text: 'Creative materials and artistic expression', value: 'A', score: 5 },
        { text: 'People, helping and teaching', value: 'S', score: 5 },
        { text: 'Leading and persuading others', value: 'E', score: 5 },
        { text: 'Organizing data and following procedures', value: 'C', score: 5 },
      ],
      category: 'interests',
      trait: 'holland-code',
    },
    {
      id: 'i2',
      question: 'In my free time, I prefer to:',
      options: [
        { text: 'Fix or build things', value: 'R', score: 5 },
        { text: 'Read, research, or learn new things', value: 'I', score: 5 },
        { text: 'Create art, music, or write', value: 'A', score: 5 },
        { text: 'Volunteer or help others', value: 'S', score: 5 },
        { text: 'Start projects or lead activities', value: 'E', score: 5 },
        { text: 'Organize and plan events', value: 'C', score: 5 },
      ],
      category: 'interests',
      trait: 'holland-code',
    },
    {
      id: 'i3',
      question: 'I am most interested in:',
      options: [
        { text: 'Outdoor activities and hands-on work', value: 'R', score: 5 },
        { text: 'Science, technology, and problem-solving', value: 'I', score: 5 },
        { text: 'Arts, design, and creative expression', value: 'A', score: 5 },
        { text: 'Working with people and communities', value: 'S', score: 5 },
        { text: 'Business, sales, and leadership', value: 'E', score: 5 },
        { text: 'Administration and detailed work', value: 'C', score: 5 },
      ],
      category: 'interests',
      trait: 'holland-code',
    },
    {
      id: 'i4',
      question: 'My ideal job would involve:',
      options: [
        { text: 'Working with equipment or in nature', value: 'R', score: 5 },
        { text: 'Conducting research and analysis', value: 'I', score: 5 },
        { text: 'Designing and creating new things', value: 'A', score: 5 },
        { text: 'Teaching or counseling others', value: 'S', score: 5 },
        { text: 'Managing and influencing people', value: 'E', score: 5 },
        { text: 'Maintaining records and systems', value: 'C', score: 5 },
      ],
      category: 'interests',
      trait: 'holland-code',
    },
    {
      id: 'i5',
      question: 'I feel most satisfied when:',
      options: [
        { text: 'I complete a practical task', value: 'R', score: 5 },
        { text: 'I solve a complex problem', value: 'I', score: 5 },
        { text: 'I create something unique', value: 'A', score: 5 },
        { text: 'I help someone succeed', value: 'S', score: 5 },
        { text: 'I achieve a goal or close a deal', value: 'E', score: 5 },
        { text: 'I organize something efficiently', value: 'C', score: 5 },
      ],
      category: 'interests',
      trait: 'holland-code',
    },
  ],

  skills: [
    {
      id: 's1',
      question: 'How comfortable are you with public speaking?',
      options: [
        { text: 'Very comfortable', value: 'high', score: 5 },
        { text: 'Somewhat comfortable', value: 'medium', score: 3 },
        { text: 'Not comfortable', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'communication',
    },
    {
      id: 's2',
      question: 'How would you rate your problem-solving abilities?',
      options: [
        { text: 'Excellent', value: 'high', score: 5 },
        { text: 'Good', value: 'medium', score: 3 },
        { text: 'Need improvement', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'analytical',
    },
    {
      id: 's3',
      question: 'How comfortable are you with technology and software?',
      options: [
        { text: 'Very comfortable', value: 'high', score: 5 },
        { text: 'Moderately comfortable', value: 'medium', score: 3 },
        { text: 'Not comfortable', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'technical',
    },
    {
      id: 's4',
      question: 'How well do you work in teams?',
      options: [
        { text: 'Very well', value: 'high', score: 5 },
        { text: 'Reasonably well', value: 'medium', score: 3 },
        { text: 'Prefer working alone', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'teamwork',
    },
    {
      id: 's5',
      question: 'How creative are you?',
      options: [
        { text: 'Very creative', value: 'high', score: 5 },
        { text: 'Moderately creative', value: 'medium', score: 3 },
        { text: 'Not very creative', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'creativity',
    },
    {
      id: 's6',
      question: 'How organized are you?',
      options: [
        { text: 'Very organized', value: 'high', score: 5 },
        { text: 'Moderately organized', value: 'medium', score: 3 },
        { text: 'Not organized', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'organization',
    },
    {
      id: 's7',
      question: 'How good are you at managing time and deadlines?',
      options: [
        { text: 'Excellent', value: 'high', score: 5 },
        { text: 'Good', value: 'medium', score: 3 },
        { text: 'Need improvement', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'time-management',
    },
    {
      id: 's8',
      question: 'How comfortable are you with leading others?',
      options: [
        { text: 'Very comfortable', value: 'high', score: 5 },
        { text: 'Somewhat comfortable', value: 'medium', score: 3 },
        { text: 'Not comfortable', value: 'low', score: 1 },
      ],
      category: 'skills',
      skill: 'leadership',
    },
  ],

  workStyle: [
    {
      id: 'w1',
      question: 'I prefer to work:',
      options: [
        { text: 'In a structured office environment', value: 'structured', score: 5 },
        { text: 'With flexibility (remote/hybrid)', value: 'flexible', score: 5 },
        { text: 'Outdoors or on the move', value: 'dynamic', score: 5 },
      ],
      category: 'workStyle',
      trait: 'environment',
    },
    {
      id: 'w2',
      question: 'My ideal work schedule is:',
      options: [
        { text: 'Fixed 9-5 schedule', value: 'fixed', score: 5 },
        { text: 'Flexible hours', value: 'flexible', score: 5 },
        { text: 'Project-based deadlines', value: 'deadline-driven', score: 5 },
      ],
      category: 'workStyle',
      trait: 'schedule',
    },
    {
      id: 'w3',
      question: 'I work best:',
      options: [
        { text: 'Independently', value: 'independent', score: 5 },
        { text: 'In a team', value: 'collaborative', score: 5 },
        { text: 'Mix of both', value: 'mixed', score: 5 },
      ],
      category: 'workStyle',
      trait: 'collaboration',
    },
    {
      id: 'w4',
      question: 'I prefer work that is:',
      options: [
        { text: 'Routine and predictable', value: 'routine', score: 5 },
        { text: 'Varied and changing', value: 'varied', score: 5 },
        { text: 'Fast-paced and challenging', value: 'fast-paced', score: 5 },
      ],
      category: 'workStyle',
      trait: 'pace',
    },
    {
      id: 'w5',
      question: 'I am motivated by:',
      options: [
        { text: 'Money and benefits', value: 'financial', score: 5 },
        { text: 'Making a difference', value: 'impact', score: 5 },
        { text: 'Learning and growth', value: 'growth', score: 5 },
        { text: 'Recognition and status', value: 'recognition', score: 5 },
      ],
      category: 'workStyle',
      trait: 'motivation',
    },
  ],
};