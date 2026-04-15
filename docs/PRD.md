# PRD: Galac6 Parent Companion

## Overview

**Project name:** Galac6 Parent Companion
**One-liner:** Mobile app for French parents to track their child's AI-tutored learning on Galac6, with live activity feeds, AI-generated weekly reports, and screen time controls.
**Type:** Mobile app (React Native / Expo)
**Target users:** French parents of students aged 6-18 using Galac6
**Timeline:** 2 days (15-16 April 2026)
**Purpose:** CTO interview prototype for Galac6 + Ekkhara portfolio piece

---

## Problem Statement

Galac6 has a powerful student-facing AI tutoring platform but its parent dashboard is limited to profile management (name, grade, accessibility settings). Parents have no way to:

- See what their child studied today
- Track progress over time
- Control screen time
- Get AI-powered insights on strengths and weaknesses

Competitors like Rakoono and Stewdy offer parent dashboards. This gap is a retention and conversion risk — parents pay the subscription but can't see the value.

---

## User Stories

### Story 1: Activity Feed

**As a** parent,
**I want to** see a live feed of my child's learning activities,
**So that** I know what they studied, how they performed, and how engaged they are.

**Acceptance Criteria:**

- Given the app is open, when I view the feed, then I see activity cards sorted by most recent
- Given an activity card, when I read it, then I see: activity type, subject, title, score (if applicable), XP earned, duration, and timestamp
- Given the feed, when I pull to refresh, then new activities appear at the top
- Given multiple children, when I switch profiles, then the feed updates to show that child's activities

### Story 2: Weekly AI Report

**As a** parent,
**I want to** receive a weekly AI-generated learning report for my child,
**So that** I understand their strengths, weaknesses, and what to focus on next week.

**Acceptance Criteria:**

- Given the report tab, when I open it, then I see the current week's report with: total study time, total XP, subject breakdown chart
- Given the report, when I read the AI summary, then it includes: 2-3 strengths, 2-3 areas for improvement, 3 specific recommendations
- Given the report, when I tap "Generate report", then Claude API produces a personalized analysis from the child's activity data
- Given the report, when I scroll down, then I see a bar chart of time spent per subject

### Story 3: Screen Time Controls

**As a** parent,
**I want to** set daily time limits and study windows for my child,
**So that** I can manage their screen time while ensuring they study regularly.

**Acceptance Criteria:**

- Given the controls tab, when I view it, then I see today's usage (minutes used / limit) as a progress ring
- Given the controls, when I adjust the daily limit slider, then the limit updates (15 min increments, 30-180 min range)
- Given the controls, when I toggle "Lock app", then the lock state is saved
- Given study windows, when I set start/end times, then they display as time range chips

### Story 4: Child Profile Switcher

**As a** parent with multiple children,
**I want to** switch between child profiles,
**So that** I can track each child's learning independently.

**Acceptance Criteria:**

- Given the profile tab, when I open it, then I see all child profiles with avatar, name, grade, XP, streak
- Given a child card, when I tap it, then it becomes the active profile and all tabs update
- Given the active child, when I view any tab, then I see that child's name in the header

### Story 5: Onboarding Flow

**As a** new parent user,
**I want to** be guided through setting up my first child profile,
**So that** I can start using the app immediately without confusion.

**Acceptance Criteria:**

- Given first launch, when the app opens, then I see a welcome screen with Galac6 branding
- Given onboarding, when I proceed, then I enter child name, select grade level, and see a confirmation
- Given onboarding complete, when I tap "C'est parti", then I land on the Activity Feed with mock data populated

### Story 6: Share Progress

**As a** proud parent,
**I want to** share my child's weekly report as an image,
**So that** I can send it to family or post it on social media.

**Acceptance Criteria:**

- Given the weekly report, when I tap the share button, then the report is captured as an image
- Given the share sheet, when I select a target (WhatsApp, iMessage, etc.), then the image is shared via native share API

### Story 7: Study Schedule

**As a** parent,
**I want to** set a weekly study plan for my child,
**So that** their daily practice is focused on subjects I prioritize.

**Acceptance Criteria:**

- Given the controls tab, when I scroll to "Programme de la semaine", then I see a 7-day grid
- Given a day in the grid, when I tap it, then I can assign 1-3 subjects from the French curriculum
- Given a schedule is set, when I view it, then assigned subjects show as colored chips per day

### Story 8: Notifications Preview

**As a** parent,
**I want to** see what push notifications would look like,
**So that** I understand the real-time tracking vision even in a prototype.

**Acceptance Criteria:**

- Given the activity feed, when new activities appear, then an in-app notification banner slides in from the top
- Given the notification, when I see it, then it shows: child name, activity type, score, and timestamp
- Given the notification, when I tap it, then I scroll to that activity in the feed

---

## Technical Architecture

### Stack

