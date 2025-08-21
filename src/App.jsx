import { useEffect, useState } from "react";
import AnalyticsDashboard from "./components/AnalyticsDashboard.jsx";
import Cat from "./components/Cat.jsx";
import GamificationSystem from "./components/GamificationSystem.jsx";
import SmartFeatures from "./components/SmartFeatures.jsx";
import Timer from "./components/Timer.jsx";

export default function App() {
  const [mode, setMode] = useState("idle");
  const [activeTab, setActiveTab] = useState("timer");
  const [productivity, setProductivity] = useState({
    streak: 0,
    totalTime: 0,
    totalSessions: 0,
    longestStreak: 0,
    earlyBirdSessions: 0,
    nightOwlSessions: 0,
    maxDailySessions: 0,
    maxConsecutive: 0
  });
  const [currentTask, setCurrentTask] = useState("");

  // Load saved state when component mounts
  useEffect(() => {
    const loadState = async () => {
      try {
        const result = await chrome.storage.local.get(['catMode', 'productivity', 'currentTask']);
        if (result.catMode) setMode(result.catMode);
        if (result.productivity) setProductivity(result.productivity);
        if (result.currentTask) setCurrentTask(result.currentTask);
      } catch (error) {
        console.log('Storage not available, using default state');
      }
    };
    loadState();
  }, []);

  // Save mode and productivity changes to storage
  const handleModeChange = async (newMode) => {
    setMode(newMode);
    try {
      await chrome.storage.local.set({ catMode: newMode });
    } catch (error) {
      console.log('Could not save to storage');
    }
  };

  const updateProductivity = async (newProductivity) => {
    setProductivity(newProductivity);
    try {
      await chrome.storage.local.set({ productivity: newProductivity });
    } catch (error) {
      console.log('Could not save productivity data');
    }
  };

  const handleSessionComplete = () => {
    const hour = new Date().getHours();
    const updatedProductivity = {
      ...productivity,
      totalSessions: productivity.totalSessions + 1,
      streak: productivity.streak + 1,
      longestStreak: Math.max(productivity.longestStreak, productivity.streak + 1),
      earlyBirdSessions: hour < 9 ? productivity.earlyBirdSessions + 1 : productivity.earlyBirdSessions,
      nightOwlSessions: hour >= 21 ? productivity.nightOwlSessions + 1 : productivity.nightOwlSessions
    };
    updateProductivity(updatedProductivity);
  };

  const handleLevelUp = (newLevel) => {
    // Could trigger special animations or rewards
    console.log(`Cat leveled up to ${newLevel.name}!`);
  };

  const tabs = [
    { id: 'timer', label: '⏱️', name: 'Timer' },
    { id: 'stats', label: '📊', name: 'Stats' },
    { id: 'achievements', label: '🏆', name: 'Awards' },
    { id: 'smart', label: '🤖', name: 'AI' }
  ];

  return (
    <div className="w-80 max-h-[600px] bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white bg-opacity-80 backdrop-blur-sm p-4 border-b">
        <h1 className="text-lg font-bold text-gray-800 mb-2 text-center">
          🐱 ProCat - Productivity Companion
        </h1>
        
        {/* Cat Display */}
        <Cat 
          mood={mode} 
          theme="orange" 
          productivity={productivity}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b bg-white bg-opacity-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-1 text-xs font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span>{tab.label}</span>
              <span className="hidden sm:block">{tab.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'timer' && (
          <Timer 
            onStart={() => handleModeChange("focus")} 
            onBreak={() => {
              handleModeChange("happy");
              handleSessionComplete();
            }}
            onReset={() => handleModeChange("idle")}
            productivity={productivity}
            onProductivityUpdate={updateProductivity}
          />
        )}
        
        {activeTab === 'stats' && (
          <AnalyticsDashboard productivity={productivity} />
        )}
        
        {activeTab === 'achievements' && (
          <GamificationSystem 
            productivity={productivity} 
            onLevelUp={handleLevelUp}
          />
        )}
        
        {activeTab === 'smart' && (
          <SmartFeatures 
            productivity={productivity}
            currentTask={currentTask}
          />
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-white bg-opacity-80 backdrop-blur-sm p-2 border-t">
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => handleModeChange("excited")}
            className="flex-1 py-1 px-2 bg-yellow-200 rounded hover:bg-yellow-300 transition-colors"
          >
            🎉 Celebrate
          </button>
          <button
            onClick={() => handleModeChange("sleeping")}
            className="flex-1 py-1 px-2 bg-purple-200 rounded hover:bg-purple-300 transition-colors"
          >
            😴 Rest
          </button>
          <button
            onClick={() => handleModeChange("stressed")}
            className="flex-1 py-1 px-2 bg-red-200 rounded hover:bg-red-300 transition-colors"
          >
            😰 Help
          </button>
        </div>
      </div>
    </div>
  );
}