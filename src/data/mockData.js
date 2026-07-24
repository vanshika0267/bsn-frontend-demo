// High-fidelity Mock Data for BSN (BioPay Student Network)

export const currentUser = {
  id: "std_001",
  name: "Alex Rivera",
  role: "Student",
  email: "alex.rivera@university.edu",
  college: "Massachusetts Institute of Technology",
  headline: "Computer Science Undergrad | AI Research Assistant | Full-Stack Developer",
  bio: "Passionate Computer Science student at MIT specializing in Artificial Intelligence and Web Technologies. Experienced in building full-stack applications and deploying machine learning models. Always eager to collaborate on open-source projects, compete in hackathons, and mentor juniors in coding.",
  profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200",
  coverBanner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400",
  impactScore: 840,
  impactProgress: 84, // percentage
  rank: 14,
  badge: "Elite Creator",
  connectionsCount: 342,
  resumeUrl: "#",
  portfolioUrl: "https://alexrivera.dev",
  interests: ["Artificial Intelligence", "Web3", "UI/UX Design", "Hackathons", "Competitive Coding", "Open Source"],
  skills: [
    { name: "React.js / Next.js", level: "Advanced", value: 90 },
    { name: "Python / PyTorch", level: "Advanced", value: 85 },
    { name: "Node.js / Express", level: "Intermediate", value: 75 },
    { name: "TypeScript", level: "Intermediate", value: 80 },
    { name: "Docker & AWS", level: "Beginner", value: 50 },
    { name: "Tailwind CSS", level: "Advanced", value: 95 }
  ],
  certifications: [
    {
      id: "cert_1",
      title: "AWS Certified Developer Associate",
      issuer: "Amazon Web Services",
      date: "Dec 2025",
      credentialId: "AWS-102938",
      logo: "☁️"
    },
    {
      id: "cert_2",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI (Coursera)",
      date: "Aug 2025",
      credentialId: "DL-98234-COURSERA",
      logo: "🧠"
    }
  ],
  projects: [
    {
      id: "proj_1",
      title: "DeCentralize - Web3 Dev Network",
      description: "A decentralized developer collaboration platform with smart contract integrated reward distribution, github pull request trackers, and custom profile badges.",
      techStack: ["React", "Solidity", "Ether.js", "Tailwind CSS"],
      stars: 124,
      forks: 32,
      githubUrl: "https://github.com/alexrivera/decentralize",
      demoUrl: "https://decentralize.demo.dev"
    },
    {
      id: "proj_2",
      title: "Aura-AI Speech Synthesis",
      description: "Real-time voice emotion synthesis leveraging modern diffusion models. Built with a fast React frontend interface and an optimized Python FastAPI backend.",
      techStack: ["Python", "FastAPI", "React", "Tailwind CSS", "PyTorch"],
      stars: 89,
      forks: 12,
      githubUrl: "https://github.com/alexrivera/aura-ai",
      demoUrl: "https://aura-ai.demo.dev"
    },
    {
      id: "proj_3",
      title: "BioPay - Contactless Biometric Wallet",
      description: "Our team's award-winning biometric payment system. Integrating facial recognition and palm scanning for secure transaction authorizations in college campuses.",
      techStack: ["React Native", "Flask", "OpenCV", "PostgreSQL"],
      stars: 45,
      forks: 8,
      githubUrl: "https://github.com/alexrivera/biopay",
      demoUrl: "https://biopay.network"
    }
  ],
  achievements: [
    {
      id: "ach_1",
      date: "Jan 2026",
      title: "1st Place - MIT Hackathon 2026",
      description: "Led a team of 4 to design and build BioPay, a secure biometric payment gateway for students. Won the overall grand prize out of 120 teams."
    },
    {
      id: "ach_2",
      date: "Nov 2025",
      title: "Google Summer of Code Contributor",
      description: "Successfully completed a 12-week program contributing to the Apache Software Foundation, implementing key optimization modules for data streams."
    },
    {
      id: "ach_3",
      date: "May 2025",
      title: "Published Researcher - AAAI Student Abstract",
      description: "Co-authored a paper on lightweight transformer models for mobile web devices, accepted at the AAAI student abstract track."
    }
  ],
  sharedResources: [
    {
      id: "res_1",
      title: "MIT Advanced Algorithms Study Guide",
      description: "Comprehensive notes covering dynamic programming, graph algorithms, flows, and NP-hard reductions. Includes practice questions with model answers.",
      category: "Notes",
      downloads: 342,
      likes: 128,
      fileSize: "4.2 MB",
      dateAdded: "Mar 12, 2026"
    },
    {
      id: "res_2",
      title: "Technical Interview Cheat Sheet",
      description: "Quick reference card for patterns like sliding window, two-pointers, merge intervals, fast-slow pointers, and systems design fundamentals.",
      category: "Cheat Sheet",
      downloads: 852,
      likes: 412,
      fileSize: "1.8 MB",
      dateAdded: "Jan 05, 2026"
    }
  ]
};

