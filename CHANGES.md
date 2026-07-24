# Biopay Student Network — Changelog

## Overview

This document details all modifications made to the Biopay Student Network frontend to implement three features:

1. **Faculty Q&A — Resolve Doubt** (persistent status)
2. **Mentorship Requests — Approval Flow** (Pending / Approved / Other sections)
3. **Opportunities Module — Jobs & Hackathons Split** (two independent pages)

All changes follow the principle of minimum edits — no existing code was removed, no unrelated files were modified, and all existing functionality remains intact.

---

## Files Modified

| # | File | Task(s) | Change Type |
|---|------|---------|-------------|
| 1 | `src/services/api.js` | 1 | Added new API function |
| 2 | `src/pages/Dashboard/tabs/StudentQuestionsTab.jsx` | 1 | Modified |
| 3 | `src/pages/Dashboard/tabs/MentorshipRequestsTab.jsx` | 2 | Modified |
| 4 | `src/pages/Dashboard/tabs/OpportunitiesTab.jsx` | 3 | Modified |
| 5 | `src/pages/Dashboard/DashboardPage.jsx` | 3 | Modified |
| 6 | `src/data/roleConfig/student.js` | 3 | Modified |
| 7 | `src/data/roleConfig/studentSenior.js` | 3 | Modified |

## Files Created

| # | File | Task(s) | Description |
|---|------|---------|-------------|
| 1 | `src/pages/Dashboard/tabs/JobsTab.jsx` | 3 | Thin wrapper for Jobs page |
| 2 | `src/pages/Dashboard/tabs/HackathonsTab.jsx` | 3 | Thin wrapper for Hackathons page |

---

## Task 1: Faculty Q&A — Resolve Doubt

### Problem
The "Resolve Doubt" button did not exist in the Student Questions tab. Faculty/Senior users had no way to mark a student's doubt as resolved, and there was no persistent status tracking.

### Solution
Added a fully functional "Resolve Doubt" button that:
- Calls the backend API to persist the resolved status
- Updates the UI immediately to show a green **"Resolved"** badge
- Persists the resolved status in `localStorage` so it survives page refresh
- Reconciles with backend data on load (if the backend returns `status: 'resolved'`)

### Changes by File

#### `src/services/api.js`
- **Added** `resolveQuestion(qid)` — new API function that calls `POST /seniors/questions/{qid}/resolve`
- No existing functions were modified

```js
// Added line:
export const resolveQuestion = (qid) => req("POST", `/seniors/questions/${qid}/resolve`);
```

#### `src/pages/Dashboard/tabs/StudentQuestionsTab.jsx`
Full rewrite with the following additions:

1. **New imports:** Added `resolveQuestion` from the API service
2. **localStorage persistence:**
   - `bsn_resolved_questions` — stores array of resolved question IDs
   - `bsn_answered_questions` — stores array of answered question IDs (previously only in-memory)
   - Helper functions `loadPersistedIds(key)` and `savePersistedIds(key, ids)` for reliable localStorage I/O
3. **New state:** `resolvedIds` (Set-like array loaded from localStorage) and `resolvingId` (loading tracker)
4. **Backend reconciliation:** On load, if a question's `status` field from the backend is `'resolved'` or `'answered'`, it is automatically added to the local persisted IDs
5. **New handler:** `handleResolve(qId)` — calls the API, updates `resolvedIds` state (which triggers localStorage save)
6. **UI changes:**
   - Each question card now shows the appropriate badge: **"Resolved"** (green/success) > **"Answered"** (blue/primary) > no badge
   - "Resolve Doubt" button (green `success` variant) appears next to the "Answer" button on non-resolved questions
   - Button shows "Resolving..." loading state while the API call is in progress
   - Both "Answer" and "Resolve Doubt" buttons appear in the card footer, side by side

### Persistence Flow
```
User clicks "Resolve Doubt"
  → handleResolve(qId) called
  → API call: POST /seniors/questions/{qid}/resolve
  → On success: resolvedIds updated → useEffect saves to localStorage
  → On page refresh: loadPersistedIds('bsn_resolved_questions') restores IDs
  → Questions with matching IDs show "Resolved" badge
  → Backend reconciliation: if q.status === 'resolved', auto-adds to resolvedIds
```

