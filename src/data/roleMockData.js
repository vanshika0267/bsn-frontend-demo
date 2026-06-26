// High-fidelity Mock Data for BSN Role Personalization Layer

// 1. Recruiter Mock Data
export const recruiterCandidates = [
  {
    id: "cand_1",
    name: "Jane Doe",
    college: "Stanford University",
    branch: "Computer Science",
    impactScore: 920,
    badge: "Elite Creator",
    skills: ["React.js", "Node.js", "Python", "GraphQL"],
    avatar: "👩‍💻"
  },
  {
    id: "cand_2",
    name: "John Smith",
    college: "Massachusetts Institute of Technology",
    branch: "Electrical Engineering",
    impactScore: 890,
    badge: "Master Builder",
    skills: ["Python", "C++", "PyTorch", "Kubernetes"],
    avatar: "👨‍💻"
  },
  {
    id: "cand_3",
    name: "Alice Johnson",
    college: "Cambridge University",
    branch: "Software Engineering",
    impactScore: 840,
    badge: "Gold Contributor",
    skills: ["JavaScript", "React Native", "Figma", "Tailwind CSS"],
    avatar: "👩‍💻"
  },
  {
    id: "cand_4",
    name: "Bob Wilson",
    college: "Harvard University",
    branch: "Data Science",
    impactScore: 780,
    badge: "Rising Star",
    skills: ["SQL", "Pandas", "Scikit-Learn", "R"],
    avatar: "👨‍💻"
  }
];

export const recruiterJobPostings = [
  {
    id: "job_1",
    title: "Software Engineering Intern - Frontend",
    team: "Stripe Checkout",
    status: "Active",
    applicantsCount: 28,
    postedDate: "June 12, 2026",
    stipend: "$9,500/Month"
  },
  {
    id: "job_2",
    title: "Backend Architect - Distributed Systems",
    team: "Stripe Infrastructure",
    status: "Active",
    applicantsCount: 14,
    postedDate: "June 18, 2026",
    stipend: "$11,200/Month"
  }
];

export const recruiterApplications = [
  {
    id: "app_1",
    candidateName: "Jane Doe",
    jobTitle: "Software Engineering Intern - Frontend",
    status: "Shortlisted",
    matchScore: 94,
    appliedDate: "3 days ago"
  },
  {
    id: "app_2",
    candidateName: "Bob Wilson",
    jobTitle: "Backend Architect",
    status: "Under Review",
    matchScore: 82,
    appliedDate: "1 day ago"
  }
];

// 2. Senior / Alumni Mock Data
export const seniorMentorshipRequests = [
  {
    id: "req_1",
    studentName: "Alex Rivera",
    topic: "Next.js Architecture Review",
    dateTime: "June 26 at 4:00 PM (1 hr)",
    status: "Confirmed",
    avatar: "👨‍💻"
  },
  {
    id: "req_2",
    studentName: "Emily Watson",
    topic: "Stripe Portfolio Vetting",
    dateTime: "June 28 at 2:30 PM (30 min)",
    status: "Pending Approval",
    avatar: "👩‍💻"
  }
];

export const seniorQuestions = [
  {
    id: "q_1",
    studentName: "Marcus Vance",
    question: "Should I focus on WASM or standard REST APIs for highly interactive data visualization dashboards?",
    votes: 18,
    replies: 2,
    topic: "Web Performance"
  },
  {
    id: "q_2",
    studentName: "Sonia Patel",
    question: "How do big tech firms structure their product validation cycles for cloud infrastructure launches?",
    votes: 12,
    replies: 0,
    topic: "System Architecture"
  }
];

// 3. College Admin Mock Data
export const collegeStudents = [
  {
    id: "stud_1",
    name: "Alex Rivera",
    branch: "Computer Science",
    year: "3rd Year",
    impactScore: 840,
    status: "Verified",
    placementStatus: "Unplaced"
  },
  {
    id: "stud_2",
    name: "Sarah Jenkins",
    branch: "Information Technology",
    year: "4th Year",
    impactScore: 910,
    status: "Verified",
    placementStatus: "Placed (Vercel)"
  },
  {
    id: "stud_3",
    name: "Devon Miller",
    branch: "Computer Science",
    year: "4th Year",
    impactScore: 875,
    status: "Verified",
    placementStatus: "Placed (AWS)"
  }
];

export const collegeVerifications = [
  {
    id: "ver_1",
    studentName: "Marcus Vance",
    badgeName: "AWS Certified Developer",
    hash: "sha256:8f2a938c...",
    status: "Pending",
    submittedDate: "2 days ago"
  },
  {
    id: "ver_2",
    studentName: "Emily Watson",
    badgeName: "GSoC 2025 Completion",
    hash: "sha256:bc31f9d2...",
    status: "Pending",
    submittedDate: "Today"
  }
];

// 4. Platform Admin Mock Data
export const platformUsers = [
  { id: "usr_1", name: "Alex Rivera", role: "Student", college: "MIT", status: "Active" },
  { id: "usr_2", name: "Jane Doe", role: "Recruiter", college: "Stanford", status: "Active" },
  { id: "usr_3", name: "Sarah Jenkins", role: "Senior/Alumni", college: "Vercel", status: "Active" }
];

export const platformSystemLogs = [
  { id: "log_1", event: "Plagiarism Scan", resource: "MIT Alg Notes", similarity: "12%", status: "Passed", time: "5 mins ago" },
  { id: "log_2", event: "System Backup", resource: "PostgreSQL Ledger", similarity: "0%", status: "Success", time: "1 hour ago" },
  { id: "log_3", event: "Vetting Request", resource: "Stripe Job Intern", similarity: "0%", status: "Approved", time: "2 hours ago" }
];