| Layer      | Choice                 | Justification                                        |
| ---------- | ---------------------- | ---------------------------------------------------- |
| Framework  | Expo SDK 52            | Latest, file-based routing, OTA updates              |
| Navigation | Expo Router v4         | File-based, type-safe, familiar patterns             |
| Language   | TypeScript (strict)    | Type safety, better DX                               |
| Styling    | NativeWind v4          | Tailwind for RN, rapid UI development                |
| State      | Zustand                | Zero boilerplate, TS-first, async storage middleware |
| Storage    | AsyncStorage           | Offline-capable, mock data persistence               |
| AI         | Anthropic SDK          | Claude for weekly report generation                  |
| Charts     | react-native-chart-kit | Lightweight, works with Expo                         |
| Icons      | @expo/vector-icons     | Built into Expo, no extra install                    |

### Data Flow

```
Mock Data Service → Zustand Store → React Components
                                          ↓
                                    User Actions
                                          ↓
                              Zustand Store (update)
                                          ↓
                              AsyncStorage (persist)

Report Tab → Claude API → Formatted Report → UI
```

### Project Structure

```
galac6-parent/
├── app/                       # Expo Router
│   ├── _layout.tsx            # Root layout
│   ├── onboarding.tsx         # First-launch onboarding
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Tab bar
│   │   ├── index.tsx          # Activity Feed
│   │   ├── report.tsx         # Weekly Report
│   │   ├── controls.tsx       # Screen Time + Study Schedule
│   │   └── profile.tsx        # Child Profiles
├── components/
│   ├── ActivityCard.tsx
│   ├── SubjectBadge.tsx
│   ├── ProgressRing.tsx
│   ├── ScreenTimeSlider.tsx
│   ├── WeeklyChart.tsx
│   ├── ReportSection.tsx
│   ├── NotificationBanner.tsx # In-app notification slide-in
│   ├── ShareReportButton.tsx  # Capture + native share
│   ├── StudyScheduleGrid.tsx  # 7-day subject assignment grid
│   └── OnboardingSteps.tsx    # Welcome + child setup
├── services/
│   ├── mockData.ts            # Realistic activity generator
│   ├── claude.ts              # AI report generation
│   ├── share.ts               # Screenshot capture + share
│   └── storage.ts             # AsyncStorage wrapper
├── stores/
│   ├── childStore.ts
│   ├── activityStore.ts
│   ├── controlsStore.ts
│   └── scheduleStore.ts       # Weekly study schedule
├── constants/
│   ├── colors.ts              # Galac6 brand
│   ├── subjects.ts            # French curriculum subjects
│   └── mockActivities.ts      # Seed data
├── types/
│   └── index.ts
└── assets/
```

---

## Edge Cases

| Scenario                             | Expected Behavior                              |
| ------------------------------------ | ---------------------------------------------- |
| No children configured               | Show "Ajoute un enfant" empty state            |
| No activities yet                    | Show "Pas encore d'activité" with illustration |
| AI report generation fails           | Show error toast, offer retry button           |
| Screen time limit = 0                | Treat as "no limit set", show info message     |
| Very long activity title (50+ chars) | Truncate with ellipsis on activity card        |

---

## Testing Strategy

| Type       | Tool                                 | Scope                      |
| ---------- | ------------------------------------ | -------------------------- |
| Type check | tsc --noEmit                         | All files                  |
| Lint       | eslint                               | All .ts/.tsx               |
| Unit       | jest + @testing-library/react-native | Stores, services           |
| Smoke      | Expo build check                     | App launches without crash |

---

## Build Milestones

### Phase 1: Foundation + Core Screens (Day 1, Hours 0-8)

**Quality gate:** App launches, 4 tabs working, feed + profile populated with mock data

- [ ] Expo init with TypeScript + NativeWind + Expo Router
- [ ] Types, constants, mock data service with realistic Galac6 activities
- [ ] Zustand stores (child, activity, controls, schedule)
- [ ] Tab navigation with Galac6 branding (purple, dark mode)
- [ ] Story 5: Onboarding flow (welcome → add child → confirmation)
- [ ] Story 1: Activity Feed screen (scrollable cards, subject badges, scores)
- [ ] Story 8: Notification banners (in-app slide-in on new activity)
- [ ] Story 4: Profile screen (child switcher, XP/streak display)

### Phase 2: AI Report + Controls + Schedule (Day 2, Hours 0-5)

**Quality gate:** All 8 stories functional, Claude API generates real report

- [ ] Story 2: Weekly Report screen (chart + AI summary)
- [ ] Claude API integration (real AI-generated weekly analysis)
- [ ] Story 6: Share progress (capture report as image + native share)
- [ ] Story 3: Screen Time Controls (progress ring, slider, lock toggle)
- [ ] Story 7: Study Schedule (7-day grid with subject chips)
- [ ] Pull-to-refresh on feed

### Phase 3: Polish + Demo Prep (Day 2, Hours 5-8)

**Quality gate:** Lint clean, demo-ready, presentation materials done

- [ ] Animations (card entry, notification slide, tab transitions)
- [ ] Loading states and error handling
- [ ] Empty states with illustrations
- [ ] Screenshots for Thursday presentation
- [ ] README with setup instructions
- [ ] Build APK/TestFlight if time permits

---

## Out of Scope (Explicitly)

- Real Galac6 backend integration (using mock data)
- Push notifications (requires Expo push service setup)
- Authentication / login (prototype starts logged in)
- App Store submission
- Offline sync
- Multi-language (French only for demo)
- Stripe/payment integration
