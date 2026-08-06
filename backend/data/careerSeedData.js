// backend/data/careerSeedData.js
export const careersData = [
  // TECHNOLOGY CAREERS
  {
    title: "Software Engineer",
    slug: "software-engineer",
    description: "Design, develop, and maintain software applications and systems. Work with various programming languages and frameworks to create efficient, scalable solutions.",
    industry: "Technology",
    category: "Software Development",
    salary: { min: 70000, max: 180000, median: 110000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["JavaScript", "Python", "Java", "Git", "SQL", "API Development", "Cloud Computing"],
      soft: ["Problem Solving", "Teamwork", "Communication", "Time Management"]
    },
    growthOutlook: {
      rate: "Fast Growing",
      percentage: 22,
      description: "Much faster than average due to increasing demand for software across all industries"
    },
    personalityTypes: ["INTJ", "INTP", "ISTJ"],
    hollandCodes: ["Investigative", "Realistic", "Conventional"],
    dayInLife: "Start day reviewing code from team, attend stand-up meeting, work on feature development, collaborate with designers and product managers, debug issues, write tests, and document code.",
    workEnvironment: "Primarily office or remote work with flexible hours. Collaborative team environment with focus time for coding.",
    advantages: ["High salary potential", "Remote work options", "Creative problem solving", "Continuous learning"],
    challenges: ["Tight deadlines", "Rapidly changing technology", "Complex problem solving", "Sedentary work"],
    careerPath: {
      entryLevel: "Junior Software Engineer",
      midLevel: "Senior Software Engineer / Tech Lead",
      seniorLevel: "Engineering Manager / Principal Engineer"
    },
    topCompanies: ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
    certifications: ["AWS Certified Developer", "Oracle Certified Professional", "Microsoft Certified"],
    featured: true
  },
  {
    title: "Data Scientist",
    slug: "data-scientist",
    description: "Analyze complex data sets to help organizations make informed decisions. Use statistical methods, machine learning, and data visualization.",
    industry: "Technology",
    category: "Data & Analytics",
    salary: { min: 80000, max: 200000, median: 120000, currency: "USD" },
    educationRequired: "Master's Degree",
    experienceLevel: "Mid Level",
    skills: {
      technical: ["Python", "R", "SQL", "Machine Learning", "Statistics", "TensorFlow", "Data Visualization"],
      soft: ["Analytical Thinking", "Communication", "Business Acumen", "Curiosity"]
    },
    growthOutlook: {
      rate: "Explosive Growth",
      percentage: 36,
      description: "Extremely high demand as organizations increasingly rely on data-driven decisions"
    },
    personalityTypes: ["INTJ", "INTP", "ENTJ"],
    hollandCodes: ["Investigative", "Conventional"],
    dayInLife: "Analyze datasets, build predictive models, create visualizations, present findings to stakeholders, collaborate with engineers to deploy models.",
    workEnvironment: "Office or remote with mix of independent analysis and team collaboration.",
    advantages: ["High demand", "Intellectual challenges", "Impact on business decisions", "Excellent compensation"],
    challenges: ["Requires advanced education", "Complex mathematics", "Data quality issues", "Explaining technical concepts"],
    careerPath: {
      entryLevel: "Data Analyst",
      midLevel: "Senior Data Scientist",
      seniorLevel: "Lead Data Scientist / Director of Data Science"
    },
    topCompanies: ["Google", "Netflix", "Amazon", "LinkedIn", "Airbnb"],
    certifications: ["Google Data Analytics", "IBM Data Science", "Microsoft Certified: Azure Data Scientist"],
    featured: true
  },
  {
    title: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    description: "Protect computer networks and systems from cyber threats. Monitor security systems, investigate breaches, and implement security measures.",
    industry: "Technology",
    category: "Information Security",
    salary: { min: 65000, max: 130000, median: 88000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["CAD Software", "SolidWorks", "AutoCAD", "Thermodynamics", "Manufacturing Processes", "FEA"],
      soft: ["Problem Solving", "Creativity", "Teamwork", "Attention to Detail"]
    },
    growthOutlook: {
      rate: "Stable",
      percentage: 7,
      description: "Steady growth across manufacturing and technology sectors"
    },
    personalityTypes: ["ISTP", "INTJ", "INTP", "ISTJ"],
    hollandCodes: ["Realistic", "Investigative"],
    dayInLife: "Design components, run simulations, create prototypes, test products, collaborate with teams, document designs.",
    workEnvironment: "Mix of office design work and lab/factory floor testing.",
    advantages: ["Problem solving", "Tangible results", "Variety", "Good salary"],
    challenges: ["Project deadlines", "Budget constraints", "Complex calculations", "Regulatory requirements"],
    careerPath: {
      entryLevel: "Mechanical Engineer",
      midLevel: "Senior Mechanical Engineer / Project Lead",
      seniorLevel: "Engineering Manager / Chief Engineer"
    },
    topCompanies: ["Boeing", "Tesla", "SpaceX", "General Electric", "Ford"],
    certifications: ["PE License", "Six Sigma", "PMP"],
    featured: true
  },
  {
    title: "Civil Engineer",
    slug: "civil-engineer",
    description: "Plan, design, and oversee construction of infrastructure projects like roads, bridges, buildings, and water systems.",
    industry: "Engineering",
    category: "Civil",
    salary: { min: 60000, max: 120000, median: 82000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["AutoCAD Civil 3D", "Structural Analysis", "Project Management", "Surveying", "Construction Methods"],
      soft: ["Problem Solving", "Communication", "Leadership", "Time Management"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 8,
      description: "Growth driven by infrastructure development and maintenance needs"
    },
    personalityTypes: ["ISTJ", "INTJ", "ESTJ"],
    hollandCodes: ["Realistic", "Investigative", "Conventional"],
    dayInLife: "Review plans, conduct site inspections, coordinate with contractors, ensure code compliance, manage budgets.",
    workEnvironment: "Mix of office work and construction site visits in various weather conditions.",
    advantages: ["Visible impact", "Project variety", "Job stability", "Professional respect"],
    challenges: ["Long project timelines", "Regulatory complexity", "Site conditions", "Budget pressures"],
    careerPath: {
      entryLevel: "Civil Engineer",
      midLevel: "Senior Civil Engineer / Project Manager",
      seniorLevel: "Principal Engineer / Engineering Director"
    },
    topCompanies: ["AECOM", "Jacobs", "Bechtel", "Fluor", "Kiewit"],
    certifications: ["PE License", "LEED", "PMP"],
    featured: false
  },
  {
    title: "Electrical Engineer",
    slug: "electrical-engineer",
    description: "Design, develop, and test electrical equipment and systems from small circuits to large power grids.",
    industry: "Engineering",
    category: "Electrical",
    salary: { min: 68000, max: 135000, median: 95000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Circuit Design", "MATLAB", "PCB Design", "Control Systems", "Power Systems", "Testing Equipment"],
      soft: ["Analytical Thinking", "Attention to Detail", "Problem Solving", "Teamwork"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 7,
      description: "Steady demand across electronics, power, and technology sectors"
    },
    personalityTypes: ["INTJ", "INTP", "ISTJ", "ISTP"],
    hollandCodes: ["Investigative", "Realistic"],
    dayInLife: "Design circuits, run simulations, test prototypes, troubleshoot issues, document specifications, collaborate with teams.",
    workEnvironment: "Office and laboratory with hands-on equipment work.",
    advantages: ["Diverse applications", "Problem solving", "Technology advancement", "Good compensation"],
    challenges: ["Rapid technology changes", "Complex mathematics", "Safety considerations", "Project pressure"],
    careerPath: {
      entryLevel: "Electrical Engineer",
      midLevel: "Senior Electrical Engineer / Lead Engineer",
      seniorLevel: "Principal Engineer / Engineering Director"
    },
    topCompanies: ["Intel", "Texas Instruments", "Siemens", "General Electric", "Lockheed Martin"],
    certifications: ["PE License", "NICET", "IEEE Certifications"],
    featured: false
  },

  // ARTS & MEDIA CAREERS
  {
    title: "Graphic Designer",
    slug: "graphic-designer",
    description: "Create visual concepts to communicate ideas through digital or print media, including logos, websites, and marketing materials.",
    industry: "Arts & Media",
    category: "Visual Design",
    salary: { min: 40000, max: 85000, median: 55000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Adobe Creative Suite", "Typography", "Layout Design", "Branding", "Print Production"],
      soft: ["Creativity", "Communication", "Time Management", "Attention to Detail"]
    },
    growthOutlook: {
      rate: "Stable",
      percentage: 3,
      description: "Moderate growth with competition from freelancers and automation"
    },
    personalityTypes: ["ISFP", "INFP", "ENFP", "ISFJ"],
    hollandCodes: ["Artistic", "Realistic"],
    dayInLife: "Meet with clients, brainstorm concepts, create designs, revise based on feedback, prepare files for production.",
    workEnvironment: "Creative studio or remote with flexible hours and collaborative work.",
    advantages: ["Creative expression", "Portfolio diversity", "Freelance options", "Visual impact"],
    challenges: ["Subjective feedback", "Tight deadlines", "Client revisions", "Income variability"],
    careerPath: {
      entryLevel: "Junior Graphic Designer",
      midLevel: "Senior Graphic Designer / Art Director",
      seniorLevel: "Creative Director / Design Director"
    },
    topCompanies: ["Design Agencies", "In-house Corporate Teams", "Publishing Houses"],
    certifications: ["Adobe Certified Professional", "Portfolio-based career"],
    featured: false
  },
  {
    title: "Content Writer",
    slug: "content-writer",
    description: "Create engaging written content for websites, blogs, marketing materials, and social media to inform and attract audiences.",
    industry: "Arts & Media",
    category: "Writing",
    salary: { min: 38000, max: 80000, median: 52000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["SEO Writing", "Content Management Systems", "Research", "Copywriting", "Editing"],
      soft: ["Writing Skills", "Creativity", "Adaptability", "Time Management"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 9,
      description: "Strong growth driven by digital marketing and content needs"
    },
    personalityTypes: ["INFP", "INFJ", "ENFP", "INTP"],
    hollandCodes: ["Artistic", "Investigative"],
    dayInLife: "Research topics, write articles, optimize for SEO, edit content, collaborate with marketing teams, publish content.",
    workEnvironment: "Remote or office with independent work and creative freedom.",
    advantages: ["Creative work", "Flexible location", "Variety of topics", "Portfolio building"],
    challenges: ["Lower starting salary", "Writer's block", "Tight deadlines", "SEO constraints"],
    careerPath: {
      entryLevel: "Content Writer",
      midLevel: "Senior Content Writer / Content Strategist",
      seniorLevel: "Content Manager / Editorial Director"
    },
    topCompanies: ["Marketing Agencies", "Media Companies", "Tech Companies"],
    certifications: ["HubSpot Content Marketing", "Google Analytics", "Portfolio-based"],
    featured: false
  },
  {
    title: "Video Editor",
    slug: "video-editor",
    description: "Edit video footage, add effects and graphics, create compelling narratives, and produce final content for various media.",
    industry: "Arts & Media",
    category: "Video Production",
    salary: { min: 42000, max: 90000, median: 58000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading", "Audio Editing"],
      soft: ["Creativity", "Attention to Detail", "Time Management", "Collaboration"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 12,
      description: "Strong growth due to video content explosion across platforms"
    },
    personalityTypes: ["ISFP", "ISTP", "INFP"],
    hollandCodes: ["Artistic", "Realistic"],
    dayInLife: "Review footage, create rough cuts, add effects and transitions, adjust audio, export final videos, collaborate with directors.",
    workEnvironment: "Studio or remote with deadline-driven project work.",
    advantages: ["Creative work", "Growing industry", "Diverse projects", "Remote options"],
    challenges: ["Tight deadlines", "Long sitting hours", "Revision cycles", "Software learning curve"],
    careerPath: {
      entryLevel: "Video Editor",
      midLevel: "Senior Editor / Lead Editor",
      seniorLevel: "Post-Production Supervisor / Creative Director"
    },
    topCompanies: ["Film Studios", "Production Companies", "YouTube/Streaming", "Advertising Agencies"],
    certifications: ["Adobe Certified Professional", "Apple Certified Pro"],
    featured: false
  },

  // SCIENCE & RESEARCH CAREERS
  {
    title: "Research Scientist",
    slug: "research-scientist",
    description: "Conduct experiments, analyze data, and advance knowledge in specific scientific fields through systematic investigation.",
    industry: "Science & Research",
    category: "Scientific Research",
    salary: { min: 65000, max: 130000, median: 88000, currency: "USD" },
    educationRequired: "Doctoral Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Laboratory Techniques", "Data Analysis", "Scientific Writing", "Statistical Software", "Research Methodology"],
      soft: ["Critical Thinking", "Patience", "Attention to Detail", "Collaboration"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 8,
      description: "Steady growth in biotech, pharma, and research institutions"
    },
    personalityTypes: ["INTJ", "INTP", "ISTJ"],
    hollandCodes: ["Investigative", "Realistic"],
    dayInLife: "Design experiments, conduct research, analyze results, write papers, present findings, collaborate with colleagues, apply for grants.",
    workEnvironment: "Laboratory or research facility with independent and collaborative work.",
    advantages: ["Intellectual work", "Discovery", "Contributing to knowledge", "Academic freedom"],
    challenges: ["Long education", "Grant pressure", "Slow career progress", "Publish or perish"],
    careerPath: {
      entryLevel: "Postdoctoral Researcher",
      midLevel: "Research Scientist / Principal Investigator",
      seniorLevel: "Senior Scientist / Research Director"
    },
    topCompanies: ["Universities", "NIH", "Research Institutes", "Pharmaceutical Companies"],
    certifications: ["PhD", "Board Certifications", "Specialized Training"],
    featured: false
  },
  {
    title: "UX/UI Designer",
    slug: "ux-ui-designer",
    description: "Create intuitive and visually appealing digital experiences. Conduct user research, design interfaces, and prototype solutions.",
    industry: "Technology",
    category: "Design",
    salary: { min: 60000, max: 140000, median: 85000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Figma", "Adobe XD", "Sketch", "Prototyping", "HTML/CSS", "User Research"],
      soft: ["Creativity", "Empathy", "Communication", "Collaboration"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 16,
      description: "Strong growth as user experience becomes crucial for digital products"
    },
    personalityTypes: ["INFP", "ENFP", "ISFP", "INFJ"],
    hollandCodes: ["Artistic", "Investigative", "Social"],
    dayInLife: "Conduct user research, create wireframes and mockups, collaborate with developers, run usability tests, iterate on designs.",
    workEnvironment: "Creative office or remote environment with collaborative design sessions.",
    advantages: ["Creative work", "User impact", "Collaborative", "Portfolio-based career"],
    challenges: ["Subjective feedback", "Tight deadlines", "Balancing aesthetics and usability", "Stakeholder management"],
    careerPath: {
      entryLevel: "Junior UX/UI Designer",
      midLevel: "Senior UX Designer / UX Lead",
      seniorLevel: "Head of Design / Design Director"
    },
    topCompanies: ["Apple", "Airbnb", "Google", "Meta", "Adobe"],
    certifications: ["Google UX Design Certificate", "Nielsen Norman Group UX Certification"],
    featured: false
  },
  {
    title: "DevOps Engineer",
    slug: "devops-engineer",
    description: "Bridge development and operations teams. Automate processes, manage infrastructure, and ensure smooth software deployment.",
    industry: "Technology",
    category: "Operations",
    salary: { min: 75000, max: 170000, median: 115000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Mid Level",
    skills: {
      technical: ["Docker", "Kubernetes", "AWS", "CI/CD", "Jenkins", "Terraform", "Linux", "Python"],
      soft: ["Problem Solving", "Collaboration", "Communication", "Adaptability"]
    },
    growthOutlook: {
      rate: "Fast Growing",
      percentage: 25,
      description: "High demand for automation and cloud infrastructure expertise"
    },
    personalityTypes: ["ISTJ", "INTJ", "ISTP"],
    hollandCodes: ["Realistic", "Investigative", "Conventional"],
    dayInLife: "Manage cloud infrastructure, automate deployment pipelines, monitor system performance, troubleshoot production issues, collaborate with developers.",
    workEnvironment: "Remote or office with on-call rotation. Mix of planned work and urgent fixes.",
    advantages: ["High demand", "Automation focus", "Cloud technology", "Problem solving"],
    challenges: ["On-call duties", "High pressure", "Complex systems", "Constant learning"],
    careerPath: {
      entryLevel: "Junior DevOps Engineer",
      midLevel: "Senior DevOps Engineer / SRE",
      seniorLevel: "DevOps Architect / Director of Engineering"
    },
    topCompanies: ["Amazon", "Netflix", "Google", "Microsoft", "Atlassian"],
    certifications: ["AWS Certified DevOps", "Kubernetes Administrator", "Docker Certified"],
    featured: false
  },

  // HEALTHCARE CAREERS
  {
    title: "Registered Nurse",
    slug: "registered-nurse",
    description: "Provide patient care, educate patients about health conditions, and collaborate with healthcare teams to deliver quality treatment.",
    industry: "Healthcare",
    category: "Nursing",
    salary: { min: 60000, max: 110000, median: 75000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Patient Care", "Medical Equipment", "EMR Systems", "IV Administration", "Medication Management"],
      soft: ["Compassion", "Communication", "Critical Thinking", "Stress Management", "Teamwork"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 9,
      description: "Steady growth due to aging population and healthcare needs"
    },
    personalityTypes: ["ISFJ", "ESFJ", "INFJ", "ENFJ"],
    hollandCodes: ["Social", "Investigative", "Realistic"],
    dayInLife: "Assess patients, administer medications, monitor vital signs, coordinate care, educate patients and families, document treatment.",
    workEnvironment: "Hospitals, clinics, or care facilities with shift work including nights and weekends.",
    advantages: ["Job security", "Helping people", "Career flexibility", "Respect"],
    challenges: ["Physical demands", "Emotional stress", "Long shifts", "Exposure to illness"],
    careerPath: {
      entryLevel: "Staff Nurse",
      midLevel: "Charge Nurse / Nurse Educator",
      seniorLevel: "Nurse Manager / Director of Nursing"
    },
    topCompanies: ["Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Kaiser Permanente"],
    certifications: ["NCLEX-RN", "BLS", "ACLS", "Specialty Certifications"],
    featured: true
  },
  {
    title: "Physical Therapist",
    slug: "physical-therapist",
    description: "Help patients improve mobility, reduce pain, and recover from injuries through therapeutic exercises and treatments.",
    industry: "Healthcare",
    category: "Rehabilitation",
    salary: { min: 65000, max: 110000, median: 85000, currency: "USD" },
    educationRequired: "Doctoral Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Therapeutic Exercise", "Manual Therapy", "Gait Analysis", "Treatment Planning"],
      soft: ["Patience", "Communication", "Empathy", "Motivation", "Problem Solving"]
    },
    growthOutlook: {
      rate: "Fast Growing",
      percentage: 18,
      description: "Strong growth due to aging population and focus on rehabilitation"
    },
    personalityTypes: ["ESFJ", "ENFJ", "ISFJ"],
    hollandCodes: ["Social", "Investigative", "Realistic"],
    dayInLife: "Evaluate patients, create treatment plans, guide exercises, use therapeutic equipment, track progress, educate patients.",
    workEnvironment: "Clinics, hospitals, sports facilities, or home visits with active, hands-on work.",
    advantages: ["Patient interaction", "Seeing results", "Variety", "Job satisfaction"],
    challenges: ["Physical demands", "Insurance paperwork", "Long doctorate program", "Patient compliance"],
    careerPath: {
      entryLevel: "Physical Therapist",
      midLevel: "Senior PT / Clinical Specialist",
      seniorLevel: "PT Director / Practice Owner"
    },
    topCompanies: ["ATI Physical Therapy", "Athletico", "Select Medical", "Hospital Systems"],
    certifications: ["DPT License", "Board Certification", "Specialty Certifications"],
    featured: false
  },
  {
    title: "Medical Laboratory Scientist",
    slug: "medical-laboratory-scientist",
    description: "Perform complex laboratory tests, analyze samples, and provide critical information for patient diagnosis and treatment.",
    industry: "Healthcare",
    category: "Laboratory Sciences",
    salary: { min: 50000, max: 85000, median: 65000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Laboratory Techniques", "Microscopy", "Quality Control", "Laboratory Equipment", "Data Analysis"],
      soft: ["Attention to Detail", "Analytical Thinking", "Time Management", "Accuracy"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 11,
      description: "Steady demand for diagnostic testing and laboratory services"
    },
    personalityTypes: ["ISTJ", "INTJ", "ISFJ"],
    hollandCodes: ["Investigative", "Realistic", "Conventional"],
    dayInLife: "Analyze blood, tissue, and fluid samples, operate laboratory equipment, perform quality control, report results, maintain records.",
    workEnvironment: "Hospital or clinical laboratory with controlled environment and precise work.",
    advantages: ["Job stability", "Important role", "Less patient interaction", "Predictable hours"],
    challenges: ["Repetitive tasks", "High accuracy required", "Exposure to hazards", "Behind-the-scenes work"],
    careerPath: {
      entryLevel: "Medical Laboratory Scientist",
      midLevel: "Lead Technologist / Specialist",
      seniorLevel: "Laboratory Manager / Director"
    },
    topCompanies: ["Quest Diagnostics", "LabCorp", "Hospital Laboratory Systems"],
    certifications: ["ASCP Certification", "AMT Certification", "Specialty Certifications"],
    featured: false
  },
  {
    title: "Physician Assistant",
    slug: "physician-assistant",
    description: "Examine patients, diagnose illnesses, develop treatment plans, and prescribe medications under physician supervision.",
    industry: "Healthcare",
    category: "Medical Practice",
    salary: { min: 90000, max: 140000, median: 115000, currency: "USD" },
    educationRequired: "Master's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Patient Examination", "Diagnosis", "Treatment Planning", "Prescribing", "Medical Procedures"],
      soft: ["Decision Making", "Communication", "Empathy", "Critical Thinking", "Teamwork"]
    },
    growthOutlook: {
      rate: "Explosive Growth",
      percentage: 31,
      description: "Extremely high growth due to physician shortages and expanding PA roles"
    },
    personalityTypes: ["ENFJ", "ENTJ", "INFJ", "ISTJ"],
    hollandCodes: ["Social", "Investigative"],
    dayInLife: "See patients, perform examinations, order tests, make diagnoses, prescribe treatments, collaborate with physicians, document visits.",
    workEnvironment: "Hospitals, clinics, or specialty practices with varied patient populations.",
    advantages: ["High income", "Patient care", "Autonomy", "Career flexibility"],
    challenges: ["Educational cost", "High responsibility", "Emotional stress", "Long hours"],
    careerPath: {
      entryLevel: "Physician Assistant",
      midLevel: "Senior PA / Lead PA",
      seniorLevel: "PA Supervisor / Medical Director PA"
    },
    topCompanies: ["Hospital Systems", "Private Practices", "Urgent Care Centers"],
    certifications: ["PANCE Certification", "State Licensure", "DEA License"],
    featured: true
  },
  {
    title: "Health Information Manager",
    slug: "health-information-manager",
    description: "Manage patient health information systems, ensure data accuracy and security, and maintain compliance with healthcare regulations.",
    industry: "Healthcare",
    category: "Health Information",
    salary: { min: 55000, max: 100000, median: 75000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Mid Level",
    skills: {
      technical: ["Electronic Health Records", "Medical Coding", "HIPAA", "Data Management", "Healthcare IT"],
      soft: ["Organization", "Attention to Detail", "Leadership", "Communication"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 17,
      description: "Strong growth due to digitization of health records and data security needs"
    },
    personalityTypes: ["ISTJ", "ESTJ", "INTJ"],
    hollandCodes: ["Conventional", "Investigative", "Enterprising"],
    dayInLife: "Oversee health records, ensure compliance, manage staff, implement systems, analyze data quality, coordinate with IT.",
    workEnvironment: "Office environment in healthcare facilities with administrative focus.",
    advantages: ["Less patient contact", "Regular hours", "Growing field", "Technology integration"],
    challenges: ["Regulatory complexity", "System changes", "Data security responsibility", "Staff management"],
    careerPath: {
      entryLevel: "Health Information Technician",
      midLevel: "Health Information Manager",
      seniorLevel: "Director of Health Information / Chief Health Information Officer"
    },
    topCompanies: ["Hospital Systems", "Healthcare IT Companies", "Insurance Companies"],
    certifications: ["RHIA", "RHIT", "CCS", "CHPS"],
    featured: false
  },

  // BUSINESS & FINANCE CAREERS
  {
    title: "Financial Analyst",
    slug: "financial-analyst",
    description: "Analyze financial data, create reports and forecasts, and provide recommendations to guide business decisions and investments.",
    industry: "Business & Finance",
    category: "Financial Analysis",
    salary: { min: 55000, max: 120000, median: 75000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Excel", "Financial Modeling", "SQL", "Bloomberg Terminal", "Data Analysis", "Forecasting"],
      soft: ["Analytical Thinking", "Attention to Detail", "Communication", "Problem Solving"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 9,
      description: "Steady demand as organizations need financial insights for decision-making"
    },
    personalityTypes: ["INTJ", "ISTJ", "ENTJ", "ESTJ"],
    hollandCodes: ["Conventional", "Investigative", "Enterprising"],
    dayInLife: "Analyze financial statements, create models, prepare reports, present findings, research market trends, support budgeting.",
    workEnvironment: "Office setting with mix of independent analysis and team collaboration.",
    advantages: ["Good career path", "Analytical work", "Business impact", "Transferable skills"],
    challenges: ["Long hours", "Deadline pressure", "Detail-oriented work", "Market volatility stress"],
    careerPath: {
      entryLevel: "Financial Analyst",
      midLevel: "Senior Financial Analyst",
      seniorLevel: "Finance Manager / Director of Finance"
    },
    topCompanies: ["Goldman Sachs", "JP Morgan", "Morgan Stanley", "BlackRock", "Vanguard"],
    certifications: ["CFA", "CPA", "CFP", "FRM"],
    featured: true
  },
  {
    title: "Marketing Manager",
    slug: "marketing-manager",
    description: "Develop and execute marketing strategies, manage campaigns, analyze market trends, and oversee marketing teams.",
    industry: "Business & Finance",
    category: "Marketing",
    salary: { min: 65000, max: 150000, median: 95000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Mid Level",
    skills: {
      technical: ["Digital Marketing", "SEO/SEM", "Marketing Analytics", "Social Media", "Content Strategy", "CRM"],
      soft: ["Creativity", "Leadership", "Communication", "Strategic Thinking", "Project Management"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 10,
      description: "Consistent growth driven by digital transformation and brand importance"
    },
    personalityTypes: ["ENFP", "ENTJ", "ENTP", "ENFJ"],
    hollandCodes: ["Enterprising", "Artistic", "Social"],
    dayInLife: "Plan campaigns, manage teams, analyze metrics, coordinate with agencies, present to executives, manage budgets.",
    workEnvironment: "Fast-paced office or remote with creative collaboration and strategic planning.",
    advantages: ["Creative work", "Variety", "Business impact", "Career growth"],
    challenges: ["Pressure for results", "Fast-changing landscape", "Budget constraints", "Measuring ROI"],
    careerPath: {
      entryLevel: "Marketing Coordinator",
      midLevel: "Marketing Manager",
      seniorLevel: "Director of Marketing / Chief Marketing Officer"
    },
    topCompanies: ["Procter & Gamble", "Coca-Cola", "Unilever", "Nike", "Apple"],
    certifications: ["Google Analytics", "HubSpot", "Facebook Blueprint", "AMA PCM"],
    featured: true
  },
  {
    title: "Human Resources Manager",
    slug: "human-resources-manager",
    description: "Oversee recruitment, employee relations, benefits administration, and organizational development initiatives.",
    industry: "Business & Finance",
    category: "Human Resources",
    salary: { min: 60000, max: 130000, median: 85000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Mid Level",
    skills: {
      technical: ["HRIS", "Recruitment", "Performance Management", "Labor Law", "Benefits Administration"],
      soft: ["Communication", "Conflict Resolution", "Leadership", "Empathy", "Negotiation"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 9,
      description: "Steady demand for HR expertise in employee relations and talent management"
    },
    personalityTypes: ["ENFJ", "ESFJ", "INFJ", "ENTJ"],
    hollandCodes: ["Social", "Enterprising", "Conventional"],
    dayInLife: "Handle employee issues, oversee recruitment, manage benefits, conduct training, ensure compliance, advise management.",
    workEnvironment: "Office setting with people interaction, confidential discussions, and administrative work.",
    advantages: ["People-focused", "Variety", "Organizational impact", "Problem solving"],
    challenges: ["Difficult conversations", "Conflicting priorities", "Compliance complexity", "Emotional demands"],
    careerPath: {
      entryLevel: "HR Generalist",
      midLevel: "HR Manager",
      seniorLevel: "Director of HR / Chief Human Resources Officer"
    },
    topCompanies: ["Google", "Microsoft", "Amazon", "Salesforce", "Fortune 500 Companies"],
    certifications: ["SHRM-CP", "SHRM-SCP", "PHR", "SPHR"],
    featured: false
  },
  {
    title: "Accountant",
    slug: "accountant",
    description: "Prepare and examine financial records, ensure accuracy, assess financial operations, and ensure compliance with tax laws.",
    industry: "Business & Finance",
    category: "Accounting",
    salary: { min: 50000, max: 100000, median: 70000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Accounting Software", "Excel", "Financial Reporting", "Tax Preparation", "Auditing", "GAAP"],
      soft: ["Attention to Detail", "Analytical Thinking", "Ethics", "Time Management"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 6,
      description: "Steady demand as all organizations need accounting services"
    },
    personalityTypes: ["ISTJ", "INTJ", "ESTJ"],
    hollandCodes: ["Conventional", "Investigative"],
    dayInLife: "Record transactions, prepare financial statements, reconcile accounts, prepare tax returns, conduct audits, ensure compliance.",
    workEnvironment: "Office with busy periods during tax season and quarterly closes.",
    advantages: ["Job stability", "Clear career path", "Work-life balance (most of year)", "Transferable skills"],
    challenges: ["Busy seasons", "Repetitive tasks", "Regulatory changes", "Detail intensity"],
    careerPath: {
      entryLevel: "Staff Accountant",
      midLevel: "Senior Accountant / Accounting Manager",
      seniorLevel: "Controller / Chief Financial Officer"
    },
    topCompanies: ["Big Four (Deloitte, PwC, EY, KPMG)", "RSM", "Grant Thornton"],
    certifications: ["CPA", "CMA", "CIA", "EA"],
    featured: false
  },
  {
    title: "Management Consultant",
    slug: "management-consultant",
    description: "Analyze business problems, develop solutions, and help organizations improve performance and efficiency.",
    industry: "Business & Finance",
    category: "Consulting",
    salary: { min: 70000, max: 180000, median: 105000, currency: "USD" },
    educationRequired: "Master's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Business Analysis", "Data Analytics", "Project Management", "Financial Modeling", "PowerPoint", "Excel"],
      soft: ["Problem Solving", "Communication", "Presentation", "Leadership", "Adaptability"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 11,
      description: "Strong growth as companies seek external expertise for complex challenges"
    },
    personalityTypes: ["ENTJ", "INTJ", "ENTP", "ESTJ"],
    hollandCodes: ["Enterprising", "Investigative", "Social"],
    dayInLife: "Analyze client problems, conduct research, develop recommendations, create presentations, facilitate workshops, manage projects.",
    workEnvironment: "Fast-paced with extensive travel, client sites, and deadline-driven project work.",
    advantages: ["Variety", "Learning opportunities", "High compensation", "Networking"],
    challenges: ["Long hours", "Travel demands", "Pressure", "Work-life balance"],
    careerPath: {
      entryLevel: "Analyst / Associate Consultant",
      midLevel: "Senior Consultant / Manager",
      seniorLevel: "Partner / Managing Director"
    },
    topCompanies: ["McKinsey", "BCG", "Bain", "Deloitte", "Accenture"],
    certifications: ["MBA", "PMP", "Six Sigma", "CMC"],
    featured: true
  },

  // EDUCATION CAREERS
  {
    title: "High School Teacher",
    slug: "high-school-teacher",
    description: "Educate students in specific subjects, develop lesson plans, assess student progress, and foster a positive learning environment.",
    industry: "Education",
    category: "Secondary Education",
    salary: { min: 45000, max: 80000, median: 60000, currency: "USD" },
    educationRequired: "Bachelor's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Curriculum Development", "Classroom Management", "Assessment Design", "Educational Technology"],
      soft: ["Communication", "Patience", "Creativity", "Empathy", "Leadership"]
    },
    growthOutlook: {
      rate: "Growing",
      percentage: 5,
      description: "Steady demand with shortages in certain subjects and regions"
    },
    personalityTypes: ["ENFJ", "ESFJ", "INFJ", "ISFJ"],
    hollandCodes: ["Social", "Artistic"],
    dayInLife: "Teach classes, prepare lessons, grade assignments, meet with parents, participate in meetings, mentor students.",
    workEnvironment: "School setting with structured schedule and summer breaks.",
    advantages: ["Impactful work", "Job security", "Summers off", "Pension benefits"],
    challenges: ["Lower salary", "Classroom management", "Paperwork", "Emotional demands"],
    careerPath: {
      entryLevel: "Teacher",
      midLevel: "Department Head / Lead Teacher",
      seniorLevel: "Assistant Principal / Principal"
    },
    topCompanies: ["Public School Districts", "Private Schools", "Charter Schools"],
    certifications: ["State Teaching License", "Subject Endorsements", "National Board Certification"],
    featured: false
  },
  {
    title: "Instructional Designer",
    slug: "instructional-designer",
    description: "Design and develop educational materials, online courses, and training programs using pedagogical principles and technology.",
    industry: "Education",
    category: "Educational Technology",
    salary: { min: 55000, max: 95000, median: 70000, currency: "USD" },
    educationRequired: "Master's Degree",
    experienceLevel: "Entry Level",
    skills: {
      technical: ["Learning Management Systems", "e-Learning Tools", "Articulate", "Adobe Captivate", "Instructional Design Models"],
      soft: ["Creativity", "Communication", "Project Management", "Collaboration"]
    },
    growthOutlook: {
      rate: "Fast Growing",
      percentage: 14,
      description: "High growth driven by online education and corporate training needs"
    },
    personalityTypes: ["INFJ", "INFP", "INTJ", "ENFP"],
    hollandCodes: ["Artistic", "Social", "Investigative"],
    dayInLife: "Analyze learning needs, design curricula, create multimedia content, develop assessments, test courses, revise materials.",
    workEnvironment: "Office or remote with creative and collaborative work.",
    advantages: ["Creative work", "Growing field", "Remote options", "Variety"],
    challenges: ["Multiple stakeholders", "Tight deadlines", "Technology changes", "SME coordination"],
    careerPath: {
      entryLevel: "Instructional Designer",
      midLevel: "Senior Instructional Designer / ID Lead",
      seniorLevel: "Director of Learning / Chief Learning Officer"
    },
    topCompanies: ["Educational Publishers", "Tech Companies", "Corporations", "Universities"],
    certifications: ["ATD Certification", "CPTD", "Adobe Certified"],
    featured: false
  }
  // Add truncated message for continuation
];

// Note: This is a starter set of ~25 careers. You should expand to 100+ 
// by adding more careers in each industry following the same structure.
// Industries to expand: Legal, Social Services, Government, Skilled Trades, Hospitality, etc., max: 150000, median: 95000, currency: "USD" },
    