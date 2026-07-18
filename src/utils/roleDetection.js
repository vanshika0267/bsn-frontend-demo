
export const ROLE_DOMAINS = {
  student:   ['stu.upes.ac.in'],
  faculty:   ['ddn.upes.ac.in'],
  recruiter: ['company.com'],
  admin:     ['connectbiopay.com'],
};

export function detectRoleFromEmail(email) {
  if (!email || !email.includes('@')) {
    return { role: null, confidence: 'low', matchedRule: 'invalid_email', domain: '' };
  }

  const lower = email.toLowerCase().trim();
  const domain = lower.split('@')[1] || '';

  for (const [role, domains] of Object.entries(ROLE_DOMAINS)) {
    if (domains.includes(domain)) {
      return { role, confidence: 'high', matchedRule: `domain:${domain}`, domain };
    }
  }

  return { role: 'student', confidence: 'low', matchedRule: 'default_student', domain };
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

const LOGIN_HELP_TEXT = 'Please use your registered email id to log in.';

export function getRoleLoginFields(role) {
  switch (role) {
    case 'student':
      return { title: 'Student Login', subtitle: 'Access your learning dashboard', fields: ['university', 'graduationYear', 'major'], helpText: LOGIN_HELP_TEXT };
    case 'faculty':
      return { title: 'Faculty Portal', subtitle: 'Teaching & research dashboard', fields: ['department', 'institution', 'designation'], helpText: LOGIN_HELP_TEXT };
    case 'recruiter':
      return { title: 'Recruiter Access', subtitle: 'Talent acquisition portal', fields: ['company', 'position', 'industry'], helpText: LOGIN_HELP_TEXT };
    case 'admin':
      return { title: 'Admin Console', subtitle: 'Secure administrative access', fields: [], helpText: LOGIN_HELP_TEXT };
    default:
      return { title: 'Welcome to BioPay', subtitle: 'Student Network Login', fields: [], helpText: LOGIN_HELP_TEXT };
  }
}