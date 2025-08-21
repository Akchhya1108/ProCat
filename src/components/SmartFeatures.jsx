import { useEffect, useState } from "react";

export default function SmartFeatures({ productivity, currentTask }) {
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [optimalTimes, setOptimalTimes] = useState([]);
  const [moodPrediction, setMoodPrediction] = useState('neutral');

  // Analyze user patterns and generate suggestions
  useEffect(() => {
    generateSmartSuggestions();
    analyzeOptimalTimes();
    predictMood();
  }, [productivity]);

  const generateSmartSuggestions = () => {
    const suggestions = [];
    const hour = new Date().getHours();
    
    // Time-based suggestions
    if (hour >= 14 && hour <= 16) {
      suggestions.push({
        type: 'timing',
        icon: '☕',
        title: 'Afternoon Dip Alert',
        message: 'This is typically a low-energy period. Consider a short break or light task.',
        action: 'Take 5-min break'
      });
    }
    
    if (hour >= 9 && hour <= 11) {
      suggestions.push({
        type: 'timing',
        icon: '🚀',
        title: 'Peak Focus Time',
        message: 'Your brain is at peak performance! Perfect for challenging tasks.',
        action: 'Start deep work'
      });
    }

    // Pattern-based suggestions
    if (productivity.streak > 0 && productivity.streak % 3 === 0) {
      suggestions.push({
        type: 'pattern',
        icon: '🎯',
        title: 'Streak Milestone',
        message: `Amazing! You're on a ${productivity.streak} session streak. Keep the momentum!`,
        action: 'Continue streak'
      });
    }

    // Task-specific suggestions
    if (currentTask?.toLowerCase().includes('meeting')) {
      suggestions.push({
        type: 'task',
        icon: '📝',
        title: 'Meeting Prep',
        message: 'Detected meeting task. Consider reviewing agenda and preparing notes.',
        action: 'Prep checklist'
      });
    }

    setSmartSuggestions(suggestions);
  };

  const analyzeOptimalTimes = () => {
    // Simulate analysis of when user is most productive
    const times = [
      { time: '9:00 AM', productivity: 95, label: 'Peak Focus' },
      { time: '11:00 AM', productivity: 88, label: 'High Energy' },
      { time: '2:00 PM', productivity: 65, label: 'Post-lunch Dip' },
      { time: '4:00 PM', productivity: 82, label: 'Second Wind' },
      { time: '7:00 PM', productivity: 70, label: 'Evening Focus' }
    ];
    setOptimalTimes(times);
  };

  const predictMood = () => {
    // Simple mood prediction based on productivity patterns
    if (productivity.streak >= 5) {
      setMoodPrediction('motivated');
    } else if (productivity.streak === 0) {
      setMoodPrediction('needsEncouragement');
    } else {
      setMoodPrediction('building');
    }
  };

  const getMoodMessage = () => {
    const messages = {
      motivated: "You're on fire! 🔥 Your cat is super proud of your consistency!",
      building: "Good progress! 📈 Your cat believes in you!",
      needsEncouragement: "Every expert was once a beginner. 🌱 Your cat is here to help!"
    };
    return messages[moodPrediction];
  };

  const getSmartBreakSuggestion = () => {
    const hour = new Date().getHours();
    const breakTypes = {
      morning: ['Stretch and hydrate 💧', 'Quick walk outside 🚶‍♂️', 'Deep breathing 🧘‍♀️'],
      afternoon: ['Power nap (10 min) 😴', 'Healthy snack 🥕', 'Eye exercises 👁️'],
      evening: ['Gentle stretching 🤸‍♂️', 'Herbal tea ☕', 'Gratitude journaling 📔']
    };
    
    let timeOfDay = 'morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    if (hour >= 17) timeOfDay = 'evening';
    
    const options = breakTypes[timeOfDay];
    return options[Math.floor(Math.random() * options.length)];
  };

  return (
    <div className="space-y-4">
      {/* AI Mood Analysis */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-lg">
        <h3 className="font-bold text-sm mb-2">🤖 AI Cat Assistant</h3>
        <div className="bg-white bg-opacity-70 p-2 rounded text-sm">
          {getMoodMessage()}
        </div>
      </div>

      {/* Smart Suggestions */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">💡 Smart Suggestions</h4>
        {smartSuggestions.map((suggestion, index) => (
          <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 rounded-r">
            <div className="flex items-start gap-2">
              <span>{suggestion.icon}</span>
              <div className="flex-1">
                <h5 className="font-medium text-xs">{suggestion.title}</h5>
                <p className="text-xs text-gray-600 mb-1">{suggestion.message}</p>
                <button className="text-xs bg-yellow-200 px-2 py-1 rounded hover:bg-yellow-300">
                  {suggestion.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optimal Productivity Times */}
      <div className="bg-green-50 p-3 rounded-lg">
        <h4 className="font-medium text-sm mb-2">⏰ Your Peak Times</h4>
        <div className="space-y-1">
          {optimalTimes.slice(0, 3).map((time, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span>{time.time}</span>
              <div className="flex items-center gap-1">
                <div className="w-12 bg-white bg-opacity-50 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${time.productivity}%` }}
                  />
                </div>
                <span className="text-green-600 font-medium">{time.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Break Suggestions */}
      <div className="bg-purple-50 p-3 rounded-lg">
        <h4 className="font-medium text-sm mb-2">🧘‍♀️ Smart Break Ideas</h4>
        <div className="text-sm bg-white bg-opacity-70 p-2 rounded mb-2">
          {getSmartBreakSuggestion()}
        </div>
        <button 
          onClick={() => setSmartSuggestions(prev => [...prev])} // Trigger refresh
          className="text-xs bg-purple-200 px-2 py-1 rounded hover:bg-purple-300"
        >
          Get New Suggestion
        </button>
      </div>

      {/* Focus Environment Optimizer */}
      <div className="bg-orange-50 p-3 rounded-lg">
        <h4 className="font-medium text-sm mb-2">🌡️ Environment Check</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white bg-opacity-70 p-2 rounded text-center">
            <div className="font-medium">Lighting</div>
            <div className="text-green-600">Optimal ✓</div>
          </div>
          <div className="bg-white bg-opacity-70 p-2 rounded text-center">
            <div className="font-medium">Noise Level</div>
            <div className="text-yellow-600">Moderate ⚠️</div>
          </div>
        </div>
        <p className="text-xs text-orange-600 mt-2">
          💡 Consider using noise-canceling headphones for better focus!
        </p>
      </div>

      {/* Productivity Forecast */}
      <div className="bg-indigo-50 p-3 rounded-lg">
        <h4 className="font-medium text-sm mb-2">📈 Today's Forecast</h4>
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span>Morning Energy:</span>
            <span className="text-green-600 font-medium">High 🌅</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Afternoon Focus:</span>
            <span className="text-yellow-600 font-medium">Medium ☀️</span>
          </div>
          <div className="flex justify-between">
            <span>Evening Wind-down:</span>
            <span className="text-blue-600 font-medium">Low 🌙</span>
          </div>
        </div>
      </div>
    </div>
  );
}