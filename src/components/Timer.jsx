import { useEffect, useState } from "react";

export default function Timer({ onStart, onBreak, onReset }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work' or 'break'

  // Load saved timer state on mount
  useEffect(() => {
    const loadTimerState = async () => {
      try {
        const result = await chrome.storage.local.get(['timerState']);
        if (result.timerState) {
          const { timeLeft: savedTime, isRunning: savedRunning, sessionType: savedType, lastUpdate } = result.timerState;
          
          if (savedRunning && lastUpdate) {
            // Calculate time elapsed since last update
            const elapsed = Math.floor((Date.now() - lastUpdate) / 1000);
            const newTimeLeft = Math.max(0, savedTime - elapsed);
            
            setTimeLeft(newTimeLeft);
            setIsRunning(newTimeLeft > 0);
            setSessionType(savedType || 'work');
            
            if (newTimeLeft === 0) {
              handleTimerComplete();
            }
          } else {
            setTimeLeft(savedTime);
            setIsRunning(savedRunning);
            setSessionType(savedType || 'work');
          }
        }
      } catch (error) {
        console.log('Could not load timer state');
      }
    };

    loadTimerState();
  }, []);

  // Save timer state whenever it changes
  useEffect(() => {
    const saveTimerState = async () => {
      try {
        await chrome.storage.local.set({
          timerState: {
            timeLeft,
            isRunning,
            sessionType,
            lastUpdate: Date.now()
          }
        });
      } catch (error) {
        console.log('Could not save timer state');
      }
    };

    saveTimerState();
  }, [timeLeft, isRunning, sessionType]);

  // Timer countdown logic
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    // Show notification
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'cat.png',
        title: 'Productivity Cat',
        message: sessionType === 'work' ? 
          '🎉 Great work! Time for a break!' : 
          '⏰ Break time over! Ready to focus?'
      });
    } catch (error) {
      console.log('Notifications not available');
    }

    if (sessionType === 'work') {
      // Work session complete, start break
      setSessionType('break');
      setTimeLeft(5 * 60); // 5 minute break
      onBreak();
    } else {
      // Break complete, ready for work
      setSessionType('work');
      setTimeLeft(25 * 60); // 25 minute work session
      onReset();
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    if (sessionType === 'work') {
      onStart();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSessionType('work');
    setTimeLeft(25 * 60);
    onReset();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getSessionLabel = () => {
    if (sessionType === 'work') {
      return isRunning ? 'Working...' : 'Work Session';
    } else {
      return isRunning ? 'Break Time!' : 'Break Session';
    }
  };

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-600 mb-1">{getSessionLabel()}</p>
      <p className="font-mono text-xl mb-2">{formatTime(timeLeft)}</p>
      
      <div className="mt-2 flex gap-2 justify-center">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className={`px-3 py-1 rounded-xl transition-colors ${
            isRunning 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-pink-300 hover:bg-pink-400 text-gray-800'
          }`}
        >
          {isRunning ? 'Running...' : 'Start'}
        </button>
        
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 bg-blue-300 rounded-xl hover:bg-blue-400 text-gray-800 transition-colors"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
        
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-gray-300 rounded-xl hover:bg-gray-400 text-gray-800 transition-colors"
        >
          Reset
        </button>
      </div>

      {sessionType === 'break' && (
        <p className="text-xs text-green-600 mt-2">🌱 Take a breather!</p>
      )}
    </div>
  );
}