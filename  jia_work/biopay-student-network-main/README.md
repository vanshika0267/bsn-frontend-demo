# Biopay-Student-Network

BioPay Student Network – Frontend (React + Vite + Tailwind v4 + TypeScript)

---

## Team Module Split – July 2026

🟢 **Vanshika (Profile Module)**
- Editable Profile Picture (upload/change/remove + preview, sync everywhere)
- Editable Skills & Interests (add/edit/remove)
- Profile UI consistency

🟢 **Shivam (Authentication UI)**
- Password Validation (min length, upper/lower, number, special + messages)
- Show/Hide Password eye icon (Login, Signup, Confirm)
- Login UI Enhancement (background animation, polish)

🟢 **Jiya (Authentication Flow + GitHub Integration)** ← this branch
- **A. GitHub Integration**: username/URL connect → auto fetch repos → refresh sync → Profile UI consistent
- **B. Role-Based Login Flow**: remove persona selector → email-domain SRS detection → Student / Faculty / Recruiter / Admin distinct flows
- See `README_JIYA.md` for full delivery notes

🟢 **Varista (Community Module)**
- Senior Chatrooms (Company-wise, Public Seniors Discussion, 1-to-1 Mentorship)
- Team Finder (Request to Join → Pending, member count post-approval)

---

## Jiya Build – Quick Start

```bash
npm install
npm run dev
```

- Login: http://localhost:5173/login
- Test emails:
  - `arjun@student.biopay.edu` (Student)
  - `dr.mehta@faculty.biopay.edu` (Faculty)
  - `priya@recruiter.biopay.com` (Recruiter)
  - `admin@admin.biopay.com` (Admin)
  - `jiya@iitp.ac.in` (.ac.in auto)
- Profile → GitHub Integration → try `torvalds`, `vercel`, or full URL

Full details: [`README_JIYA.md`](./README_JIYA.md)

---

Design tokens (from `src/index.css`):
- `--color-primary-blue: #2563EB`
- `--color-secondary-navy: #0F172A`
- `--color-success-green: #22C55E`
- `--color-danger-red: #EF4444`
- Fonts: Inter (sans), Poppins (display)
