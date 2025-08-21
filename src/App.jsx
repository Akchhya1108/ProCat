import { useState, useEffect } from "react";
import Cat from "./components/Cat.jsx";
import Timer from "./components/Timer.jsx";

export default function App() {
  const [mode, setMode] = useState("idle");

  // Load saved state when component mounts
  useEffect(() => {
    const loadState = async () => {
      try {
        const result = await chrome.storage.local.get(['catMode', 'timerState']);
        if (result.catMode) {
          setMode(result.catMode);
        }
      } catch (error) {
        console.log('Storage not available, using default state');
      }
    };
    
    loadState();
  }, []);

  // Save mode changes to storage
  const handleModeChange = async (newMode) => {
    setMode(newMode);
    try {
      await chrome.storage.local.set({ catMode: newMode });
    } catch (error) {
      console.log('Could not save to storage');
    }
  };

  return (
    <div className="p-4 w-64">
      <h1 className="text-lg font-bold mb-2">🐱 Productivity Cat</h1>
      <Cat mood={mode} />
      <Timer 
        onStart={() => handleModeChange("focus")} 
        onBreak={() => handleModeChange("happy")}
        onReset={() => handleModeChange("idle")}
      />
    </div>
  );
}
