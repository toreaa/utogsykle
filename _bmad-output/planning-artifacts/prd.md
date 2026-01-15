---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-problem', 'step-04-solution', 'step-05-users', 'step-06-features', 'step-07-ux', 'step-08-technical', 'step-09-success', 'step-10-risks', 'step-11-complete']
inputDocuments:
  - '_bmad-output/analysis/brainstorming-session-2026-01-13.md'
  - 'PROJECT_STATUS.md'
workflowType: 'prd'
date: 2026-01-14
---

# Product Requirements Document - utogsykle

**Author:** Tore
**Date:** 2026-01-14
**Version:** 1.0

---

## 1. Executive Summary

### Vision Statement

I want to build a year-round corporate wellness competition platform that makes "Sykle til jobben" obsolete. Where they offer 9 weeks of cycling tracking, I'm building 52 weeks of any activity—with fairness baked into the core.

The fundamental philosophy is **"Consistency > Performance"**. I don't want fit people dominating leaderboards. I want the person who shows up every day—even for a 15-minute walk—to beat the marathon runner who only logs once a week.

### Why This Exists

"Sykle til jobben" has been running since 1973 with ~40,000 annual participants. But it's broken:
- Only 9 weeks per year (May-June)
- Poor app quality (bugs, slow sync, bad UX)
- Basic gamification (3 points/day max)
- Limited to cycling focus
- No company customization

I see an opportunity to take everything they do wrong and flip it. Year-round engagement. Any activity. Company-controlled competitions. Advanced gamification. Actually good UX.

### MVP Scope

Three things must work at launch:
1. **Three-tier admin system** — System admin → Company admin → User
2. **Default activities + leaderboards** — Ready-to-use competitions that work out of the box
3. **Stripe payment integration** — Subscription billing that just works

---

## 2. Problem Statement

### The Core Problem

Corporate wellness programs fail because they're designed for fitness enthusiasts, not regular employees. HR buys a platform, rolls it out, and 80% of employees ignore it because:

- **The fit people always win** — Why compete when you know you'll lose?
- **It's too much effort** — Manual logging kills participation
- **It's seasonal** — Motivation dies when the campaign ends
- **It's inflexible** — One-size-fits-all competitions don't fit anyone

### Who Feels This Pain

**Lars (The Reluctant Employee)**
- Not anti-fitness, just not prioritizing it
- Would participate IF it felt achievable
- Hates team pressure and unfair comparisons
- Needs zero-friction logging

**Nina (HR Business Partner)**
- Bought wellness platforms before that failed
- Needs ROI proof (sick leave reduction)
- Fears looking bad if the platform has poor UX
- Wants simple pricing, not enterprise sales calls

**Erik (Office Manager/Admin)**
- Stuck setting up and managing the platform
- Hates manual data entry
- Needs bulk operations and self-service tools
- Will abandon anything that creates support tickets

### Market Context

**Sykle til jobben (Primary Competitor)**
| Aspect | Their Approach | My Approach |
|--------|---------------|-------------|
| Duration | 9 weeks/year | 52 weeks/year |
| Activities | Cycling-focused | Any activity |
| Pricing | 104-149 kr/person (one-time) | Subscription (TBD) |
| Customization | None | Full company control |
| Fairness | Distance-based | Consistency-based |
| App quality | 4.4/5, buggy | Must be excellent |

---

## 3. Solution Overview

### Core Differentiators

**D-1: Year-Round Engagement**
Not a campaign. A permanent part of how the company operates. 52 weeks of competitions, seasons, and engagement—not a 9-week burst that everyone forgets.

**D-2: Fairness by Design**
- Consistency beats performance (showing up > one big effort)
- Self-selected leagues (beginner/intermediate/advanced)
- Team averaging, not summing (prevents athlete stacking)
- Daily point caps (grinding has limits)

**D-3: Company-Controlled Competitions**
Companies can create anything: "Hvem spiser ribbe flest ganger før jul?" isn't a wellness activity, but it builds engagement. The platform enables whatever competitions a company wants.

