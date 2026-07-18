// High-fidelity Mock Data for Seniors Connect (Community Module) & Team Finder

export const companies = [
  { id: 'google', name: 'Google', logo: '🌐', seniorsCount: 15, tagline: 'Search, Cloud, and AI Systems' },
  { id: 'microsoft', name: 'Microsoft', logo: '💻', seniorsCount: 12, tagline: 'OS, Azure, and Productivity Tools' },
  { id: 'samsung', name: 'Samsung', logo: '📱', seniorsCount: 8, tagline: 'Electronics, hardware, and mobile tech' },
  { id: 'amazon', name: 'Amazon', logo: '📦', seniorsCount: 10, tagline: 'AWS cloud, e-commerce, and logistics' },
  { id: 'adobe', name: 'Adobe', logo: '🎨', seniorsCount: 6, tagline: 'Creative Suite, documents, and design systems' }
];

export const companyChats = {
  google: [
    { id: 1, sender: 'Sarah Jenkins', role: 'Staff Engineer', company: 'Google', text: 'Hey guys! Happy to answer any questions about the software engineering internship loop at Google.', time: '10:24 AM', avatar: '👩‍💻' },
    { id: 2, sender: 'Alex Rivera', role: 'Student', text: 'Thanks Sarah! How critical is system design for the intern interviews?', time: '10:26 AM', avatar: '👨‍💻' },
    { id: 3, sender: 'Sarah Jenkins', role: 'Staff Engineer', company: 'Google', text: 'For interns, it is mostly standard DSA (2 rounds). System design is typically only required for L4+ roles, though understanding basic caching and HTTP is a plus!', time: '10:28 AM', avatar: '👩‍💻' },
    { id: 4, sender: 'Rohan Gupta', role: 'Student', text: 'Are there any openings in the gRPC/Protobuf team?', time: '10:30 AM', avatar: '👦' },
    { id: 5, sender: 'Kabir Mehta', role: 'Senior UX Designer', company: 'Google', text: 'Rohan, yes! Google Cloud is hiring UX and Dev engineers for API Infrastructure. Do share your portfolio.', time: '10:32 AM', avatar: '👨‍🎨' }
  ],
  microsoft: [
    { id: 1, sender: 'Devon Miller', role: 'Backend Architect', company: 'Microsoft', text: 'Welcome to the Microsoft room! Currently working in Azure DevTools division.', time: 'Yesterday', avatar: '👨‍💻' },
    { id: 2, sender: 'Emily Watson', role: 'Student', text: 'Hi Devon! What skills do you look for in Azure backend applicants?', time: 'Yesterday', avatar: '👩‍💻' },
    { id: 3, sender: 'Devon Miller', role: 'Backend Architect', company: 'Microsoft', text: 'Strong systems design, concurrency principles, and database management. Go, C#, or Rust are highly valued here.', time: 'Yesterday', avatar: '👨‍💻' }
  ],
  samsung: [
    { id: 1, sender: 'Jin-Woo Park', role: 'Senior Kernel Dev', company: 'Samsung', text: 'Any low-level or firmware enthusiasts here? We work directly on Knox security kernels and mobile chipset optimizations.', time: '2 days ago', avatar: '👨‍💻' },
    { id: 2, sender: 'Alex Rivera', role: 'Student', text: 'Is C++20 standard widely adopted in mobile divisions yet?', time: '2 days ago', avatar: '👨‍💻' },
    { id: 3, sender: 'Jin-Woo Park', role: 'Senior Kernel Dev', company: 'Samsung', text: 'We are adopting C++20 for new subsystems, but C remains the king for drivers and low-level kernel code!', time: '2 days ago', avatar: '👨‍💻' }
  ],
  amazon: [
    { id: 1, sender: 'Amara Lopez', role: 'L6 SDE', company: 'Amazon', text: 'Hey everyone! If you want to talk about distributed systems, AWS Lambda architectures, or Amazon leadership principles, ask away!', time: '3 days ago', avatar: '👩‍💻' }
  ],
  adobe: [
    { id: 1, sender: 'Nikhil Saxena', role: 'Lead Architect', company: 'Adobe', text: 'Hello Designers and Developers! We are constantly pushing limits on WebGL/WebAssembly for Web Photoshop.', time: '4 days ago', avatar: '👨‍💻' }
  ]
};

export const publicDiscussion = [
  {
    id: 'pub_q1',
    author: 'Marcus Vance',
    role: 'Student',
    question: 'Should I focus on WASM or standard REST APIs for highly interactive data visualization dashboards?',
    votes: 18,
    topic: 'Web Performance',
    timestamp: '2 hours ago',
    replies: [
      {
        id: 'pub_a1_1',
        author: 'Sarah Jenkins',
        role: 'Staff Engineer',
        company: 'Google',
        text: 'Standard REST/GraphQL is completely fine until you hit thousands of active nodes or require real-time client-side calculation (like canvas render passes). Start with REST, optimize with WebSockets, and only migrate heavy parser tasks to WASM if profiling shows CPU bottlenecks.',
        timestamp: '1 hour ago'
      },
      {
        id: 'pub_a1_2',
        author: 'Devon Miller',
        role: 'Backend Architect',
        company: 'Microsoft',
        text: 'Agreed. WASM has a bridge serialization overhead. Unless your calculations are self-contained and heavy, standard JS engines are incredibly fast.',
        timestamp: '30 mins ago'
      }
    ]
  },
  {
    id: 'pub_q2',
    author: 'Sonia Patel',
    role: 'Student',
    question: 'How do big tech firms structure their product validation cycles for cloud infrastructure launches?',
    votes: 12,
    topic: 'System Architecture',
    timestamp: '1 day ago',
    replies: []
  }
];

