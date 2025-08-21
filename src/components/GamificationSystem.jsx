import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ACHIEVEMENTS = {
  firstTimer: { 
    id: 'firstTimer', 
    name: 'Getting Started', 
    desc: 'Complete your first focus session', 
    icon: '🌱',
    condition: (stats) => stats.totalSessions >= 1
  },
  earlyBird: { 
    id: 'earlyBird', 
    name: 'Early Bird', 
    desc: 'Start a session before 9 AM', 
    icon: '🐦',
    condition: (stats) => stats.earlyBirdSessions >= 1
  },
  nightOwl: { 
    id: 'nightOwl', 
    name: 'Night Owl', 
    desc: 'Work after 9 PM', 
    icon: '🦉',
    condition: (stats) => stats.nightOwlSessions >= 1
  },
  streakMaster: { 
    id: 'streakMaster', 
    name: 'Streak Master', 
    desc: 'Maintain a 5-day streak', 
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 5
  },
  marathoner: { 
    id: 'marathoner', 
    name: 'Marathoner', 
    desc: 'Complete 25 sessions in a day', 
    icon: '🏃‍♀️',
    condition: (stats) => stats.maxDailySessions >= 25
  },
  focused: { 
    id: 'focused', 
    name: 'Laser Focused', 
    desc: 'Complete 10 sessions without breaks', 
    icon: '🎯',
    condition: (stats) => stats.maxConsecutive >= 10
  },
  centurion: { 
    id: 'centurion', 
    name: 'Centurion', 
    desc: 'Complete 100 total sessions', 
    icon: '💯',
    condition: (stats) => stats.totalSessions >= 100
  }
};

const CAT_LEVELS = [
  { level: 1, name: "Kitten", min: 0, max: 50, color: "bg-gray-200" },
  { level: 2, name: "Cat", min: 51, max: 150, color: "bg-green-200" },
  { level: 3, name: "Cool Cat", min: 151, max: 300, color: "bg-blue-200" },
  { level: 4, name: "Ninja Cat", min: 301, max: 500, color: "bg-purple-200" },
  { level: 5, name: "Master Cat", min: 501, max: 1000, color: "bg-yellow-200" },
  { level: 6, name: "Legendary Cat", min: 1001, max: Infinity, color: "bg-gradient-to-r from-purple-400 to-pink-400" }
];