export const opportunities = [
  {
    id: "opp_1",
    title: "Global Student Hackathon 2026",
    host: "Major League Hacking (MLH)",
    company: "Major League Hacking (MLH)",
    type: "Hackathon",
    location: "Virtual / Hybrid",
    reward: "$15,000 Prize Pool",
    salary: "$15,050 Prize Pool",
    deadline: "In 5 Days",
    posted: "1 day ago",
    logo: "🏆",
    tags: ["Coding", "Design", "AI", "Global"],
    description: "The ultimate 48-hour global sprint where students build software solutions to tackle global issues. Sponsored by Microsoft, GitHub, and OpenAI.",
    status: "Open",
    track: "Software Engineering"
  },
  {
    id: "opp_2",
    title: "Software Engineering Intern - Frontend",
    host: "Stripe",
    company: "Stripe",
    type: "Internship",
    location: "San Francisco, CA / Remote",
    reward: "$9,500 / Month",
    salary: "$9,500 / Month",
    deadline: "Jul 15, 2026",
    posted: "3 days ago",
    logo: "💳",
    tags: ["React", "TypeScript", "UI/UX", "Paid"],
    description: "Join the Stripe Payment Methods team to build high-performance, accessible checkout interfaces used by millions of businesses worldwide.",
    status: "Open",
    track: "Software Engineering"
  },
  {
    id: "opp_3",
    title: "AI Research Fellowship",
    host: "Google DeepMind",
    company: "Google DeepMind",
    type: "Fellowship",
    location: "London, UK / Hybrid",
    reward: "Fully Funded + Stipend",
    salary: "Fully Funded + Stipend",
    deadline: "Aug 01, 2026",
    posted: "5 days ago",
    logo: "🧠",
    tags: ["AI/ML", "Research", "Python", "Ph.D./M.S."],
    description: "A prestigious 6-month research internship studying next-generation generative models. Collaborate with top scientists and access cluster compute resources.",
    status: "Open",
    track: "Applied Machine Learning"
  },
  {
    id: "opp_4",
    title: "Product Design Challenge",
    host: "Figma",
    company: "Figma",
    type: "Competition",
    location: "Virtual",
    reward: "Figma Pro + $5,000",
    salary: "Figma Pro + $5,000",
    deadline: "In 12 Days",
    posted: "1 week ago",
    logo: "🎨",
    tags: ["UI/UX", "Case Study", "Prototyping"],
    description: "Design a collaborative educational tool for high school students. Projects will be evaluated on usability, research depth, and visual design polish.",
    status: "Open",
    track: "Java"
  },
  {
    id: 101,
    title: "Junior Software Engineer",
    host: "Vercel",
    company: "Vercel",
    location: "Remote, US",
    type: "Internship",
    track: "Software Engineering",
    salary: "$80,005 - $95,000 / yr",
    reward: "$80,005 - $95,000 / yr",
    deadline: "In 10 Days",
    posted: "2 days ago",
    logo: "▲",
    description: "We are looking for a junior React/Next.js developer to join our core dashboard team. Familiarity with tailwind CSS, bundle optimizations, and hydration steps is required.",
    tags: ["react", "nextjs", "tailwind"],
    status: "Open"
  },
  {
    id: 102,
    title: "Discrete Mathematics API Developer",
    host: "Supabase",
    company: "Supabase",
    location: "Remote, EU",
    type: "Internship",
    track: "Discrete Mathematics",
    salary: "$3,500 - $4,200 / mo",
    reward: "$3,500 - $4,200 / mo",
    deadline: "In 2 Weeks",
    posted: "4 days ago",
    logo: "⚡",
    description: "Help build scalable serverless middleware and PostgreSQL integrations. Basic understanding of SQL indexing, connection pools, and Go/Node.js scripting is preferred.",
    tags: ["postgres", "nodejs", "go"],
    status: "Open"
  },
  {
    id: 103,
    title: "Freelance Applied Machine Learning Developer",
    host: "Linear Corp",
    company: "Linear Corp",
    location: "Contract / Remote",
    type: "Freelance",
    track: "Applied Machine Learning",
    salary: "$60 - $85 / hr",
    reward: "$60 - $85 / hr",
    deadline: "In 3 Weeks",
    posted: "1 week ago",
    logo: "⚙️",
    description: "Urgent contract to implement interactive desktop widgets and push configurations in React Native / Expo. Experience with local databases (SQLite) is a plus.",
    tags: ["react-native", "expo", "sqlite"],
    status: "Open"
  }
];

