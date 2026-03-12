import { useMemo, useState } from 'react';

type Tab = 'Home' | 'Session' | 'History' | 'Settings';
type WorkoutType = 'Upper Body' | 'Lower Body';
type ExerciseKind = 'push' | 'pull' | 'legs';

type SetLog = {
  id: string;
  workoutType: WorkoutType;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
};

type ExercisePlan = {
  name: string;
  kind: ExerciseKind;
  targetSets: number;
  repRange: string;
  suggestedWeight: number;
  restSec: number;
  cue: string;
};

type WorkoutDayPlan = {
  title: WorkoutType;
  goal: string;
  exercises: ExercisePlan[];
};

const upperWorkout: WorkoutDayPlan = {
  title: 'Upper Body',
  goal: 'Chest, back, shoulders, and arms',
  exercises: [
    {
      name: 'Bench Press',
      kind: 'push',
      targetSets: 4,
      repRange: '5-8',
      suggestedWeight: 85,
      restSec: 120,
      cue: 'Drive feet into floor and keep shoulder blades tight.',
    },
    {
      name: 'One-Arm Dumbbell Row',
      kind: 'pull',
      targetSets: 3,
      repRange: '8-12',
      suggestedWeight: 45,
      restSec: 90,
      cue: 'Pull elbow toward your back pocket, not your shoulder.',
    },
    {
      name: 'Seated Shoulder Press',
      kind: 'push',
      targetSets: 3,
      repRange: '8-10',
      suggestedWeight: 35,
      restSec: 90,
      cue: 'Keep ribs down and press in a smooth arc overhead.',
    },
    {
      name: 'Lat Pulldown',
      kind: 'pull',
      targetSets: 3,
      repRange: '10-12',
      suggestedWeight: 75,
      restSec: 75,
      cue: 'Lead with elbows and pause briefly at the chest.',
    },
  ],
};

const lowerWorkout: WorkoutDayPlan = {
  title: 'Lower Body',
  goal: 'Quads, hamstrings, glutes, and calves',
  exercises: [
    {
      name: 'Back Squat',
      kind: 'legs',
      targetSets: 4,
      repRange: '5-8',
      suggestedWeight: 105,
      restSec: 120,
      cue: 'Brace your core first, then sit down between your hips.',
    },
    {
      name: 'Romanian Deadlift',
      kind: 'legs',
      targetSets: 3,
      repRange: '8-10',
      suggestedWeight: 95,
      restSec: 120,
      cue: 'Hinge at hips and keep bar close to thighs and shins.',
    },
    {
      name: 'Walking Lunges',
      kind: 'legs',
      targetSets: 2,
      repRange: '10-12',
      suggestedWeight: 25,
      restSec: 75,
      cue: 'Stay tall and let rear knee track straight down.',
    },
    {
      name: 'Calf Raise',
      kind: 'legs',
      targetSets: 3,
      repRange: '12-15',
      suggestedWeight: 70,
      restSec: 60,
      cue: 'Pause at top and lower under control for full stretch.',
    },
  ],
};

const tabs: Tab[] = ['Home', 'Session', 'History', 'Settings'];

