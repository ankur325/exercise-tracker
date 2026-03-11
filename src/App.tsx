import { useMemo, useState } from 'react';

type Tab = 'Home' | 'Session' | 'History' | 'Settings';

type SetLog = {
  id: string;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
};

type ExercisePlan = {
  name: string;
  targetSets: number;
  repRange: string;
  suggestedWeight: number;
  restSec: number;
};

const todayPlan: ExercisePlan[] = [
  { name: 'Barbell Squat', targetSets: 3, repRange: '5-8', suggestedWeight: 95, restSec: 120 },
  { name: 'Bench Press', targetSets: 3, repRange: '6-10', suggestedWeight: 75, restSec: 120 },
  { name: 'Lat Pulldown', targetSets: 3, repRange: '8-12', suggestedWeight: 70, restSec: 90 },
  { name: 'Romanian Deadlift', targetSets: 2, repRange: '8-10', suggestedWeight: 85, restSec: 120 },
];

const tabs: Tab[] = ['Home', 'Session', 'History', 'Settings'];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [logs, setLogs] = useState<SetLog[]>([]);

  const totalVolume = useMemo(
    () => logs.reduce((sum, entry) => sum + entry.reps * entry.weight, 0),
    [logs],
  );

  const logSet = (exerciseName: string, setNumber: number, reps: number, weight: number) => {
    setLogs((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        exerciseName,
        setNumber,
        reps,
        weight,
        completedAt: new Date().toLocaleTimeString(),
      },
    ]);
    setActiveTab('Session');
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Exercise Tracker</h1>
        <p className="subtitle">Mobile-first workout guidance and logging</p>
      </header>

      <main>
        {activeTab === 'Home' && <HomeTab logs={logs} totalVolume={totalVolume} onQuickStart={setActiveTab} />}
        {activeTab === 'Session' && (
          <SessionTab plan={todayPlan} logs={logs} onLogSet={logSet} onSwitchTab={setActiveTab} />
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
  onQuickStart: (tab: Tab) => void;
};

function HomeTab({ logs, totalVolume, onQuickStart }: HomeTabProps) {
  return (
    <section className="stack">
      <article className="card primary">
        <h2>Today: Full Body A</h2>
        <p>4 exercises • 11 target sets • 45-60 min</p>
        <button className="action" type="button" onClick={() => onQuickStart('Session')}>
          Start Workout
        </button>
      </article>

      <article className="stats-grid">
        <div className="stat">
          <span>Sets logged</span>
          <strong>{logs.length}</strong>
        </div>
        <div className="stat">
          <span>Volume</span>
          <strong>{totalVolume} lb</strong>
        </div>
      </article>

      <article className="card">
        <h3>Quick guidance</h3>
        <ul>
          <li>Hit the top of your rep range on all sets? Add 5 lb next time.</li>
          <li>Missed reps two workouts in a row? Keep weight the same or deload 5%.</li>
          <li>Rest 90-120 sec for compounds, 60-90 sec for accessories.</li>
        </ul>
      </article>
    </section>
  );
}

type SessionTabProps = {
  plan: ExercisePlan[];
  logs: SetLog[];
  onLogSet: (exerciseName: string, setNumber: number, reps: number, weight: number) => void;
  onSwitchTab: (tab: Tab) => void;
};

function SessionTab({ plan, logs, onLogSet, onSwitchTab }: SessionTabProps) {
  return (
    <section className="stack">
      <article className="card">
        <h2>Active Session</h2>
        <p>Tap “Log Set” to quickly capture your work.</p>
      </article>

      {plan.map((exercise) => {
        const exerciseLogs = logs.filter((entry) => entry.exerciseName === exercise.name);
        const nextSetNumber = exerciseLogs.length + 1;
        const completedAllSets = exerciseLogs.length >= exercise.targetSets;

        return (
          <article className="card" key={exercise.name}>
            <div className="exercise-header">
              <h3>{exercise.name}</h3>
              <span>
                {exercise.repRange} reps • Rest {exercise.restSec}s
              </span>
            </div>

            <p className="muted">Suggested load: {exercise.suggestedWeight} lb</p>
            <p className="muted">
              Progress: {exerciseLogs.length}/{exercise.targetSets} sets complete
            </p>

            <button
              type="button"
              className="action"
              disabled={completedAllSets}
              onClick={() => onLogSet(exercise.name, nextSetNumber, 8, exercise.suggestedWeight)}
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

type HistoryTabProps = {
  logs: SetLog[];
  totalVolume: number;
};

function HistoryTab({ logs, totalVolume }: HistoryTabProps) {
  return (
    <section className="stack">
      <article className="card">
        <h2>History</h2>
        <p>Total logged volume: {totalVolume} lb</p>
      </article>

      <article className="card">
        <h3>Recent Sets</h3>
        {logs.length === 0 ? (
          <p className="muted">No sets logged yet. Start a session to see your history.</p>
        ) : (
          <ul className="history-list">
            {logs
              .slice()
              .reverse()
              .map((entry) => (
                <li key={entry.id}>
                  <strong>{entry.exerciseName}</strong> — Set {entry.setNumber}: {entry.reps} reps @{' '}
                  {entry.weight} lb
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
        <p>Defaults for an MVP build.</p>
      </article>

      <article className="card">
        <ul>
          <li>Units: Pounds (lb)</li>
          <li>Compound rest: 120 sec</li>
          <li>Accessory rest: 90 sec</li>
          <li>Notifications: Enabled</li>
        </ul>
      </article>
    </section>
  );
}

export default App;
