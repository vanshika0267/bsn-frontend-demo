// API helper for talking to the BSN backend (FastAPI + MongoDB).
const API_URL = "https://bsn-deploy.onrender.com";

export const getToken = () => localStorage.getItem("bsn_token");
export const setToken = (t) =>
  t ? localStorage.setItem("bsn_token", t) : localStorage.removeItem("bsn_token");

function authHeaders(extra = {}) {
  const t = getToken();
  return t ? { ...extra, Authorization: `Bearer ${t}` } : extra;
}

async function handle(res) {
  if (!res.ok) {
    let detail;
    try { detail = (await res.json()).detail; } catch { /* ignore */ }
    throw new Error(detail || `Request failed (${res.status})`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Core JSON request helper (GET/POST/PATCH/DELETE).
async function req(method, path, body) {
  const hasBody = body !== undefined && body !== null;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: authHeaders(hasBody ? { "Content-Type": "application/json" } : {}),
    body: hasBody ? JSON.stringify(body) : undefined,
  });
  return handle(res);
}

const qs = (params) => {
  const s = Object.entries(params || {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return s ? `?${s}` : "";
};

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
  return handle(res);
}

export async function apiRegister({ name, email, password, college, is_alumni, graduation_year }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, college, is_alumni, graduation_year }),
  });
  return handle(res);
}

export const becomeAlumnus = () => req("POST", "/users/me/become-alumni");

