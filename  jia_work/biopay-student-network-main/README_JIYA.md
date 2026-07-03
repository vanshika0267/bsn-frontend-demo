# BioPay Student Network – Jiya Module

**Authentication Flow + GitHub Integration**

Branch: `jiya/auth-flow-github`  
Date: 2025-07-01  
Owner: Jiya  

---

## ✅ Delivered – Jiya's Assigned Tasks ONLY

### A. GitHub Integration

- [x] Connect GitHub profile by entering GitHub **username OR full profile URL**
  - `src/utils/github.ts` – `parseGitHubInput()`
  - Supports: `torvalds`, `https://github.com/vercel`, `github.com/username`
- [x] Fetch and display GitHub repositories/projects automatically
  - GitHub REST API v3: `/users/:username` + `/users/:username/repos?sort=updated&per_page=100`
  - Repo cards: name, description, stars, forks, language (color-coded), updated date, topics
- [x] New public repositories reflect on refresh
  - “↻ Refresh” button re-fetches live
  - `lastSyncedAt` meta stored in localStorage
  - Designed for future backend webhook / proxy integration
- [x] GitHub section consistent with existing Profile UI
  - Tailwind v4, Inter / Poppins, BioPay color tokens:
    - `--color-primary-blue: #2563EB`
    - `--color-secondary-navy: #0F172A`
    - etc.
  - Rounded-2xl cards, border-gray #E2E8F0, light-gray #F8FAFC background

Files:
- `src/components/github/GitHubConnect.tsx` – full connect UI
- `src/components/github/GitHubProfileCard.tsx`
- `src/components/github/GitHubRepoList.tsx`
- `src/utils/github.ts`

Global GitHub username visible in Navbar (top-right pill).

---

### B. Role-Based Login Flow

- [x] **Removed persona selector from login** – deleted entirely
- [x] **Email-domain role detection – SRS compliant**
  ```
  student.biopay.edu / .edu / .ac.in / .edu.in → Student 🎓
  faculty.biopay.edu / prof.* → Faculty 👨‍🏫
  recruiter.biopay.com / hr.* / company.* → Recruiter 💼
  admin.biopay.com → Admin ⚙️
  ```
  Live RoleBadge shows: detected role, confidence (high/medium/low), matchedRule, domain
- [x] **Role-specific login / registration flow**
  - Login: `/login` → detect → `ROLE_META[role].dashboard` redirect
    - `/dashboard/student`
    - `/dashboard/faculty`
    - `/dashboard/recruiter`
    - `/dashboard/admin`
  - Register: `/register` → 3-step
    1. Institutional Email → auto role
    2. Account details
    3. Role-specific fields:
       - Student: University, Graduation Year, Major
       - Faculty: Department, Institution, Designation
       - Recruiter: Company, Position, Industry
       - Admin: domain-verified notice
- [x] **Design language preserved** – no redesign, BioPay tokens only

Files:
- `src/utils/roleDetection.ts` – core SRS logic
- `src/components/auth/RoleBadge.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/context/AppContext.tsx` – login/register with role detection

---

## 🚫 Intentionally NOT Implemented (Other teammates)

To avoid conflicts per team instructions:

**Shivam – Authentication UI**
- ❌ Password validation rules (min length, uppercase, lowercase, number, special)
- ❌ Show/Hide password eye icon
- ❌ Login background animation / UI enhancement
→ Left as basic `required` input. Labeled in UI: “Shivam: show/hide → pending”

**Vanshika – Profile Module**
- ❌ Editable Profile Picture (upload/change/remove + preview)
- ❌ Editable Skills & Interests (add/edit/remove)
- ❌ Profile UI changes
→ Read-only placeholder components with amber “Vanshika – …” badges:
`src/components/profile/ProfileHeader.tsx`
`src/components/profile/SkillsInterests.tsx`

**Varista – Community Module**
- ❌ Senior Chatrooms
- ❌ Team Finder
→ Route `/community` shows “Varista – Community Module – Coming Soon”

All other-team areas are clearly marked DO NOT EDIT.

---

## Run locally

```bash
cd test-biopay
npm install
npm run dev
# http://localhost:5173
```

Test SRS emails:
- `arjun@student.biopay.edu` → Student
- `dr.mehta@faculty.biopay.edu` → Faculty
- `priya@recruiter.biopay.com` → Recruiter
- `admin@admin.biopay.com` → Admin
- `jiya@iitp.ac.in` → Student (.ac.in auto-detect)

Any password works (mock auth – Shivam adds validation).

GitHub test usernames:
`torvalds`, `facebook`, `vercel`, `https://github.com/vercel`

---

## Architecture

```
src/
  context/AppContext.tsx        # Auth + role + githubUsername global
  routes/AppRoutes.tsx
  utils/
    roleDetection.ts            # Jiya – SRS role detection
    github.ts                   # Jiya – GitHub API client
  components/
    auth/RoleBadge.tsx          # Jiya
    github/
      GitHubConnect.tsx         # Jiya – full
      GitHubProfileCard.tsx
      GitHubRepoList.tsx
    profile/
      ProfileHeader.tsx         # Vanshika – placeholder
      SkillsInterests.tsx       # Vanshika – placeholder
    layout/
      Navbar.tsx
      DashboardLayout.tsx
  pages/
    LoginPage.tsx               # Jiya – role-based
    RegisterPage.tsx            # Jiya – role-specific
    ProfilePage.tsx
    DashboardPage.tsx
```

- React 18 + React Router 6
- Tailwind CSS v4 (`@import "tailwindcss"` in index.css)
- TypeScript strict
- localStorage persistence: `biopay_user`, `biopay_role`, `biopay_github_username_v1`, `biopay_github_sync_meta`

Future backend integration points commented in `github.ts`:
```ts
// Future: Authorization token via backend proxy
// 'Authorization': `Bearer ${token}`
```

---

## Git workflow (per team instructions)

- Did NOT push to shared frontend branch
- Branch: `jiya/auth-flow-github`
- Ready to push → demonstrate in meeting → team lead merges

```bash
git checkout -b jiya/auth-flow-github
git add .
git commit -m "feat(jiya): Role-Based Login Flow + GitHub Integration

- Remove persona selector, email-domain SRS role detection
- Student/Faculty/Recruiter/Admin distinct dashboards & registration
- GitHub username/URL connect, live repo fetch, refresh sync
- Profile UI consistent with BioPay design system
- Vanshika/Shivam/Varista modules untouched (placeholders only)"
git push origin jiya/auth-flow-github
```

---

**Submitted by: Jiya**  
Module: Authentication Flow + GitHub Integration  
BioPay Student Network – Internship Team – July 2026
