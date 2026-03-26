# Weight Training Mobile React App Plan

## 1) Vision
Build a mobile-first React app that helps a beginner lifter:
- Follow structured workouts step-by-step.
- Log weight, reps, and sets quickly while training.
- See progress over time and know what to do next session.

## 2) Target User and Constraints
- User: beginner/intermediate weight trainer.
- Device: primarily phone (PWA-style UX).
- Environment: gym floor (one-hand usage, fast interactions, low cognitive load).

## 3) MVP Scope

### Core Features
1. **Workout Program Builder**
   - Preload simple programs (e.g., Push/Pull/Legs, Upper/Lower, 3-day full body).
   - User can choose one and set weekly schedule.

2. **Workout Session Flow**
   - “Start Workout” shows today’s routine.
   - Exercise cards display target sets/reps and suggested load from last session.
   - One-tap logging for completed set (weight/reps/RPE optional).

3. **Rest Timer + Guidance**
   - Configurable rest timer per exercise type.
   - Audio/vibration cue when rest ends.

4. **Progress Tracking**
   - Exercise history with simple charts (weight and estimated 1RM trend).
   - Personal records: max weight, max reps at weight, best volume.

5. **Progressive Overload Suggestions**
   - Basic rules engine:
     - If all sets hit top of rep range, suggest +2.5–5 lb next session.
     - If repeatedly below target, suggest same or slight deload.

### Nice-to-Have (Post-MVP)
- Warm-up planner.
- Plate calculator.
- Superset/circuit mode.
- Coach share/export.
- Apple Health / Google Fit integrations.

## 4) Information Architecture (Mobile-First)
- **Home**: today’s workout + quick stats.
- **Program**: template selection and edit.
- **Session**: active workout logging flow.
- **History**: past sessions, charts, PRs.
- **Settings**: units, rest defaults, notifications.

Bottom tab navigation with 4 tabs: Home, Session, History, Settings.

## 5) Suggested Tech Stack
- **Frontend**: React + TypeScript + Vite.
- **Mobile-friendly UI**: Tailwind CSS + shadcn/ui (or Chakra UI).
- **State**: Zustand (session + app state).
- **Data**:
  - Start local-first with IndexedDB (Dexie) for offline use.
  - Optional backend later: Supabase/Postgres + auth.
- **Charts**: Recharts.
- **PWA**: vite-plugin-pwa for installable app behavior.

## 6) Data Model (Initial)
- `Program`: id, name, days[], progressionRule.
- `WorkoutDay`: id, programId, name, exercises[].
- `Exercise`: id, name, muscleGroup, defaultRestSec, repRange.
- `Session`: id, date, workoutDayId, startedAt, endedAt.
- `SetLog`: id, sessionId, exerciseId, setNumber, weight, reps, rpe, completedAt.
- `PRRecord`: exerciseId, type, value, date.

## 7) UX Principles for Gym Usage
- Big touch targets and sticky primary action buttons.
- Minimal typing; defaults and recent values prefilled.
- High contrast and large type.
- Keep critical actions under 2 taps.
- Offline-first behavior; sync when online.

## 8) Validation Metrics
- Time to log a set < 5 seconds.
- Workout completion rate (started vs completed sessions).
- Week-over-week volume progression.
- User retention after 4 weeks.

## 9) 4-Phase Delivery Plan

### Phase 1 (Week 1): Foundation
- Setup app shell (routing, tabs, theme, responsive layout).
- Create base data model and local storage layer.
- Seed example program templates.

### Phase 2 (Week 2): Session Logging MVP
- Build active session flow.
- Add set logger with smart defaults.
- Add rest timer and completion summary.

### Phase 3 (Week 3): Progress + Suggestions
- Add history screens and charts.
- Implement PR detection.
- Add basic overload recommendation engine.

### Phase 4 (Week 4): Polish + PWA
- Improve UX/microinteractions.
- Add installable PWA support and offline caching.
- QA on common mobile viewports.

## 10) Risks and Mitigations
- **Risk**: logging too slow in gym.
  - **Mitigation**: optimize one-tap flows, defaults, and quick edit.
- **Risk**: confusing progression suggestions.
  - **Mitigation**: keep rules explicit and show “why this suggestion”.
- **Risk**: data loss on device.
  - **Mitigation**: local backups/export; optional cloud sync later.

## 11) Next Steps
1. Confirm preferred training split (3-day full body vs PPL).
2. Decide whether auth/cloud sync is needed in v1.
3. Start Phase 1 scaffolding and define first clickable wireframes.
