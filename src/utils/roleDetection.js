/**
 * Jiya - Authentication Flow + Role-Based Login
 * SRS-compliant role detection based on email domain
 */

export const ROLE_DOMAINS = {
  student: [
    'student.biopay.com',
    'student.biopay.edu',
    's.biopay.edu',
  ],
  faculty: [
    'faculty.biopay.com',
    'faculty.biopay.edu',
    'prof.biopay.edu',
  ],
  recruiter: [
    'recruiter.biopay.com',
    'hr.biopay.com',
    'talent.biopay.com',
  ],
  admin: [
    'admin.biopay.com',
  ]
};

export function detectRoleFromEmail(email) {
  if (!email || !email.includes('@')) {
    return { role: null, confidence: 'low', matchedRule: 'invalid_email', domain: '' };
  }

  const lower = email.toLowerCase().trim();
  const domain = lower.split('@')[1] || '';
  const localPart = lower.split('@')[0] || '';

  // 1. Exact SRS domain match - HIGH confidence
  for (const [role, domains] of Object.entries(ROLE_DOMAINS)) {
    if (domains.includes(domain)) {
      return {
        role,
        confidence: 'high',
        matchedRule: `srs_exact_domain:${domain}`,
        domain
      };
    }
  }

  // 2. Faculty detection
  if (
    domain.startsWith('faculty.') ||
    localPart.startsWith('faculty.') ||
    localPart.includes('prof.') ||
    domain.includes('faculty') ||
    localPart.includes('professor')
  ) {
    return { role: 'faculty', confidence: 'high', matchedRule: 'faculty_pattern', domain };
  }

  // 3. Recruiter detection
  if (
    domain.startsWith('recruiter.') ||
    domain.startsWith('hr.') ||
    domain.startsWith('talent.') ||
    localPart.includes('recruiter') ||
    localPart.includes('hr.') ||
    localPart.includes('.hr@') ||
    domain.includes('company') ||
    domain.includes('corp') ||
    domain.includes('hiring')
  ) {
    return { role: 'recruiter', confidence: 'high', matchedRule: 'recruiter_pattern', domain };
  }

  // 4. Admin detection
  if (
    domain.startsWith('admin.') ||
    localPart.startsWith('admin') ||
    localPart.includes('superadmin')
  ) {
    return { role: 'admin', confidence: 'high', matchedRule: 'admin_pattern', domain };
  }

  // 5. Student academic domains - HIGH confidence
  if (
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu.in') ||
    domain.includes('university') ||
    domain.includes('college') ||
    domain.includes('institute')
  ) {
    return { role: 'student', confidence: 'high', matchedRule: 'academic_domain', domain };
  }

  // 6. Student pattern - MEDIUM
  if (
    domain.startsWith('student.') ||
    localPart.startsWith('student') ||
    localPart.includes('.student') ||
    localPart.match(/^s\d+/) || // s12345 pattern
    domain.includes('student')
  ) {
    return { role: 'student', confidence: 'medium', matchedRule: 'student_pattern', domain };
  }

  // Default fallback for Biopay domains
  if (domain.includes('biopay')) {
    return { role: 'student', confidence: 'medium', matchedRule: 'biopay_default_student', domain };
  }

  // Unknown domain - low confidence, default student (will show confirmation)
  if (domain) {
    return { role: 'student', confidence: 'low', matchedRule: 'fallback_default', domain };
  }

  return { role: null, confidence: 'low', matchedRule: 'no_domain', domain };
}

export const ROLE_META = {
  student: {
    label: 'Student',
    color: '#2563EB',
    bg: '#EFF6FF',
    description: 'Access courses, projects, and mentorship',
    dashboard: '/dashboard/student',
    icon: '🎓',
  },
  faculty: {
    label: 'Faculty',
    color: '#7C3AED',
    bg: '#F5F3FF',
    description: 'Manage classes and review student work',
    dashboard: '/dashboard/faculty',
    icon: '👨‍🏫',
  },
  recruiter: {
    label: 'Recruiter',
    color: '#059669',
    bg: '#ECFDF5',
    description: 'Discover talent and post opportunities',
    dashboard: '/dashboard/recruiter',
    icon: '💼',
  },
  admin: {
    label: 'Admin',
    color: '#DC2626',
    bg: '#FEF2F2',
    description: 'Platform administration',
    dashboard: '/dashboard/admin',
    icon: '⚙️',
  }
};

export function getRoleLoginFields(role) {
  switch (role) {
    case 'student':
      return {
        title: 'Student Login',
        subtitle: 'Access your learning dashboard',
        fields: ['university', 'graduationYear', 'major'],
        helpText: 'Use your .edu / .ac.in email or student.biopay.com'
      };
    case 'faculty':
      return {
        title: 'Faculty Portal',
        subtitle: 'Teaching & research dashboard',
        fields: ['department', 'institution', 'designation'],
        helpText: 'Use your faculty.biopay.edu email'
      };
    case 'recruiter':
      return {
        title: 'Recruiter Access',
        subtitle: 'Talent acquisition portal',
        fields: ['company', 'position', 'industry'],
        helpText: 'Use your company or recruiter.biopay.com email'
      };
    case 'admin':
      return {
        title: 'Admin Console',
        subtitle: 'Secure administrative access',
        fields: [],
        helpText: 'Admin-only access'
      };
    default:
      return {
        title: 'Welcome to BioPay',
        subtitle: 'Student Network Login',
        fields: [],
        helpText: 'Enter your institutional email'
      };
  }
}