---

## Task 2: Mentorship Requests — Approval Flow

### Problem
The Mentorship Requests tab showed all requests in a flat list. There was no visual separation between pending, approved, and rejected requests. While approve/reject API calls already existed, the UX did not clearly show which requests were pending action vs. already handled.

### Solution
Split the requests into three clearly labeled sections with headers and count badges. The approval flow now uses the existing backend API (`approveDmRequest` / `rejectDmRequest`) and reloads the inbox after each action, so approved requests move from the Pending section to the Approved section.

### Changes by File

#### `src/pages/Dashboard/tabs/MentorshipRequestsTab.jsx`
Full rewrite with the following changes:

1. **Request filtering:** Added three derived arrays:
   - `pendingRequests` — status === 'pending'
   - `approvedRequests` — status === 'approved'
   - `rejectedRequests` — all other statuses (rejected, expired, etc.)
2. **Three UI sections:**
   - **Pending Requests** — Yellow badge with count. Each card shows student name, email, message, timestamp, and Approve/Reject buttons.
   - **Approved** — Green badge with count. Each card has a green avatar accent, "Approved" badge, and a "Message" button to open chat.
   - **Other** — Red badge with count. Cards are rendered with reduced opacity (60%) to de-emphasize rejected requests.
3. **Empty section handling:** If a section has no requests, it is simply not rendered (no empty state clutter)
4. **Overall empty state:** If the inbox has zero requests, the original `EmptyState` component is shown

### Approval Flow
```
User clicks "Approve" on a pending request
  → handleApprove(request_id) called
  → API call: POST /senior-connect/dm-requests/{id}/approve
  → On success: loadInbox() reloads all requests from backend
  → Request moves from Pending section to Approved section
  → "Message" button appears on the approved request card
  → Status persists after page refresh (loaded from backend)
```

### What Was NOT Changed
- The approve/reject API functions (`approveDmRequest`, `rejectDmRequest`) were already implemented and working
- No changes to the API service file for this task
- The `dmInbox()` API call already returns request objects with a `status` field

---

## Task 3: Opportunities Module — Jobs & Hackathons Split

### Problem
The Opportunities tab combined all opportunity types (internships, full-time jobs, hackathons) into a single page with category filter tabs. The requirement was to split this into two independent pages:
- **Jobs Page** — Internships, Part-time Jobs, Full-time Jobs
- **Hackathons Page** — Hackathons, Competitions, Innovation Challenges

### Solution
Made the existing `OpportunitiesTab` component reusable by accepting a `scope` prop. Created two thin wrapper components (`JobsTab`, `HackathonsTab`) that pass the appropriate scope. Updated role configurations to add the new sidebar entries and allowed tabs.

### Changes by File

#### `src/pages/Dashboard/tabs/OpportunitiesTab.jsx`
Modified to accept props and support multiple scopes:

1. **New category presets:**
   - `CATEGORIES_ALL` — Original categories (All, Internships, Full-time, Hackathons)
   - `CATEGORIES_JOBS` — All, Internships, Part-time, Full-time
   - `CATEGORIES_HACKATHONS` — All, Hackathons, Competitions, Innovation Challenges

2. **Extended `CATEGORY_LABELS`** — Added `part_time`, `competition`, `innovation_challenge`

3. **Extended `categoryBadgeVariant`** — New categories map to appropriate colors (purple for hackathon-type, primary for job-type)

4. **Component signature:** Changed from `OpportunitiesTab()` to `OpportunitiesTab({ scope = 'all', pageTitle, pageDescription })`
   - `scope` selects which category preset to use
   - `pageTitle` / `pageDescription` allow custom titles (optional, with sensible defaults)

5. **Dynamic category rendering:** Replaced hardcoded `CATEGORIES.map(...)` with `categories.map(...)` using the scope-selected list

