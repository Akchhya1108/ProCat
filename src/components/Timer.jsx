import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TIMER_TECHNIQUES = {
  pomodoro: { work: 25, break: 5, longBreak: 15, cycles: 4 },
  "52-17": { work: 52, break: 17, longBreak: 17, cycles: 1 },
  "90-20": { work: 90, break: 20, longBreak: 30, cycles: 1 },
  custom: { work: 25, break: 5, longBreak: 15, cycles: 4 }
};

const PRODUCTIVITY_QUOTES = [
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future depends on what you do today. - Mahatma Gandhi"
];

export default function AdvancedTimer({ onStart, onBreak, onReset, onMoodChange }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work');
  const [technique, setTechnique] = useState('pomodoro');
  const [cycleCount, setCycleCount] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [productivity, setProductivity] = useState({ streak: 0, totalTime: 0 });

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Progress calculation
  const progress = ((TIMER_TECHNIQUES[technique][sessionType] * 60 - timeLeft) / (TIMER_TECHNIQUES[technique][sessionType] * 60)) * 100;

  // Load saved state
  useEffect(() => {
    const loadState = async () => {
      try {
        const result = await chrome.storage.local.get(['advancedTimerState', 'productivity']);
        if (result.advancedTimerState) {
          const state = result.advancedTimerState;
          setTimeLeft(state.timeLeft || 25 * 60);
          setIsRunning(state.isRunning || false);
          setSessionType(state.sessionType || 'work');
          setTechnique(state.technique || 'pomodoro');
          setCycleCount(state.cycleCount || 0);
          setTotalSessions(state.totalSessions || 0);
          setTaskName(state.taskName || '');
        }
        if (result.productivity) {
          setProductivity(result.productivity);
        }
      } catch (error) {
        console.log('Could not load state');
      }
    };
    loadState();
  }, []);

  // Save state
  useEffect(() => {
    const saveState = async () => {
      try {
        await chrome.storage.local.set({
          advancedTimerState: {
            timeLeft, isRunning, sessionType, technique, 
            cycleCount, totalSessions, taskName
          },
          productivity
        });
      } catch (error) {
        console.log('Could not save state');
      }
    };
    saveState();
  }, [timeLeft, isRunning, sessionType, technique, cycleCount, totalSessions, taskName, productivity]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Play completion sound
    if (soundEnabled) {
      try {
        const audio = new Audio('/sounds/ding.mp3');
        audio.play().catch(() => console.log('Sound not available'));
      } catch (error) {
        console.log('Sound not supported');
      }
    }

    // Update productivity stats
    const newProductivity = {
      streak: productivity.streak + 1,
      totalTime: productivity.totalTime + TIMER_TECHNIQUES[technique][sessionType]
    };
    setProductivity(newProductivity);

    // Determine next session
    if (sessionType === 'work') {
      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);
      setTotalSessions(prev => prev + 1);
      
      if (newCycleCount >= TIMER_TECHNIQUES[technique].cycles) {
        // Long break
        setSessionType('longBreak');
        setTimeLeft(TIMER_TECHNIQUES[technique].longBreak * 60);
        setCycleCount(0);
        onMoodChange('excited');
      } else {
        // Short break
        setSessionType('break');
        setTimeLeft(TIMER_TECHNIQUES[technique].break * 60);
        onMoodChange('happy');
      }
    } else {
      // Back to work
      setSessionType('work');
      setTimeLeft(TIMER_TECHNIQUES[technique].work * 60);
      onReset();
    }

    // Show notification
    const messages = {
      work: `🎉 Great work${taskName ? ` on ${taskName}` : ''}! Time for a break!`,
      break: '⏰ Break over! Ready to focus?',
      longBreak: '🌟 Long break time! You deserve it!'
    };

    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'cat.png',
        title: 'Productivity Cat',
        message: messages[sessionType]
      });
    } catch (error) {
      console.log('Notifications not available');
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleTechniqueChange = (newTechnique) => {
    setTechnique(newTechnique);
    setTimeLeft(TIMER_TECHNIQUES[newTechnique].work * 60);
    setSessionType('work');
    setIsRunning(false);
    setCycleCount(0);
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Technique Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Technique</label>
        <select 
          value={technique}
          onChange={(e) => handleTechniqueChange(e.target.value)}
          className="w-full p-2 text-sm border rounded-lg bg-white"
          disabled={isRunning}
        >
          <option value="pomodoro">🍅 Pomodoro (25/5)</option>
          <option value="52-17">⚡ DeskTime (52/17)</option>
          <option value="90-20">🧠 Ultradian (90/20)</option>
          <option value="custom">⚙️ Custom</option>
        </select>
      </div>

      {/* Task Input */}
      <div>
        <input
          type="text"
          placeholder="What are you working on?"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-2 text-sm border rounded-lg"
          disabled={isRunning}
        />
      </div>

      {/* Progress Ring */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64" cy="64" r="56"
              fill="none" stroke="#e5e7eb" strokeWidth="8"
            />
            <motion.circle
              cx="64" cy="64" r="56"
              fill="none" 
              stroke={sessionType === 'work' ? '#3b82f6' : '#10b981'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 56 * (1 - progress / 100)
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-mono text-lg font-bold">{formatTime(timeLeft)}</p>
            <p className="text-xs text-gray-500 capitalize">{sessionType}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => {
            setIsRunning(!isRunning);
            if (!isRunning && sessionType === 'work') onStart();
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isRunning 
              ? 'bg-red-300 hover:bg-red-400 text-red-800' 
              : 'bg-green-300 hover:bg-green-400 text-green-800'
          }`}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(TIMER_TECHNIQUES[technique][sessionType] * 60);
          }}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-800 transition-colors"
        >
          Reset
        </button>
        
        <button
          onClick={() => setShowStats(!showStats)}
          className="px-4 py-2 bg-purple-300 rounded-lg hover:bg-purple-400 text-purple-800 transition-colors"
        >
          📊
        </button>
      </div>

      {/* Stats Panel */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg space-y-2"
        >
          <h3 className="font-bold text-sm">📈 Productivity Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-medium">Streak: {productivity.streak}</p>
              <p>Sessions: {totalSessions}</p>
            </div>
            <div>
              <p className="font-medium">Total Time: {Math.floor(productivity.totalTime / 60)}h</p>
              <p>Cycle: {cycleCount + 1}/{TIMER_TECHNIQUES[technique].cycles}</p>
            </div>
          </div>
          
          <div className="text-xs text-purple-600 italic">
            "{PRODUCTIVITY_QUOTES[currentQuote % PRODUCTIVITY_QUOTES.length]}"
          </div>
          
          <button
            onClick={() => setCurrentQuote(prev => prev + 1)}
            className="text-xs bg-white px-2 py-1 rounded hover:bg-purple-50"
          >
            New Quote ✨
          </button>
        </motion.div>
      )}

      {/* Settings */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="rounded"
          />
          🔊 Sound
        </label>
        
        {taskName && (
          <span className="bg-blue-100 px-2 py-1 rounded text-blue-700 truncate max-w-24">
            {taskName}
          </span>
        )}
      </div>
    </div>
  );
}