import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Different cat breeds/themes
const catThemes = {
  orange: { src: "/cats/orange-cat.png", bg: "bg-orange-50" },
  gray: { src: "/cats/gray-cat.png", bg: "bg-gray-50" },
  black: { src: "/cats/black-cat.png", bg: "bg-purple-50" },
  calico: { src: "/cats/calico-cat.png", bg: "bg-pink-50" }
};

export const advancedMoods = {
  idle: { 
    rotate: [0, 2, -2, 0],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  },
  focus: { 
    scale: [1, 1.02, 1], 
    y: [0, -2, 0],
    rotate: [0, 1, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
  happy: { 
    rotate: [0, 20, -20, 0],
    scale: [1, 1.15, 1],
    y: [0, -10, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
  },
  break: {
    y: [0, -15, 0],
    rotate: [0, 10, -10, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 1, repeat: Infinity, ease: "bounceInOut" }
  },
  sleeping: {
    rotate: [0, -5, 5, 0],
    scale: [1, 0.95, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
  excited: {
    y: [0, -20, 0, -15, 0],
    rotate: [0, 15, -15, 10, 0],
    scale: [1, 1.2, 1.1, 1.15, 1],
    transition: { duration: 0.8, repeat: Infinity }
  },
  stressed: {
    x: [-2, 2, -2, 2, 0],
    rotate: [0, -3, 3, -3, 0],
    transition: { duration: 0.3, repeat: Infinity }
  }
};

export default function EnhancedCat({ mood = "idle", theme = "orange", productivity }) {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [showParticles, setShowParticles] = useState(false);

  // Advanced messages based on productivity and time
  const getAdvancedMessage = () => {
    const hour = new Date().getHours();
    const messages = {
      idle: [
        "Ready for some productivity! 😸",
        "What shall we work on? 🤔",
        hour < 12 ? "Good morning! ☀️" : hour < 17 ? "Afternoon focus! 🌤️" : "Evening grind! 🌙"
      ],
      focus: [
        "In the zone! 🎯",
        "Crushing it! 💪",
        `${productivity?.streak || 0} sessions strong! 🔥`
      ],
      happy: [
        "Woohoo! Great job! 🎉",
        "You're amazing! ✨",
        "Victory dance time! 💃"
      ],
      excited: [
        "SO PUMPED! 🚀",
        "Let's GOOO! ⚡",
        "Energy through the roof! 🔥"
      ],
      sleeping: [
        "Zzz... maybe time for bed? 😴",
        "Sweet dreams... 🌙",
        "Recharging... 🔋"
      ],
      stressed: [
        "Take a breath... 😰",
        "It's okay, we got this! 💙",
        "Step by step... 🦶"
      ]
    };
    
    const moodMessages = messages[mood] || messages.idle;
    return moodMessages[Math.floor(Math.random() * moodMessages.length)];
  };

  // Particle effect for celebrations
  const Particles = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, (i - 3) * 20],
            y: [0, -30 - i * 5]
          }}
          transition={{ duration: 2, delay: i * 0.1 }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );

  useEffect(() => {
    if (mood === 'happy' || mood === 'excited') {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 2000);
    }
  }, [mood]);

  return (
    <div className={`flex flex-col items-center p-4 rounded-lg transition-colors duration-500 ${catThemes[currentTheme].bg}`}>
      <div className="relative">
        <motion.img
          src={catThemes[currentTheme].src}
          alt="Productivity Cat"
          className="w-28 mb-3 filter drop-shadow-lg"
          animate={advancedMoods[mood]}
          key={mood}
        />
        {showParticles && <Particles />}
        
        {/* Productivity ring */}
        {productivity && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 flex items-center justify-center text-xs font-bold">
            {productivity.streak}
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-gray-700 text-center mb-2 min-h-[20px]">
        {getAdvancedMessage()}
      </p>

      {/* Theme selector */}
      <div className="flex gap-1 mb-2">
        {Object.keys(catThemes).map((t) => (
          <button
            key={t}
            onClick={() => setCurrentTheme(t)}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              currentTheme === t ? 'border-gray-600 scale-110' : 'border-gray-300'
            } ${catThemes[t].bg.replace('bg-', 'bg-gradient-to-br from-')}`}
          />
        ))}
      </div>

      {/* Mood indicator */}
      <div className="flex gap-1">
        {Object.keys(advancedMoods).slice(0, 4).map((m) => (
          <div
            key={m}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              mood === m ? 'bg-purple-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}