export const leaderboard = [
  { rank: 1, name: "Sarah Connor", college: "Stanford University", track: "Discrete Mathematics", score: 1250, xp: 2450, contributions: 24, badges: 8, streak: 12, avatar: "👩‍💻" },
  { rank: 2, name: "Kabir Mehta", college: "IIT Bombay", track: "Java", score: 1190, xp: 2120, contributions: 18, badges: 6, streak: 8, avatar: "👨‍💻" },
  { rank: 3, name: "Emily Watson", college: "Oxford University", track: "Software Engineering", score: 1110, xp: 1890, contributions: 15, badges: 5, streak: 15, avatar: "👩‍💻" },
  { rank: 4, name: "David Chen", college: "Tsinghua University", track: "DevOps", score: 1040, xp: 1180, contributions: 9, badges: 3, streak: 2, avatar: "👨‍💻" },
  { rank: 14, name: "Alex Rivera (You)", college: "MIT", track: "Software Engineering", score: 840, xp: 840, contributions: 11, badges: 4, streak: 5, avatar: "👨‍💻", isCurrentUser: true, isSelf: true },
  { rank: 15, name: "Zoe Jenkins", college: "UC Berkeley", track: "Applied Machine Learning", score: 825, xp: 820, contributions: 5, badges: 2, streak: 3, avatar: "👩‍💻" }
];