export default function GamificationSystem({ productivity, onLevelUp }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [catLevel, setCatLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Calculate current level and experience
  useEffect(() => {
    const totalExp = productivity.totalSessions * 10 + productivity.streak * 5;
    setExperience(totalExp);
    
    const currentLevel = CAT_LEVELS.find(level => 
      totalExp >= level.min && totalExp <= level.max
    );
    
    if (currentLevel && currentLevel.level > catLevel) {
      setCatLevel(currentLevel.level);
      setShowLevelUp(true);
      onLevelUp?.(currentLevel);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [productivity]);

  // Check for new achievements
  useEffect(() => {
    const checkAchievements = () => {
      const newlyUnlocked = [];
      
      Object.values(ACHIEVEMENTS).forEach(achievement => {
        if (achievement.condition(productivity) && 
            !unlockedAchievements.includes(achievement.id)) {
          newlyUnlocked.push(achievement.id);
        }
      });

      if (newlyUnlocked.length > 0) {
        setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
        setNewAchievements(newlyUnlocked);
        setTimeout(() => setNewAchievements([]), 5000);
      }
    };

    checkAchievements();
  }, [productivity, unlockedAchievements]);

  const getCurrentLevel = () => {
    return CAT_LEVELS.find(level => 
      experience >= level.min && experience <= level.max
    ) || CAT_LEVELS[0];
  };

  const getProgressToNext = () => {
    const current = getCurrentLevel();
    const next = CAT_LEVELS.find(level => level.level === current.level + 1);
    
    if (!next) return 100; // Max level
    
    const progress = ((experience - current.min) / (next.min - current.min)) * 100;
    return Math.min(progress, 100);
  };

  const getProductivityRank = () => {
    if (productivity.totalSessions < 5) return { rank: "Beginner", color: "text-gray-600" };
    if (productivity.totalSessions < 25) return { rank: "Apprentice", color: "text-green-600" };
    if (productivity.totalSessions < 100) return { rank: "Expert", color: "text-blue-600" };
    if (productivity.totalSessions < 500) return { rank: "Master", color: "text-purple-600" };
    return { rank: "Legend", color: "text-yellow-600" };
  };

  const currentLevel = getCurrentLevel();
  const rank = getProductivityRank();

  return (
    <div className="space-y-4">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="bg-gradient-to-r from-yellow-200 to-orange-200 p-4 rounded-lg text-center border-2 border-yellow-300"
          >
            <h3 className="font-bold text-lg">🎉 Level Up!</h3>
            <p className="text-sm">Your cat is now a <strong>{currentLevel.name}</strong>!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cat Level & XP */}
      <div className={`p-4 rounded-lg ${currentLevel.color}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Level {currentLevel.level} {currentLevel.name}</h3>
          <span className={`text-sm font-medium ${rank.color}`}>{rank.rank}</span>
        </div>
        
        <div className="w-full bg-white bg-opacity-50 rounded-full h-3 mb-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${getProgressToNext()}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-600">
          <span>XP: {experience}</span>
          <span>Next: {CAT_LEVELS[currentLevel.level]?.min || "MAX"}</span>
        </div>
      </div>

      {/* New Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map(achievementId => {
          const achievement = ACHIEVEMENTS[achievementId];
          return (
            <motion.div
              key={achievementId}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-gradient-to-r from-green-200 to-blue-200 p-3 rounded-lg border-l-4 border-green-400"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className="font-bold text-sm">Achievement Unlocked!</h4>
                  <p className="text-sm">{achievement.name}</p>
                  <p className="text-xs text-gray-600">{achievement.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Achievement Gallery */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <h4 className="font-bold text-sm mb-2">🏆 Achievements ({unlockedAchievements.length}/{Object.keys(ACHIEVEMENTS).length})</h4>
        
        <div className="grid grid-cols-4 gap-2">
          {Object.values(ACHIEVEMENTS).map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                className={`p-2 rounded-lg text-center transition-all cursor-pointer ${
                  isUnlocked 
                    ? 'bg-yellow-100 border-2 border-yellow-300' 
                    : 'bg-gray-200 opacity-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={`${achievement.name}: ${achievement.desc}`}
              >
                <div className={`text-xl ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <p className="text-xs font-medium mt-1 truncate">{achievement.name}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenge */}
      <DailyChallenge productivity={productivity} />
    </div>
  );
}

// Daily Challenge Component
function DailyChallenge({ productivity }) {
  const [dailyGoal, setDailyGoal] = useState(5);
  const [todaySessions, setTodaySessions] = useState(0);

  // Get today's sessions (this would need to be tracked properly)
  const todayProgress = Math.min((todaySessions / dailyGoal) * 100, 100);

  const challenges = [
    { name: "Early Starter", desc: "Complete 3 sessions before noon", reward: "🌅" },
    { name: "Consistency King", desc: "Complete sessions every 2 hours", reward: "⏰" },
    { name: "Focus Master", desc: "Complete 8 sessions today", reward: "🎯" },
    { name: "Break Warrior", desc: "Take all your breaks today", reward: "🧘‍♀️" }
  ];

  const todayChallenge = challenges[new Date().getDay() % challenges.length];

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-3 rounded-lg">
      <h4 className="font-bold text-sm mb-2">🌟 Today's Challenge</h4>
      
      <div className="bg-white bg-opacity-50 p-2 rounded mb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{todayChallenge.name}</span>
          <span>{todayChallenge.reward}</span>
        </div>
        <p className="text-xs text-gray-600">{todayChallenge.desc}</p>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span>Daily Goal Progress</span>
          <span>{todaySessions}/{dailyGoal}</span>
        </div>
        <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-blue-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${todayProgress}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
          className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-50"
        >
          -
        </button>
        <span className="flex-1 text-center text-xs py-1">Goal: {dailyGoal}</span>
        <button
          onClick={() => setDailyGoal(dailyGoal + 1)}
          className="px-2 py-1 bg-white rounded text-xs hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  );
}