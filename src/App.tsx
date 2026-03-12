import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────

type Tab = 'Home' | 'Session' | 'History' | 'Settings';
type WorkoutType = 'Upper Body' | 'Lower Body';
type ExerciseKind = 'push' | 'pull' | 'legs';

type MuscleInfo = {
  primary: string[];
  secondary: string[];
};

type SetLog = {
  id: string;
  workoutType: WorkoutType;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
  date: string;
};

type ExercisePlan = {
  name: string;
  kind: ExerciseKind;
  targetSets: number;
  repRange: string;
  suggestedWeight: number;
  restSec: number;
  cue: string;
  muscles: MuscleInfo;
};

type WorkoutDayPlan = {
  title: WorkoutType;
  goal: string;
  exercises: ExercisePlan[];
};

// ─── Workout Data ──────────────────────────────────────────────────────────

const upperWorkout: WorkoutDayPlan = {
  title: 'Upper Body',
  goal: 'Chest, back, shoulders, and arms',
  exercises: [
    {
      name: 'Bench Press',
      kind: 'push',
      targetSets: 4,
      repRange: '5–8',
      suggestedWeight: 85,
      restSec: 120,
      cue: 'Retract shoulder blades before each rep. Drive feet into floor throughout.',
      muscles: { primary: ['Chest', 'Triceps'], secondary: ['Front Delts'] },
    },
    {
      name: 'One-Arm Dumbbell Row',
      kind: 'pull',
      targetSets: 3,
      repRange: '8–12',
      suggestedWeight: 45,
      restSec: 90,
      cue: 'Pull elbow toward your back pocket, not your shoulder.',
      muscles: { primary: ['Lats', 'Rhomboids'], secondary: ['Biceps'] },
    },
    {
      name: 'Seated Shoulder Press',
      kind: 'push',
      targetSets: 3,
      repRange: '8–10',
      suggestedWeight: 35,
      restSec: 90,
      cue: 'Keep ribs down and press in a smooth arc overhead.',
      muscles: { primary: ['Delts', 'Triceps'], secondary: ['Upper Traps'] },
    },
    {
      name: 'Lat Pulldown',
      kind: 'pull',
      targetSets: 3,
      repRange: '10–12',
      suggestedWeight: 75,
      restSec: 75,
      cue: 'Lead with elbows and pause briefly at the chest.',
      muscles: { primary: ['Lats'], secondary: ['Biceps', 'Rear Delts'] },
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
      repRange: '5–8',
      suggestedWeight: 105,
      restSec: 120,
      cue: 'Brace your core first, then sit down between your hips.',
      muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings', 'Core'] },
    },
    {
      name: 'Romanian Deadlift',
      kind: 'legs',
      targetSets: 3,
      repRange: '8–10',
      suggestedWeight: 95,
      restSec: 120,
      cue: 'Hinge at hips and keep bar close to thighs throughout.',
      muscles: { primary: ['Hamstrings', 'Glutes'], secondary: ['Lower Back'] },
    },
    {
      name: 'Walking Lunges',
      kind: 'legs',
      targetSets: 2,
      repRange: '10–12',
      suggestedWeight: 25,
      restSec: 75,
      cue: 'Stay tall and let rear knee track straight down.',
      muscles: { primary: ['Quads', 'Glutes'], secondary: ['Hamstrings'] },
    },
    {
      name: 'Calf Raise',
      kind: 'legs',
      targetSets: 3,
      repRange: '12–15',
      suggestedWeight: 70,
      restSec: 60,
      cue: 'Pause at top and lower under full control for a deep stretch.',
      muscles: { primary: ['Calves'], secondary: ['Soleus'] },
    },
  ],
};

const tabs: Tab[] = ['Home', 'Session', 'History', 'Settings'];

const getTodayPlan = (): WorkoutDayPlan => {
  const day = new Date().getDay();
  if (day === 0) {
    return { title: 'Upper Body', goal: 'Active recovery: walk + mobility + light core', exercises: [] };
  }
  return day % 2 === 0 ? lowerWorkout : upperWorkout;
};

const todayDateStr = () => new Date().toISOString().slice(0, 10);