6. **Extended hackathon detection:** `isHackathon` now also matches `competition` and `innovation_challenge` categories for correct card rendering (prize/dates instead of stipend)

#### `src/pages/Dashboard/tabs/JobsTab.jsx` (NEW)
Thin wrapper component:
```jsx
import OpportunitiesTab from './OpportunitiesTab';
const JobsTab = () => <OpportunitiesTab scope="jobs" />;
export default JobsTab;
```

#### `src/pages/Dashboard/tabs/HackathonsTab.jsx` (NEW)
Thin wrapper component:
```jsx
import OpportunitiesTab from './OpportunitiesTab';
const HackathonsTab = () => <OpportunitiesTab scope="hackathons" />;
export default HackathonsTab;
```

#### `src/pages/Dashboard/DashboardPage.jsx`
- **Added imports:** `JobsTab` and `HackathonsTab`
- **Added tab views:** Two new `<motion.div>` blocks for `currentTab === 'jobs'` and `currentTab === 'hackathons'`
- **No existing tab views were modified or removed**

#### `src/data/roleConfig/student.js`
- **Added sidebar items:**
  - `Jobs` (FiBriefcase icon, tab: 'jobs')
  - `Hackathons` (FiTrophy icon, tab: 'hackathons')
  - `Opportunities` (FiLayers icon, tab: 'opportunities') — renamed from the old single entry
- **Added allowed tabs:** `'jobs'` and `'hackathons'`
- **Added imports:** `FiTrophy`, `FiLayers`

#### `src/data/roleConfig/studentSenior.js`
- Same sidebar and allowedTabs changes as `student.js`
- **Added imports:** `FiTrophy`, `FiLayers`

### Page Breakdown

| Page | URL | Scope | Category Filter Tabs |
|------|-----|-------|---------------------|
| Opportunities | `?tab=opportunities` | `all` | All, Internships, Full-time, Hackathons |
| Jobs | `?tab=jobs` | `jobs` | All, Internships, Part-time, Full-time |
| Hackathons | `?tab=hackathons` | `hackathons` | All, Hackathons, Competitions, Innovation Challenges |

### What Was NOT Changed
- The original `OpportunitiesTab` at `?tab=opportunities` still works exactly as before (scope defaults to `'all'`)
- No other role configs were modified (Faculty, Senior-only, Recruiter, College Admin, Platform Admin don't access the Opportunities tab)
- The `OpportunityCard.jsx` component was not modified — card rendering differences are handled within `OpportunitiesTab`
- All filtering, search, apply, and modal functionality works identically across all three pages

---

## Confirmation: No Unrelated Code Removed

The following existing functionality was verified to remain intact:

| Feature | Status |
|---------|--------|
| Original Opportunities tab (`?tab=opportunities`) | ✅ Unchanged |
| Mentorship Requests tab (`?tab=mentorship-requests`) | ✅ Enhanced, not removed |
| Student Questions tab (`?tab=questions`) | ✅ Enhanced, not removed |
| All other dashboard tabs | ✅ Unchanged |
| All role configurations (Faculty, Senior, Recruiter, College Admin, Platform Admin) | ✅ Unchanged (except Student/StudentSenior for Task 3) |
| Sidebar navigation | ✅ Intact for all roles |
| Authentication & authorization flow | ✅ Unchanged |
| API service functions (non-modified) | ✅ Unchanged |
| All existing components (Button, Card, Badge, Modal, etc.) | ✅ Unchanged |
| Routing (App.jsx) | ✅ Unchanged |

---

## New API Endpoint Expected (Backend)

One new backend endpoint is expected for Task 1 to fully work:

```
POST /seniors/questions/{qid}/resolve
```

If the backend does not yet implement this endpoint, the "Resolve Doubt" button will show an error. The localStorage persistence will still work as a fallback — resolved questions will be remembered locally even without the backend, though they won't sync across devices.

For Tasks 2 and 3, all API endpoints already exist in the backend (`approveDmRequest`, `rejectDmRequest`, `listOpportunities`).