export const seniors = [
  {
    id: 'sen_1',
    name: 'Sarah Jenkins',
    role: 'Staff Engineer',
    company: 'Google',
    track: 'Software Engineering',
    gradYear: '2023',
    skills: ['React', 'Next.js', 'Web Performance', 'Design Systems'],
    slots: ['Mon 4:00 PM', 'Wed 2:00 PM', 'Fri 5:00 PM'],
    bio: 'Ex-Stripe. Specialist in Next.js core frameworks and React component libraries architecture.',
    avatar: '👩‍💻'
  },
  {
    id: 'sen_2',
    name: 'Devon Miller',
    role: 'Backend Architect',
    company: 'Microsoft',
    track: 'Distributed Systems',
    gradYear: '2022',
    skills: ['Node.js', 'Go', 'DynamoDB', 'Microservices'],
    slots: ['Tue 10:00 AM', 'Thu 11:30 AM'],
    bio: 'Azure Solutions Architect. Enthusiastic about event-driven design, serverless deployments, and concurrency.',
    avatar: '👨‍💻'
  },
  {
    id: 'sen_3',
    name: 'Amara Lopez',
    role: 'SDE-2',
    company: 'Samsung',
    track: 'Mobile & Firmware',
    gradYear: '2024',
    skills: ['C++', 'Android NDK', 'Linux Kernel', 'Knox SDK'],
    slots: ['Wed 3:00 PM', 'Fri 10:00 AM'],
    bio: 'Passionate about mobile security, native optimizations, and kernel-level configurations.',
    avatar: '👩‍💻'
  },
  {
    id: 'sen_4',
    name: 'Nikhil Saxena',
    role: 'Lead Architect',
    company: 'Adobe',
    track: 'Creative Tech',
    gradYear: '2021',
    skills: ['WebGL', 'WebAssembly', 'Canvas API', 'Rust'],
    slots: ['Thu 2:00 PM', 'Fri 4:00 PM'],
    bio: 'Building the next generation of creative tools inside browser sandboxes.',
    avatar: '👨‍💻'
  }
];

export const mockTeams = [
  {
    id: 'team_01',
    name: 'BioPay Contactless Wallet UI',
    project: 'BioPay Admin Dashboard',
    creator: 'Alex Rivera (You)',
    postedBy: 'Alex Rivera (You)',
    college: 'Massachusetts Institute of Technology',
    description: 'Developing a sleek, real-time dashboard panel for monitoring terminal transactions and biometric validation rates on campus.',
    capacity: 4,
    membersCount: 1,
    spotsLeft: 3,
    skills: ['React', 'Tailwind CSS', 'Figma', 'WebSockets'],
    rolesNeeded: ['UI Designer', 'Frontend Dev', 'QA Specialist'],
    status: 'Open',
    avatar: '👥',
    pendingRequests: [
      { id: 'req_a', applicantName: 'Rohan Gupta', skills: ['React', 'CSS'], avatar: '👦' },
      { id: 'req_b', applicantName: 'Jane Smith', skills: ['Figma', 'UI Design'], avatar: '👩‍💻' }
    ]
  },
  {
    id: 'team_02',
    name: 'Need React/Tailwind Developer for BioPay Network',
    project: 'BioPay Wallet Interface',
    creator: 'Sarah Connor',
    postedBy: 'Sarah Connor',
    college: 'Stanford University',
    description: 'Looking for an expert frontend developer to help build the administrative panel of BioPay network. We are building it for a national hackathon next month.',
    capacity: 4,
    membersCount: 2,
    spotsLeft: 2,
    skills: ['React', 'Tailwind CSS', 'Figma'],
    rolesNeeded: ['Frontend Developer', 'UI Designer'],
    status: 'Open',
    avatar: '👩‍💻',
    pendingRequests: []
  },
  {
    id: 'team_03',
    name: 'AI Research - Edge Transformer models',
    project: 'Edge-AI Chat',
    creator: 'Dr. Alan Turing',
    postedBy: 'Dr. Alan Turing',
    college: 'Cambridge University',
    description: 'Seeking graduate or advanced undergraduate students interested in optimizing transformer weights for execution inside browser sandboxes.',
    capacity: 3,
    membersCount: 2,
    spotsLeft: 1,
    skills: ['Python', 'PyTorch', 'WASM'],
    rolesNeeded: ['PyTorch Specialist', 'WASM Engineer'],
    status: 'Open',
    avatar: '👨‍💻',
    pendingRequests: []
  }
];