// ─── LocalStorage Hook ─────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
}

function IconDumbbell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11M6.5 17.5h11M5 4v16M19 4v16M2 8v8M22 8v8" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12,8 12,12 14,14" />
      <path d="M3.05 11a9 9 0 1 0 .5-4" />
      <polyline points="3,3 3,8 8,8" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const tabIcons: Record<Tab, React.ReactNode> = {
  Home: <IconHome />,
  Session: <IconDumbbell />,
  History: <IconHistory />,
  Settings: <IconSettings />,
};

// ─── Rest Timer Types ──────────────────────────────────────────────────────

type RestTimerState = {
  active: boolean;
  secondsLeft: number;
  totalSec: number;
  exerciseName: string;
};

// ─── App ───────────────────────────────────────────────────────────────────

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [logs, setLogs] = useLocalStorage<SetLog[]>('workout-logs', []);
  const [restTimer, setRestTimer] = useState<RestTimerState>({
    active: false,
    secondsLeft: 0,
    totalSec: 0,
    exerciseName: '',
  });

  const todayPlan = useMemo(() => getTodayPlan(), []);
  const totalVolume = useMemo(() => logs.reduce((sum, e) => sum + e.reps * e.weight, 0), [logs]);

  useEffect(() => {
    if (!restTimer.active || restTimer.secondsLeft <= 0) return;
    const id = setInterval(() => {
      setRestTimer((t) => {
        if (t.secondsLeft <= 1) return { ...t, active: false, secondsLeft: 0 };
        return { ...t, secondsLeft: t.secondsLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [restTimer.active, restTimer.secondsLeft]);

  const logSet = (
    workoutType: WorkoutType,
    exerciseName: string,
    setNumber: number,
    reps: number,
    weight: number,
    restSec: number,
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
        date: todayDateStr(),
      },
    ]);
    setRestTimer({ active: true, secondsLeft: restSec, totalSec: restSec, exerciseName });
  };

  const dismissTimer = () => setRestTimer((t) => ({ ...t, active: false, secondsLeft: 0 }));

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="header-content">
          <div>
            <p className="kicker">Exercise Tracker</p>
            <h1>Upper / Lower Flow</h1>
          </div>
          <span className="header-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </header>

      <main className="main-content">
        {restTimer.active && <RestTimerCard timer={restTimer} onDismiss={dismissTimer} />}

        {activeTab === 'Home' && (
          <HomeTab logs={logs} totalVolume={totalVolume} todayPlan={todayPlan} onQuickStart={setActiveTab} />
        )}
        {activeTab === 'Session' && (
          <SessionTab plan={todayPlan} logs={logs} onLogSet={logSet} onSwitchTab={setActiveTab} />
        )}
        {activeTab === 'History' && <HistoryTab logs={logs} totalVolume={totalVolume} />}
        {activeTab === 'Settings' && <SettingsTab logs={logs} onClearLogs={() => setLogs([])} />}
      </main>

      <nav className="tab-bar" aria-label="Navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tabIcons[tab]}
            <span>{tab}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Rest Timer Card ───────────────────────────────────────────────────────

function RestTimerCard({ timer, onDismiss }: { timer: RestTimerState; onDismiss: () => void }) {
  const progress = timer.secondsLeft / timer.totalSec;
  const mins = Math.floor(timer.secondsLeft / 60);
  const secs = timer.secondsLeft % 60;
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`;
  const isAlmostDone = timer.secondsLeft <= 10;

  return (
    <div className={`rest-timer-card${isAlmostDone ? ' almost-done' : ''}`}>
      <div className="rest-timer-top">
        <div className="rest-timer-info">
          <span className="rest-timer-label">Rest</span>
          <span className="rest-timer-time">{timeStr}</span>
        </div>
        <button type="button" className="rest-dismiss" onClick={onDismiss}>
          Skip
        </button>
      </div>
      <div className="rest-progress-track">
        <div className="rest-progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="rest-timer-sub">After: {timer.exerciseName}</p>
    </div>
  );
}

// ─── Home Tab ──────────────────────────────────────────────────────────────

type HomeTabProps = {
  logs: SetLog[];
  totalVolume: number;
  todayPlan: WorkoutDayPlan;
  onQuickStart: (tab: Tab) => void;
};

function HomeTab({ logs, totalVolume, todayPlan, onQuickStart }: HomeTabProps) {
  const isRestDay = todayPlan.exercises.length === 0;
  const todayStr = todayDateStr();
  const todayLogs = logs.filter((l) => l.date === todayStr);
  const todaySets = todayLogs.length;
  const todayVolume = todayLogs.reduce((sum, e) => sum + e.reps * e.weight, 0);

  return (
    <section className="stack">
      <article className={`card hero-card${isRestDay ? ' rest' : ' primary'}`}>
        <p className="label">Today's workout</p>
        <h2 className="hero-title">{isRestDay ? 'Recovery Day' : todayPlan.title}</h2>
        <p className="hero-goal">{todayPlan.goal}</p>
        {!isRestDay ? (
          <button className="btn-primary" type="button" onClick={() => onQuickStart('Session')}>
            Start {todayPlan.title}
          </button>
        ) : (
          <button className="btn-secondary" type="button" onClick={() => onQuickStart('History')}>
            Review Prior Workouts
          </button>
        )}
      </article>

      {todaySets > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Sets today</span>
            <strong className="stat-value">{todaySets}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume today</span>
            <strong className="stat-value">{todayVolume.toLocaleString()} lb</strong>
          </div>
        </div>
      )}

      {!isRestDay && (
        <article className="card">
          <h3 className="section-title">Today's Exercises</h3>
          <div className="exercise-preview-list">
            {todayPlan.exercises.map((ex) => (
              <div key={ex.name} className="exercise-preview-row">
                <div className="exercise-preview-info">
                  <span className="exercise-preview-name">{ex.name}</span>
                  <span className="exercise-preview-meta">
                    {ex.targetSets} sets × {ex.repRange} reps
                  </span>
                </div>
                <span className={`kind-badge kind-${ex.kind}`}>{ex.kind}</span>
              </div>
            ))}
          </div>
        </article>
      )}

      {logs.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total sets</span>
            <strong className="stat-value">{logs.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total volume</span>
            <strong className="stat-value">{totalVolume.toLocaleString()} lb</strong>
          </div>
        </div>
      )}

      <article className="card">
        <h3 className="section-title">Weekly rhythm</h3>
        <ul className="rhythm-list">
          <li>Mon / Wed / Fri / Sat — alternate Upper and Lower</li>
          <li>Sunday — active recovery (walk + mobility)</li>
          <li>Feeling beat up? Swap for mobility and resume tomorrow</li>
        </ul>
      </article>
    </section>
  );
}

// ─── Session Tab ───────────────────────────────────────────────────────────

type SessionTabProps = {
  plan: WorkoutDayPlan;
  logs: SetLog[];
  onLogSet: (
    workoutType: WorkoutType,
    exerciseName: string,
    setNumber: number,
    reps: number,
    weight: number,
    restSec: number,
  ) => void;
  onSwitchTab: (tab: Tab) => void;
};

function SessionTab({ plan, logs, onLogSet, onSwitchTab }: SessionTabProps) {
  const [inputs, setInputs] = useState<Record<string, { weight: number; reps: number }>>(() =>
    Object.fromEntries(
      (plan.exercises ?? []).map((ex) => [
        ex.name,
        { weight: ex.suggestedWeight, reps: parseInt(ex.repRange) },
      ]),
    ),
  );

  if (plan.exercises.length === 0) {
    return (
      <section className="stack">
        <article className="card rest">
          <h2>Recovery Day</h2>
          <p style={{ marginTop: '0.4rem', color: 'var(--text-2)' }}>
            No heavy training today. 20–30 min walk + mobility work.
          </p>
          <button type="button" className="btn-secondary" onClick={() => onSwitchTab('History')}>
            See Previous Sessions
          </button>
        </article>
      </section>
    );
  }

  const allComplete = plan.exercises.every(
    (ex) => logs.filter((l) => l.exerciseName === ex.name).length >= ex.targetSets,
  );

  return (
    <section className="stack">
      <div className="session-header">
        <h2 className="session-title">{plan.title}</h2>
        <span className="session-goal">{plan.goal}</span>
      </div>

      {plan.exercises.map((exercise) => {
        const completedSets = logs.filter((l) => l.exerciseName === exercise.name).length;
        const nextSetNumber = completedSets + 1;
        const allSetsComplete = completedSets >= exercise.targetSets;
        const exInputs = inputs[exercise.name] ?? { weight: exercise.suggestedWeight, reps: parseInt(exercise.repRange) };

        const updateInput = (field: 'weight' | 'reps', raw: string) => {
          const val = field === 'weight' ? parseFloat(raw) || 0 : parseInt(raw) || 1;
          setInputs((prev) => ({ ...prev, [exercise.name]: { ...exInputs, [field]: val } }));
        };

        return (
          <article className={`card exercise-card${allSetsComplete ? ' exercise-done' : ''}`} key={exercise.name}>
            <div className="exercise-card-header">
              <div className="exercise-name-row">
                <h3 className="exercise-name">{exercise.name}</h3>
                <span className={`kind-badge kind-${exercise.kind}`}>{exercise.kind}</span>
              </div>
              <div className="exercise-meta">
                <span>{exercise.repRange} reps</span>
                <span>·</span>
                <span>{exercise.restSec >= 60 ? `${exercise.restSec / 60} min` : `${exercise.restSec}s`} rest</span>
              </div>
            </div>

            <MuscleTargets muscles={exercise.muscles} />

            <p className="exercise-cue">"{exercise.cue}"</p>

            <SetDots total={exercise.targetSets} completed={completedSets} />

            {!allSetsComplete ? (
              <div className="log-set-form">
                <div className="input-row">
                  <label className="input-group">
                    <span>Weight (lb)</span>
                    <input
                      type="number"
                      min="0"
                      step="2.5"
                      value={exInputs.weight}
                      onChange={(e) => updateInput('weight', e.target.value)}
                    />
                  </label>
                  <label className="input-group">
                    <span>Reps</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={exInputs.reps}
                      onChange={(e) => updateInput('reps', e.target.value)}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    onLogSet(plan.title, exercise.name, nextSetNumber, exInputs.reps, exInputs.weight, exercise.restSec)
                  }
                >
                  Log Set {nextSetNumber} of {exercise.targetSets}
                </button>
              </div>
            ) : (
              <div className="exercise-complete-badge">✓ All {exercise.targetSets} sets complete</div>
            )}
          </article>
        );
      })}

      {allComplete && (
        <article className="card session-done-card">
          <h3>Session Complete!</h3>
          <p style={{ color: 'var(--text-2)', marginTop: '0.35rem' }}>Great work. All exercises finished.</p>
          <button type="button" className="btn-primary" onClick={() => onSwitchTab('History')}>
            View Session History
          </button>
        </article>
      )}

      <button type="button" className="btn-ghost" onClick={() => onSwitchTab('History')}>
        End Session & View History
      </button>
    </section>
  );
}

// ─── Muscle Targets ────────────────────────────────────────────────────────

function MuscleTargets({ muscles }: { muscles: MuscleInfo }) {
  return (
    <div className="muscle-targets">
      <div className="muscle-group">
        <span className="muscle-label">Primary</span>
        <div className="muscle-tags">
          {muscles.primary.map((m) => (
            <span key={m} className="muscle-tag primary">
              {m}
            </span>
          ))}
        </div>
      </div>
      {muscles.secondary.length > 0 && (
        <div className="muscle-group">
          <span className="muscle-label">Secondary</span>
          <div className="muscle-tags">
            {muscles.secondary.map((m) => (
              <span key={m} className="muscle-tag secondary">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Set Dots ──────────────────────────────────────────────────────────────

function SetDots({ total, completed }: { total: number; completed: number }) {
  return (
    <div className="set-dots-row">
      <span className="set-dots-label">
        {completed < total ? `Set ${completed + 1} of ${total}` : `${completed}/${total} complete`}
      </span>
      <div className="set-dots">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`set-dot${i < completed ? ' done' : i === completed ? ' current' : ''}`} />
        ))}
      </div>
    </div>
  );
}

// ─── History Tab ───────────────────────────────────────────────────────────

type HistoryTabProps = {
  logs: SetLog[];
  totalVolume: number;
};

function HistoryTab({ logs, totalVolume }: HistoryTabProps) {
  const upperSets = logs.filter((l) => l.workoutType === 'Upper Body').length;
  const lowerSets = logs.filter((l) => l.workoutType === 'Lower Body').length;

  const byDate = useMemo(() => {
    const map = new Map<string, SetLog[]>();
    for (const log of [...logs].reverse()) {
      const arr = map.get(log.date) ?? [];
      arr.push(log);
      map.set(log.date, arr);
    }
    return map;
  }, [logs]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (dateStr === todayDateStr()) return 'Today';
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <section className="stack">
      <div className="stats-grid stats-grid-4">
        <div className="stat-card">
          <span className="stat-label">Total volume</span>
          <strong className="stat-value">{totalVolume.toLocaleString()} lb</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total sets</span>
          <strong className="stat-value">{logs.length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Upper sets</span>
          <strong className="stat-value">{upperSets}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Lower sets</span>
          <strong className="stat-value">{lowerSets}</strong>
        </div>
      </div>

      {logs.length === 0 ? (
        <article className="card">
          <p className="muted-center">No sets logged yet. Start a session!</p>
        </article>
      ) : (
        Array.from(byDate.entries()).map(([date, dateLogs]) => {
          const dateVolume = dateLogs.reduce((sum, l) => sum + l.reps * l.weight, 0);
          return (
            <article key={date} className="card">
              <div className="history-date-header">
                <h3 className="history-date">{formatDate(date)}</h3>
                <span className="history-date-volume">{dateVolume.toLocaleString()} lb</span>
              </div>
              <ul className="history-list">
                {dateLogs.map((entry) => (
                  <li key={entry.id} className="history-item">
                    <div className="history-item-main">
                      <span className="history-exercise">{entry.exerciseName}</span>
                      <span
                        className={`kind-badge badge-sm ${entry.workoutType === 'Upper Body' ? 'kind-pull' : 'kind-legs'}`}
                      >
                        {entry.workoutType === 'Upper Body' ? 'Upper' : 'Lower'}
                      </span>
                    </div>
                    <div className="history-item-details">
                      <span>Set {entry.setNumber}</span>
                      <span>·</span>
                      <span>{entry.reps} reps</span>
                      <span>·</span>
                      <span>{entry.weight} lb</span>
                      <span className="history-time">{entry.completedAt}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          );
        })
      )}
    </section>
  );
}

// ─── Settings Tab ──────────────────────────────────────────────────────────

function SettingsTab({ logs, onClearLogs }: { logs: SetLog[]; onClearLogs: () => void }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="stack">
      <article className="card">
        <h2>Settings</h2>
        <p className="muted">App configuration and data management.</p>
      </article>

      <article className="card">
        <h3 className="section-title">Current Setup</h3>
        <ul className="settings-list">
          <li>
            <span>Split</span>
            <span>Upper / Lower alternating</span>
          </li>
          <li>
            <span>Units</span>
            <span>Pounds (lb)</span>
          </li>
          <li>
            <span>Rest cues</span>
            <span>Timer after each set</span>
          </li>
          <li>
            <span>Data storage</span>
            <span>On-device (browser)</span>
          </li>
        </ul>
      </article>

      <article className="card">
        <h3 className="section-title">Data</h3>
        <p className="muted">{logs.length} sets stored locally in your browser.</p>
        {!confirming ? (
          <button type="button" className="btn-danger" onClick={() => setConfirming(true)}>
            Clear All Workout Data
          </button>
        ) : (
          <div className="confirm-row">
            <p className="confirm-text">This cannot be undone.</p>
            <button
              type="button"
              className="btn-danger"
              onClick={() => {
                onClearLogs();
                setConfirming(false);
              }}
            >
              Yes, clear all data
            </button>
            <button type="button" className="btn-ghost" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

export default App;