export const learningResources = [
  {
    id: "lr_1",
    title: "Deep Learning with PyTorch",
    author: "Dr. Andrew Ng",
    uploadedBy: "Dr. Andrew Ng",
    role: "Senior Professor",
    category: "Notes",
    downloads: 1420,
    upvotes: 620,
    likes: 620,
    rating: 4.9,
    college: "Stanford",
    fileSize: "12.4 MB",
    description: "Deep learning mathematical foundations and coding models using PyTorch libraries.",
    type: "PDF",
    link: "https://example.com/pytorch",
    tags: ["pytorch", "deep-learning", "ai"],
    upvoted: false,
    saved: false,
    date: "Jun 10, 2026"
  },
  {
    id: "lr_2",
    title: "System Design Blueprint",
    author: "Jessica Vance",
    uploadedBy: "Jessica Vance",
    role: "Staff Engineer (Alumni)",
    category: "Guide",
    downloads: 3200,
    upvotes: 1540,
    likes: 1540,
    rating: 5.0,
    college: "MIT",
    fileSize: "8.1 MB",
    description: "A complete software architecture blueprint for high-scale system designs.",
    type: "Repository",
    link: "https://github.com/example/system-design",
    tags: ["architecture", "scale", "system-design"],
    upvoted: false,
    saved: false,
    date: "Jun 08, 2026"
  },
  {
    id: "lr_3",
    title: "Cracking the Coding Interview - Solutions in JS",
    author: "Marcus Aurelius",
    uploadedBy: "Marcus Aurelius",
    role: "Senior Student",
    category: "Cheat Sheet",
    downloads: 2190,
    upvotes: 910,
    likes: 910,
    rating: 4.8,
    college: "Caltech",
    fileSize: "3.5 MB",
    description: "Algorithmic puzzle designs and answers coded in standard JavaScript modules.",
    type: "Link",
    link: "https://example.com/js-interview",
    tags: ["js", "interview", "leetcode"],
    upvoted: false,
    saved: false,
    date: "Jun 11, 2026"
  },
  {
    id: "lr_4",
    title: "Database Management Systems Lecture Slides",
    author: "Prof. Elizabeth Stone",
    uploadedBy: "Prof. Elizabeth Stone",
    role: "Faculty Advisor",
    category: "Lectures",
    downloads: 870,
    upvotes: 340,
    likes: 340,
    rating: 4.7,
    college: "Harvard",
    fileSize: "22.0 MB",
    description: "Relational algebra, normalizations, and SQL indexing lecture materials.",
    type: "PDF",
    link: "https://example.com/db-slides",
    tags: ["sql", "database", "lectures"],
    upvoted: false,
    saved: false,
    date: "Jun 05, 2026"
  },
  {
    id: 1,
    title: 'Advanced Tailwind Configuration & Glassmorphism Utilities',
    author: 'Alex Rivera',
    uploadedBy: 'Alex Rivera',
    role: 'Student (You)',
    category: 'Software Engineering',
    type: 'Repository',
    link: 'https://github.com/example/tailwind-glassmorphism',
    tags: ['tailwind', 'css', 'glassmorphism', 'design'],
    upvotes: 42,
    likes: 42,
    downloads: 142,
    rating: 4.9,
    college: "MIT",
    fileSize: "0.8 MB",
    description: 'A helper boilerplate config and custom base styles file to achieve state-of-the-art glass panels, background overlays, and blur transitions.',
    upvoted: false,
    saved: false,
    date: 'Jun 15, 2026'
  },
  {
    id: 2,
    title: 'Vetted Junior Dev Interview Preparation Guide',
    author: 'Sofia Chen',
    uploadedBy: 'Sofia Chen',
    role: 'Student',
    category: 'Discrete Mathematics',
    type: 'PDF',
    link: 'https://example.com/docs/interview-guide.pdf',
    tags: ['algorithms', 'interviews', 'system-design'],
    upvotes: 28,
    likes: 28,
    downloads: 98,
    rating: 4.7,
    college: "Stanford University",
    fileSize: "2.4 MB",
    description: 'Comprehensive review syllabus of algorithms, web protocols, standard architectural schemas, and system design patterns.',
    upvoted: false,
    saved: false,
    date: 'Jun 12, 2026'
  },
  {
    id: 3,
    title: 'Figma Auto-Layout & Component Library Boilerplate',
    author: 'Jane Doe',
    uploadedBy: 'Jane Doe',
    role: 'Student',
    category: 'Java',
    type: 'Link',
    link: 'https://figma.com/file/boilerplate',
    tags: ['figma', 'design-system', 'ui-ux'],
    upvotes: 15,
    likes: 15,
    downloads: 50,
    rating: 4.5,
    college: "UC Berkeley",
    fileSize: "1.2 MB",
    description: 'An advanced starter kit for responsive Figma designs, using harmonized HSL color tokens and typography setups.',
    upvoted: false,
    saved: false,
    date: 'Jun 19, 2026'
  }
];