const getTodayPlan = (): WorkoutDayPlan => {
  const day = new Date().getDay();

  if (day === 0) {
    return {
      title: 'Upper Body',
      goal: 'Active recovery day: walk + mobility + light core',
      exercises: [],
    };
  }

  return day % 2 === 0 ? lowerWorkout : upperWorkout;
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [logs, setLogs] = useState<SetLog[]>([]);

  const todayPlan = useMemo(() => getTodayPlan(), []);
  const totalVolume = useMemo(() => logs.reduce((sum, entry) => sum + entry.reps * entry.weight, 0), [logs]);

  const logSet = (
    workoutType: WorkoutType,
    exerciseName: string,
    setNumber: number,
    reps: number,
    weight: number,
  ) => {
    setLogs((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        workoutType,
        exerciseName,
        setNumber,
        reps,
        weight,
        completedAt: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="app-shell">
      <header className="top">
        <p className="kicker">Exercise Tracker</p>
        <h1>Upper / Lower Daily Flow</h1>
        <p className="subtitle">Alternate days to train hard and recover while still staying consistent.</p>
      </header>

      <main>
        {activeTab === 'Home' && (
          <HomeTab logs={logs} totalVolume={totalVolume} todayPlan={todayPlan} onQuickStart={setActiveTab} />
        )}
        {activeTab === 'Session' && (
          <SessionTab
            plan={todayPlan}
            logs={logs}
            onLogSet={logSet}
            onSwitchTab={setActiveTab}
          />
        )}
        {activeTab === 'History' && <HistoryTab logs={logs} totalVolume={totalVolume} />}
        {activeTab === 'Settings' && <SettingsTab />}
      </main>

      <nav className="tab-bar" aria-label="Bottom Navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}

type HomeTabProps = {
  logs: SetLog[];
  totalVolume: number;
  todayPlan: WorkoutDayPlan;
  onQuickStart: (tab: Tab) => void;
};

function HomeTab({ logs, totalVolume, todayPlan, onQuickStart }: HomeTabProps) {
  const isRestStyle = todayPlan.exercises.length === 0;

  return (
    <section className="stack">
      <article className={isRestStyle ? 'card rest' : 'card primary'}>
        <p className="label">Today</p>
        <h2>{todayPlan.title}</h2>
        <p>{todayPlan.goal}</p>
        {!isRestStyle ? (
          <button className="action" type="button" onClick={() => onQuickStart('Session')}>
            Start {todayPlan.title}
          </button>
        ) : (
          <button className="secondary" type="button" onClick={() => onQuickStart('History')}>
            Review Prior Workouts
          </button>
        )}
      </article>

      <article className="stats-grid">
        <div className="stat">
          <span>Sets logged</span>
          <strong>{logs.length}</strong>
        </div>
        <div className="stat">
          <span>Total volume</span>
          <strong>{totalVolume} lb</strong>
        </div>
      </article>

      <article className="card">
        <h3>Weekly rhythm</h3>
        <ul>
          <li>Mon/Wed/Fri/Sat: alternate Upper and Lower.</li>
          <li>At least one lighter day weekly for recovery work.</li>
          <li>If you feel beat up, swap the day for mobility and resume tomorrow.</li>
        </ul>
      </article>
    </section>
  );
}

type SessionTabProps = {
  plan: WorkoutDayPlan;
  logs: SetLog[];
  onLogSet: (
    workoutType: WorkoutType,
    exerciseName: string,
    setNumber: number,
    reps: number,
    weight: number,
  ) => void;
  onSwitchTab: (tab: Tab) => void;
};

function SessionTab({ plan, logs, onLogSet, onSwitchTab }: SessionTabProps) {
  if (plan.exercises.length === 0) {
    return (
      <section className="stack">
        <article className="card rest">
          <h2>Recovery Day</h2>
          <p>No heavy training today. Do 20–30 minutes of walking and mobility.</p>
          <button type="button" className="secondary" onClick={() => onSwitchTab('History')}>
            See Previous Sessions
          </button>
        </article>
      </section>
    );
  }

  return (
    <section className="stack">
      <article className="card">
        <h2>Active Session: {plan.title}</h2>
        <p>{plan.goal}</p>
      </article>

      {plan.exercises.map((exercise) => {
        const exerciseLogs = logs.filter((entry) => entry.exerciseName === exercise.name);
        const nextSetNumber = exerciseLogs.length + 1;
        const completedAllSets = exerciseLogs.length >= exercise.targetSets;

        return (
          <article className="card exercise-card" key={exercise.name}>
            <ExerciseAnimation kind={exercise.kind} />
            <div>
              <div className="exercise-header">
                <h3>{exercise.name}</h3>
                <span>
                  {exercise.repRange} reps • {exercise.restSec}s rest
                </span>
              </div>
              <p className="muted">Cue: {exercise.cue}</p>
              <p className="muted">Suggested load: {exercise.suggestedWeight} lb</p>
              <p className="muted">
                Progress: {exerciseLogs.length}/{exercise.targetSets} sets complete
              </p>
            </div>

            <button
              type="button"
              className="action"
              disabled={completedAllSets}
              onClick={() => onLogSet(plan.title, exercise.name, nextSetNumber, 8, exercise.suggestedWeight)}
            >
              {completedAllSets ? 'Completed' : `Log Set ${nextSetNumber}`}
            </button>
          </article>
        );
      })}

      <button type="button" className="secondary" onClick={() => onSwitchTab('History')}>
        End Session & View History
      </button>
    </section>
  );
}

function ExerciseAnimation({ kind }: { kind: ExerciseKind }) {
  const label = kind === 'push' ? 'Pressing animation' : kind === 'pull' ? 'Pulling animation' : 'Squat animation';

  return (
    <div className={`exercise-animation ${kind}`} aria-label={label}>
      <div className="stick-figure" />
      <div className="bar" />
    </div>
  );
}

type HistoryTabProps = {
  logs: SetLog[];
  totalVolume: number;
};

function HistoryTab({ logs, totalVolume }: HistoryTabProps) {
  const upperSets = logs.filter((log) => log.workoutType === 'Upper Body').length;
  const lowerSets = logs.filter((log) => log.workoutType === 'Lower Body').length;

  return (
    <section className="stack">
      <article className="card">
        <h2>History</h2>
        <p>Total volume: {totalVolume} lb</p>
        <p className="muted">
          Upper sets: {upperSets} • Lower sets: {lowerSets}
        </p>
      </article>

      <article className="card">
        <h3>Recent Sets</h3>
        {logs.length === 0 ? (
          <p className="muted">No sets logged yet. Start a session to see progress.</p>
        ) : (
          <ul className="history-list">
            {logs
              .slice()
              .reverse()
              .map((entry) => (
                <li key={entry.id}>
                  <strong>
                    {entry.exerciseName} ({entry.workoutType})
                  </strong>
                  <span>
                    Set {entry.setNumber}: {entry.reps} reps @ {entry.weight} lb
                  </span>
                  <span>{entry.completedAt}</span>
                </li>
              ))}
          </ul>
        )}
      </article>
    </section>
  );
}

function SettingsTab() {
  return (
    <section className="stack">
      <article className="card">
        <h2>Settings</h2>
        <p className="muted">Starter defaults for this MVP.</p>
      </article>

      <article className="card">
        <ul>
          <li>Split: Upper / Lower alternating days</li>
          <li>Default reps logged with one-tap: 8</li>
          <li>Units: Pounds (lb)</li>
          <li>Rest cues: Visual only (for now)</li>
        </ul>
      </article>
    </section>
  );
}

export default App;