### Design Principles

1. **Design for Lars, not the fitness enthusiast** — If the reluctant participant won't use it, the product fails
2. **Automation is non-negotiable** — Manual input kills adoption
3. **Transparency builds trust** — Open data, no hidden algorithms
4. **Activity enablement, not just tracking** — Help people DO activities, not just log them
5. **Simple pricing, simple UX** — No enterprise complexity

---

## 4. User Personas & Journeys

### Primary Persona: Lars (The Reluctant Employee)

**Demographics:** 35-50, office worker, not anti-fitness but not prioritizing it

**Goals:**
- Not embarrass himself in front of colleagues
- Maybe get a bit more active (if it's easy)
- Have some fun with competitions

**Frustrations:**
- Fit colleagues always winning
- Complicated apps
- Feeling pressured by teams
- Unfair point systems

**Key Insights from Research:**
| Insight | Design Implication |
|---------|-------------------|
| Team pressure kills motivation | Solo participation as first-class citizen |
| Autonomy matters | Self-select into competitions |
| Manual input = death | Automation non-negotiable |
| Curiosity about others drives engagement | Leaderboard as main hook |
| Unfair points = quit | Activity weighting + consistency rewards |
| Streaks = motivating | Streak system with protection |
| Accepts minimal friction manual input | Photo, GPS tap, or honor system OK |

**User Journey:**
1. Receives invite email from company admin
2. Signs up with work email (domain whitelisted)
3. Connects Strava/Garmin (or opts for manual)
4. Browses available competitions
5. Joins a walking challenge (low barrier)
6. Gets notification: "You moved up 3 spots!"
7. Checks leaderboard, gives kudos to colleague
8. Earns streak badge after 7 days
9. Joins another competition

### Buyer Persona: Nina (HR Business Partner)

**Demographics:** 30-45, HR role, reports to leadership on wellness ROI

**Goals:**
- Prove wellness investment delivers results
- Not look bad by championing a failed platform
- Improve "trivsel" (workplace satisfaction)

**Frustrations:**
- Platforms that need constant support
- Complex enterprise pricing
- No ROI metrics
- Employees complaining about UX

**Key Insights from Research:**
| Insight | Design Implication |
|---------|-------------------|
| ROI = sick leave reduction | Analytics dashboard with before/after |
| Needs 6+ months to prove value | Annual contracts encouraged |
| Fear: bad UX makes her look bad | Reliability & polish critical |
| Hates tier pricing | One tier, all features |
| Wants intro package | Onboarding kit (PDF + video) |
| 1 month free pilot | Try before you buy |
| Success = "trivsel" | Soft metrics in dashboard |

**Buying Journey:**
1. Sees competitor comparison (us vs Sykle til jobben)
2. Signs up for 1-month free pilot
3. Gets onboarding kit
4. Runs pilot with 20-50 employees
5. Reviews adoption dashboard
6. Converts to annual subscription
7. Rolls out company-wide

### Admin Persona: Erik (Office Manager)

**Demographics:** 25-40, handles operational setup, not technical

**Goals:**
- Set things up quickly
- Not create support tickets
- Have visibility into what's happening

**Frustrations:**
- Manual data entry
- Confusing admin panels
- No bulk operations
- Can't delegate tasks

**Key Insights from Research:**
| Insight | Design Implication |
|---------|-------------------|
| Bulk user import | CSV/Excel import |
| Manual entry = nightmare | Import or self-service only |
| Domain-based self-registration | Email domain whitelist |
| KISS principle | Minimal required fields |
| Outlier alerts | Anomaly detection |
| Slack/Teams integration | Webhook notifications |
| Additional admin rights | Role delegation |
| Self-service export | No support ticket needed |

---

## 5. Functional Requirements

### 5.1 MVP Features (Must-Have)

#### F1: Three-Tier Admin System

**System Admin (utogsykle team)**
- Create/manage company accounts
- View all companies and users
- Handle billing issues
- Access system-wide analytics

**Company Admin (Nina/Erik)**
- Invite users (bulk CSV or individual)
- Create and manage competitions
- View company dashboard and analytics
- Configure company settings
- Export data (CSV, API)

**User (Lars)**
- Register with work email
- Connect fitness integrations
- Join/leave competitions
- View personal stats and history
- View leaderboards
- Give/receive kudos

#### F2: Default Activities & Competitions

**Pre-configured Activity Types:**
- Walking (steps or distance)
- Running (distance)
- Cycling (distance)
- Swimming (distance or time)
- Gym/Strength training (sessions)
- General exercise (time)

**Default Competition Templates:**
- Weekly step challenge
- Monthly distance challenge
- Streak challenge (consistency)
- Team vs team
- Department challenge

**Leaderboard Features:**
- Individual rankings
- Team rankings (average-based)
- Streak leaderboard
- Activity-specific leaderboards
- Historical comparisons

#### F3: Payment Integration (Stripe)

**Billing Model:**
- Per-user subscription pricing
- Monthly or annual billing
- Automatic invoicing
- Self-service subscription management

**Features:**
- Company credit card on file
- Usage-based billing (active users)
- Invoice history
- Payment failure handling

### 5.2 Phase 2 Features (Post-Launch)

#### P2-1: Advanced Fairness & Anti-Cheat

- Outlier detection (flag suspicious activities)
- Verification hold (review before points awarded)
- Required integrations for competitive leagues
- Peer reporting

#### P2-2: Custom Activity Types

- Company-defined activities
- Custom point values
- Activity categories
- Non-fitness challenges ("ribbe-konkurranse")

#### P2-3: Company Branding

- Subdomain (bedrifta.utogsykle.no)
- Logo upload
- Color theme customization

#### P2-4: Advanced Gamification

- Division system (Bronze → Platinum)
- Seasonal leagues with promotion/relegation
- Earnable currency ("activity coins")
- Streak freeze purchases
- Flash events (48-hour surprise competitions)
- Year in review summaries
- Birthday bonuses

#### P2-5: Integrations & Notifications

- Slack/Teams webhooks
- Strava deep integration
- Garmin Connect
- Apple Health / Google Fit
- Push notifications (mobile)

---

## 6. User Experience Requirements

### Design Philosophy

The UX must serve Lars—the reluctant participant. If he finds it confusing, annoying, or unfair, the product fails. Every design decision flows from this.

### Core UX Principles

1. **Zero-friction onboarding** — Email invite → click → connected in under 2 minutes
2. **Automation first** — Strava/Garmin sync should "just work"
3. **Transparency** — Show exactly how points are calculated
4. **Gentle social** — Kudos and reactions, not confrontational comparisons
5. **Mobile-first** — Most interactions happen on phones
6. **Accessibility** — No gym required, no equipment required

### Key Screens

**User Dashboard**
- Current competitions (with rank)
- Recent activity
- Streak status
- Notifications
- Quick actions (log activity, give kudos)

**Leaderboard**
- Clear ranking with movement indicators
- Filter by competition/activity/timeframe
- Colleague profiles (click to kudos)
- "You vs similar" comparison (opt-in)

**Competition Detail**
- Rules clearly explained
- Current standings
- Time remaining
- Activity feed
- Join/leave button

**Admin Dashboard**
- Adoption metrics (% registered, % active)
- Competition health
- Anomaly alerts
- Quick actions (invite, create competition)

### Language & Tone

- Encouraging, not competitive ("Great streak!" not "You beat 47%")
- Norwegian as primary language
- Casual but professional
- No fitness jargon

---

## 7. Technical Requirements

### 7.0 Technology Stack (Mandated)

These technology choices are **non-negotiable** for this project:

| Layer | Technology | Why |
|-------|------------|-----|
| **Database** | Supabase (PostgreSQL) | Managed Postgres, built-in RLS for multi-tenancy, realtime subscriptions |
| **Auth** | Supabase Auth | Email/password, magic links, integrates with RLS |
| **Backend** | Supabase Edge Functions | Serverless, TypeScript, close to data |
| **Hosting** | Vercel | Next.js optimized, edge network, easy deploys |
| **Framework** | Next.js 14+ (App Router) | React, server components, API routes |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS | Utility-first, fast iteration |
| **Payments** | Stripe | Subscriptions, invoicing, webhooks |
| **Fitness API** | Strava OAuth | Activity sync |

**Project Structure Pattern:**
```
/app                    # Next.js App Router
  /(auth)              # Auth routes (login, register)
  /(dashboard)         # Authenticated routes
    /admin             # Company admin views
    /user              # User views
/components            # React components
/lib
  /supabase           # Supabase client & helpers
  /stripe             # Stripe integration
  /strava             # Strava OAuth & sync
/supabase
  /migrations         # Database migrations
  /functions          # Edge functions
```

### 7.1 Multi-Tenant Architecture (Critical)

This is a **multi-tenant SaaS platform**. Multiple companies use the same application, each with complete data isolation.

**Core Multi-Tenancy Requirements:**

| Requirement | Description |
|-------------|-------------|
| **Data Isolation** | Company A cannot see Company B's data under any circumstance |
| **Tenant Context** | Every database query must be scoped to the current tenant |
| **Admin Hierarchy** | System admin (utogsykle) → Company admin → Users |
| **Self-Contained** | Each company has its own competitions, leaderboards, settings |
| **Scalable** | Architecture must support 100+ companies without degradation |

**Database Strategy (for Architecture phase):**
- Single database with tenant ID on all tables (recommended for Supabase)
- Row Level Security (RLS) policies enforcing tenant isolation
- Company ID as foreign key on: users, competitions, activities, teams, etc.
- Indexes on company_id for query performance

**Tenant Boundaries:**
- Users belong to exactly one company
- Competitions are company-scoped (no cross-company competitions in MVP)
- Leaderboards show only company members
- Admin actions are restricted to own company
- Data exports include only own company data

**System Admin (utogsykle) Capabilities:**
- View all companies (metadata only, not user data)
- Create/suspend company accounts
- Manage billing across companies
- System-wide analytics (aggregated, anonymized)

### 7.2 Integrations (MVP)

**Authentication**
- Email/password
- Magic link option
- Domain whitelist for self-registration (per company)

**Fitness Platforms**
- Strava OAuth (read activities)
- Manual input fallback

**Payments**
- Stripe Checkout
- Stripe Billing (subscriptions per company)
- Stripe Webhooks

### 7.3 Data Requirements

**User Data**
- Email, name, company
- Connected integrations
- Activity history
- Competition participation
- Achievements/streaks

**Company Data**
- Company name, domain
- Admin users
- Billing info
- Active competitions
- Aggregate statistics

**Activity Data**
- Type, duration, distance
- Source (Strava/manual)
- Timestamp
- Points awarded
- Competition context

### 7.4 Security & Privacy

**Principles:**
- Minimal data collection
- Never sell data (public commitment)
- Plain language privacy policy
- GDPR compliant

**Requirements:**
- Data encryption at rest and in transit
- Secure authentication
- Audit logging
- Data export (user right)
- Account deletion (user right)

### 7.5 Performance

- Page load < 2 seconds
- Real-time leaderboard updates (within 5 minutes of activity sync)
- Support 100+ concurrent users per company
- 99.9% uptime target

### 7.6 Data Integrity

- Daily backups
- Soft delete (30-day recovery)
- Immutable activity log (append-only for audit)
- Sync conflict handling

---

## 8. Success Metrics

### North Star Metric

**Weekly Active Participation Rate**
= Users who logged at least one activity this week / Total registered users

Target: >50% after 3 months

### Primary Metrics

| Metric | Definition | MVP Target |
|--------|------------|------------|
| Activation Rate | Users who complete onboarding + first activity | >80% |
| Weekly Active Users | Users with 1+ activity/week | >50% |
| Streak Retention | Users maintaining 7+ day streaks | >30% |
| Competition Participation | Users in at least one active competition | >70% |
| NPS | Net Promoter Score | >40 |

### Business Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Company Conversion | Free trial → paid | >30% |
| Monthly Churn | Companies cancelling | <5% |
| Expansion Revenue | Additional users per company | >10% MoM |
| CAC Payback | Months to recover acquisition cost | <6 months |

### Admin Metrics (for Nina)

| Metric | What it proves |
|--------|---------------|
| Adoption rate over time | Platform is sticky |
| Activity trend | Engagement growing |
| Participation by department | Where to focus |
| Before/after sick leave | ROI (if data available) |

---

## 9. Risks & Mitigations

### User Adoption Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Fit people dominate | High | High | Consistency > Performance scoring, self-selected leagues, team averaging |
| Cheating ruins trust | Medium | High | Outlier detection, required integrations for competitive leagues, transparency |
| Manual logging friction | High | High | Strava/Garmin integration, minimal manual input |
| Competition fatigue | Medium | Medium | Variety of competition types, seasons, flash events |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low initial adoption | Medium | High | Onboarding kit, admin nudges, social proof ("23 colleagues joined!") |
| Price comparison to Sykle | High | Medium | Year-round value argument, free pilot, feature comparison matrix |
| Champion leaves company | Medium | Medium | Multi-admin setup, documented processes |
| Competitor copies us | Medium | Low | Execution speed, UX quality, first-mover in Norway |

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Strava API changes | Low | High | Abstract integration layer, manual fallback |
| Data breach | Low | Critical | Minimal data, encryption, security monitoring, EU hosting |
| Scale issues | Low | Medium | Cloud infrastructure, load testing |
| Data loss | Low | High | Daily backups, soft delete, immutable logs |

---

## 10. Out of Scope (Explicit No's)

These are NOT in MVP and NOT planned for near-term:

- **Native mobile apps** — Web-first, PWA later
- **Wearable device integrations** — Strava/Garmin covers this
- **Social features beyond kudos** — No messaging, no comments
- **Marketplace/prizes** — No physical rewards system
- **API for third parties** — Internal only initially
- **Multi-language** — Norwegian only at launch
- **SSO/SAML** — Email auth is sufficient for target market
- **Advanced HR analytics** — Basic dashboard only

---

## 11. Open Questions

Questions to resolve during Architecture phase:

1. **Pricing model** — Per user/month? Per user/year? Flat rate per company?
2. **Free tier** — Should there be a forever-free option for small teams?
3. **Activity point values** — How exactly do we weight different activities?
4. **Streak mechanics** — How many streak freezes? How earned?
5. **Team size limits** — Min/max team sizes for competitions?
6. **Data retention** — How long do we keep activity history?
7. **Inter-company leagues (Phase 2+)** — If we want Company vs Company competitions later, how do we handle cross-tenant data sharing while maintaining privacy?

---

## 12. Appendix

### A. Competitive Analysis Summary

**Sykle til jobben**
- Established 1973, ~40,000 annual participants
- 9-week campaign (May-June)
- Pricing: 104-149 kr/person one-time
- App: Bedriftsidretten (4.4/5, developed by Bloc AS)
- Integrations: Strava, Polar (limited)
- Weaknesses: Seasonal, poor UX, basic gamification, inflexible

### B. Gamification Mechanics Reference

Ideas from Cross-Pollination research:

| Source | Mechanic | Potential Application |
|--------|----------|----------------------|
| Duolingo | Streak freeze | Earn rest days to protect streak |
| Duolingo | Weekly leagues | Division system with promotion |
| Strava | Kudos | One-tap recognition |
| Strava | Year in review | Personal annual summaries |
| Fortnite | Flash events | 48-hour surprise competitions |
| Pokémon GO | Community challenge | Company-wide collective goals |
| Wordle | Daily challenge | Same mini-challenge for everyone |

### C. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-14 | Tore | Initial PRD based on brainstorming session |

---

*This PRD represents Tore's vision for utogsykle, synthesized from comprehensive brainstorming covering 115 ideas across user research, gamification design, and risk analysis.*