export const teamFinderPosts = [
  {
    id: "tf_1",
    name: "Need React/Tailwind Developer for BioPay Network",
    title: "Need React/Tailwind Developer for BioPay Network",
    project: "BioPay Wallet Interface",
    postedBy: "Sarah Connor",
    creator: "Sarah Connor",
    college: "Stanford University",
    description: "Looking for an expert frontend developer to help build the administrative panel of BioPay network. We are building it for a national hackathon next month.",
    rolesNeeded: ["Frontend Developer", "UI Designer"],
    skills: ["React", "Tailwind CSS", "Figma"],
    spotsLeft: 2,
    membersCount: 2,
    capacity: 4,
    avatar: "👩‍💻",
    status: "Recruiting"
  },
  {
    id: "tf_2",
    name: "AI Research - Lightweight Transformer models",
    title: "AI Research - Lightweight Transformer models",
    project: "Edge-AI Chat",
    postedBy: "Dr. Alan Turing",
    creator: "Dr. Alan Turing",
    college: "Cambridge University",
    description: "Seeking graduate or advanced undergraduate students interested in optimizing transformer weights for execution inside browser sandboxes.",
    rolesNeeded: ["PyTorch Specialist", "WASM Engineer"],
    skills: ["Python", "PyTorch", "WASM"],
    spotsLeft: 1,
    membersCount: 2,
    capacity: 3,
    avatar: "👨‍💻",
    status: "Recruiting"
  },
  {
    id: 201,
    name: 'Decentralized Finance Mobile App',
    title: 'Decentralized Finance Mobile App',
    project: 'DeFi Wallet',
    postedBy: 'Sofia Chen',
    creator: 'Sofia Chen',
    college: 'Stanford University',
    description: 'Building a cross-platform React Native dashboard to monitor transactions. Looking for a developer comfortable with web3 library integrations.',
    membersCount: 3,
    capacity: 5,
    spotsLeft: 2,
    skills: ['React Native', 'TypeScript', 'Web3.js'],
    rolesNeeded: ['React Native', 'TypeScript', 'Web3.js'],
    status: 'Recruiting',
    avatar: "👩‍💻"
  },
  {
    id: 202,
    name: 'Open Source UI component library',
    title: 'Open Source UI component library',
    project: 'Component Library',
    postedBy: 'Alex Rivera',
    creator: 'Alex Rivera',
    college: 'Massachusetts Institute of Technology',
    description: 'Collaborating on a premium library of Tailwind templates featuring transitions and dark modes. Looking for design-oriented engineers.',
    membersCount: 2,
    capacity: 4,
    spotsLeft: 2,
    skills: ['React', 'Tailwind CSS', 'Figma'],
    rolesNeeded: ['React', 'Tailwind CSS', 'Figma'],
    status: 'Recruiting',
    avatar: "👨‍💻"
  }
];

export const notificationsList = [
  {
    id: "notif_1",
    type: "Opportunities",
    title: "New Hackathon Announced",
    description: "Major League Hacking just posted 'Global Student Hackathon 2026'. Register before spots fill up!",
    timestamp: "10 mins ago",
    read: false,
    icon: "🏆"
  },
  {
    id: "notif_2",
    type: "Invitations",
    title: "Team Invitation from Sarah Connor",
    description: "Sarah Connor invited you to join the team 'BioPay Wallet Interface' as a Frontend Developer.",
    timestamp: "2 hours ago",
    read: false,
    icon: "✉️"
  },
  {
    id: "notif_3",
    type: "Rankings",
    title: "Rank Updated! You are now #14",
    description: "Congratulations! Your resource 'MIT Advanced Algorithms Study Guide' received 20 new downloads, bumping your Impact Score to 840.",
    timestamp: "1 day ago",
    read: true,
    icon: "📈"
  },
  {
    id: "notif_4",
    type: "All",
    title: "Profile Viewed",
    description: "A recruiter from Stripe viewed your profile and downloaded your resume.",
    timestamp: "3 days ago",
    read: true,
    icon: "👤"
  },
  {
    id: "notif_5",
    type: "All",
    title: "Resource Approved",
    description: "Your upload 'Technical Interview Cheat Sheet' has been verified and published to the Learning Hub.",
    timestamp: "5 days ago",
    read: true,
    icon: "✅"
  }
];

export const recentActivity = [
  {
    id: "act_1",
    type: "upload",
    title: "Uploaded 'MIT Advanced Algorithms Study Guide'",
    timestamp: "3 days ago",
    icon: "📄"
  },
  {
    id: "act_2",
    type: "achievement",
    title: "Won 1st Place at MIT Hackathon 2026",
    timestamp: "1 week ago",
    icon: "🏆"
  },
  {
    id: "act_3",
    type: "connection",
    title: "Connected with Sarah Connor and 12 other students",
    timestamp: "2 weeks ago",
    icon: "🤝"
  }
];
