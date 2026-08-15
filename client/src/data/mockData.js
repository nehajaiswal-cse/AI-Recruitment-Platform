// Central mock data source.
//
// To go live: replace the contents of `fetchDashboardData()` with a real
// API call (e.g. `fetch('/api/dashboard').then(r => r.json())`), keeping
// the same shape. Every component below reads only from this shape, so
// nothing else needs to change.
//
// Numbers are kept internally consistent on purpose: the five pipeline
// stage counts sum to the total candidate count (154 + 62 + 18 + 6 + 41 =
// 281), which is the same 281 shown in the "Applications" stat card. A
// handful of named candidates recur across "Recent applications" and
// "Upcoming interviews" so the dashboard reads as one real pipeline
// rather than disconnected sample rows.

const TOTAL_CANDIDATES = 281

const stats = [
  { id: 'jobs', label: 'Total Jobs', value: 24, delta: '+2 this week' },
  { id: 'applied', label: 'Applications', value: TOTAL_CANDIDATES, delta: '+18 this week' },
  { id: 'interview', label: 'Interviews', value: 18, delta: '+4 this week' },
  { id: 'offers', label: 'Selected', value: 6, delta: '+1 this week' },
]

const applicationTrend = [
  { month: 'Jan', applied: 30, shortlisted: 12, hired: 4 },
  { month: 'Feb', applied: 55, shortlisted: 20, hired: 6 },
  { month: 'Mar', applied: 52, shortlisted: 18, hired: 5 },
  { month: 'Apr', applied: 74, shortlisted: 28, hired: 8 },
  { month: 'May', applied: 92, shortlisted: 33, hired: 10 },
  { month: 'Jun', applied: 112, shortlisted: 40, hired: 13 },
  { month: 'Jul', applied: 100, shortlisted: 35, hired: 11 },
  { month: 'Aug', applied: 122, shortlisted: 44, hired: 15 },
]

// colorKey maps to a fixed palette in PipelineFunnel.jsx (blue / orange / purple / green / pink)
const pipeline = [
  { id: 'applied', label: 'Applied', count: 154, colorKey: 'blue' },
  { id: 'shortlisted', label: 'Shortlisted', count: 62, colorKey: 'orange' },
  { id: 'interview', label: 'Interview', count: 18, colorKey: 'purple' },
  { id: 'selected', label: 'Selected', count: 6, colorKey: 'green' },
  { id: 'rejected', label: 'Rejected', count: 41, colorKey: 'pink' },
]

// Shared candidate pool. Some people show up in both the applications list
// and the interviews list, on purpose, since a real candidate moves through
// both views as they progress.
const candidates = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Senior Frontend Engineer',
    stage: 'Interview',
    appliedAgo: '2 hours ago',
    interview: { when: 'Today', time: '10:00 AM', mode: 'Technical Round' },
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    role: 'Product Designer',
    stage: 'Shortlisted',
    appliedAgo: '5 hours ago',
    interview: null,
  },
  {
    id: 3,
    name: 'Ananya Iyer',
    role: 'Backend Engineer',
    stage: 'Applied',
    appliedAgo: '1 day ago',
    interview: null,
  },
  {
    id: 4,
    name: 'Devansh Kapoor',
    role: 'Data Analyst',
    stage: 'Selected',
    appliedAgo: '1 day ago',
    interview: null,
  },
  {
    id: 5,
    name: 'Sara Fernandes',
    role: 'QA Engineer',
    stage: 'Rejected',
    appliedAgo: '2 days ago',
    interview: null,
  },
  {
    id: 6,
    name: 'Kabir Anand',
    role: 'DevOps Engineer',
    stage: 'Shortlisted',
    appliedAgo: '2 days ago',
    interview: { when: 'Tomorrow', time: '2:30 PM', mode: 'Screening Call' },
  },
  {
    id: 7,
    name: 'Meera Joshi',
    role: 'Product Manager',
    stage: 'Interview',
    appliedAgo: '3 days ago',
    interview: { when: 'Aug 16', time: '11:00 AM', mode: 'Panel Interview' },
  },
]

const recentApplications = candidates.map(({ id, name, role, stage, appliedAgo }) => ({
  id,
  name,
  role,
  stage,
  appliedAgo,
}))

const upcomingInterviews = candidates
  .filter((c) => c.interview)
  .map(({ id, name, role, interview }) => ({
    id,
    name,
    role,
    when: interview.when,
    time: interview.time,
    mode: interview.mode,
  }))

export async function fetchDashboardData() {
  // Simulated network delay so loading states are easy to test.
  // Replace this whole function body with a real fetch when the API is ready.
  await new Promise((resolve) => setTimeout(resolve, 250))
  return {
    stats,
    applicationTrend,
    pipeline,
    totalCandidates: TOTAL_CANDIDATES,
    recentApplications,
    upcomingInterviews,
    recruiterName: 'Advita',
  }
}