export async function apiLogin(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error("Invalid email or password");
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function apiGetMe() {
  const res = await fetch(`${API_URL}/auth/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

// ---------------------------------------------------------------------------
// Opportunities / Job postings / Hackathons
// ---------------------------------------------------------------------------
export const listOpportunities = (category) => req("GET", `/opportunities${qs({ category })}`);
export const getOpportunity = (id) => req("GET", `/opportunities/${id}`);
export const createOpportunity = (data) => req("POST", "/opportunities", data);
export const updateOpportunity = (id, data) => req("PATCH", `/opportunities/${id}`, data);
export const deleteOpportunity = (id) => req("DELETE", `/opportunities/${id}`);
export const setOpportunityStatus = (id, status) => req("PATCH", `/opportunities/${id}/status`, { status });
export const myOpportunities = () => req("GET", "/opportunities/mine");
export async function applyToOpportunity(id, userId, file) {
  const form = new FormData();
  form.append("user_id", userId);
  if (file) form.append("resume", file);
  const res = await fetch(`${API_URL}/opportunities/${id}/apply`, {
    method: "POST",
    headers: authHeaders(), // browser sets multipart boundary
    body: form,
  });
  return handle(res);
}
export const getApplicants = (id) => req("GET", `/opportunities/${id}/applicants`);
export const setApplicationStatus = (appId, status) => req("PATCH", `/applications/${appId}/status`, { status });
export const getMyApplications = (userId) => req("GET", `/applications/${userId}`);

// ---------------------------------------------------------------------------
// Resources + Contribute (resource requests)
// ---------------------------------------------------------------------------
export const listResources = (params) => req("GET", `/resources${qs(params)}`);
export const getResource = (id) => req("GET", `/resources/${id}`);
export const myResources = () => req("GET", "/resources/mine");
export const upvoteResource = (id) => req("POST", `/resources/${id}/upvote`);
export const downloadResource = (id) => req("POST", `/resources/${id}/download`);
export async function uploadResource({ title, subject, type = "notes", description = "", file }) {
  const form = new FormData();
  form.append("title", title);
  form.append("subject", subject);
  form.append("type", type);
  form.append("description", description);
  form.append("file", file);
  const res = await fetch(`${API_URL}/resources`, {
    method: "POST",
    headers: authHeaders(), // no Content-Type: browser sets multipart boundary
    body: form,
  });
  return handle(res);
}
export const listResourceRequests = (status) => req("GET", `/resource-requests${qs({ status })}`);
export const createResourceRequest = (data) => req("POST", "/resource-requests", data);
export const upvoteResourceRequest = (id) => req("POST", `/resource-requests/${id}/upvote`);
export const fulfillResourceRequest = (id, resourceId) =>
  req("POST", `/resource-requests/${id}/fulfill${qs({ resource_id: resourceId })}`);

// ---------------------------------------------------------------------------
// Candidate search (recruiter)
// ---------------------------------------------------------------------------
export const searchCandidates = (params) => req("GET", `/candidates${qs(params)}`);

// ---------------------------------------------------------------------------
// Messaging (chat)
// ---------------------------------------------------------------------------
export const sendMessage = (recipientId, text) => req("POST", "/messages", { recipient_id: recipientId, text });
export const getConversation = (otherUserId) => req("GET", `/messages/${otherUserId}`);
export const listConversations = () => req("GET", "/conversations");

// ---------------------------------------------------------------------------
// Senior Connect (companies, alumni, Q&A, DM requests)
// ---------------------------------------------------------------------------
export const listCompanies = () => req("GET", "/senior-connect/companies");
export const createCompany = (data) => req("POST", "/senior-connect/companies", data);
export const linkAlumniCompany = (data) => req("POST", "/senior-connect/alumni/company", data);
export const listCompanyAlumni = (companyId) => req("GET", `/senior-connect/companies/${companyId}/alumni`);
export const askCompanyQuestion = (data) => req("POST", "/senior-connect/questions", data);
export const listCompanyQuestions = (companyId) => req("GET", `/senior-connect/questions${qs({ company_id: companyId })}`);
export const answerCompanyQuestion = (qid, answer) => req("POST", `/senior-connect/questions/${qid}/answer`, { answer });
export const getQuestionAnswers = (qid) => req("GET", `/senior-connect/questions/${qid}/answers`);
export const sendDmRequest = (data) => req("POST", "/senior-connect/dm-requests", data);
export const dmInbox = () => req("GET", "/senior-connect/dm-requests/inbox");
export const dmOutbox = () => req("GET", "/senior-connect/dm-requests/outbox");
export const approveDmRequest = (id) => req("POST", `/senior-connect/dm-requests/${id}/approve`);
export const rejectDmRequest = (id) => req("POST", `/senior-connect/dm-requests/${id}/reject`);
export const getDmContact = (id) => req("GET", `/senior-connect/dm-requests/${id}/contact`);

// General seniors Q&A
export const askQuestion = (userId, question) => req("POST", "/seniors/questions", { user_id: userId, question });
export const listSeniorQuestions = () => req("GET", "/seniors/questions");
export const answerQuestion = (qid, seniorId, answer) => req("POST", `/seniors/questions/${qid}/answer`, { senior_id: seniorId, answer });

// Skill gap + teams
export const skillGap = (userId, targetRole) => req("POST", "/skill-gap", { user_id: userId, target_role: targetRole });
export const listTeams = () => req("GET", "/teams");
export const myTeams = () => req("GET", "/teams/mine");
export const createTeam = (teamName, requiredSkills) => req("POST", "/teams", { team_name: teamName, required_skills: requiredSkills });
export const joinTeam = (teamId) => req("POST", `/teams/${teamId}/join`);
export const getTeamMembers = (teamId) => req("GET", `/teams/${teamId}/members`);

// ---------------------------------------------------------------------------
// Senior/Alumni grant (recruiter)
// ---------------------------------------------------------------------------
export const grantSenior = (userId, isSenior = true) => req("POST", `/users/${userId}/senior`, { is_senior: isSenior });

// ---------------------------------------------------------------------------
// Profiles / onboarding
// ---------------------------------------------------------------------------
export const getProfile = (userId) => req("GET", `/profiles/${userId}`);
export const updateProfile = (userId, data) => req("PUT", `/profiles/${userId}`, data);
export const submitOnboarding = (data) => req("POST", "/onboarding", data);

// ---------------------------------------------------------------------------
// Scoring / leaderboard / badges
// ---------------------------------------------------------------------------
export const getScore = (userId) => req("GET", `/scoring/${userId}`);
export const getLedger = (userId) => req("GET", `/scoring/${userId}/ledger`);
export const studentsLeaderboard = () => req("GET", "/leaderboard/students");
export const collegesLeaderboard = () => req("GET", "/leaderboard/colleges");
export const getBadges = (userId) => req("GET", `/badges/${userId}`);

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export const getNotifications = (userId) => req("GET", `/notifications/${userId}`);
export const markNotificationRead = (id) => req("POST", `/notifications/${id}/read`);

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const adminStats = () => req("GET", "/admin/stats");
export const adminListUsers = (params) => req("GET", `/admin/users${qs(params)}`);
export const adminGetUser = (id) => req("GET", `/admin/users/${id}`);
export const adminCreateUser = (data) => req("POST", "/admin/users", data);
export const adminUpdateUser = (id, data) => req("PATCH", `/admin/users/${id}`, data);
export const adminChangeRole = (id, role) => req("PATCH", `/admin/users/${id}/role`, { role });
export const adminVerifyUser = (id, verified = true) => req("POST", `/admin/users/${id}/verify${qs({ verified })}`);
export const adminResetPassword = (id) => req("POST", `/admin/users/${id}/reset-password`);
export const adminDeleteUser = (id) => req("DELETE", `/admin/users/${id}`);
export const adminListResources = (status) => req("GET", `/admin/resources${qs({ status })}`);
export const adminModerateResource = (id, status) => req("PATCH", `/admin/resources/${id}/status`, { status });
export const adminDeleteResource = (id) => req("DELETE", `/admin/resources/${id}`);
export const adminListOpportunities = () => req("GET", "/admin/opportunities");
export const adminDeleteOpportunity = (id) => req("DELETE", `/admin/opportunities/${id}`);
